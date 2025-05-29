import express from 'express';
const router = express.Router();
import { createJurnalRank, getSingleRank, getAllJurnalRanks, updateJurnalRank, deleteJurnalRanks } from '../controllers/jurnalRanksController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route("/")
    .post(authGuard, adminGuard, createJurnalRank)
    .get(getAllJurnalRanks)

router  
    .route('/:jurnalRankId')
    .get(getSingleRank)
    .put(authGuard, adminGuard, updateJurnalRank)
    .delete(authGuard, adminGuard, deleteJurnalRanks)

export default router;