# Developer Guide

This guide provides instructions for maintaining, extending, and contributing to the Privacy-Preserving Academic Peer Review System.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding New Features](#adding-new-features)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Automation Tools](#automation-tools)
- [Deployment Process](#deployment-process)
- [Maintenance and Updates](#maintenance-and-updates)
- [Troubleshooting](#troubleshooting)

## Project Overview

This project demonstrates a privacy-preserving academic peer review system using FHEVM (Fully Homomorphic Encryption Virtual Machine). It includes:

- Smart contracts for encrypted review management
- Comprehensive test suites
- Frontend React application
- Automation scripts for documentation and repository generation
- GitBook-compatible documentation

## Development Setup

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: For version control
- **MetaMask**: For testing frontend interactions

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AcademicReviewSystem
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Compile contracts:
   ```bash
   npm run compile
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
AcademicReviewSystem/
├── contracts/                      # Smart contracts
│   ├── AcademicPeerReview.sol      # Main review system
│   ├── FHECore.sol                 # FHE utilities
│   └── SimpleAcademicReview.sol    # Simplified version
├── test/                           # Test suites
│   └── AcademicPeerReview.test.js  # Comprehensive tests
├── scripts/                        # Automation and deployment
│   ├── deploy.js                   # Deployment script
│   ├── create-fhevm-example.ts     # Example generator
│   ├── generate-docs.ts            # Documentation generator
│   └── README.md                   # Scripts documentation
├── frontend/                       # React frontend
│   ├── src/                        # React components
│   └── public/                     # Static assets
├── docs/                           # GitBook documentation
│   ├── SUMMARY.md                  # Documentation index
│   └── *.md                        # Example documentation
├── hardhat.config.js               # Hardhat configuration
├── package.json                    # Dependencies and scripts
├── README.md                       # Main documentation
├── SETUP_GUIDE.md                  # Setup instructions
├── SUBMISSION.md                   # Competition submission
├── DEVELOPER_GUIDE.md              # This file
└── .env.example                    # Environment template
```

## Adding New Features

### Adding a New Smart Contract

1. Create the contract in `contracts/`:
   ```solidity
   // contracts/NewFeature.sol
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.24;

   contract NewFeature {
       // Implementation
   }
   ```

2. Write comprehensive tests in `test/`:
   ```javascript
   // test/NewFeature.test.js
   const { expect } = require("chai");
   const { ethers } = require("hardhat");

   describe("NewFeature", function () {
       // Test cases
   });
   ```

3. Update deployment scripts:
   ```javascript
   // scripts/deploy.js
   const NewFeature = await ethers.getContractFactory("NewFeature");
   const newFeature = await NewFeature.deploy();
   ```

4. Document the feature in README.md

### Adding FHE Operations

When adding new FHE operations:

1. **Use proper FHEVM imports**:
   ```solidity
   import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
   ```

2. **Implement input proof validation**:
   ```solidity
   function processEncryptedValue(
       externalEuint32 inputEuint32,
       bytes calldata inputProof
   ) external {
       euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);
       // Process value
   }
   ```

3. **Set proper access permissions**:
   ```solidity
   FHE.allowThis(encryptedValue);
   FHE.allow(encryptedValue, msg.sender);
   ```

4. **Document the FHE concept** in code comments and documentation

## Testing Guidelines

### Writing Tests

1. **Organize tests by functionality**:
   ```javascript
   describe("AcademicPeerReview Contract", function () {
       describe("Deployment", function () {
           // Deployment tests
       });

       describe("Paper Submission", function () {
           // Paper submission tests
       });

       describe("Review Submission", function () {
           // Review submission tests
       });
   });
   ```

2. **Test both success and failure cases**:
   ```javascript
   it("Should submit a paper successfully", async function () {
       // Success case
   });

   it("Should reject invalid paper submission", async function () {
       // Failure case
   });
   ```

3. **Use descriptive test names**:
   ```javascript
   it("Should allow only paper author to request score reveal", async function () {
       // Test implementation
   });
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run with gas reporting
npm run test:gas

# Generate coverage report
npm run test:coverage

# Run specific test file
npx hardhat test test/AcademicPeerReview.test.js
```

### Test Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Documentation Standards

### Code Documentation

1. **Contract-level documentation**:
   ```solidity
   /**
    * @title Privacy-Preserving Academic Peer Review System
    * @notice Enables anonymous peer review using FHEVM
    * @dev Implements encrypted storage, homomorphic operations, and access control
    */
   contract AcademicPeerReview {
       // Implementation
   }
   ```

2. **Function documentation**:
   ```solidity
   /**
    * @notice Submits an encrypted review for a paper
    * @dev Requires valid input proof for encryption
    * @param paperId ID of the paper being reviewed
    * @param score Review score (1-10)
    * @param inputProof Cryptographic proof of valid encryption
    * @param comments Review comments
    */
   function submitReview(
       uint256 paperId,
       uint8 score,
       bytes32 inputProof,
       string memory comments
   ) external {
       // Implementation
   }
   ```

3. **Inline comments for complex logic**:
   ```solidity
   // Aggregate encrypted scores using homomorphic addition
   for (uint256 i = 1; i < scores.length; i++) {
       aggregatedScore = keccak256(
           abi.encodePacked(aggregatedScore, scores[i])
       );
   }
   ```

### Generating Documentation

1. **Generate GitBook documentation**:
   ```bash
   # Generate for specific example
   npm run generate-docs privacy-academic-review

   # Generate for all examples
   npm run generate-all-docs
   ```

2. **Update README when adding features**:
   - Add feature description
   - Include usage examples
   - Update table of contents

## Automation Tools

### Example Generator

Create standalone example repositories:

```bash
# Generate full example
npm run create-example privacy-academic-review ./output

# Generate simplified example
npm run create-example simple-academic-review ./output-simple
```

### Documentation Generator

Generate GitBook-compatible documentation:

```bash
# Single example
ts-node scripts/generate-docs.ts privacy-academic-review

# All examples
ts-node scripts/generate-docs.ts --all
```

See [scripts/README.md](scripts/README.md) for detailed automation documentation.

## Deployment Process

### Local Deployment

1. Start local Hardhat network:
   ```bash
   npx hardhat node
   ```

2. Deploy contracts (in another terminal):
   ```bash
   npm run deploy:local
   ```

3. Note deployed contract addresses for frontend configuration

### Testnet Deployment

1. Configure environment:
   ```bash
   # .env file
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   ```

2. Deploy to Sepolia:
   ```bash
   npm run deploy:sepolia
   ```

3. Verify on Etherscan:
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### FHEVM Testnet Deployment

1. Configure FHEVM RPC:
   ```bash
   # .env file
   FHEVM_RPC_URL=https://devnet.zama.ai
   ```

2. Deploy:
   ```bash
   npm run deploy:fhevm
   ```

## Maintenance and Updates

### Updating Dependencies

1. **Check for updates**:
   ```bash
   npm outdated
   ```

2. **Update specific package**:
   ```bash
   npm update <package-name>
   ```

3. **Update all packages**:
   ```bash
   npm update
   ```

4. **Test after updates**:
   ```bash
   npm run compile
   npm test
   ```

### Updating FHEVM Library

When `@fhevm/solidity` releases a new version:

1. Update package.json:
   ```json
   {
     "dependencies": {
       "@fhevm/solidity": "^0.10.0"
     }
   }
   ```

2. Install new version:
   ```bash
   npm install
   ```

3. Review breaking changes in release notes

4. Update contract imports if needed

5. Run full test suite:
   ```bash
   npm run compile
   npm test
   ```

6. Update documentation:
   ```bash
   npm run generate-all-docs
   ```

### Version Control

1. **Commit frequently** with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add reviewer reputation system"
   ```

2. **Follow conventional commits**:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test additions/changes
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks

3. **Create branches for features**:
   ```bash
   git checkout -b feature/new-feature
   ```

## Troubleshooting

### Common Issues

#### Compilation Errors

```bash
# Clean artifacts
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Recompile
npm run compile
```

#### Test Failures

```bash
# Run single test for debugging
npx hardhat test test/AcademicPeerReview.test.js --grep "specific test name"

# Enable verbose logging
DEBUG=true npm test
```

#### Deployment Issues

```bash
# Check network configuration
npx hardhat console --network sepolia

# Verify gas settings
# Update hardhat.config.js if needed
```

#### Frontend Connection Issues

1. Check contract address in `frontend/src/App.js`
2. Verify network in MetaMask matches deployment
3. Clear browser cache and reload

### Getting Help

- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Hardhat Documentation**: https://hardhat.org/docs
- **Zama Community Forum**: https://www.zama.ai/community
- **GitHub Issues**: Report bugs in the repository

## Best Practices

1. **Security First**:
   - Always validate inputs
   - Use access control modifiers
   - Test edge cases thoroughly
   - Follow FHEVM security guidelines

2. **Code Quality**:
   - Follow Solidity style guide
   - Write comprehensive tests
   - Document all public functions
   - Use meaningful variable names

3. **Performance**:
   - Optimize gas usage
   - Minimize storage operations
   - Use efficient data structures
   - Profile gas consumption

4. **Documentation**:
   - Keep README updated
   - Generate docs after changes
   - Include usage examples
   - Document breaking changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Update documentation
6. Submit a pull request

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Ethers.js Documentation](https://docs.ethers.org)

---

**For questions or support, please open an issue on GitHub or reach out to the development team.**
