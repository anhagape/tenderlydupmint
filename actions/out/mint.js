"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintFunction = void 0;
const web3_1 = __importDefault(require("web3"));
const mintFunction = async (context, event) => {
    let transactionEvent = event;
    const infuraNodeAddress = await context.secrets.get('NODE_ADDRESS');
    let web3 = new web3_1.default(infuraNodeAddress);
    let publicAddress = await context.secrets.get('PUBLIC_ADDRESS');
    let privateKey = await context.secrets.get('PRIVATE_KEY');
    let rawTx = {
        from: publicAddress,
        to: transactionEvent.to,
        gasLimit: 0,
        type: "0x2",
        data: transactionEvent.input,
        value: transactionEvent.value
    };
    const estimateGasLimit = await web3.eth.estimateGas(rawTx);
    rawTx.gasLimit = estimateGasLimit;
    const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Txn Success");
    console.log("TxHash: ", receipt.transactionHash);
};
exports.mintFunction = mintFunction;
//# sourceMappingURL=mint.js.map