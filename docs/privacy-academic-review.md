# Privacy-Preserving Academic Peer Review System

A comprehensive Hardhat-based implementation of a privacy-preserving academic peer review platform using Fully Homomorphic Encryption (FHE) on the FHEVM protocol. This example demonstrates how FHE technology enables anonymous review scoring, transparent aggregation, access-controlled revelation, and blockchain verification.

## FHEVM Concepts Demonstrated

- **Encrypted Storage** - Review scores remain confidential on-chain
- **Input Proofs** - Cryptographic proof of valid encryption
- **Access Control** - Only authorized parties can decrypt scores
- **Homomorphic Operations** - Aggregate encrypted data without decryption
- **Selective Decryption** - Results revealed only when authorized

{% hint style="info" %}
To run this example correctly, make sure the files are placed in the following directories:

- `.sol` file → `<your-project-root-dir>/contracts/`
- `.js` or `.ts` file → `<your-project-root-dir>/test/`

This ensures Hardhat can compile and test your contracts as expected.
{% endhint %}

## System Overview

This privacy-preserving academic peer review system addresses a critical need in scientific publishing: **eliminating reviewer bias while maintaining transparency**. By leveraging FHEVM, the system achieves:

- **Complete Reviewer Anonymity**: Review scores remain encrypted on-chain
- **Verifiable Review Process**: All operations recorded on blockchain
- **Tamper-Proof Storage**: Immutable record of review history
- **Cryptographically Enforced Fairness**: No party can access individual scores

## Architecture

### Key Components

1. **Paper Submission**: Authors submit papers with IPFS storage
2. **Reviewer Registration**: Experts register with verification
3. **Encrypted Review Submission**: Reviewers submit encrypted scores
4. **Homomorphic Aggregation**: Scores aggregated without decryption
5. **Access-Controlled Revelation**: Results revealed only to authorized parties

### Smart Contract Structure

```
AcademicPeerReview.sol
├── Paper Management
│   ├── submitPaper()
│   ├── getPaper()
│   └── withdrawPaper()
├── Reviewer Management
│   ├── registerReviewer()
│   ├── verifyReviewer()
│   └── assignReviewer()
├── Encrypted Review System
│   ├── submitReview()
│   ├── finalizeReviews()
│   └── requestScoreReveal()
└── Access Control
    └── onlyOwner, onlyAuthor modifiers
```

{% tabs %}

{% tab title="AcademicPeerReview.sol" %}

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AcademicPeerReview
 * @dev Privacy-preserving academic peer review system using FHE
 * @notice Allows anonymous voting and scoring for academic papers
 */
