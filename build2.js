const { resolve, extname } = require('path')
const { spawn } = require('child_process')
const { writeFile } = require('fs/promises')
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

async function downloadStickers(name, list, type, prefix) {
  if (!name || !list.length) return
  const saveDir = removeSpace(resolvePath('stickers', name))
  if (!existsSync(saveDir)) {
    console.log('mkdir: ', name)
    mkdirSync(saveDir, { recursive: true })
  }
  prefix = prefix ?? removeSpace(name) + '_'
  const info = {
    name,
    prefix,
    type,
    icon: list[0].name,
    items: list.map(e => e.name)
  }
  await writeFile(resolvePath(saveDir, 'info.json'), JSON.stringify(info))
  for (const item of list) {
    const iconName = removeSpace(item.name)
    downloadFile(item.icon, saveDir, `${prefix}${iconName}${extname(item.icon)}`)
  }
}

function bh3() {
  const name = '崩坏3·雷鸣彻空'
  const iconPreUrl = 'https://i0.hdslb.com/bfs/emote/'
  const itemNames = ['崩坏3_你好', '崩坏3_？', '崩坏3_差不多得了', '崩坏3_lay了', '崩坏3_吃咸鱼', '崩坏3_七', '崩坏3_十', '崩坏3_米', '崩坏3_长', '崩坏3_刀', '崩坏3_给你一拳', '崩坏3_呼呼呼', '崩坏3_划水', '崩坏3_乆', '崩坏3_卡了', '崩坏3_哭哭哭', '崩坏3_乱杀', '崩坏3_怒', '崩坏3_睿智', '崩坏3_送你一朵花']
  const itemsIcons = ['07cd5969c63c497ef8337cb37683234cacabb071', '9e05626dd7cccb35d3da3b8932d3aec353228dd1', '2a058c99fb5764303d499dda0c4b70e859650948', '97896639ae56311adade2b34b7e1aaeba78cbac6', '3817cb914eca387f4059c91819b2c0a9c081c3f8', 'cb94815fe126b8d6f9f2f920cddf37e025dbd476', '168108fa4238180d02ac91de2cf6350da7da9487', '87909ca321507db7df6c19b3c808ecc9f2ab8229', '61bfa199fa5a9df7ee3c31c7ea90f33fa09f0217', '189583681fb0f7dafa4f0212f0325a4a325aac07', 'f6c804d440664eec7fc8fbcf3e9e668d27b103bc', '0ad43de47307eaa17973cb96f7259e81bd6d9759', 'ca78a5f023a95f6abaf67898eaae697a08792ce8', '57589d4c18330379abeed617cc6f7a628020f2f8', 'd28255700f3b1ade61b6f00f1ed961c9a6485f01', '6c8973adbde2a2aa24aec464801587ac378da20a', 'cf0502792be0ec758b3ef894cf5d861377587036', 'f8eb0a26470f891aa1741103c68e33b5b8ceefee', '97006f5004b67aee4f2e8ff8d5d671e4a128a859', 'd8c665db9fdc69b3b90c71de3fe05536ac795409']
  const list = itemsIcons.map((e, i) => ({
    name: itemNames[i],
    icon: iconPreUrl + e + '.png'
  }))
  return [name, list, 'png', '']
}

function pcr() {
  const name = '公主连结'
  const iconPreUrl = 'https://i0.hdslb.com/bfs/emote/'
  const itemNames = ['公主连结_不错', '公主连结_鼓气', '公主连结_害怕', '公主连结_惊吓', '公主连结_来啊', '公主连结_累死了', '公主连结_冷漠', '公主连结_厉害了', '公主连结_你干嘛', '公主连结_扭扭捏捏', '公主连结_祈祷', '公主连结_思索', '公主连结_投币', '公主连结_无奈', '公主连结_邪恶', '公主连结_阴谋', '公主连结_怎么这样', '公主连结_emmm']
  const itemsIcons = ['e0ac5fff71fd2aabd8c20505a548f5bca36bc7a5', 'a3fb7d3a867ba3523e6a0faa2ca42af797328d6d', 'c305b2bd36063b700fd9fac093c21639c0806138', '57ad87c4e597a366dac713ad4800cecbd520175e', 'a82ab04d1a10c742b5eadafb2a0e04d77daa84d4', '8c68c16f8f4c79f14bb16c6ea64378d77abdf0d0', '04a257a00ae097d61498db6118f6da393d4c85b7', '066c5c59e39f163345d2a41123d53596b39a2ce3', '422897481963e6efdd93dce8581c112e7af80a1e', '4c20cd2aed2598dd18507fdd03c7d39b6eb7842c', 'a63b3da12e46314470413fea6975579b0871d1f8', '3c6741be302ec54f152093ab00f950b00a083d6d', '6bd0c47917f94d510990db020ce3a7c07ed698e9', '7f78404ee98cc8738b9b738f7e4446a6fdbaff00', '97d25106924c7f3db1fe26ed7d67db943ffcc92e', '705f87da382b4c46d6bf19579b62c88bf4aa702c', '7461756bf9c49c4b48d1c26083695044b468ad7c', '99ca73b1f486042cd8ab6b17fd5ad638ed777899']
  const list = itemsIcons.map((e, i) => ({
    name: itemNames[i],
    icon: iconPreUrl + e + '.png'
  }))
  return [name, list, 'png', '']
}

