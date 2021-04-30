import { BigNumber, providers, utils } from "ethers";
export declare class CeloProvider extends providers.JsonRpcProvider {
    constructor(url?: utils.ConnectionInfo | string, network?: providers.Networkish);
    sendTransaction: (signedTransaction: string | Promise<string>) => Promise<providers.TransactionResponse>;
    getGasPrice: (feeCurrencyAddress?: string) => Promise<BigNumber>;
    prepareRequest: (method: any, params: any) => [string, Array<any>];
}
export declare class CeloWebsocketProvider extends providers.WebSocketProvider {
    constructor(url: string, network?: providers.Networkish);
    sendTransaction: (signedTransaction: string | Promise<string>) => Promise<providers.TransactionResponse>;
    getGasPrice: (feeCurrencyAddress?: string) => Promise<BigNumber>;
    prepareRequest: (method: any, params: any) => [string, Array<any>];
}
/**
 * Override certain block formatting properties that don't exist on Celo blocks
 * Reaches into https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/formatter.ts
 */
export declare function setBlockFormat(this: providers.JsonRpcProvider): void;
/**
 * Override to parse transaction correctly
 * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export declare function sendTransaction(this: providers.JsonRpcProvider, signedTransaction: string | Promise<string>): Promise<providers.TransactionResponse>;
/**
 * Override to handle alternative gas currencies
 * getGasPrice in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/base-provider.ts
 */
export declare function getGasPrice(this: providers.JsonRpcProvider, feeCurrencyAddress?: string): Promise<BigNumber>;
/**
 * Override to handle alternative gas currencies
 * prepareRequest in https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/json-rpc-provider.ts
 */
export declare function prepareRequest<T extends providers.JsonRpcProvider>(this: T, superPrepareRequest: (method: any, params: any) => [string, Array<any>], method: any, params: any): [string, Array<any>];
