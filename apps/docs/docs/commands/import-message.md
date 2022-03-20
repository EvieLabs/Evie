# `/importmessage`

> Sends Discord Message JSON as a message

The `/importmessage` command allows you to send a message from a valid Discord Message JSON.

Most people use this command to send fancy embeds that other people in your server can edit if they have the `Manage Messages` permission. This is a great way to make "info" messages that can be edited by your staff team.

## What is Discord Message JSON?

Discord Message JSON is a JSON object that contains all the information needed to send a message. It is a standard format for Discord messages.
You can learn more about the [`Message Object`](https://discord.com/developers/docs/resources/channel#message-object) on the [Discord Developer Portal](https://discord.com/developers/docs/resources/channel#message-object).

### Can I easily generate a Message Object?

Using a tool such as [Discohook](https://discohook.org/) you can easily create Message Objects.

![Discohook](/images/Discohook.png)

When using Discohook make sure to only modify the `Content` section as we are repurposing Discohook's main focus of sending Webhooks to creating a Message Object. Keep in mind modifing the `Profile` section will also occur in a rejection from Evie as you cannot change a bot's Profile, only Webhooks can do that.

Once done click `JSON Data Editor` and copy the contents.

![Discohook Copying](/images/DiscohookCopy.png)

You can now type `/importmessage <channel>` and paste the copied JSON into the modal that will pop-up after entering the command.
Evie will attempt to send your message and if it fails you will be notified, otherwise you will be notified when the message has been sent with a link to the message.

  <DiscordMessages>
    <DiscordMessage profile="evie">
      <template #interactions>
        <DiscordInteraction profile="tristan" :command="true"
          >importmessage</DiscordInteraction
        >
      </template>
	  <DiscordEmbed slot="embeds" color="#00ff00">
	   <discord-embed-description slot="description">
	   <img style="width:18px;height:18px;text-indent:-9999px;vertical-align:bottom;object-fit:contain;" src="https://cdn.discordapp.com/emojis/952340083418230874.gif?size=44&quality=lossless" /> Imported here!
	   </discord-embed-description>
      </DiscordEmbed>
    </DiscordMessage>
	<DiscordMessage profile="evie">
		<DiscordEmbed slot="embeds" color="#0F52BA" embed-title="Discohook Example">
		<discord-embed-description slot="description">
	   	Hello docs.eviebot.rocks!
	   </discord-embed-description>
        <DiscordEmbedFields slot="fields">
          <DiscordEmbedField field-title="Field Test">
            Hey!
          </DiscordEmbedField>
        </DiscordEmbedFields>
      </DiscordEmbed>
    </DiscordMessage>
  </DiscordMessages>
