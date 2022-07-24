import connection from '../database/database.js';
import { customerSchema } from "../schemas/customerSchema.js"

export async function checkCustomerToInsert(req, res, next) {
  const customer = req.body;
  const validateCustomer = customerSchema.validate(customer);
  if (validateCustomer.error) {
    console.log(validateCustomer.error.message);
    return res.sendStatus(400);
  }

  const customerExists = await connection.query(
    `SELECT * FROM customers 
    WHERE cpf = $1;`, 
    [customer.cpf]
  );
  if (customerExists.rows.length > 0) {
    return res.sendStatus(409);
  }

  res.locals.customer = customer;
  next();
}

export async function checkCustomerToUpdate(req, res, next) {
  const { id } = req.params;
  const customer = req.body;

  const validateCustomer = customerSchema.validate(customer);
  if (validateCustomer.error) {
    console.log(validateCustomer.error.message);
    return res.sendStatus(400);
  }

  //Verifica se não há outro cliente com o mesmo cpf
  const customerExists = await connection.query(
    `SELECT * FROM customers 
    WHERE id != $1 
    AND cpf = $2;`,
    [id, customer.cpf]
  );
  if (customerExists.rows.length > 0) {
    return res.sendStatus(409);
  }

  res.locals.customer = customer;
  next();
}