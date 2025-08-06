import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A note must belong to a user."],
    },
    title: {
      type: String,
      required: [true, "A note should have a title."],
      maxlength: [50, "Title should be less or equal to 50 characters."],
    },
    content: {
      type: String,
      required: [true, "A note must have content."],
      maxlength: [500, "Content should be less or equal to 500 characters."],
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
