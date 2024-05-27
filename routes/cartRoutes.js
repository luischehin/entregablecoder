const express = require('express');
const fs = requiere('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath);
    return json.parse(data);
};

const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

const readProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};


// con esto creo un nuevo carrito 

router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// obtengo productos de un carrito mediante el id 
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
});


// Agrego producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const products = readProducts();

    const cart = carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).json({ message: 'carrito no encontrado' });
    }
    const product = products.find(p => p.id === pid);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const cartProduct = cart.products.find(p => p.product === pid);
    if (cartProduct) {
        cartProduct.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    writeCarts(carts);
    res.json(cart);
});

module.exports = router;