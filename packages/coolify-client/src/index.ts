import { z } from "zod";

const CoolifyConfigSchema = z
	.object({
		applicationId: z.string(),
		name: z.string(),
		type: z.string(),
		buildPack: z.string(),
		repository: z.string(),
		branch: z.string(),
		projectId: z.number(),
		port: z.number(),
		commit: z.string(),
		installCommand: z.string(),
		startCommand: z.string(),
		baseDirectory: z.string(),
	})
	.passthrough();

export type CoolifyConfig = z.infer<typeof CoolifyConfigSchema>;

export async function ParseJwt(jwt: string) {
	const str = Buffer.from(jwt, "base64").toString("utf-8");
	const json = JSON.parse(str);

	return CoolifyConfigSchema.parseAsync(json);
}
