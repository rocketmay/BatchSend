import * as dotenv from 'dotenv'
dotenv.config();

import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import { initClient } from './src/initClient.js';
import { printUserInfo, printTokenInfo, printBatchSummary } from './src/checkInfo.js';
import { sendTokens } from './src/sendTokens.js';

import fs from 'fs';

const tokenConfig = './token.cfg';
const batchCSV = './batch.csv';

main();

function UserInput(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, answer => {
            resolve(answer);
        });

    });
}



async function main() {

    console.log("---------------------------------");
    console.log(" Batch Token Sender ");
    console.log("---------------------------------");
    console.log("");

    // init returns an object with client, network, tokenId and batch
    let config;
    try{
     config = await init();
    } catch(err){
        console.log(err);
        return Promise.resolve();
    }

    if (config != null) {
        // user confirms account information

        printUserInfo();

        var confirmUser = await UserInput("Is this correct? [yes]/no ");

        if (confirmUser != "yes") {
            console.log("Please update .env and run this script again.");
            rl.close();
            return Promise.resolve();
        }


        // user confirms token information

        await printTokenInfo(config.tokenId, config.client);

        var confirmToken = await UserInput("Is this correct? [yes]/no ");

        if (confirmToken != "yes") {
            console.log("Please update token.cfg and run this script again.");
            rl.close();
            return Promise.resolve();
        }

        // user confirms batch information

        printBatchSummary(config.batch);

        var confirmBatch = await UserInput("Is this correct? [yes]/no ");

        if (confirmBatch != "yes") {
            console.log("Please update batch.csv and run this script again.");
            rl.close();
            return;
        }
        var confirmSend = await UserInput("LAST CHANCE TO QUIT: Proceed to submit transactions to Hedera Network? [yes]/no ");

        if (confirmSend != "yes") {
            console.log("Cancelled.");
            rl.close();
            return Promise.resolve();
        }

        sendTokens(config.batch, config.client, config.clientId, config.tokenId).then(() => {

            var batchSize = config.batch.length;
            console.log("Script complete. Please check log.csv for send log.");
            rl.close();
            return Promise.resolve();
        }).catch(err => {
            console.log("Error during send. Please check log.csv for send log.");
            console.log("Final error was: " + err);
            rl.close();
            return Promise.resolve();
        });

        
    }


    async function init() {

        var client = await initClient();
        var network = process.env.NETWORK;
        var tokenId;
        var batch;
        var clientId = process.env.OPERATOR_ID;

        // read the token Id out of token.cfg
        try {
            
            if (fs.existsSync(tokenConfig)) {
                
                var file = fs.readFileSync(tokenConfig).toString().split("\n");
                for (var i in file) {
                    var line = file[i].split(" ");
                    if (line[0] == "tokenId") {
                        tokenId = line[1];
                        break;
                    }
                }
                
                if (tokenId == null) {
                    throw new Error("tokenId not found in token.cfg");
                }
            }
        } catch (err) {
            throw new Error("Cannot load token information: " + err);
        }

        // load the batch of accounts
        try {
            batch = loadBatch(batchCSV);
        } catch (err) {
            throw new Error("Cannot load batch information: " + err);
        }

        var result = { clientId: clientId, client: client, network: network, tokenId: tokenId, batch:batch };
        return result;

    }

    /**
     * Loads a CSV file (ignoring the first line, which is the header) into a tokenID/amount array.
     * @param filename should be batch.csv
     */
    function loadBatch(filename) {

        // batch is an array of {accountid , amount} objects
        let batch = [];

        if (fs.existsSync(filename)) {
            var array = fs.readFileSync(filename).toString().split("\n");

            // ignore the first line, which is the headers
            // format for the CSV should be: accountId, amount_to_send
            // this script does not do any error checking on account Id's.

            for (var i=1; i<array.length; i++) {

                var line = array[i].split(",");
                if(line.length != 2)
                {
                    if(line != "")
                    {
                        console.log(`Line ${i+1} in batch file not formatted correctly: ${array[i]}`);
                    }
                } else
                {
                    var sendAmount = line[1].replace(/(\r\n|\n|\r)/gm, ""); // remove the newline from amount
                    var pair={accountid:line[0],amount:sendAmount}
                    batch.push(pair);
                }
                
                
            }

            return batch;

        } else
        {
            throw new Error(`batch file ${filename} does not exist.`);
        }

    }
}
