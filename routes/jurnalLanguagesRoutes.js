import express from 'express';
const router = express.Router();
import { createJurnalLanguage, getSingleLanguage, getAllJurnalLanguages, updateJurnalLanguage, deleteJurnalLanguages} from '../controllers/jurnalLanguagesController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route('/')
    .post(authGuard, adminGuard, createJurnalLanguage)
    .get(getAllJurnalLanguages)

router
    .route("/:jurnalLanguageId")
    .get(getSingleLanguage)
    .put(authGuard, adminGuard, updateJurnalLanguage)
    .delete(authGuard, adminGuard, deleteJurnalLanguages)

export default router;