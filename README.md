# POC NFT Lending Platform

## Introduction
This is a small POC of a lending platform where users can deposit NFTs and borrow stable coins against them.



## Getting started

### Project

#### [./apps/blockchain](./apps/blockchain/README.md)
This is a foundry project that contains the 3 contracts that are used in the lending platform.

#### [./apps/web](./apps/web/README.md)
This is a nextjs project that contains the frontend for the lending platform.

#### [./docker-compose.yml](./docker-compose.yml)
This is the docker-compose file that will start the foundry node and the nextjs app.


### Installation

Install Web App Deps
```sh
cd apps/web
bun i
```
Clone foundry submodules
```sh
git submodule update --init --recursive
```



### Usage

Start the app
```sh
docker compose up -d
```

```sh
docker compose logs anvil
```
Import the 6th private key into metamask.
Or use the following mnemonic to import the account into metamask.


Open the webpage
```sh
open http://localhost:3000
```
Use the newly imported account to connect to the site.


## Struggles

### Minified Npm Packages
The compiled npm packages should not be minified as it makes quick debugging difficult.
And makes ad-hock patching unfeasible.

**Workaround:** Coped the hook that needed the change into the project

### Disconnecting wallet
There seems to be an issue when you disconnect using the metamask sdk 
the useAccount hook will update before the useSdk hook which causes an issue on 
when a sync between metamask sdk and wagmi sdk. 

**Workaround:** Left this now the app will attempt to reconnect the wallet if it is disconnected.

### Metamask caching issue 1.
No way to clear the cache of metamask, so if you have a wallet connected to the site
Seems to be specific to the approval functions.

**Workaround:** Added randon nonce when deploying contract to force unique contract addresses.

### Metamask caching issue 2.
Getting nft approval addresses seem to be cached until the page reloads

**Workaround:** Added randon nonce when deploying contract to force unique contract addresses.