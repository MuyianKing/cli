import fs from 'node:fs'
import path from 'node:path'
import copydir from 'copy-dir'

function copyDir(from, to, options) {
  copydir.sync(from, to, {
    filter(stat, filepath) {
      if (stat === 'directory' && filepath.includes('node_modules')) {
        return false
      }

      return true
    },
    ...options,
  })
}

function checkMkdirExists(path) {
  return fs.existsSync(path)
};

function mkdirGuard(target) {
  try {
    fs.mkdirSync(target, { recursive: true })
  } catch {
    mkdirp(target)
    function mkdirp(dir) {
      if (fs.existsSync(dir)) {
        return true
      }
      const dirname = path.dirname(dir)
      mkdirp(dirname)
      fs.mkdirSync(dir)
    }
  }
}

function copyFile(from, to) {
  const buffer = fs.readFileSync(from)
  const parentPath = path.dirname(to)

  mkdirGuard(parentPath)

  fs.writeFileSync(to, buffer)
}

export {
  checkMkdirExists,
  copyDir,
  copyFile,
}
