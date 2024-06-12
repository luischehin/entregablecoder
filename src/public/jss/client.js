const socket = io();
const productList = document.getElementById('product-list');

// Escuchar el evento de actualización de productos
socket.on('product-updated', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - ${product.price}`;
        productList.appendChild(li);
    });
});
