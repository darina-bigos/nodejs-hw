import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      enum: TAGS,
      index: true, // Додано індекс згідно з вимогою
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Note = model('note', noteSchema);
