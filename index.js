import Express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import configureProductRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";

const app = Express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

const __dirname = path.resolve(); // Para obtener el directorio actual

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src/views"));

// Middleware para servir archivos estáticos
app.use(Express.static(path.join(__dirname, "src/public")));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// Hacer Socket.IO disponible en req.app
app.set('io', io);

// Variable en memoria para productos
let products = [];

// Configurar rutas
const productRoutes = configureProductRoutes(io);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Rutas para vistas
app.get("/", (req, res) => {
    res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts", { products });
});

// Configurar Socket.IO
io.on("connection", (socket) => {
    console.log("Usuario conectado");
    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});

// Iniciar el servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});