import express from 'express';
const router = express.Router();
import { createJurnalColumnStyle, getSingleColumnStyle, getAllJurnalColumnStyles, updateJurnalColumnStyle, deleteJurnalColumnStyles } from '../controllers/jurnalColumnStylesController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route("/")
    .post(authGuard, adminGuard, createJurnalColumnStyle)
    .get(getAllJurnalColumnStyles)

router  
    .route('/:jurnalColumnStyleId')
    .get(getSingleColumnStyle)
    .put(authGuard, adminGuard, updateJurnalColumnStyle)
    .delete(authGuard, adminGuard, deleteJurnalColumnStyles)

export default router;