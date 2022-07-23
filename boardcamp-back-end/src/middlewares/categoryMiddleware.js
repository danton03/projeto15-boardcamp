import connection from "../database/database.js";
import { categorySchema } from "../schemas/categorySchema.js";

async function checkNameConflicts(req, res, next) {
  const name = req.body.name[0].toUpperCase() + req.body.name.slice(1).toLowerCase();
  const categoryName = req.body;
  const validateCategory = categorySchema.validate(categoryName);
  
  if(validateCategory.error){ 
    return res.status(400);
  }

  const categoryExists = await connection.query(`
    SELECT * FROM categories 
    WHERE categories.name = $1
    `, [name]
  );
  
  if(categoryExists.rows.length > 0){
    return res.status(409);
  }

  res.locals.categoryName = name;
  next();
}

export {checkNameConflicts};