import { Schema, model } from "mongoose";

const JurnalColumnStylesSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false, default: "" }
    },
    { timestamps: true }
);

const JurnalColumnStyles = model("JurnalColumnStyles", JurnalColumnStylesSchema);
export default JurnalColumnStyles;