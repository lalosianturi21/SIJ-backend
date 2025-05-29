import express from 'express';
const router = express.Router();
import { createJurnalCurrency, getSingleCurrency, getAllJurnalCurrencies, updateJurnalCurrency, deleteJurnalCurrencies } from '../controllers/jurnalCurrenciesController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route('/')
    .post(authGuard, adminGuard, createJurnalCurrency)
    .get(getAllJurnalCurrencies)

router
    .route('/:jurnalCurrencyId')
    .get(getSingleCurrency)
    .put(authGuard, adminGuard, updateJurnalCurrency)
    .delete(authGuard, adminGuard, deleteJurnalCurrencies)


export default router