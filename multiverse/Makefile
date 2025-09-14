# Default variables (can be overridden: make deploy NETWORK=avalanche)
NETWORK ?= fuji
DEPLOY_SCRIPT ?= scripts/deploy.ts
IGNITION_MODULE ?= ./ignition/modules/SneakProtocol.ts

.PHONY: compile deploy deploy-ignition verify

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
