import connection from "../database/database.js";

export async function listCustomers(req, res) {
  try {
    const { cpf } = req.query;
    if (cpf) {
      let query = `SELECT * FROM customers
      WHERE cpf LIKE $1;`;
      const {rows: customers} = await connection.query(
        query, [`${cpf}%`]
      );
  
      return res.status(200).send(customers);
    }
  
    else{
      let query = `SELECT * FROM customers;`;
      const {rows: customers} = await connection.query(query);
  
      return res.status(200).send(customers);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export async function listCustomersById(req, res){
  try {
    const { id } = req.params;
    const { rows: customer } = await connection.query(
      `SELECT * FROM customers 
      WHERE id = $1;`, [id]
    );
  
    if(customer.length === 0){
      return res.sendStatus(404);
    }
    
    return res.status(200).send(customer[0]);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function insertCustomer(req, res){
  try {
    const { name, phone, cpf, birthday } = res.locals.customer;
    await connection.query(
      `INSERT INTO customers 
      (name, phone, cpf, birthday) 
      VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
  
    return res.sendStatus(201);  
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function updateCustomer(req, res){
  try {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = res.locals.customer;
    await connection.query(
      `UPDATE customers 
      SET name = $1, phone = $2, cpf = $3, birthday = $4 
      WHERE id = $5;`, 
      [name, phone, cpf, birthday, id]
    );
    
    return res.sendStatus(200); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}