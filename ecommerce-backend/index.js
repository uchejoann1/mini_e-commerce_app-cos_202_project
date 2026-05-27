require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
async function testConnection() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
        console.error('Connection error:', error.message);
    } else {
        console.log('✅ Connected to Supabase successfully!');
    }
}

testConnection();
