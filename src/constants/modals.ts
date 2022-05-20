import type { ModalOptions, Snowflake } from "discord.js";

export function ImportMessageModal(state: Snowflake, value?: string) {
  return {
    title: "Import Discord Message JSON",
    custom_id: `import_msgjson_${state}`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "json_data",
            label: "JSON",
            style: 2,
            min_length: 1,
            max_length: 4000,
            placeholder: "Paste JSON here...",
            required: true,
            value,
          },
        ],
      },
    ],
  } as unknown as ModalOptions;
}

export function CreateTagModal(state: Snowflake) {
  return {
    title: "Create Tag",
    custom_id: `create_tag_${state}`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "tag_name",
            label: "Tag Name",
            style: 1,
            min_length: 1,
            max_length: 15,
            placeholder: "Tag Name",
            required: true,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "tag_content",
            label: "Tag Content",
            style: 2,
            min_length: 1,
            max_length: 500,
            placeholder: "Tag Content",
            required: true,
          },
        ],
      },
    ],
  } as unknown as ModalOptions;
}

export function ChangeSlugModal(
  state: Snowflake,
  existing?: {
    slug?: string;
    redirect?: string;
  }
) {
  return {
    title: "Change Slug",
    custom_id: `change_slug_${state}`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "slug",
            label: "Slug",
            style: 1,
            min_length: 1,
            max_length: 15,
            placeholder: "Slug",
            required: true,
            value: existing?.slug,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "redirect",
            label: "Redirect Link",
            style: 2,
            min_length: 1,
            max_length: 500,
            placeholder: "Redirect Link",
            required: false,
            value: existing?.redirect,
          },
        ],
      },
    ],
  } as unknown as ModalOptions;
}
