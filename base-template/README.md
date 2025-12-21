# FHEVM Hardhat Template

Base template for developing privacy-preserving smart contracts using FHEVM (Fully Homomorphic Encryption Virtual Machine) with Hardhat.

## Overview

This template provides a complete development environment for building FHEVM-based smart contracts with:

- **Hardhat Development Framework**: Industry-standard Ethereum development environment
- **TypeScript Support**: Type-safe development experience
- **Comprehensive Testing**: Built-in testing framework with Chai matchers
- **Multiple Network Support**: Local, Sepolia, and FHEVM testnet configurations
- **Gas Reporting**: Track and optimize gas consumption
- **Contract Verification**: Etherscan integration for contract verification

## Quick Start

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Package manager (v8.0.0 or higher)
- **MetaMask**: Browser wallet for testing (optional)

### Installation

1. **Clone this template**:
   ```bash
   # This template will be copied when using the automation scripts
   # Or manually clone/copy the base-template directory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Compile contracts**:
   ```bash
   npm run compile
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

## Project Structure

```
base-template/
├── contracts/          # Solidity smart contracts
├── test/              # Test files
├── scripts/           # Deployment and utility scripts
├── hardhat.config.js  # Hardhat configuration
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile all smart contracts |
| `npm test` | Run test suite |
| `npm run test:gas` | Run tests with gas reporting |
| `npm run test:coverage` | Generate test coverage report |
| `npm run clean` | Clean build artifacts |
| `npm run deploy:local` | Deploy to local Hardhat network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:fhevm` | Deploy to FHEVM testnet |
| `npm run node` | Start local Hardhat node |
| `npm run verify` | Verify contracts on Etherscan |

## Network Configuration

### Local Development

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy contracts
npm run deploy:local
```

### Sepolia Testnet

1. Configure `.env`:
   ```
   PRIVATE_KEY=your_private_key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   ```

2. Deploy:
   ```bash
   npm run deploy:sepolia
   ```

3. Verify:
   ```bash
   npm run verify -- --network sepolia <CONTRACT_ADDRESS>
   ```

### FHEVM Testnet

1. Configure `.env`:
   ```
   FHEVM_RPC_URL=https://devnet.zama.ai
   PRIVATE_KEY=your_private_key
   ```

2. Deploy:
   ```bash
   npm run deploy:fhevm
   ```

## FHEVM Integration

This template is pre-configured for FHEVM development. Key features:

### Encrypted Data Types

```solidity
import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";

contract Example {
    euint32 private encryptedValue;

    function store(externalEuint32 value, bytes calldata proof) external {
        encryptedValue = FHE.fromExternal(value, proof);
        FHE.allowThis(encryptedValue);
    }
}
```

### Homomorphic Operations

```solidity
euint32 result = FHE.add(encryptedA, encryptedB);
ebool isGreater = FHE.gt(encryptedA, encryptedB);
euint32 selected = FHE.select(condition, valueA, valueB);
```

### Access Control

```solidity
// Allow contract to use encrypted value
FHE.allowThis(encryptedValue);

// Allow specific address to access encrypted value
FHE.allow(encryptedValue, userAddress);
```

## Writing Contracts

1. Create contract in `contracts/`:
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.24;

   contract MyContract {
       // Your code here
   }
   ```

2. Write tests in `test/`:
   ```javascript
   const { expect } = require("chai");
   const { ethers } = require("hardhat");

   describe("MyContract", function () {
       it("Should work correctly", async function () {
           // Your tests here
       });
   });
   ```

3. Compile and test:
   ```bash
   npm run compile
   npm test
   ```

## Deployment

Create deployment script in `scripts/deploy.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
    const Contract = await ethers.getContractFactory("MyContract");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

## Testing Best Practices

1. **Test encrypted operations**:
   ```javascript
   it("Should handle encrypted values", async function () {
       const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof"));
       await contract.storeEncrypted(value, inputProof);
   });
   ```

2. **Test access control**:
   ```javascript
   it("Should restrict unauthorized access", async function () {
       await expect(
           contract.connect(unauthorized).restrictedFunction()
       ).to.be.revertedWith("Not authorized");
   });
   ```

3. **Test gas consumption**:
   ```bash
   REPORT_GAS=true npm test
   ```

## Troubleshooting

### Common Issues

**Module not found**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Compilation errors**:
```bash
npm run clean
npm run compile
```

**Test failures**:
```bash
npx hardhat clean
npm test
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

## Security

- **Never commit private keys**: Always use `.env` files (excluded from git)
- **Validate inputs**: Always validate and sanitize user inputs
- **Test thoroughly**: Write comprehensive tests including edge cases
- **Use access control**: Implement proper authorization checks
- **Follow best practices**: Review Solidity and FHEVM security guidelines

## License

This template is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

- **GitHub Issues**: Report bugs or request features
- **FHEVM Docs**: https://docs.zama.ai
- **Zama Community**: https://www.zama.ai/community
- **Discord**: https://discord.gg/zama

---

**Built for privacy-preserving smart contracts with [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
