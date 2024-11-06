const copydir = require('copy-dir');
const fs = require('fs');

function copyDir(from, to, options) {
  copydir.sync(from, to, options);
}

function checkMkdirExists(path) {
  return fs.existsSync(path)
};

function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true });
  } catch (e) {
    mkdirp(target)
    function mkdirp(dir) {
      if (fs.existsSync(dir)) { return true }
      const dirname = path.dirname(dir);
      mkdirp(dirname);
      fs.mkdirSync(dir);
    }
  }
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from);
  const parentPath = path.dirname(to);

  mkdirGuard(parentPath)

  fs.writeFileSync(to, buffer);
}

exports.copyFile = copyFile;
exports.checkMkdirExists = checkMkdirExists;
exports.copyDir = copyDir;
