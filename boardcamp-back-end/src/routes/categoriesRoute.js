import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoriesController.js";
import { checkNameConflicts } from "../middlewares/categoryMiddleware.js";

const router = Router();

router.get('/categories', listCategories);
router.post('/categories', checkNameConflicts, createCategory);

export default router;