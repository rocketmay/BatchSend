import * as dotenv from 'dotenv'
dotenv.config();

import {
	Client,
	PrivateKey,
	AccountId,
} from "@hashgraph/sdk";

export async function initClient() {
	var client;

	if (process.env.NETWORK != null) {
		var network = process.env.NETWORK;
	} else {
		reject("err");
		return;
	}

	// Return new promise
	return new Promise(function (resolve, reject) {

		// connect to testnet
		if (network == "mainnet") {
			client = Client.forMainnet();
		} else {
			client = Client.forTestnet();
		}

		if (process.env.OPERATOR_KEY != null && process.env.OPERATOR_ID != null) {
			const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
			const operatorId = AccountId.fromString(process.env.OPERATOR_ID);

			client.setOperator(operatorId, operatorKey);
			resolve(client);
			return;
		} else {
			console.log("Error: Environment variables OPERATOR_KEY and OPERATOR_ID must be present in .env file.");
			reject("err");
			return;
		}

	})

}
