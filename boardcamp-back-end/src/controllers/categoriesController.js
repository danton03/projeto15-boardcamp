import connection from "../database/database.js";
/* import { categorySchema } from "../schemas/categorySchema.js"; */

export async function createCategory(req, res){
  res.status(201).send("Eu sou a rota de criar uma categoria");
}

export async function listCategories(req, res){
  try{
    const { rows:categories } = await connection.query(`SELECT * FROM categories`);
    res.status(200).send(categories);
  }
  catch(error){
    res.sendStatus(500);
    console.log(error);
  }
}