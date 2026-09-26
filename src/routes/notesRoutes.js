import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/notes', getAllNotesSchema, getAllNotes);

router.get('/notes/:noteId', noteIdSchema, getNoteById);

router.post('/notes', createNoteSchema, createNote);

router.delete('/notes/:noteId', noteIdSchema, deleteNote);

router.patch('/notes/:noteId', updateNoteSchema, updateNote);

export const notesRouter = router;
