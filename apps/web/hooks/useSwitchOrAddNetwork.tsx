// https://github.com/MetaMask/metamask-sdk/blob/ee26cba52da4ad85a8f8f17503211135d9c70e75/packages/sdk-react-ui/src/hooks/MetaMaskWagmiHooks.ts#L38
// Needed to add rpcUrls 

import { type Chain, useNetwork, useSDK } from '@metamask/sdk-react-ui';
import { useState } from 'react';


interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency?: {
      name: string;
      symbol: string; // 2-6 characters long
      decimals: number;
    };
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[]; // Currently ignored.
  };

export const useSwitchOrAddNetwork = () => {
    const [error, setError] = useState<unknown>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [pendingChainId, setPendingChainId] = useState<number>();
 
    const { provider } = useSDK()
    const { chains } = useNetwork();
    const switchOrAddNetwork = async (chain: Chain) => {
        if(!provider) throw new Error('Provider not found');
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let response: any;
  
      setPendingChainId(chain.id);
      setIsLoading(true);
      try {
        response = await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chain.id.toString(16)}` }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        // FIXME remove ALL ts-ignore below
        if (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          switchError.code === 4902 ||
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          switchError?.data?.originalError?.code === 4902
        ) {
          const params: AddEthereumChainParameter = {
            chainId: `0x${chain.id.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
          };
  
          const rpcUrls: string[] = [];
  
          const keys = ['default', 'infura', 'public'];
  
          for (const key of keys) {
              if (chain.rpcUrls[key]) {
                  rpcUrls.push(chain.rpcUrls[key].toString());
              }
          }
  
          if (chain.blockExplorers) {
            params.blockExplorerUrls = [chain.blockExplorers?.default?.url];
          }
  
          params.rpcUrls = Object.keys(chain.rpcUrls).flatMap(key => chain.rpcUrls[key].http);

          try {
            response = await provider.request({
              method: 'wallet_addEthereumChain',
              params: [params],
            });
          } catch (addError) {
            setError(addError);
          }
        } else {
          setError(switchError);
        }
      }
  
      setIsLoading(false);
  
      return response;
    };
  
    return {
        chains,
      error,
      isLoading,
      pendingChainId,
      switchOrAddNetwork,
    };
  };