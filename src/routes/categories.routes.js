import { Router } from "express";

import {createCat, findAllCats} from '../controllers/categories.controllers.js'

const router = Router();

router.post("/categories", createCat);
router.get("/categories", findAllCats);

export default router;