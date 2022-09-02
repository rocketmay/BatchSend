import * as dotenv from 'dotenv'
dotenv.config();

import {
    PrivateKey,
    TransferTransaction
} from "@hashgraph/sdk";

import fs from 'fs';

const bucketSize = 100; // how many transactions to send at once to the network.
const delay = 1000; // how many milliseconds to wait between buckets.

export async function sendTokens(batch, client, clientId, tokenid) {

    let log = fs.createWriteStream("log.csv", { flags: 'w' });
    log.write(`line, accountid, amount, status, notes\n`);

    var currentIndex = 0;

    while (currentIndex < batch.length) {

        // transactions are sent in 'buckets', which is a crude rate-limiting method
        // the script sends out {bucketSize} transactions at once, then waits for all of them to resolve
        // it then waits {delay} milliseconds before sending out the next bucket.
        // this is mostly just to avoid sending thousands of transactions at a time.
        await sendBucket(batch, client, clientId, tokenid, currentIndex, bucketSize, log);
        currentIndex = currentIndex + bucketSize;

    }

    console.log("");
    log.close();
    Promise.resolve();

}

async function sendBucket(batch, client, clientId, tokenid, currentIndex, bucketSize,log) {
    return new Promise(resolve => {
        var endIndex = Math.min(currentIndex + bucketSize, batch.length);

        console.log("Sending... " + currentIndex + "/" + batch.length);

        let promises = [];

        for (var i = currentIndex; i < endIndex; i++) {
            var line = i + 1; // line in the file, taking into account the csv header
            try {
                promises.push(
                    sendToAccount(line, client, clientId, tokenid, batch[i].accountid, batch[i].amount, log)
                );
            } catch (err) {
                // error is logged in sendToAccount, so we have nothing to do here.
            }

            currentIndex++;

        }

        Promise.allSettled(promises).then(() => {
            setTimeout(function () { 
                resolve();
            }, delay);
        });
    });
}

async function sendToAccount(line, client, clientId, tokenId, account, amount, log) {


    //Create the transfer transaction
    const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, clientId, -amount)
        .addTokenTransfer(tokenId, account, amount)
        .freezeWith(client);

    //Sign with the sender account private key
    const signTx = await transaction.sign(PrivateKey.fromString(process.env.OPERATOR_KEY));

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    var receipt;
    try {
        // Request the receipt of the transaction
        receipt = await txResponse.getReceipt(client);
    } catch (err) {
        var error = `${line}, ${account}, ${amount}, ERR, ${err.status}`;
        console.log(error);
        await log.write(error + "\n");
        return Promise.reject(error);
    }
    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    var status = "";
    if (transactionStatus._code == 22) {
        status = "OK";
        await log.write(`${line}, ${account}, ${amount}, ${status},  ` + "\n");
        return Promise.resolve();
    } else {
        status = "ERR";
        var error = `${line}, ${account}, ${amount}, ${status},  `;
        console.log(error);
        await log.write(error + "\n");
        return Promise.reject(error);
    }


}

/**
 * Utility function just to help show progress
 * @param {*} updateString 
 * @param {*} first 
 */
function printProgress(updateString, first) {
    if (first) {
        process.stdout.write(updateString);
    } else {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(updateString);
    }
}