Sync [ActualBudget](https://actualbudget.com/) via [SimpleFIN](https://beta-bridge.simplefin.org/)
## PREREQUISITES
  - A [SimpleFIN Token](https://beta-bridge.simplefin.org/) is required during **setup**
  - The [ActualBduget Budget ID](https://actualbudget.com/docs/developers/using-the-API/#getting-started) is required during **setup**
  - ActualBudget needs to be installed and running

## TODO
 - Better security for storage of SimpleFIN AccessKey
 - Allow custom date ranges for sync
 
## USAGE
  - **Sync** - If the app hasn't been configured yet, you'll be run through the setup steps, otherwise it will sync the current month for all accounts. 
    ```
    node app.js
    ```

  - **Setup** - Change your SimpleFIN token, which budget file to use, and how the accounts are linked. 
    ```
    node app.js --setup
    ```

  - **Link** - Change or add any new linked accounts 
    ```
    node app.js --link
    ```
