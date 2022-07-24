import connection from "../database/database.js";
import { rentalSchema } from "../schemas/rentalSchema.js";
import dayjs from "dayjs";

export async function checkRentalConflicts(req, res, next) {
  const rental = req.body;
  try {
    const validateRental = rentalSchema.validate(rental);

    const { rows: [customer] } = await connection.query(
      `SELECT id FROM customers 
      WHERE id = $1;`, [rental.customerId]
    );

    const { rows: [game] } = await connection.query(
      `SELECT * FROM games 
      WHERE id = $1;`, [rental.gameId]
    );

    const { rows: rentals } = await connection.query(
      `SELECT * FROM rentals 
      WHERE "gameId" = $1;`, [rental.gameId]
    );

    //Calcula a quantidade de aluguéis do jogo que estão em aberto 
    //para verificar se há jogos disponíveis
    let openRents = 0;
    for (let i = 0; i < rentals.length; i++) {
      if (rentals[i].returnDate === null){
        openRents++;
      }
    }
    
    const validate = validateRental.error || !game || !customer ||!game.stockTotal === 0 || openRents < game.stockTotal

    if (!validate){
      return res.sendStatus(400);
    }

    else{
      res.locals.rental = {
        ...rental,
        rentDate: dayjs().format('YYYY-MM-DD'),
        returnDate: null,
        originalPrice: Number(game.pricePerDay) * Number(rental.daysRented),
        delayFee: null
      }
      next();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function checkFinishRentalConflicts(req, res, next) {
  const { id } = req.params;
  const { rows: [ rental ] } = await connection.query(
    `SELECT * FROM rentals 
    WHERE id = $1;`, [ id ]
  );

  if (!rental) {
    return res.sendStatus(404);
  }

  //Verifica se o alugel já está finalizado
  if (rental.returnDate !== null) {
    return res.sendStatus(400);
  }

  res.locals.rental = rental;
  next();
}
export async function checkDeleteRentalConflicts(req, res, next) {
  const { id } = req.params;
  const { rows: [ rental ] } = await connection.query(
    `SELECT * FROM rentals 
    WHERE id = $1;`, [ id ]
  );

  if (!rental) {
    return res.sendStatus(404);
  }

  //Verifica se o alugel já está finalizado
  if (rental.returnDate === null) {
    return res.sendStatus(400);
  }

  res.locals.rental = rental;
  next();
}