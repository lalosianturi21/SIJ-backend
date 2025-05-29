import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js"
import jurnalRoutes from "./routes/jurnalRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import jurnalCountriesRoutes from './routes/jurnalCountriesRoutes.js';
import jurnalLanguagesRoutes from './routes/jurnalLanguagesRoutes.js';
import jurnalCurrenciesRoutes from './routes/jurnalCurrenciesRoutes.js';
import jurnalIntitutionsRoutes from './routes/jurnalInstitutionsRoutes.js';
import jurnalTracksRoutes from './routes/jurnalTracksRoutes.js';
import jurnalPublishPeriodsRoutes from './routes/jurnalPublishPeriodsRoutes.js';
import jurnalColumnStylesRoutes from './routes/jurnalColumnStylesRoutes.js';
import jurnalRanksRoutes from './routes/jurnalRanksRoutes.js';
import { errorResponserHandler, invalidPathHandler } from './middleware/errorHandler.js';
import { fileURLToPath } from "url"; 
import path from "path";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

const corsOptions = {
    exposedHeaders: "*",
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send("Server is running");
});


app.use("/api/users", userRoutes);
app.use("/api/jurnals", jurnalRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/jurnal-countries", jurnalCountriesRoutes)
app.use("/api/jurnal-languages", jurnalLanguagesRoutes)
app.use("/api/jurnal-currencies", jurnalCurrenciesRoutes)
app.use("/api/jurnal-institutions", jurnalIntitutionsRoutes)
app.use("/api/jurnal-tracks", jurnalTracksRoutes)
app.use("/api/jurnal-ranks", jurnalRanksRoutes)
app.use("/api/jurnal-publishperiods", jurnalPublishPeriodsRoutes)
app.use("/api/jurnal-columnstyles", jurnalColumnStylesRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorResponserHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));