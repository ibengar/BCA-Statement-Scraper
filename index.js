const bca = require('./lib/index')

const bcaAccount = {
  username: '',
  password: ''
}

async function main() {
  const resBalance = await bca.getBalance(bcaAccount.username, bcaAccount.password)
  const resSettlement = await bca.getSettlement(bcaAccount.username, bcaAccount.password, 01, 08, 01, 08, 2022)
  console.log({ resBalance, resSettlement })
}

main()