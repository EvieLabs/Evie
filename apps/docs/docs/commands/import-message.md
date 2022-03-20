# `/importmessage`

> Sends Discord Message JSON as a message

The `/importmessage` command allows you to send a message from a valid Discord Message JSON.

Most people use this command to send fancy embeds that other people in your server can edit if they have the `Manage Messages` permission. This is a great way to make "info" messages that can be edited by your staff team.

  <DiscordMessages>
    <DiscordMessage profile="evie">
      <template #interactions>
        <DiscordInteraction profile="tristan" :command="true"
          >importmessage</DiscordInteraction
        >
      </template>
      <DiscordEmbed slot="embeds" color="#0F52BA" embed-title="Rules">
        <DiscordEmbedFields slot="fields">
          <DiscordEmbedField field-title="Respectfulness">
            This is a friendly server, please only utilize profanity to a
            minimum. Remember to be respectful towards everyone and do not
            cause, create or bring controversy to this server.
          </DiscordEmbedField>
          <DiscordEmbedField field-title="Server language">
            This is an English server, please do not speak in any other
            languages as this can make it hard for the staff to moderate & hard
            for other members to understand what you are trying to say.
          </DiscordEmbedField>
          <DiscordEmbedField field-title="Discord ToS & Guidelines">
            We strictly follow Discord Community Guidelines, any violation
            against Discord's ToS & guidelines will result in a ban.
          </DiscordEmbedField>
          <DiscordEmbedField field-title="No spamming">
            No spamming, advertising, or NSFW content. Don't be a jerk or
            generally obnoxious, nobody likes a troller.
          </DiscordEmbedField>
          <DiscordEmbedField field-title="Direct Messages">
            If you are caught direct messaging someone from this server breaking
            these rules you will still be punished.
          </DiscordEmbedField>
        </DiscordEmbedFields>
      </DiscordEmbed>
    </DiscordMessage>
  </DiscordMessages>
