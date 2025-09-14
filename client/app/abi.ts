export const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_baseToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ChainCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "opportunityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "side",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ChainExtended",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startIndex",
                "type": "uint256"
            }
        ],
        "name": "ChainLiquidated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "opportunityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "imageUrl",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "initialLiquidity",
                "type": "uint256"
            }
        ],
        "name": "OpportunityCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "opportunityId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            }
        ],
        "name": "OpportunityResolved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "opportunityId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "side",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokens",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "BASIS_POINTS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FIXED_FEE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "HYSTERESIS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INITIAL_PRICE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INTEREST_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LIQUIDATION_PENALTY",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LP_REWARD_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "LTV",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PROTOCOL_FEE_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "baseToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_side",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            }
        ],
        "name": "claimWinnings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_metadataUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_initialLiquidity",
                "type": "uint256"
            }
        ],
        "name": "createOpportunity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_side",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "createPositionChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_side",
                "type": "bool"
            }
        ],
        "name": "extendChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            }
        ],
        "name": "getChainHealthData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "chainId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalPositions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "activePositions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidatedPositions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalAllocated",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentTotalValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDebt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "healthFactor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isLiquidationRisk",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isHighRisk",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidationThreshold",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SneakProtocol.ChainHealthData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            }
        ],
        "name": "getChainRiskAnalysis",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "positionIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "opportunityId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "side",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "allocatedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "pnl",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "riskToNextPosition",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isLiquidationTrigger",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SneakProtocol.PositionRiskData[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getChainsAtRisk",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "opportunityId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "side",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokens",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentValue",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SneakProtocol.Position",
                "name": "_position",
                "type": "tuple"
            }
        ],
        "name": "getCurrentPositionValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            }
        ],
        "name": "getLiquidationPreview",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "canLiquidate",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidationStartIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "positionsToLiquidate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "collateralShortfall",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidationPenalty",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "remainingValue",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SneakProtocol.LiquidationPreview",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            }
        ],
        "name": "getOpportunity",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "metadataUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidityYes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidityNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priceYes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priceNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "resolved",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "outcome",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalYesTokens",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalNoTokens",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "creationTime",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SneakProtocol.Opportunity",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            }
        ],
        "name": "getOpportunityRiskData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "opportunityId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priceYes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priceNo",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "priceDeviation",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "liquidityImbalance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "volatilityRisk",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isHighRisk",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalLiquidity",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SneakProtocol.OpportunityRiskData",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            }
        ],
        "name": "getPositionChain",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "chainId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "opportunityId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "side",
                                "type": "bool"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokens",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "currentValue",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "active",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct SneakProtocol.Position[]",
                        "name": "positions",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalDebt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "liquidated",
                        "type": "bool"
                    }
                ],
                "internalType": "struct SneakProtocol.PositionChain",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserChains",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_side",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
            }
        ],
        "name": "liquidateChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextChainId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextOpportunityId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "opportunities",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "metadataUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "liquidityYes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "liquidityNo",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "priceYes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "priceNo",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "resolved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "outcome",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "totalYesTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalNoTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "creationTime",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "positionChains",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "totalDebt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "liquidated",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "protocolFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_opportunityId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_outcome",
                "type": "bool"
            }
        ],
        "name": "resolveOpportunity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userChains",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "withdrawProtocolFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const musdcAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "decimals_",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
