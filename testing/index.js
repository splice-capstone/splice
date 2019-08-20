const fs = require('fs')

const fileRead = fs.readFileSync(__dirname + '/recp1.txt')

console.log(JSON.parse(fileRead))
