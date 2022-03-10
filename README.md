<div align="center">

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

### How to start your Evie dev environment

1. Install yarn if you haven't done so yet, `npm i -g yarn` or `sudo npm i -g yarn` if on a unix system.
2. Clone the repo, and switch to the `rewrite` branch.
3. Install deps with by typing `yarn`.
4. Fill in the `.env` file located in `apps/bot`.
5. Go into the `apps/bot` directory. `cd apps/bot`
6. Type `yarn build && npx prisma db push`
7. Code away.
8. Test with `docker-compose up --build` this will spin up the Main container (the bot) and a local MongoDB container.
9. Push your changes.
10. Make a PR.

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
