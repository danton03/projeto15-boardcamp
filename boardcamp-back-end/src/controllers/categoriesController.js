import connection from "../database/database.js";

export async function listCategories(req, res){
  try{
    const { rows:categories } = await connection.query(`SELECT * FROM categories`);
    return res.status(200).send(categories);
  }
  catch(error){
    return res.sendStatus(500);
  }
}

export async function createCategory(req, res){
  const { categoryName } = res.locals;
  try{
    connection.query('INSERT INTO categories (name) VALUES ($1)', [categoryName]);
    return res.sendStatus(201);
  }
  catch(error){
    return res.sendStatus(500);
  }
}