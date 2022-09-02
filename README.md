# BatchSend

#### Summary:
 A barebones script to batch multiple token sends on the Hedera network. The community is encouraged to extend and improve this script, add features, wrap it in an app, etc.

 This script requires the user to enter their Account ID and Private Key in a ".env" file. ENTERING YOUR PRIVATE KEY INTO WEBSITES, SCRIPTS AND APPS CAN POTENTIALLY EXPOSE YOUR KEY AND COMPROMISE YOUR ACCOUNT. READ THE DISCLAIMER BELOW. PROCEED AT YOUR OWN RISK. 

 The script does a little bit of error-checking but does NOT prevent all errors.
 - It does not check whether the operator account id has enough tokens (a total is provided as part of the prompts for convenience)
 - It does not check whether the operator account id has enough HBAR to pay all the fees (fees are estimated in USD but may be inaccurate)
 - The result of all transactions are recorded in a log.csv file, including any errors. Make sure to review the log to check if any transactions failed.

#### Instructions:

1. Create a .env file in your folder with the following lines:

__ file: .env _____________________________
```
# Hedera Operator
# Used to pay for transaction fees for integration tests

# Network - Set as required
NETWORK="testnet"
#NETWORK="mainnet"

# Hedera Operator Account ID
OPERATOR_ID="0.0.xxxx"

# Hedera Operator Private Key
OPERATOR_KEY="302e020100300506032b65700xxxxxxxxxxxxxxxxxxxxxxxxxx"
```
______________________

2. Make sure to set the network as required. (# comments out the appropriate line), and enter in the operator account ID and private key.

3. Edit token.cfg with your token ID.

4. Save a CSV file with the name "batch.csv" in the base folder (replacing the one that comes with the repo). This is the list of account ID's and amount to send to each account.

5. Run "node ./main.js". Carefully review the prompts. Answering yes to all the prompts will send off the transactions.

6. When the script is complete, make sure to check the "log.csv" file for any transactions that failed.

#### Future Improvements: ####

This script is open source and provided for the community's use, see the disclaimer below.

There is definitely room for improvement, better UI, better error checking, etc.

#### Disclaimer:

Copyright 2022 Rockvt.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


