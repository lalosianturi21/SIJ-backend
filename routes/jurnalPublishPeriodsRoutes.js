import express from 'express';
const router = express.Router();
import { createJurnalPublishPeriods, getSinglePublishPeriod, getAllJurnalPublishPeriods, updateJurnalPublishPeriod, deleteJurnaPublishPeriods } from '../controllers/jurnalPublishPeriodsController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route('/')
    .post(authGuard, adminGuard, createJurnalPublishPeriods)
    .get(getAllJurnalPublishPeriods)

router
    .route("/:jurnalPublishPeriodId")
    .get(getSinglePublishPeriod)
    .put(authGuard, adminGuard, updateJurnalPublishPeriod)
    .delete(authGuard, adminGuard, deleteJurnaPublishPeriods)

export default router;