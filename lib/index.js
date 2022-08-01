const parser = require('./parser')

module.exports = {
  getBalance: async (username, password) => {
    try {
      const IP = await parser.getIP()
      await parser.login(username, password, IP)
      await parser.openSettlementMenu()
      const balance = await parser.balance()
      await parser.logout()
      return balance
    } catch (err) {
      await parser.logout()
      throw err
    }
  },

  getSettlement: async (username, password, dateTo, monthTo, dateEnd, monthEnd, yearStart) => {
    try {
      const IP = await parser.getIP()
      await parser.login(username, password, IP)
      await parser.openSettlementMenu()
      await parser.openSettlementPage()
      const result = await parser.settlement(dateTo, monthTo, dateEnd, monthEnd, yearStart)
      let listData = []
      for (i in result) {
        const [ balance, date, description, branch, amount, type ] = Object.values(result[i])
        listData.push({ balance, date, description, branch, amount, type })
      }
      await parser.logout()
      return listData
    } catch (err) {
      await parser.logout()
      throw err
    }
  }
}