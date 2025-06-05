import express from 'express';
const router = express.Router();
import { createJurnalCurrency, getSingleCurrency, getAllJurnalCurrencies, updateJurnalCurrency, deleteJurnalCurrencies, getAllJurnalCurrenciesWithoutLimit } from '../controllers/jurnalCurrenciesController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route('/')
    .post(authGuard, adminGuard, createJurnalCurrency)
    .get(getAllJurnalCurrencies)

router
    .route("/countcurrencies")
    .get(getAllJurnalCurrenciesWithoutLimit)


router
    .route('/:jurnalCurrencyId')
    .get(getSingleCurrency)
    .put(authGuard, adminGuard, updateJurnalCurrency)
    .delete(authGuard, adminGuard, deleteJurnalCurrencies)


export default router