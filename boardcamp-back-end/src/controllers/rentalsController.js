import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js';
import connection from "../database/database.js";

export async function listRentals(req, res) {
  try {
    const { customerId, gameId } = req.query;
    let query = `SELECT rentals.*, customers.name AS "customerName", 
    games.name AS "gameName", games."categoryId",
    categories.name AS "categoryName"
    FROM rentals 
    INNER JOIN customers ON customers.id = rentals."customerId" 
    INNER JOIN games ON games.id = rentals."gameId" 
    INNER JOIN categories ON games."categoryId" = categories.id
    `;
    let rentalsList = [];
    if (customerId) {
      query += `WHERE "customerId" = $1;`;
      const { rows: rentals } = await connection.query(
        query, 
        [customerId]
      );

      rentalsList = [...rentals];
    } 
    else if (gameId){
      const filterByGame = query + 'WHERE "gameId" = $1;';
      const { rows: rentals } = await connection.query(
        filterByGame, 
        [gameId]
      );

      rentalsList = [...rentals];
    }
    else{
      const { rows: rentals } = await connection.query(query)
      rentalsList = [...rentals];
    }

    const rentalsFormated = rentalsList.map((rental) => {
      const rentalObj = {
        ...rental,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName
        },
      }
      delete rentalObj.customerName;
      delete rentalObj.gameName;
      delete rentalObj.categoryId;
      delete rentalObj.categoryName;
      return (rentalObj);
    });
    res.status(200).send(rentalsFormated);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function insertRental(req, res) {
  try {
    const {
      customerId,
      gameId, 
      rentDate, 
      daysRented, 
      returnDate, 
      originalPrice, 
      delayFee 
    } = res.locals.rental;

    await connection.query(
      `INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
    );

    res.sendStatus(201);
  }
  catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function finishRental(req, res) {
  const rental = res.locals.rental;
  try {
    const { rows: [game] } = await connection.query(
      `SELECT "pricePerDay" FROM games WHERE id = $1;`,
      [rental.gameId]
    );

    const date = dayjs().locale('pt-br');
    const rentDate = dayjs(rental.rentDate);
    let delay = date.diff(rentDate, "day") - rental.daysRented;
    if (delay < 0) {
      delay = 0;
    }
    const fee = delay * game.pricePerDay;

    await connection.query(
      `UPDATE rentals 
      SET "delayFee" = $1, "returnDate" = $2 
      WHERE id = $3;`, 
      [fee, date, rental.id]
    );

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const rental = res.locals.rental;
  try {
    await connection.query(
      `DELETE FROM rentals WHERE id = $1;`, 
      [rental.id]
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}