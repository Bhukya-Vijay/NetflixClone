import express from 'express'
import { createOrder, verifyPayment } from '../controllers/payments.controller.js';



const router = express.Router();

router.post("/createOrder", createOrder);
router.post("/verifypayment", verifyPayment);

export default router