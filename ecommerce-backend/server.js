import http from 'http'
import { supabase } from './supabaseClient.js'

// Helper to parse JSON body
const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })

// Helper to send JSON response
const sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

// Get user from Authorization header
const getUserFromToken = async (req) => {
  const auth = req.headers.authorization
  if (!auth) return null
  const token = auth.replace('Bearer ', '').trim()
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  if (error) return null
  return data.user
}

const server = http.createServer(async (req, res) => {
  // CORS headers (allow frontend on any origin)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const path = url.pathname
  const method = req.method

  // ---- PUBLIC PRODUCT ROUTES ----
  // GET /api/products
  if (path === '/api/products' && method === 'GET') {
    const category = url.searchParams.get('category')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const featured = url.searchParams.get('featured') === 'true'
    const isDeal = url.searchParams.get('deal') === 'true'

    let query = supabase.from('products').select('*')
    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('featured', true)
    if (isDeal) query = query.eq('is_deal', true)
    const { data, error } = await query.limit(limit)

    if (error) return sendJSON(res, 500, { error: error.message })
    return sendJSON(res, 200, data)
  }

  // GET /api/products/:id
  const matchProductId = path.match(/^\/api\/products\/([^\/]+)$/)
  if (matchProductId && method === 'GET') {
    const id = matchProductId[1]
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) return sendJSON(res, 404, { error: 'Product not found' })
    return sendJSON(res, 200, data)
  }

  // ---- AUTHENTICATED ROUTES (cart & orders) ----
  const user = await getUserFromToken(req)
  if (!user && (path.startsWith('/api/cart') || path.startsWith('/api/orders'))) {
    return sendJSON(res, 401, { error: 'Unauthorized' })
  }

  // GET /api/cart
  if (path === '/api/cart' && method === 'GET') {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:product_id (*)
      `)
      .eq('user_id', user.id)
    if (error) return sendJSON(res, 500, { error: error.message })
    // Transform to match frontend expected format
    const items = data.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product
    }))
    return sendJSON(res, 200, items)
  }

  // POST /api/cart
  if (path === '/api/cart' && method === 'POST') {
    const body = await parseBody(req)
    const { product_id, quantity = 1 } = body
    if (!product_id) return sendJSON(res, 400, { error: 'product_id required' })

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .maybeSingle()

    if (existing) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
      if (error) return sendJSON(res, 500, { error: error.message })
      return sendJSON(res, 200, { message: 'Cart updated' })
    } else {
      // Insert new
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id, quantity })
      if (error) return sendJSON(res, 500, { error: error.message })
      return sendJSON(res, 201, { message: 'Item added' })
    }
  }

  // PATCH /api/cart/:productId
  const matchCartPatch = path.match(/^\/api\/cart\/([^\/]+)$/)
  if (matchCartPatch && method === 'PATCH') {
    const productId = matchCartPatch[1]
    const body = await parseBody(req)
    const { quantity } = body
    if (quantity === undefined) return sendJSON(res, 400, { error: 'quantity required' })

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)
    if (error) return sendJSON(res, 500, { error: error.message })
    return sendJSON(res, 200, { message: 'Cart updated' })
  }

  // DELETE /api/cart/:productId
  if (matchCartPatch && method === 'DELETE') {
    const productId = matchCartPatch[1]
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    if (error) return sendJSON(res, 500, { error: error.message })
    return sendJSON(res, 200, { message: 'Item removed' })
  }

  // GET /api/orders
  if (path === '/api/orders' && method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) return sendJSON(res, 500, { error: error.message })
    return sendJSON(res, 200, data)
  }

  // POST /api/orders
  if (path === '/api/orders' && method === 'POST') {
    const body = await parseBody(req)
    const { shippingAddress } = body
    if (!shippingAddress) return sendJSON(res, 400, { error: 'shippingAddress required' })

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('product_id, quantity, products(price)')
      .eq('user_id', user.id)
    if (cartError) return sendJSON(res, 500, { error: cartError.message })
    if (!cartItems.length) return sendJSON(res, 400, { error: 'Cart is empty' })

    // Calculate total
    let total = 0
    for (const item of cartItems) {
      const price = item.products?.price || 0
      total += price * item.quantity
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        status: 'pending',
        shipping_address: shippingAddress
      })
      .select()
      .single()
    if (orderError) return sendJSON(res, 500, { error: orderError.message })

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.products?.price || 0
    }))
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    if (itemsError) {
      // Rollback? For simplicity, just return error
      await supabase.from('orders').delete().eq('id', order.id)
      return sendJSON(res, 500, { error: itemsError.message })
    }

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user.id)

    return sendJSON(res, 201, order)
  }

  // GET /api/orders/:id
  const matchOrderId = path.match(/^\/api\/orders\/([^\/]+)$/)
  if (matchOrderId && method === 'GET') {
    const id = matchOrderId[1]
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (error) return sendJSON(res, 404, { error: 'Order not found' })
    return sendJSON(res, 200, data)
  }

  // 404 for any other route
  sendJSON(res, 404, { error: 'Not found' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})