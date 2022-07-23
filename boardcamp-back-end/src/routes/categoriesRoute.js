import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoriesController.js";

const router = Router();

router.get('/categories',listCategories);
router.post('/categories', createCategory);

export default router;