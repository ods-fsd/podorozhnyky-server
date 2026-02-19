import { model, Schema } from 'mongoose';

const storiesSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    favoriteCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

export const StoriesCollection = model('stories', storiesSchema);