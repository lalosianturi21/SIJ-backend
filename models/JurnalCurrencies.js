import { Schema, model } from "mongoose";

const JurnalCurrenciesSchema = new Schema(
    {
        name: { type: String, required: true },
        symbol: { type: String, required: true },
    },
    { timestamps: true}
);

const JurnalCurrencies = model("JurnalCurrencies", JurnalCurrenciesSchema);
export default JurnalCurrencies;
