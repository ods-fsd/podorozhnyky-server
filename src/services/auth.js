import { sessionsSchema } from '../models/session';

export const logoutUser = async (sessionId) => {
  await sessionsSchema.deleteOne({ _id: sessionId });
};