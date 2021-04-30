import { BigNumber, providers, utils } from "ethers";
import { parseCeloTransaction } from "./transactions";

export class CeloProvider extends providers.JsonRpcProvider {
  constructor(
    url?: utils.ConnectionInfo | string,
    network?: providers.Networkish
  ) {
    super(url, network);
    setBlockFormat.bind(this)()
  }

  sendTransaction: (
    signedTransaction: string | Promise<string>
  ) => Promise<providers.TransactionResponse> = sendTransaction.bind(this)

  getGasPrice: (feeCurrencyAddress?: string) => Promise<BigNumber> = getGasPrice.bind(this)

  prepareRequest: (method: any, params: any) => [string, Array<any>] = prepareRequest.bind(this, super.prepareRequest.bind(this))
}

export class CeloWebsocketProvider extends providers.WebSocketProvider {
  constructor(
    url: string,
    network?: providers.Networkish
  ) {
    super(url, network);
    setBlockFormat.bind(this)()
  }

  sendTransaction: (
    signedTransaction: string | Promise<string>
  ) => Promise<providers.TransactionResponse> = sendTransaction.bind(this)

  getGasPrice: (feeCurrencyAddress?: string) => Promise<BigNumber> = getGasPrice.bind(this)

  prepareRequest: (method: any, params: any) => [string, Array<any>] = prepareRequest.bind(this, super.prepareRequest.bind(this))
}

/**
 * Override certain block formatting properties that don't exist on Celo blocks
 * Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
 */
export function setBlockFormat(this: providers.JsonRpcProvider) {
  const blockFormat = this.formatter.formats.block;
  blockFormat.gasLimit = () => BigNumber.from(0);
  blockFormat.nonce = () => "";
  blockFormat.difficulty = () => 0;
}

/**
 * Override to parse transaction correctly
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export async function sendTransaction(
  this: providers.JsonRpcProvider,
  signedTransaction: string | Promise<string>
): Promise<providers.TransactionResponse> {
  await this.getNetwork();
  const signedTx = await Promise.resolve(signedTransaction);
  const hexTx = utils.hexlify(signedTx);
  const tx = parseCeloTransaction(signedTx);
  try {
    const hash = await this.perform("sendTransaction", {
      signedTransaction: hexTx,
    });
    return this._wrapTransaction(tx, hash);
  } catch (error) {
    error.transaction = tx;
    error.transactionHash = tx.hash;
    throw error;
  }
}

/**
 * Override to handle alternative gas currencies
 * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export async function getGasPrice(this: providers.JsonRpcProvider, feeCurrencyAddress?: string) {
  await this.getNetwork();
  const params = feeCurrencyAddress ? { feeCurrencyAddress } : {};
  return BigNumber.from(await this.perform("getGasPrice", params));
}

/**
 * Override to handle alternative gas currencies
 * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
 */
export function prepareRequest<T extends providers.JsonRpcProvider>(
  this: T,
  superPrepareRequest: (method: any, params: any) => [string, Array<any>],
  method: any,
  params: any
): [string, Array<any>] {
  if (method === "getGasPrice") {
    const param = params.feeCurrencyAddress
      ? [params.feeCurrencyAddress]
      : [];
    return ["eth_gasPrice", param];
  }

  return superPrepareRequest(method, params);
}