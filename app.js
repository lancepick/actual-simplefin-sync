const setup = require('./setup')
const sync = require('./sync')
const nconf = require('nconf')

nconf.argv().env().file({ file: './config.json' })

async function run () {
  let token = nconf.get('simpleFIN:token')
  let accessKey = nconf.get('simpleFIN:accessKey')
  let budgetId = nconf.get('actual:budgetId')
  let linkedAccounts = nconf.get('linkedAccounts')

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

  await sync.run(accessKey, budgetId, linkedAccounts)

  console.log('Complete')
}

run()
