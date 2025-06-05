import express from 'express';
const router = express.Router();
import { createJurnalInstitution, getSingleInstitution, getAllJurnalInstitutions, updateJurnalInstitution, deleteJurnalInstitutions, getAllJurnalInstitutionsWithoutLimit } from '../controllers/jurnalInstitutionsController.js';
import { adminGuard, authGuard } from '../middleware/authMiddleware.js';

router
    .route("/")
    .post(authGuard, adminGuard, createJurnalInstitution)
    .get(getAllJurnalInstitutions)


router
    .route("/countinstitutions")
    .get(getAllJurnalInstitutionsWithoutLimit)

router  
    .route('/:jurnalInstitutionId')
    .get(getSingleInstitution)
    .put(authGuard, adminGuard, updateJurnalInstitution)
    .delete(authGuard, adminGuard, deleteJurnalInstitutions)

export default router;