import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRoute from "./routes/categoriesRoute.js";
import gamesRoute from "./routes/gamesRoute.js";
import customersRoute from "./routes/customersRoute.js";
import rentalsRoute from "./routes/rentalsRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.use(categoriesRoute);
app.use(gamesRoute);
app.use(customersRoute);
app.use(rentalsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Servidor rodando na porta ${PORT}`));