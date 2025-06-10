import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET! as string;

export function signToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return jwt.verify(token, SECRET) as any;
    } catch {
        return null;
    }
}
