const express = require('express');
const bodyParser = requiere('body-parser');

const app = express();
const PORT = 8080;

app.use = (bodyParser.json());

// rutas
const productoRouter = requiere('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

app.use('/api/products', productoRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log(`serivdr andando puerto ${PORT}`)
})
