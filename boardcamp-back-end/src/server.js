import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRoute from "./routes/categoriesRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(json());

app.use(categoriesRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Servidor rodando na porta ${PORT}`));