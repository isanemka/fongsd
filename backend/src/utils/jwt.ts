import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}