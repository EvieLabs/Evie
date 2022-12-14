import { Environment } from "@evie/env";
import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";

const adminToken = Environment.getString("ADMIN_TOKEN", true) || "development";

export const isAdmin = middleware(async ({ ctx, next }) => {
	if (!ctx.req.headers.authorization) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Missing authorization header",
		});
	}

	const token = ctx.req.headers.authorization.split(" ")[1];

	if (token !== adminToken) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Invalid token",
		});
	}

	return next();
});
