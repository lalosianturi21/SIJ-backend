import express from "express";
const router = express.Router();
import { createJurnalCountry, getSingleCountry, getAllJurnalCountries, updateJurnalCountry, deleteJurnalCountries } from "../controllers/jurnalCountriesController.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { getAllJurnalsWithoutLimit } from "../controllers/jurnalController.js";

router
    .route("/")
    .post(authGuard, adminGuard, createJurnalCountry)
    .get(getAllJurnalCountries)

router
    .route("/countcountries")
    .get(getAllJurnalsWithoutLimit)

router
    .route("/:jurnalCountryId")
    .get(getSingleCountry)
    .put(authGuard, adminGuard, updateJurnalCountry)
    .delete(authGuard, adminGuard, deleteJurnalCountries)

export default router