import { Button, Embed } from "#reacord/main";
import { ReplyStatusEmbed, StatusEmoji } from "#root/classes/EvieEmbed";
import { colors } from "#root/constants/config";
import { ChangeSlugModal } from "#root/constants/modals";
import lang from "#root/utils/lang";
import { boostsEvie } from "#root/utils/misc/permChecks";
import type { EvieTag } from "@prisma/client";
import { container } from "@sapphire/framework";
import {
  MessageComponentInteraction,
  ModalSubmitInteraction,
  Snowflake,
  SnowflakeUtil,
  User,
} from "discord.js";
import React, { useState } from "react";

export default function EditTagMenu(props: { user: User; _tag: EvieTag }) {
  const [tag, setTag] = useState(props._tag);

  const updateTag = async () => {
    await container.client.prisma.evieTag.update({
      where: { id: tag.id },
      data: {
        link: tag.link,
        name: tag.name,
        content: tag.content,
        online: tag.online,
      },
    });
    console.log("Updated tag");
  };

  return (
    <>
      <Embed
        color={colors.evieGrey}
        title={`Edit \`tag.name\``}
        description={`**Content**: ${tag.content}
        **Accessible online**: ${
          tag.online && tag.slug
            ? `Yes [view](https://tag.evie.pw/${tag.slug})`
            : "No"
        }
        `}
      />
      <Button
        style="primary"
        user={props.user}
        label={tag.online ? "Hide Online" : "Show Online"}
        onClick={() => {
          setTag({
            ...tag,
            online: !tag.online,
          });
          updateTag();
        }}
      />
      <Button
        style="primary"
        user={props.user}
        label="Change Slug"
        onClick={async (i) => {
          if (!boostsEvie(i.interaction.user))
            return ReplyStatusEmbed(
              StatusEmoji.FAIL,
              lang.boosterOnly,
              i.interaction
            );
          const generatedState = SnowflakeUtil.generate();
          await i.interaction.showModal(ChangeSlugModal(generatedState));
          waitForModal(i.interaction, generatedState);
        }}
      />
    </>
  );
  async function waitForModal(
    interaction: MessageComponentInteraction,
    state: Snowflake
  ) {
    const submit = (await interaction
      .awaitModalSubmit({
        filter: (i) => i.customId === `change_slug_${state}`,
        time: 100000,
      })
      .catch(() => {
        interaction.followUp({
          content: "Slug modal timed out.",
          ephemeral: true,
        });
      })) as ModalSubmitInteraction;

    if (!submit) return;
    if (!submit.fields) return;

    const slug = submit.fields.getTextInputValue("slug");

    if (!slug)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "No slug provided.",
        submit
      );

    if (slug.match(/^[a-zA-Z0-9-]{1,32}$/) === null)
      return void ReplyStatusEmbed(
        StatusEmoji.FAIL,
        "Slug must be alphanumeric and no more than 32 characters long.",
        submit
      );

    const newTag = await container.client.prisma.evieTag.update({
      where: { id: tag.id },
      data: {
        slug: slug,
      },
    });
    setTag(newTag);

    return void ReplyStatusEmbed(
      StatusEmoji.SUCCESS,
      `Slug changed to \`${slug}\``,
      submit
    );
  }
}
