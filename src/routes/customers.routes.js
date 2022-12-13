import { Router } from "express";

import { createCustom, findAllCustom, findCustomById, updateCustom } from '../controllers/customers.controllers.js'

const router = Router();

router.post("/customers", createCustom);
router.get("/customers", findAllCustom);
router.get("/customers/:id", findCustomById);
router.put("/customers/:id", updateCustom);


export default router;