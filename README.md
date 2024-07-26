## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```



== Logs ==
  MockStableCoin deployed at: 0x34A1D3fff3958843C43aD80F30b94c510645C316
  CollateralVault deployed at: 0x90193C961A926261B756D1E5bb255e67ff9498A1
  LendingBorrowing deployed at: 0xA8452Ec99ce0C64f20701dB7dD3abDb607c00496

## Setting up 1 EVM.

test test test test test test test test test test test junk


### Struggles


#### Disconnecting wallet
There seems to be an issue when you disconnect using the metamask sdk 
the useAccount hook will update before the useSdk hook which causes an issue on 
when a sync between metamask sdk and wagmi sdk. 