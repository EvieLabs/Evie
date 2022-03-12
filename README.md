<div align="center">
 dear godd
<img src="https://github.com/TeamEvie.png" width="15%" class="round" style="border-radius: 50%;">

# Evie [![DiscordInvite](https://discord.com/api/guilds/819106797028769844/embed.png)](https://evie.pw/discord)

[![Status](https://top.gg/api/widget/status/807543126424158238.svg?noavatar=true)](https://top.gg/bot/807543126424158238)
[![GitHub stars](https://img.shields.io/github/stars/TeamEvie/Evie?style=flat-square)](https://github.com/TeamEvie/Evie/stargazers)

> Hey thanks for being interested in the future of Evie!

</div>

## What needs to be done before merging with [production evie]

- [ ] Re-make the dashboard with Next.js instead of express
- [ ] Everything that is possible with the dashboard should be able to be changed inside of Discord with Modals and slash commands
- [ ] Re-write just about every typescript file as they were made when I was brand new to JavaScript and TypeScript so there's a lot of issues with them.
- [ ] Moderation system

  - [ ] Mod action log
    - [ ] Mod notes
    - [ ] Bans
    - [ ] Kicks
    - [ ] Warns
  - [ ] User log
    - [ ] Messages
    - [ ] Nicknames
    - [ ] Roles

- [ ] Add a tag system

## Contributing to Evie

### Requirements

- [`Node.js`]: To run [`yarn`]
- [`Docker`]: To be able to spin up a testing environment like production
- [`yarn`]: To manage dependencies

## How to start your Evie dev environment

There are multiple ways to start your Evie dev environment.

### Docker Compose (manually built & started every change)

1. Install yarn if you haven't done so yet, `npm i -g yarn` or `sudo npm i -g yarn` if on a unix system.
2. Clone the repo, and switch to the `rewrite` branch.
3. Install deps with by typing `yarn`.
4. Copy `.env.example` to a new file `.env` file located in `apps/bot`.
5. Go into the `apps/bot` directory. `cd apps/bot`
6. Type `yarn build` to build the Prisma schema.
7. Code away.
8. Before testing make sure to make a volume for the database with `docker volume create --name=postgres`.
9. Test with `docker-compose up --build` this will spin up the Main container (the bot) and a local database container.
10. Push your changes.
11. Make a PR.

### TSup Watch (automatically builds & restarts every change)

1. Install yarn if you haven't done so yet, `npm i -g yarn` or `sudo npm i -g yarn` if on a unix system.
2. Clone the repo, and switch to the `rewrite` branch.
3. Install deps with by typing `yarn`.
4. Copy `.env.example` to a new file `.env` file located in `apps/bot`.
5. Go into the `apps/bot` directory. `cd apps/bot`
6. Type `yarn build` to build the Prisma schema.
7. Code away.
8. Make a volume for the database with `docker volume create --name=postgres`.
9. Start the database with `docker-compose up --build postgres` this will only start the database container.
10. Update the environment variable `DATABASE_URL` in `/apps/bot` with `postgresql://postgres:internalpassword@localhost:5432/bot?schema=public`
11. Test with `yarn dev` Every save will automatically build and restart the bot.
12. Push your changes.
13. Make a PR.

**Tip:** When working in a monorepo such as this, when running `yarn dev` in the root directory, it will run `yarn dev` in every apps subdirectory. So make sure to run `yarn dev` in the `apps/bot` directory.

## Need help?

If you need help with contributing to Evie or have any questions, please join the [Discord server](https://evie.pw/discord).

## Support Evie

Evie is a completely free service and bot. If you like Evie and we have helped your Discord server somehow, please consider sponsoring us on [GitHub Sponsors](https://github.com/sponsors/twisttaan). The money we get from sponsorships helps us to keep the service running.

> Thanks to all our sponsors:
>
> <img src="https://sponsors.harjyotsahni.com/twisttaan.svg"><img>

<!----------------- Quick-Links --------------->

[`node.js`]: https://nodejs.org/en/
[`docker`]: https://www.docker.com/
[`yarn`]: https://yarnpkg.com/
[production evie]: https://evie.pw/bot

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://evie.pw"><img src="https://avatars.githubusercontent.com/u/69066026?v=4?s=100" width="100px;" alt=""/><br /><sub><b>tristan</b></sub></a><br /><a href="https://github.com/TeamEvie/Evie/commits?author=twisttaan" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
