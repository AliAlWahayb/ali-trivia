import jwt, { JwtPayload } from "jsonwebtoken";

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set.");
    }
    return secret;
}

export function signToken(payload: object) {
    return jwt.sign(payload, getSecret(), { expiresIn: "1h" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, getSecret()) as JwtPayload;
    } catch {
        return null;
    }
}
