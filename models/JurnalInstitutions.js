import { Schema, model } from "mongoose";

const JurnalInstitutionsSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const JurnalInstitutions = model("JurnalInstitutions", JurnalInstitutionsSchema);
export default JurnalInstitutions;