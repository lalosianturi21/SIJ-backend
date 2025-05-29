import { Schema, model } from "mongoose";

const JurnalSchema = new Schema(
    {
        name: { type: String, required: true },
        url: { type: String, required: true },
        apc: { type: Number, required: true },
        rating_avg: { type: Number, required: true },
        contact: { type: String, required: true },
        email: { type: String, required: true },
        cover: { type: String, required: false },
        slug: { type: String, required: true, unique: true },
        institutions: [{ type: Schema.Types.ObjectId, ref: "JurnalInstitutions" }],
        columnstyles: [{ type: Schema.Types.ObjectId, ref: "JurnalColumnStyles" }],
        countries: [{ type: Schema.Types.ObjectId, ref: "JurnalCountries" }],
        currencies: [{ type: Schema.Types.ObjectId, ref: "JurnalCurrencies" }],
        languages: [{ type: Schema.Types.ObjectId, ref: "JurnalLanguages" }],
        publishperiods: [{ type: Schema.Types.ObjectId, ref: "JurnalPublishPeriods" }],
        ranks: [{ type: Schema.Types.ObjectId, ref: "JurnalRanks" }],
        tracks: [{ type: Schema.Types.ObjectId, ref: "JurnalTracks" }],
        user: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true, toJSON: { virtuals: true }
    }
)

JurnalSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "jurnal",
});


const Jurnal = model("Jurnal", JurnalSchema);
export default Jurnal;