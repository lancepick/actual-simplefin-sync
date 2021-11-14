const setup = require('./setup')
const sync = require('./sync')
const nconf = require('nconf')

nconf.argv().env().file({ file: './config.json' })

async function run () {
  let token = nconf.get('simpleFIN:token')
  let accessKey = nconf.get('simpleFIN:accessKey')
  let budgetId = nconf.get('actual:budgetId')
  let linkedAccounts = nconf.get('linkedAccounts') || []

  const setupRequired = !!nconf.get('setup') || !accessKey || !budgetId
  const linkRequired = setupRequired || !!nconf.get('link') || !linkedAccounts

  if (setupRequired) {
    const initialSetup = await setup.initialSetup(token, accessKey, budgetId)

    token = initialSetup.token
    accessKey = initialSetup.accessKey
    budgetId = initialSetup.budgetId

    nconf.set('simpleFIN:token', token)
    nconf.set('simpleFIN:accessKey', accessKey)
    nconf.set('actual:budgetId', budgetId)
    nconf.save()
  }

  if (linkRequired) {
    linkedAccounts = await setup.accountSetup(accessKey, budgetId, linkedAccounts, linkRequired)
    nconf.set('linkedAccounts', linkedAccounts)
    nconf.save()
  }
  const lastSync = nconf.get('lastSync')
  let startDate
  if (lastSync) {
    // Looking back an additional 5 days, this may not be necessary, just trying to make sure we catch any additional 'older' transactions that may have slipped in after our last check.
    startDate = new Date(lastSync)
    startDate.setDate(startDate.getDate() - 5)
  }
  await sync.run(accessKey, budgetId, linkedAccounts, startDate)
  nconf.set('lastSync', new Date().toDateString())
  nconf.save()
  console.log('Complete')
}

run()
