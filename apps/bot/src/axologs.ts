/* 
Copyright 2022 Tristan Camejo

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

export const axo = {
  startupMsg: function (startupMsg: any) {
    console.log("\x1b[34m[Startup] \x1b[0m", startupMsg);
    return;
  },

  log: function (msg: any) {
    console.log("\x1b[36m[Evie] \x1b[0m", msg);
    return;
  },

  err: function (err: any) {
    console.log("\x1b[31m[ERROR] \x1b[0m", err);
    return;
  },

  i: function (i: any) {
    console.log("\x1b[36m[Interaction] \x1b[0m", i);
    return;
  },
};
