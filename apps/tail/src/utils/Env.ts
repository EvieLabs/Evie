import { Environment } from "@evie/env";

export class Env {
	public publicUrl = Environment.getString("PUBLIC_URL", true) || "http://localhost:9990";
	public redisUrl = Environment.getString("REDIS_URL");
	public logLevel = Environment.getString("LOG_LEVEL", true) || "debug";
	public serverPort = Environment.getNumber("PORT", true) || 9990;
	public jwtSecret = Environment.getString("JWT_SECRET", true) || "secret";
}