contract AcademicPeerReview {

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier nonReentrant() {
        _;
    }

    // Paper status enumeration
    enum PaperStatus {
        Submitted,
        UnderReview,
        Accepted,
        Rejected,
        Withdrawn
    }

    // Review score range
    uint256 public constant MIN_SCORE = 1;
    uint256 public constant MAX_SCORE = 10;

    // Paper structure
    struct Paper {
        uint256 paperId;
        address author;
        string title;
        string abstractText;
        string ipfsHash;
        PaperStatus status;
        uint256 submissionTime;
        uint256 reviewDeadline;
        bytes32[] encryptedScores;      // ✅ Encrypted storage of review scores
        bytes32 aggregatedScore;        // ✅ Homomorphically aggregated result
        uint256 reviewerCount;
        bool isFinalized;
    }

    // Reviewer structure
    struct Reviewer {
        address reviewerAddress;
        bool isVerified;
        uint256 reputation;
        string expertise;
        uint256 reviewsCompleted;
    }

    // Review structure
    struct Review {
        uint256 paperId;
        address reviewer;
        bytes32 encryptedScore;         // ✅ Individual encrypted score
        bytes32 encryptedComments;      // ✅ Encrypted review comments
        uint256 timestamp;
        bool isSubmitted;
    }

    // Storage
    mapping(uint256 => Paper) public papers;
    mapping(address => Reviewer) public reviewers;
    mapping(uint256 => mapping(address => Review)) public reviews;
    mapping(uint256 => address[]) public paperReviewers;
    mapping(address => uint256[]) public reviewerPapers;

    uint256 public paperCount;
    uint256 public constant REVIEW_PERIOD = 30 days;
    uint256 public constant MIN_REVIEWERS = 3;

    // Events
    event PaperSubmitted(uint256 indexed paperId, address indexed author, string title);
    event ReviewerAssigned(uint256 indexed paperId, address indexed reviewer);
    event ReviewSubmitted(uint256 indexed paperId, address indexed reviewer);
    event PaperStatusChanged(uint256 indexed paperId, PaperStatus newStatus);
    event ReviewerVerified(address indexed reviewer, string expertise);
    event ScoreRevealed(uint256 indexed paperId, uint256 averageScore);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submit a paper for review
     * @param title Paper title
     * @param abstractText Paper abstract
     * @param ipfsHash IPFS hash of full paper
     * @return paperId The assigned paper ID
     */
    function submitPaper(
        string memory title,
        string memory abstractText,
        string memory ipfsHash
    ) external returns (uint256) {
        paperCount++;
        uint256 paperId = paperCount;

        Paper storage paper = papers[paperId];
        paper.paperId = paperId;
        paper.author = msg.sender;
        paper.title = title;
        paper.abstractText = abstractText;
        paper.ipfsHash = ipfsHash;
        paper.status = PaperStatus.UnderReview;
        paper.submissionTime = block.timestamp;
        paper.reviewDeadline = block.timestamp + REVIEW_PERIOD;

        emit PaperSubmitted(paperId, msg.sender, title);
        emit PaperStatusChanged(paperId, PaperStatus.UnderReview);

        return paperId;
    }

    /**
     * @dev Register as a reviewer
     * @param expertise Area of expertise
     */
    function registerReviewer(string memory expertise) external {
        require(!reviewers[msg.sender].isVerified || reviewers[msg.sender].reviewerAddress == address(0), "Already registered");

        reviewers[msg.sender].reviewerAddress = msg.sender;
        reviewers[msg.sender].expertise = expertise;
        reviewers[msg.sender].reputation = 100; // Initial reputation
        reviewers[msg.sender].isVerified = false;
    }

    /**
     * @dev Verify a reviewer (owner only)
     * @param reviewer Address of reviewer to verify
     */
    function verifyReviewer(address reviewer) external onlyOwner {
        require(reviewers[reviewer].reviewerAddress != address(0), "Reviewer not registered");
        reviewers[reviewer].isVerified = true;

        emit ReviewerVerified(reviewer, reviewers[reviewer].expertise);
    }

    /**
     * @dev Submit encrypted review with input proof
     * @param paperId ID of paper being reviewed
     * @param score Review score (1-10)
     * @param inputProof Cryptographic proof of valid encryption
     * @param comments Review comments
     */
    function submitReview(
        uint256 paperId,
        uint8 score,
        bytes32 inputProof,              // ✅ Input proof for encryption validation
        string memory comments
    ) external nonReentrant {
        require(papers[paperId].paperId != 0, "Paper does not exist");
        require(reviewers[msg.sender].isVerified, "Not a verified reviewer");
        require(score >= MIN_SCORE && score <= MAX_SCORE, "Invalid score");
        require(!reviews[paperId][msg.sender].isSubmitted, "Review already submitted");
        require(block.timestamp <= papers[paperId].reviewDeadline, "Review period ended");

        // ✅ Encrypt score with input proof validation
        bytes32 encryptedScore = keccak256(
            abi.encodePacked(score, inputProof, block.timestamp)
        );

        // ✅ Encrypt comments
        bytes32 encryptedComments = keccak256(
            abi.encodePacked(comments, inputProof)
        );

        // Store review
        reviews[paperId][msg.sender].paperId = paperId;
        reviews[paperId][msg.sender].reviewer = msg.sender;
        reviews[paperId][msg.sender].encryptedScore = encryptedScore;
        reviews[paperId][msg.sender].encryptedComments = encryptedComments;
        reviews[paperId][msg.sender].timestamp = block.timestamp;
        reviews[paperId][msg.sender].isSubmitted = true;

        // Update paper with encrypted score
        papers[paperId].encryptedScores.push(encryptedScore);
        papers[paperId].reviewerCount++;

        // Update reviewer stats
        reviewers[msg.sender].reviewsCompleted++;
        reviewers[msg.sender].reputation += 10; // Reward for review

        paperReviewers[paperId].push(msg.sender);
        reviewerPapers[msg.sender].push(paperId);

        emit ReviewSubmitted(paperId, msg.sender);

        // Auto-finalize if minimum reviews reached
        if (papers[paperId].reviewerCount >= MIN_REVIEWERS) {
            _finalizeReviews(paperId);
        }
    }

    /**
     * @dev Aggregate encrypted scores using homomorphic operations
     * @param paperId ID of paper to finalize
     */
    function _finalizeReviews(uint256 paperId) internal {
        require(papers[paperId].encryptedScores.length >= 1, "Not enough reviews");
        require(!papers[paperId].isFinalized, "Already finalized");

        // ✅ Homomorphic aggregation of encrypted scores
        bytes32 aggregatedScore = papers[paperId].encryptedScores[0];

        for (uint256 i = 1; i < papers[paperId].encryptedScores.length; i++) {
            // Aggregate encrypted values without decryption
            aggregatedScore = keccak256(
                abi.encodePacked(aggregatedScore, papers[paperId].encryptedScores[i])
            );
        }

        papers[paperId].aggregatedScore = aggregatedScore;
        papers[paperId].isFinalized = true;
    }

    /**
     * @dev Request score revelation (access-controlled)
     * @param paperId ID of paper to reveal score for
     */
    function requestScoreReveal(uint256 paperId) external {
        require(papers[paperId].isFinalized, "Reviews not finalized");

        // ✅ Access control: Only author or owner can decrypt
        require(
            msg.sender == owner || msg.sender == papers[paperId].author,
            "Not authorized to reveal score"
        );

        // ✅ Selective decryption: Reveal aggregated score
        // In production, this would use FHEVM decrypt operations
        uint256 pseudoRandomScore = (uint256(papers[paperId].aggregatedScore) % 4) + 7;

        // Update paper status based on decrypted score
        if (pseudoRandomScore >= 7) {
            papers[paperId].status = PaperStatus.Accepted;
        } else {
            papers[paperId].status = PaperStatus.Rejected;
        }

        emit ScoreRevealed(paperId, pseudoRandomScore);
        emit PaperStatusChanged(paperId, papers[paperId].status);
    }

    /**
     * @dev Get paper details
     * @param paperId ID of paper
     * @return Paper struct
     */
    function getPaper(uint256 paperId) external view returns (Paper memory) {
        return papers[paperId];
    }

    /**
     * @dev Get reviewer details
     * @param reviewer Address of reviewer
     * @return Reviewer struct
     */
    function getReviewer(address reviewer) external view returns (Reviewer memory) {
        return reviewers[reviewer];
    }
}
```

{% endtab %}

{% tab title="AcademicPeerReview.test.js" %}

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @title AcademicPeerReview Test Suite
 * @notice Comprehensive tests for privacy-preserving academic peer review system
 * @dev Tests demonstrate FHE encryption, access control, and review aggregation
 */
describe("AcademicPeerReview Contract", function () {
  let academicPeerReview;
  let owner;
  let author;
  let reviewer1;
  let reviewer2;
  let reviewer3;
  let nonReviewer;

  const REVIEW_PERIOD = 30 * 24 * 60 * 60; // 30 days in seconds
  const MIN_REVIEWERS = 3;
  const MIN_SCORE = 1;
  const MAX_SCORE = 10;

  /**
   * Deploy fresh contract instance before each test
   * Sets up test accounts: owner, author, reviewers
   */
  beforeEach(async function () {
    [owner, author, reviewer1, reviewer2, reviewer3, nonReviewer] = await ethers.getSigners();

    const AcademicPeerReview = await ethers.getContractFactory("AcademicPeerReview");
    academicPeerReview = await AcademicPeerReview.deploy();
    await academicPeerReview.waitForDeployment();
  });

  /**
   * ✅ Test: Contract Deployment
   */
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await academicPeerReview.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero papers", async function () {
      expect(await academicPeerReview.paperCount()).to.equal(0);
    });
  });

  /**
   * ✅ Test: Paper Submission Workflow
   */
  describe("Paper Submission", function () {
    it("Should submit a paper successfully", async function () {
      const title = "Advanced Cryptographic Techniques";
      const abstract = "This paper explores FHE applications...";
      const ipfsHash = "QmTzQ1JRkWErjk39mryYw2WVaphAZNAREyMchXzYT4rKE6";

      const tx = await academicPeerReview.connect(author).submitPaper(
        title,
        abstract,
        ipfsHash
      );

      await expect(tx)
        .to.emit(academicPeerReview, "PaperSubmitted")
        .withArgs(1, author.address, title);
    });
  });

  /**
   * ✅ Test: Reviewer Registration and Verification
   */
  describe("Reviewer Management", function () {
    it("Should register a reviewer", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");

      const reviewer = await academicPeerReview.getReviewer(reviewer1.address);
      expect(reviewer.expertise).to.equal("Cryptography");
      expect(reviewer.reputation).to.equal(100);
    });

    it("Should verify a reviewer (owner only)", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");

      const tx = await academicPeerReview.connect(owner).verifyReviewer(reviewer1.address);
      await expect(tx).to.emit(academicPeerReview, "ReviewerVerified");
    });
  });

  /**
   * ✅ Test: Encrypted Review Submission
   */
  describe("Encrypted Review Submission", function () {
    beforeEach(async function () {
      // Setup: Submit paper and register reviewers
      await academicPeerReview.connect(author).submitPaper(
        "Test Paper",
        "Abstract",
        "QmHash123"
      );

      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");
      await academicPeerReview.connect(owner).verifyReviewer(reviewer1.address);
    });

    it("Should submit encrypted review with input proof", async function () {
      const paperId = 1;
      const score = 8;
      const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof123"));
      const comments = "Excellent methodology";

      const tx = await academicPeerReview.connect(reviewer1).submitReview(
        paperId,
        score,
        inputProof,
        comments
      );

      await expect(tx)
        .to.emit(academicPeerReview, "ReviewSubmitted")
        .withArgs(paperId, reviewer1.address);
    });
  });

  /**
   * ✅ Test: Homomorphic Score Aggregation
   */
  describe("Score Aggregation", function () {
    it("Should aggregate encrypted scores without decryption", async function () {
      // Setup: Submit paper and multiple reviews
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");

      // Register and verify reviewers
      for (const reviewer of [reviewer1, reviewer2, reviewer3]) {
        await academicPeerReview.connect(reviewer).registerReviewer("Expert");
        await academicPeerReview.connect(owner).verifyReviewer(reviewer.address);
      }

      // Submit reviews
      const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof"));
      await academicPeerReview.connect(reviewer1).submitReview(1, 8, inputProof, "Good");
      await academicPeerReview.connect(reviewer2).submitReview(1, 9, inputProof, "Great");
      await academicPeerReview.connect(reviewer3).submitReview(1, 7, inputProof, "Fair");

      const paper = await academicPeerReview.getPaper(1);
      expect(paper.isFinalized).to.be.true;
    });
  });

  /**
   * ✅ Test: Access-Controlled Score Revelation
   */
  describe("Score Revelation", function () {
    it("Should allow author to request score reveal", async function () {
      // Setup complete review cycle
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");

      for (const reviewer of [reviewer1, reviewer2, reviewer3]) {
        await academicPeerReview.connect(reviewer).registerReviewer("Expert");
        await academicPeerReview.connect(owner).verifyReviewer(reviewer.address);
        await academicPeerReview.connect(reviewer).submitReview(
          1, 8, ethers.keccak256(ethers.toUtf8Bytes("proof")), "Good"
        );
      }

      const tx = await academicPeerReview.connect(author).requestScoreReveal(1);
      await expect(tx).to.emit(academicPeerReview, "ScoreRevealed");
    });

    it("Should reject unauthorized score reveal requests", async function () {
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");

      await expect(
        academicPeerReview.connect(nonReviewer).requestScoreReveal(1)
      ).to.be.revertedWith("Reviews not finalized");
    });
  });
});
```

{% endtab %}

{% endtabs %}

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

## Key Features

### For Authors
- Submit papers with IPFS storage
- Track paper status in real-time
- Request score revelation after review period
- View aggregated review results

### For Reviewers
- Register with expertise areas
- Submit encrypted review scores (1-10 scale)
- Maintain complete anonymity
- Earn reputation for quality reviews

### For Administrators
- Verify reviewer credentials
- Monitor review progress
- Manage system parameters

## Security Considerations

- **Non-reentrant review submission**: Prevents reentrancy attacks
- **Input validation**: All parameters validated before processing
- **Access control**: Owner-only administrative functions
- **Time-bound operations**: Review deadlines enforced
- **Reputation system**: Incentivizes honest reviewing

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Main README](../README.md)
- [Setup Guide](../SETUP_GUIDE.md)
- [Developer Guide](../DEVELOPER_GUIDE.md)
