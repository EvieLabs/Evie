import { Environment } from "@evie/env";

export class Env {
	public publicUrl = Environment.getString("PUBLIC_URL", true) || "http://localhost:9990";
	public redisUrl = Environment.getString("REDIS_URL");
	public logLevel = Environment.getBoolean("VERBOSE", true, true) ? 30 : 20;
	public serverPort = Environment.getNumber("PORT", true) || 9990;
	public jwtSecret = Environment.getString("JWT_SECRET", true) || "secret";
}
