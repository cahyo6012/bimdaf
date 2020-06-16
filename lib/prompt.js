const { stdin, stdout } = process

module.exports = function prompt(question = String) {
  return new Promise((resolve, reject) => {
    stdin.resume()
    stdout.write(question)

    stdin.on('data', data => resolve(data.toString().trim()))
    stdin.on('error', err => reject(err))
  })
}