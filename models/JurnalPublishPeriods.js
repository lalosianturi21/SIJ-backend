import { Schema, model } from "mongoose";

const JurnalPublishPeriodsSchema = new Schema(
    {
        month: { type: String, required: true },
    },
    { timestamps: true }
);

const JurnalPublishPeriods = model("JurnalPublishPeriods", JurnalPublishPeriodsSchema);
export default JurnalPublishPeriods
