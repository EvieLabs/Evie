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

const fs = require("fs");
const glob = require("glob");
const path = require("path");

function getDirectories(src, callback) {
  glob(src + "/src/**/*", callback);
}

const header = `/* 
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

`;

function containsHeader(string) {
  return string.match(/\\*\nCopyright /);
}

getDirectories(".", function (err, files) {
  if (err) {
    console.log("Error", err);
  } else {
    const readAndAddHeader = new Promise((resolve, reject) => {
      let editedFiles = 0;
      let processedFiles = 0;

      files.forEach(function (file) {
        processedFiles++;
        if (processedFiles === files.length) return resolve(editedFiles);
        if (path.extname(file) === ".ts") {
          fs.readFile(file, "utf8", function (err, data) {
            if (err) {
              return console.log(err);
            }
            if (containsHeader(data)) return;
            const result = header + data;
            fs.writeFile(file, result, "utf8", function (err) {
              if (err) return console.log(err);
              editedFiles++;
              console.log(`Added copyright header to: ${file}`);
            });
          });
        }
      });
    });
    readAndAddHeader.then((editedFiles) => {
      console.log(`${editedFiles} files updated.`);
    });
  }
});
