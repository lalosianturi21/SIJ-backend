import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    desc: { type: String, required: true },
    jurnal: { type: Schema.Types.ObjectId, ref: "Jurnal", required: true },
    check: { type: Boolean, default: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replyOnUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

const Comment = model("Comment", CommentSchema);
export default Comment;
