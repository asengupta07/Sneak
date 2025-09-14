import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";
import "dotenv/config";
import "@nomicfoundation/hardhat-verify";

const config: any = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    // Avalanche Fuji Testnet
    fuji: {
      type: "http",
      chainType: "l1",
      chainId: 43113,
      url: configVariable("FUJI_RPC_URL"),
      accounts: [configVariable("FUJI_PRIVATE_KEY")],
    },
    // Avalanche C-Chain Mainnet
    avalanche: {
      type: "http",
      chainType: "l1",
      chainId: 43114,
      url: configVariable("AVALANCHE_RPC_URL"),
      accounts: [configVariable("AVALANCHE_PRIVATE_KEY")],
    },
  },
  etherscan: {
    // Reuse a single SnowTrace API key for both mainnet and Fuji
    apiKey: {
      snowtrace: "snowtrace"
    },
    customChains: [
      {
        network: "avalanche",
        chainId: 43114,
        urls: {
          apiURL: "https://api.snowtrace.io/api",
          browserURL: "https://snowtrace.io",
        },
      },
      {
        network: "fuji",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://avalanche.testnet.localhost:8080",
        },
      },
    ],
  },
};

export default config as HardhatUserConfig;
