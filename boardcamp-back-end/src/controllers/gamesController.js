import connection from "../database/database.js";

export async function listGames(req, res) {
  try {
    const { name } = req.query;
    if (name) {
      const query = `SELECT games.*, categories.name as "categoryName" 
      FROM games
      JOIN categories
      ON categories.id = games."categoryId"
      WHERE games.name ILIKE $1;`
      const { rows: game } = await connection.query( 
        query, [`${name}%`]
      );
      res.status(200).send(game);
    }
    else {
      const query = `SELECT games.*, categories.name as "categoryName" 
      FROM games
      JOIN categories
      ON categories.id= games."categoryId";`
      const { rows: games } = await connection.query(
        query
      );
      res.status(200).send(games)
    }
  }
  catch (error) {
    console.log(error)
  }
}

export async function insertGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;
  try {
    const query = `INSERT INTO games 
    ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
    VALUES ($1, $2, $3, $4, $5);`

    await connection.query(
      query, [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(500);
  }
}
