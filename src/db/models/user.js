
import { Schema, model } from 'mongoose';
const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxLength: 32,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      maxLength: 64,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: 8,
      maxLength: 128,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      maxLength: 150,
      default: '',
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'stories',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);