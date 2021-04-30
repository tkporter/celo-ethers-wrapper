"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareRequest = exports.getGasPrice = exports.sendTransaction = exports.setBlockFormat = exports.CeloWebsocketProvider = exports.CeloProvider = void 0;
const ethers_1 = require("ethers");
const transactions_1 = require("./transactions");
class CeloProvider extends ethers_1.providers.JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        this.sendTransaction = sendTransaction.bind(this);
        this.getGasPrice = getGasPrice.bind(this);
        this.prepareRequest = prepareRequest.bind(this, super.prepareRequest.bind(this));
        setBlockFormat.bind(this)();
    }
}
exports.CeloProvider = CeloProvider;
class CeloWebsocketProvider extends ethers_1.providers.WebSocketProvider {
    constructor(url, network) {
        super(url, network);
        this.sendTransaction = sendTransaction.bind(this);
        this.getGasPrice = getGasPrice.bind(this);
        this.prepareRequest = prepareRequest.bind(this, super.prepareRequest.bind(this));
        setBlockFormat.bind(this)();
    }
}
exports.CeloWebsocketProvider = CeloWebsocketProvider;
/**
 * Override certain block formatting properties that don't exist on Celo blocks
 * Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
 */
function setBlockFormat() {
    const blockFormat = this.formatter.formats.block;
    blockFormat.gasLimit = () => ethers_1.BigNumber.from(0);
    blockFormat.nonce = () => "";
    blockFormat.difficulty = () => 0;
}
exports.setBlockFormat = setBlockFormat;
/**
 * Override to parse transaction correctly
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
async function sendTransaction(signedTransaction) {
    await this.getNetwork();
    const signedTx = await Promise.resolve(signedTransaction);
    const hexTx = ethers_1.utils.hexlify(signedTx);
    const tx = transactions_1.parseCeloTransaction(signedTx);
    try {
        const hash = await this.perform("sendTransaction", {
            signedTransaction: hexTx,
        });
        return this._wrapTransaction(tx, hash);
    }
    catch (error) {
        error.transaction = tx;
        error.transactionHash = tx.hash;
        throw error;
    }
}
exports.sendTransaction = sendTransaction;
/**
 * Override to handle alternative gas currencies
 * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
async function getGasPrice(feeCurrencyAddress) {
    await this.getNetwork();
    const params = feeCurrencyAddress ? { feeCurrencyAddress } : {};
    return ethers_1.BigNumber.from(await this.perform("getGasPrice", params));
}
exports.getGasPrice = getGasPrice;
/**
 * Override to handle alternative gas currencies
 * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
 */
function prepareRequest(superPrepareRequest, method, params) {
    if (method === "getGasPrice") {
        const param = params.feeCurrencyAddress
            ? [params.feeCurrencyAddress]
            : [];
        return ["eth_gasPrice", param];
    }
    return superPrepareRequest(method, params);
}
exports.prepareRequest = prepareRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2Vsb1Byb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9DZWxvUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXFEO0FBQ3JELGlEQUFzRDtBQUV0RCxNQUFhLFlBQWEsU0FBUSxrQkFBUyxDQUFDLGVBQWU7SUFDekQsWUFDRSxHQUFtQyxFQUNuQyxPQUE4QjtRQUU5QixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSXRCLG9CQUFlLEdBRStCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFeEUsZ0JBQVcsR0FBd0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV6RixtQkFBYyxHQUF1RCxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBVDdILGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0NBU0Y7QUFoQkQsb0NBZ0JDO0FBRUQsTUFBYSxxQkFBc0IsU0FBUSxrQkFBUyxDQUFDLGlCQUFpQjtJQUNwRSxZQUNFLEdBQVcsRUFDWCxPQUE4QjtRQUU5QixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSXRCLG9CQUFlLEdBRStCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFeEUsZ0JBQVcsR0FBd0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV6RixtQkFBYyxHQUF1RCxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBVDdILGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0NBU0Y7QUFoQkQsc0RBZ0JDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsY0FBYztJQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDakQsV0FBVyxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxrQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxXQUFXLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUM3QixXQUFXLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBTEQsd0NBS0M7QUFFRDs7O0dBR0c7QUFDSSxLQUFLLFVBQVUsZUFBZSxDQUVuQyxpQkFBMkM7SUFFM0MsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDMUQsTUFBTSxLQUFLLEdBQUcsY0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0QyxNQUFNLEVBQUUsR0FBRyxtQ0FBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxJQUFJO1FBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1lBQ2pELGlCQUFpQixFQUFFLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxLQUFLLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixLQUFLLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDaEMsTUFBTSxLQUFLLENBQUM7S0FDYjtBQUNILENBQUM7QUFsQkQsMENBa0JDO0FBRUQ7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLFdBQVcsQ0FBa0Msa0JBQTJCO0lBQzVGLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hCLE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRSxPQUFPLGtCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBSkQsa0NBSUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixjQUFjLENBRTVCLG1CQUF1RSxFQUN2RSxNQUFXLEVBQ1gsTUFBVztJQUVYLElBQUksTUFBTSxLQUFLLGFBQWEsRUFBRTtRQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsa0JBQWtCO1lBQ3JDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQztZQUM3QixDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNoQztJQUVELE9BQU8sbUJBQW1CLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFkRCx3Q0FjQyJ9