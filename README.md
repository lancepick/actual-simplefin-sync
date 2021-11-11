Sync [ActualBudget](https://actualbudget.com/) via [SimpleFIN](https://beta-bridge.simplefin.org/)
## PREREQUISITES
  - A SimpleFIN Token is required during **setup**
  - The ActualBduget **Budget ID** is required during **setup**
  - ActualBudget needs to be installed and running

## TODO
 - Better security of SimpleFIN AccessKey
 - Allow custom date ranges for sync
 - Consider storing last sync date (may come in handy when crossing month boundries between syncs)
 
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
