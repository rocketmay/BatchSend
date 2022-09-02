import * as dotenv from 'dotenv'
dotenv.config();

import fetch from 'node-fetch';

	export function printUserInfo() {

		console.log(`== SENDER INFORMATION ==`)

		var network = process.env.NETWORK;

		console.log(`Network: ${network}`);
		console.log(`Operator ID: ${process.env.OPERATOR_ID}`);

	}

	export async function printTokenInfo(tokenId) {

		var network = process.env.NETWORK;
		var mirrorURL;

		if(network == "mainnet")
		{
			mirrorURL = `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens?token.id=${tokenId}`;
		} else
		{
			mirrorURL = `https://testnet.mirrornode.hedera.com/api/v1/tokens?token.id=${tokenId}`
		}

		let response;
		try {
			response = await fetch(mirrorURL);
		} catch (err) {
			throw err;
		}


		var res = await response.json();

		if(response != null)
		{
			if(res.tokens == null)
			{
				throw new Error("Invalid token id provided.");
			}
		}

		console.log(`\n== TOKEN INFORMATION ==`);
		console.log(`Token ID: ${tokenId}`);
		console.log(`Token Symbol: ${res.tokens[0].symbol}`);
		
	}

	export function printBatchSummary(batch) {

		var transferUSDCost=0.0001;

		var count = batch.length;
		var totalAmount = 0;
		var approxFees = count * parseFloat(transferUSDCost);

		for(var i = 0; i < batch.length; i++)
		{
			totalAmount = totalAmount + parseInt(batch[i].amount);
		}

		console.log(`\n== BATCH SUMMARY ==`);
		console.log(`Number of Accounts to Send to: ${count}`);
		console.log(`Total amount of token to send: ${totalAmount}`);
		console.log(`Approximate transfer fees: ${approxFees} USD`);

	}