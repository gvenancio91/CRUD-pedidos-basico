const express = require("express");
const mongoose = require("mongoose");
const SwaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

// Middleware para parsing JSON
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/orders').then(() => {
  console.log('Conectado ao MongoDB');
}).catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Schema do pedido
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

// Função para transformar os dados do pedido
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

// Criar um novo pedido
app.post("/order", async (req, res) => {
  try {
    const transformed = transformOrder(req.body);
    const order = new Order(transformed);
    await order.save();
    res.status(201).json({ message: "Pedido criado com sucesso", orderId: transformed.orderId });
  } catch (e) {
    if (e.code === 11000) { // Duplicate key error
      res.status(400).json({ error: "Pedido com este ID já existe" });
    } else {
      res.status(500).json({ error: "Erro ao criar pedido" });
    }
  }
});

// Obter os dados do pedido por ID
app.get("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
});

// Listar todos os pedidos
app.get("/orders/list", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// Atualizar o pedido
app.put("/order/:orderId", async (req, res) => {
  try {
    const transformed = transformOrder(req.body);
    const order = await Order.findOneAndUpdate({ orderId: req.params.orderId }, transformed, { new: true });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    res.json({ message: "Pedido atualizado com sucesso", order });
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
});

// Deletar o pedido
app.delete("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    res.json({ message: "Pedido deletado com sucesso" });
  } catch (e) {
    res.status(500).json({ error: "Erro ao deletar pedido" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
