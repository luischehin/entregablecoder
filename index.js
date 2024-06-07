import Express from "express"
import productsRoutes from "./routes/products.routes.js"
import cartRoutes from "./routes/carts.routes.js"

const app = Express();

const PORT = 8080;

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartRoutes);