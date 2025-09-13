import { buildModule } from "@nomicfoundation/hardhat-ignition";

const SneakProtocolModule = buildModule("SneakProtocolModule", (m) => {
  // Deploy a mock USDC token for testing
  const mockUSDC = m.contract("MockERC20", ["Mock USDC", "MUSDC", 18]);

  // Deploy the main SneakProtocol contract
  const sneakProtocol = m.contract("SneakProtocol", [mockUSDC]);

  // Mint some initial tokens to the deployer for testing
  const mintAmount = m.bigint("1000000000000000000000000"); // 1M USDC

  m.call(mockUSDC, "mint", [m.getAccount(0), mintAmount]);

  return {
    mockUSDC,
    sneakProtocol,
  };
});

export default SneakProtocolModule;
