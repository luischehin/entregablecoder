import { Router } from 'express';
import fs from 'fs';

const router = Router();
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

// Ruta para actualizar un producto
router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const product = products.find(product => product.id == pid);
    if (!product) {
        return res.status(404).json({ error: 'No se encuentra el producto con el id solicitado' });
    }

    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.stock = stock;
    product.category = category;

    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
    res.json(product);

    // Emitir evento de actualización de producto
    req.app.get('io').emit('product-updated', products);
});

// Ruta para eliminar un producto
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = products.findIndex(product => product.id == pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: `No se encuentra el producto con el id: ${pid} solicitado` });
    }

    const [deletedProduct] = products.splice(productIndex, 1);
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
    res.json(deletedProduct);

    // Emitir evento de actualización de producto
    req.app.get('io').emit('product-updated', products);
});

export default router;