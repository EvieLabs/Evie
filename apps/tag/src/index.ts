import { Environment } from "@evie/env";
import { PubSubClient, PubSubClientEvents } from "@evie/pubsub";
import ejs from "ejs";
import Koa from "koa";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pino from "pino";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const template = ejs.compile(fs.readFileSync(path.join(__dirname, "assets", "tag.ejs"), "utf8"));
const logger = pino({ level: Environment.getString("LOG_LEVEL", true) || "debug" });
const pubsub = new PubSubClient({
	intents: [PubSubClientEvents.TagQueryResult],
});
const port = Environment.getNumber("PORT", true) || 9991;
const app = new Koa();

app.use(async (ctx) => {
	const slug = ctx.path.slice(1);

	if (!slug) {
		ctx.status = 400;
		ctx.body = "No tag provided";
		return;
	}

	const nonce = Math.random().toString(36).slice(2);

	pubsub.publish(PubSubClientEvents.TagQuery, {
		nonce,
		slug,
	});

	const result = await pubsub.waitFor(PubSubClientEvents.TagQueryResult, (data) => data.nonce === nonce);

	const { tag } = result;

	if (!tag) {
		ctx.status = 404;
		ctx.body = "Tag not found";
		return;
	}

	const rendered = template({
		tag: {
			name: tag.name,
			url: `https://tag.evie.pw/${slug}`,
			description: tag.content,
		},
	});

	ctx.status = 200;
	ctx.header["content-type"] = "text/html";
	ctx.body = rendered;
});

app.listen(port);

logger.info({ port }, "Server started");
