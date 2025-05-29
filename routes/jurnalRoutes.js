import express from "express";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import { createJurnal, updateJurnal, getAllJurnals, deleteJurnal, getJurnal } from "../controllers/jurnalController.js";

const router = express.Router();

router
    .route("/")
    .post(authGuard, adminGuard, createJurnal)
    .get(getAllJurnals)

router
    .route("/:slug")
    .delete(authGuard, adminGuard, deleteJurnal)
    .get(getJurnal)
    .put(authGuard, adminGuard, uploadPicture.single("jurnalPicture"), updateJurnal) // Tambahkan middleware upload
export default router;