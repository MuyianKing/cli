import { readFileSync } from 'node:fs'

export default function (path) {
  const data = readFileSync(path)
  return JSON.parse(data)
}
