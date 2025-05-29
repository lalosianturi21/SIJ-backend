import { Schema, model } from "mongoose";

const JurnalCountriesSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    { timestamps: true }
)

const JurnalCountries = model("JurnalCountries", JurnalCountriesSchema);
export default JurnalCountries;