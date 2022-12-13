# Fuel Messaging Bridge Integration Tests

Integration tests for the Fuel Messaging Bridge.

## Building From Source

### Dependencies

| dep     | version                                                  |
| ------- | -------------------------------------------------------- |
| Node.js | [>=v14.0.0](https://nodejs.org/en/blog/release/v14.0.0/) |

### Building

Install dependencies:

```sh
npm ci
```

### Running Tests

Before running the integration tests, you need to spin up a full development stack complete with an Ethereum client and Fuel client. You can use the easy docker setup detailed [here](https://github.com/FuelLabs/fuel-dev-env).

Run tests:

```sh
npm test
```

### Example Scripts

The test logic can also be run in script form. These scripts act as examples for how to bridge ETH and ERC-20 based assets to and from Fuel using the TS-SDK.

```sh
npm run bridgeETH
npm run bridgeERC20
```

## License

The primary license for this repo is `UNLICENSED`, see [`LICENSE`](./LICENSE).
