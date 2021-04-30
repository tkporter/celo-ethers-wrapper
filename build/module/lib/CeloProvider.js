import { BigNumber, providers, utils } from "ethers";
import { parseCeloTransaction } from "./transactions";
export class CeloProvider extends providers.JsonRpcProvider {
    constructor(url, network) {
        super(url, network);
        this.sendTransaction = sendTransaction.bind(this);
        this.getGasPrice = getGasPrice.bind(this);
        this.prepareRequest = prepareRequest.bind(this, super.prepareRequest.bind(this));
        setBlockFormat.bind(this)();
    }
}
export class CeloWebsocketProvider extends providers.WebSocketProvider {
    constructor(url, network) {
        super(url, network);
        this.sendTransaction = sendTransaction.bind(this);
        this.getGasPrice = getGasPrice.bind(this);
        this.prepareRequest = prepareRequest.bind(this, super.prepareRequest.bind(this));
        setBlockFormat.bind(this)();
    }
}
/**
 * Override certain block formatting properties that don't exist on Celo blocks
 * Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
 */
export function setBlockFormat() {
    const blockFormat = this.formatter.formats.block;
    blockFormat.gasLimit = () => BigNumber.from(0);
    blockFormat.nonce = () => "";
    blockFormat.difficulty = () => 0;
}
/**
 * Override to parse transaction correctly
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export async function sendTransaction(signedTransaction) {
    await this.getNetwork();
    const signedTx = await Promise.resolve(signedTransaction);
    const hexTx = utils.hexlify(signedTx);
    const tx = parseCeloTransaction(signedTx);
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
/**
 * Override to handle alternative gas currencies
 * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export async function getGasPrice(feeCurrencyAddress) {
    await this.getNetwork();
    const params = feeCurrencyAddress ? { feeCurrencyAddress } : {};
    return BigNumber.from(await this.perform("getGasPrice", params));
}
/**
 * Override to handle alternative gas currencies
 * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
 */
export function prepareRequest(superPrepareRequest, method, params) {
    if (method === "getGasPrice") {
        const param = params.feeCurrencyAddress
            ? [params.feeCurrencyAddress]
            : [];
        return ["eth_gasPrice", param];
    }
    return superPrepareRequest(method, params);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2Vsb1Byb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9DZWxvUHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRELE1BQU0sT0FBTyxZQUFhLFNBQVEsU0FBUyxDQUFDLGVBQWU7SUFDekQsWUFDRSxHQUFtQyxFQUNuQyxPQUE4QjtRQUU5QixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSXRCLG9CQUFlLEdBRStCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFeEUsZ0JBQVcsR0FBd0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV6RixtQkFBYyxHQUF1RCxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBVDdILGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0NBU0Y7QUFFRCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsU0FBUyxDQUFDLGlCQUFpQjtJQUNwRSxZQUNFLEdBQVcsRUFDWCxPQUE4QjtRQUU5QixLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBSXRCLG9CQUFlLEdBRStCLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFeEUsZ0JBQVcsR0FBd0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV6RixtQkFBYyxHQUF1RCxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FB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