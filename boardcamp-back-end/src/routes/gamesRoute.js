import { Router } from "express";
import { insertGame, listGames } from "../controllers/gamesController.js";
import { checkGameConflicts } from "../middlewares/gameMiddleware.js";

const router = Router();

router.get('/games', listGames);
router.post('/games', checkGameConflicts, insertGame);

export default router;