import connection from "../database/database.js";
import { gameSchema } from "../schemas/gameSchema.js";

async function checkGameConflicts (req, res, next){
  const game = req.body;
  const gameValidate = gameSchema.validate(game);
  if(gameValidate.error){
    return res.sendStatus(400);
  }

  const gameName = game.name[0].toUpperCase() + game.name.slice(1).toLowerCase();
  const gameExists = await connection.query('SELECT * FROM games WHERE name = $1;', [gameName]);
  if(gameExists.rows.length > 0) {
    return res.sendStatus(409);
  }

  const categoryExists = await connection.query('SELECT * FROM categories WHERE id = $1;', [game.categoryId]);
  if(categoryExists.rows.length === 0) {
    return res.sendStatus(400);
  }

  res.locals.game = {...game, name: gameName};
  next();
}

export {checkGameConflicts};