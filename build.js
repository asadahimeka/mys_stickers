const { resolve, extname } = require('path')
const { spawn } = require('child_process')
const { readFile, writeFile } = require('fs/promises')
const { existsSync, mkdirSync, createWriteStream } = require('fs')

const resolvePath = function (...dir) {
  return resolve(__dirname, ...dir)
}

// Function to download file using curl
function downloadFile(fileUrl, saveDir, saveName) {
  console.log(`downloading ${saveName} to ${saveDir} ...`)
  return new Promise((resolve, reject) => {
    // create an instance of writable stream
    const file = createWriteStream(resolvePath(saveDir, saveName))
    // execute curl using child_process' spawn function
    const curl = spawn('curl', [fileUrl])
    // add a 'data' event listener for the spawn instance
    curl.stdout.on('data', data => {
      file.write(data)
    })
    // add an 'end' event listener to close the writeable stream
    curl.stdout.on('end', () => {
      file.end()
      resolve()
    })
    // when the spawn child process exits, check if there were any errors and close the writeable stream
    curl.on('exit', code => {
      if (code != 0) reject(new Error('Download Failed: ' + code))
    })
  })
}

function removeSpace(s = '') {
  return s.replace(/\s+/g, '')
}

async function downloadStickers(name, list, type) {
  if (!name || !list.length) return
  const saveDir = removeSpace(resolvePath('stickers', name))
  if (!existsSync(saveDir)) {
    console.log('mkdir: ', name)
    mkdirSync(saveDir, { recursive: true })
  }
  const prefix = removeSpace(name) + '_'
  const info = {
    name,
    prefix,
    type,
    icon: removeSpace(list[0].name),
    items: list.map(e => removeSpace(e.name))
  }
  await writeFile(resolvePath(saveDir, 'info.json'), JSON.stringify(info))
  for (const item of list) {
    const iconName = removeSpace(item.name)
    downloadFile(item.icon, saveDir, `${prefix}${iconName}${extname(item.icon)}`)
  }
}

const ICONS_URL = 'https://api-static.mihoyo.com/takumi/misc/api/emoticon_set?gids=3'

async function main() {
  try {
    await downloadFile(ICONS_URL, '.', 'stickers.json')
    const buf = await readFile(resolvePath('stickers.json'))
    const stickers = JSON.parse(buf.toString())
    for (const { name, list } of stickers.data.list) {
      const pngList = list.filter(e => e.icon.endsWith('.png'))
      const gifList = list.filter(e => e.icon.endsWith('.gif'))
      downloadStickers(name, pngList, 'png')
      downloadStickers(name + '-GIF', gifList, 'gif')
    }
  } catch (error) {
    console.error(error)
  }
}

main()
