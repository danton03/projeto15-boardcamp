import { Router } from "express";
import { insertRental, listRentals, finishRental, deleteRental } from "../controllers/rentalsController.js";
import { checkDeleteRentalConflicts, checkFinishRentalConflicts, checkRentalConflicts } from "../middlewares/rentalMiddleware.js";

const router = Router();

router.get('/rentals', listRentals);
router.post('/rentals', checkRentalConflicts, insertRental);
router.post('/rentals/:id/return', checkFinishRentalConflicts, finishRental);
router.delete('/rentals/:id', checkDeleteRentalConflicts, deleteRental);

export default router;