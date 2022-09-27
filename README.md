# Archive Notice

I (tristan), have made the decision to shut down Evie (the discord bot).

> Thanks for an incredible 0.97 of a year (7 October 2021 – 27 September 2022) :heart:

Evie started as a companion bot for TristanSMP <https://tristansmp.com> enhancing Tristan SMP's Discord server with a custom bot that interacts with player data. During this time, I had another Discord bot I was working on; Jamble (Just Another Music Bot'le) and this was when YouTube started attacking Music bots with legal actions. Most bots shut down, but I decided to work on more "public" features for Evie and rebrand Jamble into Evie. Evie's main features became showing TSMP stats, Moderation utilities, general Discord tools and VALORANT stats.

Later down the track, I shut down Tristan SMP due to the low interest in the server causing no donations and I also lost interest in the server since none of my friends played it anymore either; so why pay for it? Now I have no community servers on Discord to moderate and my main feature of Evie is gone.

I had lost all ideas for Evie since I was no longer moderating any servers, and the flow of features for Evie was from my wanting features that Dyno and the other bots in my server couldn't provide. I started focusing on Evie's infrastructure (which was completely over-engineered).

Fast forward a couple of months and I completely took a break from everything Discord related and Evie's "hub" went offline causing nodes to lose connection to Discord and she went down for a month. When I came back to Discord, I discovered her being offline and had no complaints so I just decided to shut her down for good.

*p.s the evie.pw domain will most likely be re-purposed for another one of my projects*

---

<div align="center">
<img src="https://github.com/TeamEvie.png" width="15%" class="round" style="border-radius: 50%;">

<br />

[![top.gg](https://top.gg/api/widget/upvotes/807543126424158238.svg?noavatar=true)](https://top.gg/bot/807543126424158238)
[![GitHub stars](https://img.shields.io/github/stars/TeamEvie/Evie?style=flat-square)](https://github.com/TeamEvie/Evie/stargazers)
[![DiscordInvite](https://discord.com/api/guilds/819106797028769844/embed.png)](https://evie.pw/discord)
[![Crowdin](https://badges.crowdin.net/eviebot/localized.svg)](https://crowdin.com/project/eviebot)

</div>

## Features ![bap](https://cdn.discordapp.com/emojis/785701845300412436.png?size=32)

### Moderation ![bap](https://cdn.discordapp.com/emojis/785674459083964466.png?size=32)

Evie features a very powerful moderation engine, allowing you to ban, kick, temp role, timeout, and more.

### Utility ![charm](https://cdn.discordapp.com/emojis/785676180229455905.png?size=32)

Evie comes with heaps of helpful utilities to construct your server, lookup information, and more.

### Multiple languages ![jam](https://cdn.discordapp.com/emojis/785675950926200874.png?size=32)

Evie supports a wide variety of languages, allowing non-English users to use Evie in their native language. Contributing translations on [Crowdin](https://crwd.in/eviebot) is encouraged!

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
8. Update the environment variable `DATABASE_URL` you made with `postgresql://postgres:internalpassword@localhost:5432/bot?schema=public`
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
