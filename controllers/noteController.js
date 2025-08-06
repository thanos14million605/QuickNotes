import Note from "../models/noteModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const createNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const newNoteDoc = new Note({
    user: req.user.id,
    title,
    content,
  });

  const newNote = await newNoteDoc.save();

  res.status(201).json({
    status: "success",
    message: "New note created successfully.",
    data: {
      newNote,
    },
  });
});

const getNote = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) {
    return next(new AppError("Note not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

const getAllNotes = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const notes = await Note.find({ user: req.user.id });
  if (notes.length === 0) {
    return next(new AppError("No notes found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      notes,
    },
  });
});

const updateNote = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (!note) {
    return next(new AppError("Note note found.", 404));
  }

  const allowedFields = ["title", "content"];
  const updates = {};
  if (!req.body["title"] && !req.body["content"]) {
    return next(
      new AppError("At least one of title or content fields is required.")
    );
  }
  allowedFields.forEach((allowedField) => {
    if (req.body[allowedField] != null) {
      updates[allowedField] = req.body[allowedField];
    }
  });

  const updatedNote = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updates,
    {
      new: true,
    }
  );

  if (!updatedNote) {
    return next(new AppError("Note note found.", 404));
  }

  res.statsu(200).json({
    status: "success",
    data: {
      note: updatedNote,
    },
  });
});

const deleteNote = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!note) {
    return next(new AppError("Note not found.", 404));
  }

  res.status(200).json({
    status: "sucess",
    message: "Note deleted successfully.",
  });
});

export default { createNote, getNote, getAllNotes, updateNote, deleteNote };
