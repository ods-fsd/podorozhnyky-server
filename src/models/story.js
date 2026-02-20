// src/db/models/story.js
import { Schema, model } from 'mongoose';

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 80, //
    },
    article: {
      type: String,
      required: true,
      maxLength: 2500, //
    },
    shortDescription: {
      type: String,
      maxLength: 150,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const StoriesCollection = model('stories', storySchema);
