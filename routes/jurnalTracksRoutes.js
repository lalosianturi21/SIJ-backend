import express from 'express';
const router = express.Router();
import { createJurnalTrack, getSingleTrack, getAllJurnalTracks, updateJurnalTrack, deleteJurnalTracks } from '../controllers/jurnalTracksController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';
import { getAllJurnalsWithoutLimit } from '../controllers/jurnalController.js';

router
    .route("/")
    .post(authGuard, adminGuard,createJurnalTrack)
    .get(getAllJurnalTracks)


router
    .route("/counttracks")
    .get(getAllJurnalsWithoutLimit)


router  
    .route('/:jurnalTrackId')
    .get(getSingleTrack)
    .put(authGuard, adminGuard, updateJurnalTrack)
    .delete(authGuard, adminGuard, deleteJurnalTracks)

export default router;