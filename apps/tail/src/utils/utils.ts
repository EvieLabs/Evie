import jwt from "jsonwebtoken";
import { container } from "tsyringe";
import { Env } from "./Env";

export class UserError extends Error {
	constructor(message: string, public status: number = 400) {
		super(message);
	}
}

export async function generateToken(id: string) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				id,
			},
			container.resolve(Env).jwtSecret,
			{
				expiresIn: 0,
			},
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			},
		);
	});
}

export async function verifyToken(token: string) {
	return new Promise<jwt.JwtPayload & { id: string }>((resolve, reject) => {
		jwt.verify(
			token,
			container.resolve(Env).jwtSecret,
			{
				ignoreExpiration: true,
			},
			(err, decoded) => {
				if (err) {
					reject(err);
				} else {
					if (!decoded) {
						reject(new Error("No decoded payload"));
						return;
					}

					if (typeof decoded !== "object") {
						reject(new Error("Decoded payload is not an object"));
						return;
					}

					if (!("id" in decoded) || typeof decoded.id !== "string") {
						reject(new Error("Decoded payload does not have an id"));
						return;
					}

					resolve(decoded as jwt.JwtPayload & { id: string });
				}
			},
		);
	});
}
