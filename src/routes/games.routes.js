import { Router } from "express";

import { createGame, findAllGames } from '../controllers/games.controllers.js'

const router = Router();

router.post("/games", createGame);
router.get("/games", findAllGames);


export default router;