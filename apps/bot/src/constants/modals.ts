import type { ModalOptions, Snowflake } from "discord.js";

export function TSMPApplyModal(state: Snowflake) {
  return {
    title: "Apply for member on Tristan SMP",
    custom_id: `tsmp_applymodal_${state}`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 4,
            custom_id: "whyjoin",
            label: "Why do you want to join the smp?",
            style: 2,
            min_length: 50,
            max_length: 200,
            placeholder: "what do you like doing?",
            required: true,
          },
          // {
          //   type: 4,
          //   custom_id: "howmuch",
          //   label: "Estimate how much you will play in a week?",
          //   style: 2,
          //   min_length: 5,
          //   max_length: 15,
          //   placeholder: "an estimate to let us know how active you will be.",
          //   required: true,
          // },
        ],
      },
    ],
  } as unknown as ModalOptions;
}

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