function gcg() {
  const name = '双生视界·花嫁'
  const iconPreUrl = 'https://i0.hdslb.com/bfs/emote/'
  const itemNames = [
    '双生视界_星星眼',
    '双生视界_二胡爱豆',
    '双生视界_惊讶',
    '双生视界_问号',
    '双生视界_为友谊干杯',
    '双生视界_无所谓',
    '双生视界_傲娇脸',
    '双生视界_叹气',
    '双生视界_暗中观察',
    '双生视界_推眼镜',
    '双生视界_祈祷',
    '双生视界_加油',
    '双生视界_摸头',
    '双生视界_比心'
  ]
  const itemsIcons = [
    '8660b2eeb15d9cf6a7ecb4fdad66b15366623a33',
    '9dcf4bc97143b64574cbb1865c74850eda5f554a',
    '67dd0a4443eaf2ec43d90bdcfd3011d9ed84dbf8',
    '018e9f627a5f0ae5fd8a54cd6c0b6f368b38b59c',
    '587dc47855c47f5147689d7fd2cabd65ed878243',
    'cad0261d1b8afee6b26c6044bb0f89a16c313554',
    'd33421f2b2d8e07359c2468579155dc2609b326a',
    'd471550062990d2aab313756b314ed1dcd0eef01',
    'f47dcd2d6c5902ff050a59b60b705222c3fbc041',
    'e602c2d6248b394fdfed808f8d82ef59e907ab38',
    '9159c23e7d3f7f52852b4dd8b3d8090f3c8c6365',
    '0f9bc49ee7bea906014dabab5925b9e94d5f4e04',
    '055949523a71fd36902e164840baa99d56bfa7be',
    '9c9cc7f0be191832c8edfc6f9f72f66ea016f26b'
  ]
  const list = itemsIcons.map((e, i) => ({
    name: itemNames[i],
    icon: iconPreUrl + e + '.png'
  }))
  return [name, list, 'png', '']
}

function xmsj() {
  const name = '星梦手记'
  const iconPreUrl = 'https://i0.hdslb.com/bfs/emote/'
  const itemNames = [
    '星梦手记_吃瓜',
    '星梦手记_薇薇惊吓',
    '星梦手记_惺梛认真',
    '星梦手记_石化',
    '星梦手记_问号',
    '星梦手记_卖萌',
    '星梦手记_尴尬',
    '星梦手记_要抱',
    '星梦手记_未来认真',
    '星梦手记_摊手',
    '星梦手记_委屈',
    '星梦手记_没钱',
    '星梦手记_无辜',
    '星梦手记_弃疗',
    '星梦手记_雨照惊吓'
  ]
  const itemsIcons = [
    '9227318a903c96e0e4a61f06ef208150ce470f66',
    '093634e9099f40f40886a83133de5a67ca148bce',
    '16fcbf1de40cb19d26a13552a3740150e45aa89f',
    'f6a6d33835a48e4141fb433bbd0215b1130cf681',
    '4ced3d8866f502487ec2e93b326f592f4c358fbf',
    '375e4296c26f65be888e86bea4af4f858642a7bb',
    '423347d687184c14d9ce8b47a8342fd8d23e99b9',
    'c125f4fc66ac8587fe4dd264254aad5dc4b31bef',
    '330306ba001db1bd9f78bc99b8b6ec9341acbbcb',
    'acd565a268f66fa27e0ccea409b3ff57c814b360',
    '55f3974a6dded58365ef21e0a61d91725c3db431',
    'e7d3feef58bf65441cbca1b8cd3c4b79cb923d15',
    '0be73bd600367f162a2a14d48c11ad72b3527858',
    'fee923c0e57d1f1e3426b397edcfeac93d770b76',
    '4b1316f5bfd5c1745f8c721d845a6917d663c715'
  ]
  const list = itemsIcons.map((e, i) => ({
    name: itemNames[i],
    icon: iconPreUrl + e + '.png'
  }))
  return [name, list, 'png', '']
}

async function main() {
  try {
    downloadStickers(...bh3())
    downloadStickers(...pcr())
    downloadStickers(...gcg())
    downloadStickers(...xmsj())
  } catch (error) {
    console.error(error)
  }
}

main()
