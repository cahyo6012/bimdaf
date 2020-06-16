const Appportal = require('../../lib/Appportal')
const path = require('path')
const fs = require('fs')
const papa = require('papaparse')

const BASE_PATH = process.cwd()
const FILE_PATH = process.argv[4]
const OUTPUT_PATH = process.argv[5] || 'Hasil Data Kependudukan.csv'

function getListNik() {
  console.log('Membaca Daftar NIK...')
  const filepath = path.resolve(BASE_PATH, FILE_PATH)
  const listNik = []
  try {
    const csvString = fs.readFileSync(filepath, 'utf-8')
    const { data } = papa.parse(csvString, {
      header: true,
      transformHeader: h => h.toLowerCase().trim()
    })
    for (let d of data) listNik.push(d.nik)
  } catch (err) {
    console.log(err)
    process.exit()
  }
  console.log(`${listNik.length} NIK Ditemukan...\n`)
  return listNik
}

async function login() {
  console.log('Mencoba Login Appportal...')
  const appportal = await new Appportal()
  if (!appportal.isLoggedIn) throw new Error('Login Appportal Gagal. Username atau Password Salah...')
  console.log('Login Appportal Berhasil...\n')
  return appportal
}

async function getDataKependudukanByNik(listNik, appportal) {
  console.log('Mengambil Data Kependudukan...')
  const data = await appportal.getDataKependudukanByNik(listNik)
  const results = papa.unparse(data)
  console.log('Berhasil Mengambil Data Kependudukan...\n')
  return results
}

function saveDataKependudukan(results) {
  const outputpath = path.resolve(BASE_PATH, OUTPUT_PATH)
  console.log(`Menyimpan Data Pada "${ outputpath }"`)
  fs.writeFile(outputpath, results, () => process.exit())
}

module.exports = function kependudukan() {
  const listNik = getListNik()
  login()
    .then(appportal => getDataKependudukanByNik(listNik, appportal))
    .then(results => saveDataKependudukan(results))
}