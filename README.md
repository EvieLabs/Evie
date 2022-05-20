<div align="center">
<img src="https://github.com/TeamEvie.png" width="15%" class="round" style="border-radius: 50%;">

<br />

[![top.gg](https://top.gg/api/widget/upvotes/807543126424158238.svg?noavatar=true)](https://top.gg/bot/807543126424158238)
[![GitHub stars](https://img.shields.io/github/stars/TeamEvie/Evie?style=flat-square)](https://github.com/TeamEvie/Evie/stargazers)
[![DiscordInvite](https://discord.com/api/guilds/819106797028769844/embed.png)](https://evie.pw/discord)

</div>

## Features like no other! [¹](a "ok maybe not") ![bap](https://cdn.discordapp.com/emojis/785701845300412436.png?size=32)

### Moderation ![bap](https://cdn.discordapp.com/emojis/785674459083964466.png?size=32)

Evie features a very powerful moderation engine, allowing you to ban, kick, temp role, timeout, and more.

### Utility ![charm](https://cdn.discordapp.com/emojis/785676180229455905.png?size=32)

Evie comes with heaps of helpful utilities to construct your server, lookup information, and more.

### Stats ![hmm](https://cdn.discordapp.com/emojis/785675913341042718.png?size=32)

Evie can look up information and statistics both inside and outside of Discord, – for example user information and VALORANT statistics.

## Get started! ![charm](https://cdn.discordapp.com/emojis/785701961902719028.png?size=32)

1. Invite Evie! **[Default Permissions Invite](https://evie.pw/invite) or [Permission-less Invite](https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=807543126424158238)**
2. Setup Evie the way you want! **[Manage Guilds](https://evie.pw/guilds) or `/setup`**
3. Use Evie! **[Support and Community Server](https://discord.gg/Sx9QzpVC7r)**

## Need help?

If you don't understand something, discovered a bug, are having issues, or want to talk about Evie and other "nerdy" Discord topics, please join our official Discord server for support and general chit chat with our community. **[Invite](https://discord.gg/Sx9QzpVC7r)**

## Support Evie

The official public hosted Evie is a completely free service (except for some "extra" features that are just novelty). If you like Evie and she has helped your Discord server somehow, please consider sponsoring me on [GitHub Sponsors](https://github.com/sponsors/twisttaan). The money we get from sponsorships helps us to keep Evie running.

> Thanks to all our sponsors:
>
> <img src="https://sponsors.harjyotsahni.com/twisttaan.svg"><img>

## Contributing to Evie ![charm](https://cdn.discordapp.com/emojis/874847641111003136.png?size=32)

### Requirements

- [`Node.js`]: JavaScript runtime
- [`Docker`]: Run postgres locally without much work
- [`yarn`]: To manage dependencies and run scripts

## How to start your Evie dev environment

1. Install yarn if you haven't done so yet, `npm i -g yarn` or `sudo npm i -g yarn` if on a unix system.
2. Fork/Clone the repo.
3. Install deps with by typing `yarn`.
4. Copy `.env.example` to a new file `.env` file.
5. Type `yarn build` to build the Prisma schema.
6. Make a volume for the postgres database with `docker volume create --name=postgres`.
7. Start the database with `docker-compose up --build postgres` this will only start the postgres container.
8. Update the environment variable `DATABASE_URL` in `/apps/bot` with `postgresql://postgres:internalpassword@localhost:5432/bot?schema=public`
9. Before testing make sure to push the schema to the database with `yarn pushdb` (you will need to re-run this every time you make changes to `prisma/schema.prisma`)
10. Test with `yarn dev`. Every time you save a file the running instance will automatically stop, build and restart.

<!----------------- Quick-Links --------------->

[`node.js`]: https://nodejs.org/en/
[`docker`]: https://www.docker.com/
[`yarn`]: https://yarnpkg.com/

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://evie.pw"><img src="https://avatars.githubusercontent.com/u/69066026?v=4?s=100" width="100px;" alt=""/><br /><sub><b>tristan</b></sub></a><br /><a href="https://github.com/TeamEvie/Evie/commits?author=twisttaan" title="Code">💻</a> <a href="#infra-twisttaan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
