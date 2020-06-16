const path = require('path')

const CMD = process.argv[2]
const CMD_PATH = './commands/'

function main() {
  let cmd
  try {
    cmd = require(CMD_PATH + CMD)
  } catch (error) {
    console.log(`Perintah "${process.argv[2]}" Tidak Valid...`)
    process.exit()
  }
  cmd()
}

main()