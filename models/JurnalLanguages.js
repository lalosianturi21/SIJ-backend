import { Schema, model } from "mongoose";

const JurnalLanguagesSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const JurnalLanguages = model("JurnalLanguages", JurnalLanguagesSchema);
export default JurnalLanguages
