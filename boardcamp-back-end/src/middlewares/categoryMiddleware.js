import connection from "../database/database.js";
import { categorySchema } from "../schemas/categorySchema.js";

async function checkNameConflicts(req, res, next) {
  const categoryName = req.body;
  const validateCategory = categorySchema.validate(categoryName);
  
  if(validateCategory.error){ 
    return res.sendStatus(400);
  }

  const name = req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase();
  const categoryExists = await connection.query(`
    SELECT * FROM categories 
    WHERE categories.name = $1
    `, [name]
  );
  
  if(categoryExists.rows.length > 0){
    return res.sendStatus(409);
  }

  res.locals.categoryName = name;
  next();
}

export {checkNameConflicts};