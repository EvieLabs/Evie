import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import { container } from "tsyringe";
import { ServiceManager } from "../managers/ServiceManager";

let cache: string | null = null;
let lastFetch = 0;

export async function metrics(_: Request, res: Response) {
	res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");

	if (cache && Date.now() - lastFetch < 5_000) {
		return void res.status(200).send(cache);
	}

	const metrics = [
		"# HELP tail_webhook_total The total number of webhooks",
		"# TYPE tail_webhook_total counter",
		`tail_webhook_total ${await container.resolve(PrismaClient).webhook.count()}`,
		...container.resolve(ServiceManager).getMetrics(),
	].join("\n");

	cache = metrics;
	lastFetch = Date.now();

	return void res.status(200).send(metrics);
}
