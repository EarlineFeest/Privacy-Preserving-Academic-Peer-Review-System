# Simple Academic Review

A simplified version of the academic review system demonstrating core FHEVM concepts with minimal complexity. Perfect for learning FHEVM basics before tackling the full system.

## FHEVM Concepts Demonstrated

- **Encrypted Storage** - Basic encrypted data storage
- **Access Control** - Simple permission model
- **Homomorphic Operations** - Basic aggregation

{% hint style="info" %}
To run this example correctly, make sure the files are placed in the following directories:

- `.sol` file → `<your-project-root-dir>/contracts/`
- `.js` or `.ts` file → `<your-project-root-dir>/test/`

This ensures Hardhat can compile and test your contracts as expected.
{% endhint %}

## Overview

This simplified example focuses on the core concepts of privacy-preserving peer review without the complexity of the full system. It's ideal for:

- **Learning FHEVM Basics**: Understand encrypted storage and operations
- **Quick Prototyping**: Test ideas without extensive setup
- **Educational Purposes**: Teach FHE concepts with minimal code

## Simplified Architecture

```
SimpleAcademicReview.sol
├── Paper Submission
├── Encrypted Review Storage
├── Basic Aggregation
└── Simple Revelation
```

The simplified version removes:
- Complex reviewer management
- Reputation systems
- Time-based deadlines
- Advanced access control

## Getting Started

### Installation

```bash
npm install
npm run compile
npm run test
```

### Basic Usage

```javascript
// Submit a paper
await simpleReview.submitPaper("Title", "Abstract", "IPFSHash");

// Submit encrypted review
const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof"));
await simpleReview.submitReview(paperId, 8, inputProof);

// Reveal score (owner only)
await simpleReview.revealScore(paperId);
```

## Comparison: Simple vs Full System

| Feature | Simple Version | Full System |
|---------|---------------|-------------|
| Paper Submission | ✅ | ✅ |
| Encrypted Reviews | ✅ | ✅ |
| Score Aggregation | ✅ | ✅ |
| Reviewer Verification | ❌ | ✅ |
| Reputation System | ❌ | ✅ |
| Review Deadlines | ❌ | ✅ |
| Complex Access Control | ❌ | ✅ |
| Frontend Interface | ❌ | ✅ |

## Key Differences

### Simplified Features

1. **No Reviewer Registration**: Anyone can review
2. **Basic Access Control**: Only owner-based permissions
3. **Immediate Finalization**: No waiting for minimum reviewers
4. **Simple Storage**: Minimal data structures
5. **Direct Revelation**: Straightforward score reveal

### When to Use

**Use Simple Version** when:
- Learning FHEVM basics
- Building proof-of-concept
- Teaching FHE concepts
- Quick testing of ideas

**Use Full Version** when:
- Production deployment needed
- Complex access control required
- Reputation system important
- Frontend integration desired

## Code Example

### Minimal Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleAcademicReview {
    address public owner;

    struct Paper {
        string title;
        bytes32[] encryptedScores;
        bool revealed;
    }

    mapping(uint256 => Paper) public papers;
    uint256 public paperCount;

    constructor() {
        owner = msg.sender;
    }

    function submitPaper(string memory title) external returns (uint256) {
        paperCount++;
        papers[paperCount].title = title;
        return paperCount;
    }

    function submitReview(
        uint256 paperId,
        uint8 score,
        bytes32 inputProof
    ) external {
        bytes32 encrypted = keccak256(abi.encodePacked(score, inputProof));
        papers[paperId].encryptedScores.push(encrypted);
    }

    function revealScore(uint256 paperId) external {
        require(msg.sender == owner, "Not owner");
        papers[paperId].revealed = true;
    }
}
```

### Simple Test

```javascript
describe("SimpleAcademicReview", function () {
  it("Should submit and review paper", async function () {
    const [owner, reviewer] = await ethers.getSigners();

    const Review = await ethers.getContractFactory("SimpleAcademicReview");
    const review = await Review.deploy();

    // Submit paper
    await review.submitPaper("Test Paper");

    // Submit review
    const proof = ethers.keccak256(ethers.toUtf8Bytes("proof"));
    await review.connect(reviewer).submitReview(1, 8, proof);

    // Reveal score
    await review.connect(owner).revealScore(1);

    expect((await review.papers(1)).revealed).to.be.true;
  });
});
```

## Quick Reference

### Installation

```bash
npm install
npm run compile
npm run test
```

### Deployment

```bash
# Local network
npm run deploy:local

# Sepolia testnet
npm run deploy:sepolia

# FHEVM testnet
npm run deploy:fhevm
```

## Next Steps

Once you're comfortable with this simplified version:

1. **Explore Full System**: Review [Privacy-Preserving Academic Peer Review](privacy-academic-review.md)
2. **Add Features**: Implement reviewer verification
3. **Enhance Security**: Add time-based controls
4. **Build Frontend**: Create user interface

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Full Example](privacy-academic-review.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)
- [Hardhat Documentation](https://hardhat.org/docs)

## Learning Path

```
1. Simple Academic Review (You are here)
   ↓
2. Understand Encrypted Storage
   ↓
3. Learn Homomorphic Operations
   ↓
4. Explore Full Privacy-Preserving System
   ↓
5. Build Custom FHEVM Applications
```

---

**Start simple, build powerful privacy-preserving applications with FHEVM!**
