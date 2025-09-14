# Default variables (can be overridden: make deploy NETWORK=avalanche)
NETWORK ?= fuji
DEPLOY_SCRIPT ?= scripts/deploy.ts
IGNITION_MODULE ?= ./ignition/modules/SneakProtocol.ts

.PHONY: help compile deploy deploy-ignition verify verify-forge check-status check-contract build-forge clean

help:
	@echo "🚀 Sneak Protocol Makefile Commands:"
	@echo ""
	@echo "📦 Deployment:"
	@echo "  make deploy NETWORK=fuji                    - Deploy with script"
	@echo "  make deploy-ignition NETWORK=fuji           - Deploy with Ignition"
	@echo ""
	@echo "🔍 Verification:"
	@echo "  make verify-forge ADDRESS=0x...            - Verify with forge (recommended)"
	@echo "  make verify NETWORK=fuji ADDRESS=0x... BASE_TOKEN=0x... - Verify with hardhat"
	@echo ""
	@echo "📊 Status Checking:"
	@echo "  make check-status GUID=your-guid           - Check verification status by GUID"
	@echo "  make check-contract ADDRESS=0x...           - Check contract verification by address"
	@echo ""
	@echo "🔧 Build & Clean:"
	@echo "  make compile                                - Compile with hardhat"
	@echo "  make build-forge                           - Build with forge"
	@echo "  make clean                                 - Clean build artifacts"
	@echo ""
	@echo "💡 Examples:"
	@echo "  make verify-forge ADDRESS=0x59db63697591a9c8d5379b1ddb8017eb56d15b61"
	@echo "  make check-contract ADDRESS=0x59db63697591a9c8d5379b1ddb8017eb56d15b61"

compile:
	@echo "🔧 Compiling contracts..."
	@pnpm hardhat compile

deploy:
	@echo "🚀 Deploying with script to network: $(NETWORK)"
	@pnpm hardhat run $(DEPLOY_SCRIPT) --network $(NETWORK)

deploy-ignition:
	@echo "🚀 Deploying with Ignition to network: $(NETWORK)"
	@pnpm hardhat ignition deploy $(IGNITION_MODULE) --network $(NETWORK)

# Usage:
# make verify NETWORK=fuji ADDRESS=0x... BASE_TOKEN=0x...
verify:
	@if [ -z "$(ADDRESS)" ]; then echo "❌ ADDRESS is required (deployed contract address)"; exit 1; fi
	@if [ -z "$(BASE_TOKEN)" ]; then echo "❌ BASE_TOKEN is required (constructor arg)"; exit 1; fi
	@echo "🧾 Verifying $(ADDRESS) on $(NETWORK) with constructor arg $(BASE_TOKEN)..."
	@pnpm hardhat verify --network $(NETWORK) $(ADDRESS) $(BASE_TOKEN)

# Forge verification commands (more reliable for Routescan)
# Usage: make verify-forge ADDRESS=0x...
verify-forge:
	@if [ -z "$(ADDRESS)" ]; then echo "❌ ADDRESS is required (deployed contract address)"; exit 1; fi
	@echo "🔍 Verifying $(ADDRESS) with forge on Routescan..."
	@forge verify-contract $(ADDRESS) contracts/SneakProtocol.sol:SneakProtocol \
		--verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' \
		--etherscan-api-key "verifyContract" \
		--num-of-optimizations 200 \
		--compiler-version 0.8.28

# Check verification status
# Usage: make check-status GUID=your-guid-here
check-status:
	@if [ -z "$(GUID)" ]; then echo "❌ GUID is required (verification GUID)"; exit 1; fi
	@echo "🔍 Checking verification status for GUID: $(GUID)..."
	@curl -s "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=contract&action=checkverifystatus&guid=$(GUID)" | jq '.'

# Check contract verification status by address
# Usage: make check-contract ADDRESS=0x...
check-contract:
	@if [ -z "$(ADDRESS)" ]; then echo "❌ ADDRESS is required (contract address)"; exit 1; fi
	@echo "🔍 Checking contract verification status for $(ADDRESS)..."
	@curl -s "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api?module=contract&action=getsourcecode&address=$(ADDRESS)" | jq '.result[0] | {ContractName, CompilerVersion, OptimizationUsed, Runs, SourceCode: (.SourceCode | length)}'

# Build contracts with forge
build-forge:
	@echo "🔧 Building contracts with forge..."
	@forge build

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf out/ cache/ artifacts/
	@pnpm hardhat clean
