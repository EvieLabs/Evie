# DBD-capriham-theme
Discord-dashboard free theme.

# Install

```
npm i dbd-capriham-theme
```

# Docs

https://assistants.ga/dbd-docs/#/?id=capriham

# Look

![image1](https://cdn.assistants.ga/kqwivftx)
![image2](https://cdn.assistants.ga/kqwiwlw2)
![image3](https://cdn.assistants.ga/kqwiwvr1)
![image4](https://cdn.assistants.ga/kqwix3i7)

# Usage

[discord-dashboard](https://github.com/breftejk/Discord.js-Web-Dashboard) config:

```js
const DBD = require('discord-dashboard');
const CaprihamTheme = require('dbd-capriham-theme');

const Dashboard = new DBD.Dashboard({
...
    theme: CaprihamTheme({
        websiteName: "Assistants",
        iconURL: 'https://assistants.ga/ac_logo_v6.png',
        index: {
            card:{
                title: "Assistants - The center of everything",
                description: "Assistants Discord Bot management panel. Assistants Bot was created to give others the ability to do what they want. Just.<br>That's an example text.<br><br><b><i>Feel free to use HTML</i></b>",
                //image: "https://www.geeklawblog.com/wp-content/uploads/sites/528/2018/12/liprofile-656x369.png",
            },
            information: {
                title: "Information",
                description: "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>.<br><br><b><i>You can use HTML there</i></b>"
            },
            feeds: {
                title: "Feeds",
                list: [
                    {
                        icon: "fa fa-user",
                        text: "New user registered",
                        timeText: "Just now",
                        bg: "bg-light-info"
                    },
                    {
                        icon: "fa fa-server",
                        text: "Server issues",
                        timeText: "3 minutes ago",
                        bg: "bg-light-danger"
                    }
                ]
            }
        },
        commands: {
            pageTitle: "Commands",
            table: {
                title: "List",
                subTitle: "All Assistants' commands",
                list: 
                [
                    {
                        commandName: "Test command",
                        commandUsage: "prefix.test <arg> [op]",
                        commandDescription: "Lorem ipsum dolor sth"
                    },
                    {
                        commandName: "2nd command",
                        commandUsage: "oto.nd <arg> <arg2> [op]",
                        commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff"
                    }
                ]
            }
        }
    }),
...
});

Dashboard.init();
```
