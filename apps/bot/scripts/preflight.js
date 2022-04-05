const fs = require("fs");
const glob = require("glob");
const path = require("path");

function getDirectories(src, callback) {
  glob(src + "/src/**/*", callback);
}

const header = `
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
