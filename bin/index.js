#! /usr/bin/env node

const fs = require('fs');
const path = require('path');

const Red = "\x1b[31m%s\x1b[0m"
const Green = "\x1b[32m%s\x1b[0m"
const Cyan = "\x1b[36m%s\x1b[0m"

const EXPECTED_ARGS = ['root', 'dest', 'alias'];
const errorMessage = 'There should be 3 stringified args: --root="path/to/root" --dest="path/to/dest" (dest must be related to root!) --alias="@internal-path" (it is using in regexp). Also there can be optional flag --verbose';
let isVerbose = false;

let args = process.argv.slice(2);
if (args.length !== 3 && args.length !== 4) {
  console.error(Red, errorMessage);
  process.exit(1);
}
args = args.map(arg => arg.split('=')).reduce((acc, value) => {
  key = value[0].replace(/-/g, '');
  acc = {
    ...acc,
    [key]: value[1] || true
  };
  return acc;
}, {});
Object.keys(args).forEach(key => {
  const index = EXPECTED_ARGS.findIndex(arg => arg === key);
  if (index >= 0) {
    EXPECTED_ARGS.splice(index, 1);
  }
  if (key === 'verbose' && args[key] !== 'false') {
    isVerbose = true;
  }
});

if (EXPECTED_ARGS.length) {
  console.error(Red, errorMessage);
  process.exit(1);
}

args.dest = path.resolve(__dirname, args.root, args.dest);

const importRegex = new RegExp(`([import|require].*['"])${args.alias}(.*['"])`, "g");

function replaceInFile(file, newRelativePath) {
  let data = fs.readFileSync(file, 'utf8');
  let result = data.replace(importRegex, `$1${newRelativePath}$2`);
  fs.writeFileSync(file, result, 'utf8');
}

function searchAndReplaceInDir(dir) {
  const absoluteDir = path.resolve(__dirname, dir);
  showLog(Cyan, `DIR: ${absoluteDir}`);
  fs.readdirSync(absoluteDir).forEach(file => {
    file = path.join(absoluteDir, file);
    let stat = fs.lstatSync(file);
    if (stat.isDirectory()) {
      searchAndReplaceInDir(file);
    } else {
      let newRelative = path.relative(absoluteDir, args.dest);
      if (!newRelative.startsWith('.')) {
        newRelative = `./${newRelative}`;
      }
      replaceInFile(file, newRelative);
      showLog(Cyan, `File: ${absoluteDir}`);
    }
  });
}

function showLog(color, string) {
  if (isVerbose) {
    console.log(color, string);
  }
}

searchAndReplaceInDir(args.root);

console.log(Green, '(◕‿◕✿)');
console.log(Green, 'Every match was replaced! Have a nice day!');

process.exit(0);
