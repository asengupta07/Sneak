#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: NETWORK=fuji pnpm verify <ADDRESS> <BASE_TOKEN>');
  process.exit(1);
}

const [address, baseToken] = args;
const network = process.env.NETWORK || 'fuji';

const result = spawnSync('pnpm', ['hardhat', 'verify', '--network', network, address, baseToken], {
  stdio: 'inherit',
});

process.exit(result.status ?? 0);
