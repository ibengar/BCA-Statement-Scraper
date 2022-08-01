const moment = require('moment')
const request = require('request-promise-native')
const htmlTableToJson = require('html-table-to-json')
const { compile } = require('html-to-text')
const convert = compile({ wordwrap: 130 })

const rp = request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
  },
  jar: request.jar(),
  rejectUnauthorized: false
})

module.exports = {
  getIP: async () => {
    const ipify = await request({
      uri: 'https://api.ipify.org/?format=json',
      json: true
    })
    return ipify.ip
  },

  login: (username, password, ip) => {
    const options = {
      method: 'POST',
      uri: 'https://ibank.klikbca.com/authentication.do',
      headers: {
        referer: 'https://ibank.klikbca.com/login.jsp'
      },
      form: {
        'value(user_id)': username,
        'value(pswd)': password,
        'value(Submit)': 'LOGIN',
        'value(actions)': 'login',
        'value(browser_info)': 'Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/92.0.4515.159+Safari/537.36',
        'value(user_ip)': ip,
        'value(mobile)': false
      },
    }
    return rp(options).then(result => { })
  },

  openSettlementMenu: () => {
    const options = {
      method: 'POST',
      uri: 'https://ibank.klikbca.com/nav_bar/account_information_menu.htm',
      headers: {
        referer: 'https://ibank.klikbca.com/authentication.do'
      }
    }
    return rp(options)
  },

  openSettlementPage: () => {
    const options = {
      method: 'POST',
      uri: 'https://ibank.klikbca.com/accountstmt.do?value(actions)=acct_stmt',
      headers: {
        referer: 'https://ibank.klikbca.com/nav_bar/account_information_menu.htm'
      }
    }
    return rp(options)
  },

  balance: () => {
    const options = {
      method: 'POST',
      uri: 'https://ibank.klikbca.com/balanceinquiry.do',
      headers: {
        referer: 'https://ibank.klikbca.com/nav_bar/account_information_menu.htm'
      }
    }
    return rp(options).then(result => {
      const tableSplit = result.split('<table border="0" cellpadding="0" cellspacing="0" width="590">')[2].split('</tr>')
      const tableLoop = tableSplit[1].replace(/\n|\r/g, '').split('</td>')
      const tableFinal = {
        account_no: convert(tableLoop[0], { wordwrap: 130 }),
        type: convert(tableLoop[1], { wordwrap: 130 }),
        currency: convert(tableLoop[2], { wordwrap: 130 }),
        balance: convert(tableLoop[3], { wordwrap: 130 })
      }
      return tableFinal
    })
  },

  settlement: async (dateTo, monthTo, dateEnd, monthEnd, yearStart) => {
    try {
      const yearEnd = moment().format('YYYY')
      const options = {
        method: 'POST',
        uri: 'https://ibank.klikbca.com/accountstmt.do?value(actions)=acctstmtview',
        headers: {
          referer: 'https://ibank.klikbca.com/accountstmt.do?value(actions)=acct_stmt'
        },
        form: {
          'value(D1)': 0,
          'value(r1)': 1,
          'value(startDt)': dateTo,
          'value(startMt)': monthTo,
          'value(startYr)': yearStart,
          'value(endDt)': dateEnd,
          'value(endMt)': monthEnd,
          'value(endYr)': yearEnd,
          'value(fDt)': '',
          'value(tDt)': '',
          'value(submit1)': 'View Account Statement'
        }
      }
      const result = await rp(options)
      const tableParser = await htmlTableToJson.parse(result).results[4]
      return tableParser
    } catch (err) {
      throw err.message
    }
  },

  logout: () => {
    const options = {
      method: 'GET',
      uri: 'https://ibank.klikbca.com/authentication.do?value(actions)=logout',
      headers: {
        referer: 'https://ibank.klikbca.com/authentication.do?value(actions)=menu'
      }
    }
    return rp(options)
  }
}