import { execSync } from "node:child_process";
import * as fs from "node:fs";
import { container } from "@sapphire/framework";
import { Collection } from "discord.js";
import { glob } from "glob";
import { rootFolder } from "#root/constants/paths";

export default class Handbook {
	public pages: Collection<string, string> = new Collection();

	public constructor() {
		void this.checkForUpdates();
	}

	public async checkForUpdates() {
		if (!fs.existsSync(`${rootFolder}/Handbook`)) {
			await this.cloneHandbook();
			return void (await this.loadHandbook());
		}

		await this.pullHandbook();
		return void (await this.loadHandbook());
	}

	private cloneHandbook() {
		container.logger.info("Cloning Handbook...");
		execSync("git clone https://github.com/TeamEvie/Handbook.git");
		container.logger.info("Cloned Handbook!");
	}

	private pullHandbook() {
		container.logger.info("Pulling Handbook...");
		execSync("git pull", {
			cwd: `${rootFolder}/Handbook`,
		});
		container.logger.info("Pulled Handbook!");
	}

	private loadHandbook() {
		this.pages.clear();

		glob(`${rootFolder}/Handbook/**/*.md`, (err, files) => {
			if (err) {
				container.logger.error(err);
				return;
			}
			files.forEach((file) => {
				const fileName = file.split("/").pop();
				if (!fileName) return;
				const fileContent = fs.readFileSync(file, "utf8");
				this.pages.set(fileName.replace(".md", ""), fileContent);
			});
		});
	}
}
