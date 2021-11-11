const simpleFIN = require('./simpleFIN')
const api = require('@actual-app/api')

let _accessKey
let _linkedAccounts

async function sync () {
  const allAccounts = await api.getAccounts()
  const allTrans = await simpleFIN.getTransactionsForCurrentMonth(_accessKey)
  console.log('_____________________________________________________')
  console.log('|          Account          |   Added   |  Updated  |')
  console.log('+---------------------------+-----------+-----------+')
  for (const simpleFINAccountId in _linkedAccounts) {
    const accountId = _linkedAccounts[simpleFINAccountId]
    const transactions = allTrans.accounts.find(f => f.id === simpleFINAccountId).transactions
      .map(m => {
        return {
          account: accountId,
          date: new Date(m.posted * 1000).toISOString().split('T')[0],
          amount: parseInt(m.amount.replace('.', '')),
          payee_name: m.payee,
          imported_payee: m.payee,
          imported_id: m.id
        }
      })
    try {
      const importedTransactions = await api.importTransactions(accountId, transactions)
      const accountName = allAccounts.find(f => f.id === accountId).name
      console.log(`| ${accountName.padEnd(25, ' ')} | ${importedTransactions.added.length.toString().padStart(9, ' ')} | ${importedTransactions.updated.length.toString().padStart(9, ' ')} |`)
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }
  console.log('¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯')
}

async function run (accessKey, budgetId, linkedAccounts) {
  _accessKey = accessKey
  _linkedAccounts = linkedAccounts
  return await api.runWithBudget(budgetId, sync)
}

module.exports = { run }
