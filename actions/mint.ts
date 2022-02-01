import {
	ActionFn,
	Context,
	Event,
	TransactionEvent
} from '@tenderly/actions'

import Web3 from 'web3'

export const mintFunction: ActionFn = async (context: Context, event: Event) => {
	let transactionEvent = event as TransactionEvent

	const infuraNodeAddress = await context.secrets.get('NODE_ADDRESS');
	let web3 = new Web3(infuraNodeAddress);

	let publicAddress = await context.secrets.get('PUBLIC_ADDRESS');
	let privateKey = await context.secrets.get('PRIVATE_KEY');

	let rawTx = {
		from: publicAddress,
		to: transactionEvent.to,
		gasLimit: 0,
        type: "0x2",
        data: transactionEvent.input,
		value: transactionEvent.value
	}


	const estimateGasLimit = await web3.eth.estimateGas(rawTx);

	rawTx.gasLimit = estimateGasLimit;

	const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey)
	const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);

	console.log("Txn Success")
	console.log("TxHash: ", receipt.transactionHash)
}
