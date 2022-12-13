import { Router } from "express";

import { createRental, findAllRentals, finalizeRental, removeRental } from '../controllers/rentals.controllers.js'

const router = Router();

router.post("/rentals", createRental);
router.get("/rentals", findAllRentals);
router.post("/rentals/:id/return", finalizeRental);
router.delete("/rentals/:id", removeRental);


export default router;