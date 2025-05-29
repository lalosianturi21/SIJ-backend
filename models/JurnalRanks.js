import { Schema, model } from "mongoose";

const JurnalRanksSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false, default: "" }
    },
    { timestamps: true }
);

const JurnalRanks = model("JurnalRanks", JurnalRanksSchema);
export default JurnalRanks;