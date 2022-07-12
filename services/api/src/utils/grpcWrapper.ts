import { container } from "@sapphire/pieces";
import {
	CanManageGuildConfigRequest,
	GetGuildRequest,
	GetGuildResponse,
	PostVoteRequest,
	PostVoteResponse,
} from "../lib/grpc";

export async function postVote(body: PostVoteRequest.AsObject) {
	const req = new PostVoteRequest()
		.setUserSnowflake(body.userSnowflake)
		.setTest(body.test)
		.setServiceName(body.serviceName)
		.setVoteLink(body.voteLink);

	const res = await new Promise<PostVoteResponse.AsObject>((resolve, reject) =>
		container.voteManager.postVote(req, (err, res) => (err ? reject(err) : resolve(res.toObject()))),
	).catch((err) => {
		throw err;
	});

	return res;
}

export async function canManageGuild(userId: string, guildId: string) {
	const req = new CanManageGuildConfigRequest().setUserId(userId).setGuildId(guildId);

	const res = await new Promise<boolean>((resolve) =>
		container.guildStore.canManageGuildConfig(req, (err, res) =>
			err ? resolve(false) : resolve(res.toObject().canManage),
		),
	);

	return res;
}

export async function fetchGuild(guildId: string) {
	const req = new GetGuildRequest().setGuildId(guildId);

	const res = await new Promise<GetGuildResponse.AsObject>((resolve, reject) =>
		container.guildStore.getGuild(req, (err, res) => (err ? reject(err) : resolve(res.toObject()))),
	).catch((err) => {
		throw err;
	});

	return res;
}
