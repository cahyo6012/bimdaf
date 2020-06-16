const request = require('./request')
const prompt = require('./prompt')
const CliProgress = require('cli-progress')

class Appportal {
  constructor(username, password) {
    this.BASE_URL = 'https://appportal/'
    return this.login(username, password)
  }

  async login(username, password) {
    if(!username) username = await prompt('Masukkan Username: ')
    if(!password) password = await prompt('Masukkan Password: ')
    const url = this.BASE_URL + 'login/login/loging_simpel'
    const form = { username, password, sublogin: 'Login' }
    return request.post(url, { form })
      .then(res => {
        this.isLoggedIn = res.headers.refresh || res.body.trim() == 'User tidak ditemukan' ? false : true
        return this
      })
  }

  async getDataKependudukanByNik(nik) {
    if (typeof nik == 'string') nik = [nik]
    const bar = new CliProgress.SingleBar({
      format:  `Mengunduh [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`
    }, CliProgress.Presets.legacy)
    bar.start(nik.length, 0)
    const data = []
    for (let n of nik) {
      const url = this.BASE_URL + 'app_pp31/index.php/dukcapil/get'
      const form = {
        page: 1,
        rp: 30,
        sortname: 'NAMA_LGKP',
        query: '',
        qtype: '',
        filter: 'nik-dukcapil',
        'filter-nama': 'nama-persis',
        keyword: n,
        'duk-tglthnlahir': '',
        'duk-tmplahir': '',
        'duk-kabkota': ''
      }
      const res = await request.post(url, { form })
      const d = JSON.parse(res.body).rows[0]
      data.push({ ID: d.id, ...d.cell })
      bar.increment()
    }
    bar.stop()
    console.log()
    return data
  }
}

module.exports = Appportal