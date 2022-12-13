import { Environment } from "@evie/env";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

export class Authentication {
	private jwtSecret = Environment.getString("JWT_SECRET", true) || "development";
	private prisma = container.resolve(PrismaClient);

	public async authenticateUser(token: string) {
		const { id, jwtSalt } = this.verifyJwt(token);

		const service = await this.prisma.service.findFirst({
			where: {
				id,
				jwtSalt,
			},
		});

		if (!service) {
			throw new Error("Invalid token");
		}

		return service;
	}

	public async authenticateWebhook(token: string) {
		const { id, jwtSalt } = this.verifyJwt(token);

		const webhook = await this.prisma.webhook.findFirst({
			where: {
				id,
				jwtSalt,
			},
		});

		if (!webhook) {
			throw new Error("Invalid token");
		}

		return webhook;
	}

	private verifyJwt(token: string) {
		const payload = jwt.verify(token, this.jwtSecret, {
			ignoreExpiration: true,
		});

		if (typeof payload !== "object") {
			throw new Error("Invalid token");
		}

		const jwtSalt = payload["salt"];
		const id = payload["id"];

		if (!jwtSalt || !id) {
			throw new Error("Invalid token");
		}

		if (typeof jwtSalt !== "string" || typeof id !== "string") {
			throw new Error("Invalid token");
		}
		return { id, jwtSalt };
	}

	public async generateToken(id: string, jwtSalt: string) {
		return jwt.sign({ id, salt: jwtSalt }, this.jwtSecret, {
			expiresIn: 0,
		});
	}
}
declare module "jsonwebtoken" {
	interface JwtPayload {
		salt: string;
		uuid: string;
	}
}
