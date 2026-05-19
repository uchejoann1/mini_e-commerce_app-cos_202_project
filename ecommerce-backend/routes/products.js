const express = require('express');
const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: "MacBook Pro M3", price: 1200, category: "laptop" },
    { id: 2, name: "iPhone 15 Pro", price: 999, category: "phone" }
  ]);
});

module.exports = router;

// GET single product by ID
router.get('/:id', (req, res) => {
  const productId = req.params.id;

  res.json({
    id: productId,
    name: "Sample Product",
    price: 750
  });
});
