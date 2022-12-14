import express from "express";
import categoriesRoutes from "./routes/categories.routes.js"
import gamesRoutes from "./routes/games.routes.js"
import customerRoutes from "./routes/customers.routes.js"
import rentalRoutes from "./routes/rentals.routes.js"
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(categoriesRoutes);
app.use(gamesRoutes);
app.use(customerRoutes);
app.use(rentalRoutes);

app.listen(4000, () => console.log("Server running in port: 4000"))