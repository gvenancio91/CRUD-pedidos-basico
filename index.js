const express = require("express");
const mongoose = require("mongoose");
const SwaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

// Middleware to parsing JSON
app.use(express.json());

// Conect to MongoDB
mongoose.connect('mongodb://localhost:27017/orders').then(() => {
  console.log('Conected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  creationDate: { type: String, required: true },
  items: [{
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
});

const Order = mongoose.model('Order', orderSchema);

// Function to transform orders data
function transformOrder(input) {
  return {
    orderId: input.numeroPedido,
    value: input.valorTotal,
    creationDate: new Date(input.dataCriacao).toISOString(),
    items: input.items.map(item => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem
    }))
  };
}

app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

// Create new order
app.post("/order", async (req, res) => {
  try {
    const transformed = transformOrder(req.body);
    const order = new Order(transformed);
    await order.save();
    res.status(201).json({ message: "Order created successfully", orderId: transformed.orderId });
  } catch (e) {
    if (e.code === 11000) { // Duplicate key error
      res.status(400).json({ error: "An order with this ID already exists." });
    } else {
      res.status(500).json({ error: "Error creating order" });
    }
  }
});

// Get order data by ID.
app.get("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: "Error when searching for order" });
  }
});

// List all orders
app.get("/orders/list", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: "Error listing orders" });
  }
});

// Update order
app.put("/order/:orderId", async (req, res) => {
  try {
    const transformed = transformOrder(req.body);
    const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, transformed, { new: true });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order updated sucessfully", order });
  } catch (e) {
    res.status(500).json({ error: "Error updating order" });
  }
});

// Deletar o pedido
app.delete("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted sucessfully" });
  } catch (e) {
    res.status(500).json({ error: "Error deleting order" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

