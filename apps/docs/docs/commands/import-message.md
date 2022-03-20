# `/importmessage`

> Sends Discord Message JSON as a message

The `/importmessage` command allows you to send a message from a valid Discord Message JSON.

Most people use this command to send fancy embeds that other people in your server can edit if they have the `Manage Messages` permission. This is a great way to make "info" messages that can be edited by your staff team.

<DiscordMessages>
	<DiscordMessage profile="evie">
		<template #interactions>
			<DiscordInteraction profile="evie" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>
