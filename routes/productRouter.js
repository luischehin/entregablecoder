const express = require('express');
const fs = require('fs');
const path = requiere('path');
const router = express.Router();


const productsFilePath = path.join(__dirname, '../data/products.json');

const readProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};



// con esto listo todos los productos 

router.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
})

// con esto obtengo un  prodcuto
router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const product = products.find(p => p.id === pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// creo un nuevo producto 
router.post('/', (req, res) => {
    const { titulo, descripcion, codigo, precio, estado = true, stock, categoria, fotos = [] } = req.body;
    if (!title || !descripcion || !codigo || !precio || !stock || !categoria) {
        return res.status(400).json({ message: 'Todos los campos a excepcion de fotos, es obligatorio' });
    }
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        titulo,
        descripcion,
        codigo,
        precio,
        estado,
        stock,
        categoria,
        foto
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);


});

// actualizar un producto 

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { titulo, descripcion, codigo, precio, estado, stock, categoria, foto } = req.body;
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex !== -1) {
        const updatedProduct = {
            ...products[productIndex],
            titulo,
            descripcion,
            codigo,
            precio,
            estado,
            stock,
            categoria,
            foto
        };
        products[productIndex] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Borrar un producto

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== pid);
    if (products.length !== newProducts.length) {
        writeProducts(newProducts);
        res.json({ message: 'producto borrado' });
    } else {
        res.status(404).json({ message: 'producto no encontrado' });
    }
});

module.exports = router;