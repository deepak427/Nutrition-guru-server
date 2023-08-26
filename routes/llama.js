import express from "express";

import { nutritionist } from "../controllers/nutritionist.js"

const router = express.Router();

router.post('/nutritionist', nutritionist)

export default router