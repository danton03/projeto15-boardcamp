import { Router } from "express";
import { insertCustomer, listCustomers, listCustomersById, updateCustomer } from "../controllers/customersController.js";
import { checkCustomerToInsert, checkCustomerToUpdate } from "../middlewares/customerMiddleware.js";


const router = Router();

router.get("/customers", listCustomers);
router.get("/customers/:id", listCustomersById);
router.post("/customers", checkCustomerToInsert, insertCustomer);
router.put("/customers/:id", checkCustomerToUpdate, updateCustomer);

export default router;