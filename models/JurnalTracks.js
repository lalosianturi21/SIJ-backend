import { Schema, model } from "mongoose";

const JurnalTracksSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false, default: "" }
    },
    { timestamps: true }
);

const JurnalTracks = model("JurnalTracks", JurnalTracksSchema);
export default JurnalTracks;