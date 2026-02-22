import jwt from "jsonwebtoken";
import { UsersCollection } from "../models/user.js";
import { SessionsCollection } from "../models/session.js";

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const { sessionId } = req.cookies;

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token || !sessionId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // перевіряє JWT
    const { id } = jwt.verify(token, JWT_SECRET);

    // перевіряє користувача
    const user = await UsersCollection.findById(id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // перевіряє сесію
    const session = await SessionsCollection.findById(sessionId);
    if (!session) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // перевіряє що токен співпадає
    if (session.accessToken !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // перевіряє строк дії
    if (new Date() > session.accessTokenValidUntil) {
      return res.status(401).json({ message: "Token expired" });
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};