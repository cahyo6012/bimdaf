const SUB_CMD = process.argv[3]
const SUB_CMD_PATH = './'

module.exports = function tarikData() {
  let cmd
  try {
    cmd = require(SUB_CMD_PATH + SUB_CMD)
  } catch (err) {
    console.log(`Sub Perintah "${SUB_CMD}" Tidak Valid...`)
    process.exit()
  }
  cmd()
}