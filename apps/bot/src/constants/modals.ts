/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export const CreateTagModal = {
  title: "Create Tag",
  custom_id: "create_tag",
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
} as any;