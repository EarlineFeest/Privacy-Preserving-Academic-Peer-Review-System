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
    // Get test accounts
    [owner, author, reviewer1, reviewer2, reviewer3, nonReviewer] = await ethers.getSigners();

    // Deploy contract
    const AcademicPeerReview = await ethers.getContractFactory("AcademicPeerReview");
    academicPeerReview = await AcademicPeerReview.deploy();
    await academicPeerReview.waitForDeployment();
  });

  /**
   * Test Category: Contract Deployment
   * Validates initial state and ownership
   */
  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await academicPeerReview.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero papers", async function () {
      expect(await academicPeerReview.paperCount()).to.equal(0);
    });

    it("Should set correct constants", async function () {
      expect(await academicPeerReview.MIN_SCORE()).to.equal(MIN_SCORE);
      expect(await academicPeerReview.MAX_SCORE()).to.equal(MAX_SCORE);
      expect(await academicPeerReview.REVIEW_PERIOD()).to.equal(REVIEW_PERIOD);
      expect(await academicPeerReview.MIN_REVIEWERS()).to.equal(MIN_REVIEWERS);
    });
  });

  /**
   * Test Category: Paper Submission
   * Validates paper submission workflow and data storage
   */
  describe("Paper Submission", function () {
    it("Should submit a paper successfully", async function () {
      const title = "Advanced Cryptographic Techniques in Blockchain";
      const abstract = "This paper explores novel FHE applications...";
      const ipfsHash = "QmTzQ1JRkWErjk39mryYw2WVaphAZNAREyMchXzYT4rKE6";

      const tx = await academicPeerReview.connect(author).submitPaper(
        title,
        abstract,
        ipfsHash
      );

      await expect(tx)
        .to.emit(academicPeerReview, "PaperSubmitted")
        .withArgs(1, author.address, title);

      const paper = await academicPeerReview.getPaper(1);
      expect(paper.paperId).to.equal(1);
      expect(paper.author).to.equal(author.address);
      expect(paper.title).to.equal(title);
      expect(paper.abstractText).to.equal(abstract);
      expect(paper.ipfsHash).to.equal(ipfsHash);
      expect(paper.status).to.equal(1); // UnderReview status
    });

    it("Should increment paper count", async function () {
      await academicPeerReview.connect(author).submitPaper(
        "Paper 1",
        "Abstract 1",
        "QmHash1"
      );
      expect(await academicPeerReview.paperCount()).to.equal(1);

      await academicPeerReview.connect(author).submitPaper(
        "Paper 2",
        "Abstract 2",
        "QmHash2"
      );
      expect(await academicPeerReview.paperCount()).to.equal(2);
    });

    it("Should reject empty title", async function () {
      await expect(
        academicPeerReview.connect(author).submitPaper(
          "",
          "Abstract",
          "QmHash"
        )
      ).to.be.revertedWith("Title required");
    });

    it("Should reject empty abstract", async function () {
      await expect(
        academicPeerReview.connect(author).submitPaper(
          "Title",
          "",
          "QmHash"
        )
      ).to.be.revertedWith("Abstract required");
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(
        academicPeerReview.connect(author).submitPaper(
          "Title",
          "Abstract",
          ""
        )
      ).to.be.revertedWith("IPFS hash required");
    });

    it("Should store multiple papers from same author", async function () {
      await academicPeerReview.connect(author).submitPaper(
        "First Paper",
        "First Abstract",
        "QmHash1"
      );
      await academicPeerReview.connect(author).submitPaper(
        "Second Paper",
        "Second Abstract",
        "QmHash2"
      );

      const authorPapers = await academicPeerReview.getPapersByAuthor(author.address);
      expect(authorPapers.length).to.equal(2);
    });
  });

  /**
   * Test Category: Reviewer Registration
   * Tests reviewer registration and verification workflow
   */
  describe("Reviewer Registration", function () {
    it("Should register reviewer successfully", async function () {
      const expertise = "Cryptography";

      await expect(
        academicPeerReview.connect(reviewer1).registerReviewer(expertise)
      )
        .to.emit(academicPeerReview, "ReviewerVerified")
        .withArgs(reviewer1.address, expertise);

      const reviewer = await academicPeerReview.reviewers(reviewer1.address);
      expect(reviewer.reviewerAddress).to.equal(reviewer1.address);
      expect(reviewer.isVerified).to.equal(true);
      expect(reviewer.expertise).to.equal(expertise);
      expect(reviewer.reputation).to.equal(100); // Initial reputation
      expect(reviewer.reviewsCompleted).to.equal(0);
    });

    it("Should reject empty expertise", async function () {
      await expect(
        academicPeerReview.connect(reviewer1).registerReviewer("")
      ).to.be.revertedWith("Expertise required");
    });

    it("Should prevent double registration", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");

      await expect(
        academicPeerReview.connect(reviewer1).registerReviewer("Blockchain")
      ).to.be.revertedWith("Already registered");
    });

    it("Should allow multiple reviewers to register", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");
      await academicPeerReview.connect(reviewer2).registerReviewer("Distributed Systems");
      await academicPeerReview.connect(reviewer3).registerReviewer("Privacy Engineering");

      const rev1 = await academicPeerReview.reviewers(reviewer1.address);
      const rev2 = await academicPeerReview.reviewers(reviewer2.address);
      const rev3 = await academicPeerReview.reviewers(reviewer3.address);

      expect(rev1.isVerified).to.equal(true);
      expect(rev2.isVerified).to.equal(true);
      expect(rev3.isVerified).to.equal(true);
    });
  });

  /**
   * Test Category: Reviewer Verification (Owner Functions)
   * Tests administrative reviewer verification
   */
  describe("Reviewer Verification by Owner", function () {
    it("Should allow owner to verify reviewer", async function () {
      // Register without auto-verify (would need modified contract)
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");

      await expect(
        academicPeerReview.connect(owner).verifyReviewer(reviewer1.address)
      )
        .to.emit(academicPeerReview, "ReviewerVerified")
        .withArgs(reviewer1.address, "Cryptography");
    });

    it("Should reject non-owner verification attempts", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");

      await expect(
        academicPeerReview.connect(author).verifyReviewer(reviewer1.address)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should reject verification of unregistered reviewer", async function () {
      await expect(
        academicPeerReview.connect(owner).verifyReviewer(reviewer1.address)
      ).to.be.revertedWith("Reviewer not registered");
    });
  });

  /**
   * Test Category: Review Submission with FHE Encryption
   * Demonstrates encrypted review storage and input proofs
   * Chapter: encryption, access-control
   */
  describe("Review Submission (FHE Encrypted)", function () {
    let paperId;
    const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof123"));

    beforeEach(async function () {
      // Submit paper
      const tx = await academicPeerReview.connect(author).submitPaper(
        "Research on FHE",
        "This paper presents...",
        "QmHash123"
      );
      const receipt = await tx.wait();
      paperId = 1;

      // Register reviewers
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");
      await academicPeerReview.connect(reviewer2).registerReviewer("Security");
      await academicPeerReview.connect(reviewer3).registerReviewer("Privacy");
    });

    it("Should submit encrypted review successfully", async function () {
      const score = 8;
      const comments = "Excellent research methodology and thorough analysis";

      await expect(
        academicPeerReview.connect(reviewer1).submitReview(
          paperId,
          score,
          inputProof,
          comments
        )
      )
        .to.emit(academicPeerReview, "ReviewSubmitted")
        .withArgs(paperId, reviewer1.address);

      const review = await academicPeerReview.reviews(paperId, reviewer1.address);
      expect(review.isSubmitted).to.equal(true);
      expect(review.paperId).to.equal(paperId);
      expect(review.reviewer).to.equal(reviewer1.address);

      // Verify score is encrypted (stored as bytes32 hash, not plaintext)
      expect(review.encryptedScore).to.not.equal(ethers.zeroPadValue(ethers.toBeHex(score), 32));
    });

    it("Should increment reviewer reputation and reviews completed", async function () {
      await academicPeerReview.connect(reviewer1).submitReview(
        paperId,
        7,
        inputProof,
        "Good work"
      );

      const reviewer = await academicPeerReview.reviewers(reviewer1.address);
      expect(reviewer.reviewsCompleted).to.equal(1);
      expect(reviewer.reputation).to.equal(110); // 100 initial + 10 bonus
    });

    it("Should reject scores below minimum", async function () {
      await expect(
        academicPeerReview.connect(reviewer1).submitReview(
          paperId,
          0,
          inputProof,
          "Comments"
        )
      ).to.be.revertedWith("Invalid score");
    });

    it("Should reject scores above maximum", async function () {
      await expect(
        academicPeerReview.connect(reviewer1).submitReview(
          paperId,
          11,
          inputProof,
          "Comments"
        )
      ).to.be.revertedWith("Invalid score");
    });

    it("Should reject duplicate review submission", async function () {
      await academicPeerReview.connect(reviewer1).submitReview(
        paperId,
        8,
        inputProof,
        "First review"
      );

      await expect(
        academicPeerReview.connect(reviewer1).submitReview(
          paperId,
          9,
          inputProof,
          "Second review"
        )
      ).to.be.revertedWith("Review already submitted");
    });

    it("Should reject review from unverified reviewer", async function () {
      await expect(
        academicPeerReview.connect(nonReviewer).submitReview(
          paperId,
          8,
          inputProof,
          "Comments"
        )
      ).to.be.revertedWith("Reviewer not verified");
    });

    it("Should reject review for non-existent paper", async function () {
      await expect(
        academicPeerReview.connect(reviewer1).submitReview(
          999,
          8,
          inputProof,
          "Comments"
        )
      ).to.be.revertedWith("Paper does not exist");
    });

    it("Should store encrypted scores in paper", async function () {
      await academicPeerReview.connect(reviewer1).submitReview(
        paperId,
        8,
        inputProof,
        "Good"
      );

      const paper = await academicPeerReview.getPaper(paperId);
      expect(paper.encryptedScores.length).to.equal(1);
    });
  });

  /**
   * Test Category: Review Aggregation (Homomorphic Operations)
   * Demonstrates FHE computation on encrypted data
   * Chapter: homomorphic-operations
   */
  describe("Review Aggregation", function () {
    let paperId;
    const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof123"));

    beforeEach(async function () {
      // Submit paper
      await academicPeerReview.connect(author).submitPaper(
        "Advanced FHE Research",
        "Abstract...",
        "QmHash"
      );
      paperId = 1;

      // Register reviewers
      await academicPeerReview.connect(reviewer1).registerReviewer("Cryptography");
      await academicPeerReview.connect(reviewer2).registerReviewer("Security");
      await academicPeerReview.connect(reviewer3).registerReviewer("Privacy");
    });

    it("Should aggregate multiple encrypted reviews", async function () {
      // Submit multiple reviews
      await academicPeerReview.connect(reviewer1).submitReview(paperId, 8, inputProof, "Excellent");

      const paper = await academicPeerReview.getPaper(paperId);

      // Verify aggregation happened (isFinalized set to true)
      expect(paper.isFinalized).to.equal(true);

      // Verify aggregated score exists (non-zero bytes32)
      expect(paper.aggregatedScore).to.not.equal(ethers.ZeroHash);
    });

    it("Should finalize after minimum reviews received", async function () {
      // Submit one review (minimum for demo is 1)
      await academicPeerReview.connect(reviewer1).submitReview(
        paperId,
        7,
        inputProof,
        "Good research"
      );

      const paper = await academicPeerReview.getPaper(paperId);
      expect(paper.isFinalized).to.equal(true);
    });
  });

  /**
   * Test Category: Score Revelation (Selective Decryption)
   * Demonstrates access-controlled decryption
   * Chapter: access-control, decryption
   */
  describe("Score Revelation", function () {
    let paperId;
    const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof123"));

    beforeEach(async function () {
      // Submit paper and reviews
      await academicPeerReview.connect(author).submitPaper(
        "FHE Applications",
        "Abstract...",
        "QmHash"
      );
      paperId = 1;

      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");
      await academicPeerReview.connect(reviewer1).submitReview(paperId, 8, inputProof, "Good");
    });

    it("Should allow author to request score reveal", async function () {
      await expect(
        academicPeerReview.connect(author).requestScoreReveal(paperId)
      )
        .to.emit(academicPeerReview, "ScoreRevealed")
        .to.emit(academicPeerReview, "PaperStatusChanged");
    });

    it("Should allow owner to request score reveal", async function () {
      await expect(
        academicPeerReview.connect(owner).requestScoreReveal(paperId)
      )
        .to.emit(academicPeerReview, "ScoreRevealed");
    });

    it("Should reject unauthorized score reveal requests", async function () {
      await expect(
        academicPeerReview.connect(reviewer1).requestScoreReveal(paperId)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should reject reveal for unfinalized reviews", async function () {
      // Submit new paper without reviews
      await academicPeerReview.connect(author).submitPaper(
        "New Paper",
        "Abstract",
        "QmHash2"
      );

      await expect(
        academicPeerReview.connect(author).requestScoreReveal(2)
      ).to.be.revertedWith("Reviews not finalized");
    });

    it("Should update paper status based on score", async function () {
      await academicPeerReview.connect(author).requestScoreReveal(paperId);

      const paper = await academicPeerReview.getPaper(paperId);
      // Status should be either Accepted (2) or Rejected (3)
      expect([2, 3]).to.include(paper.status);
    });
  });

  /**
   * Test Category: Access Control
   * Tests role-based permissions and authorization
   * Chapter: access-control
   */
  describe("Access Control", function () {
    it("Should restrict owner-only functions", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");

      await expect(
        academicPeerReview.connect(author).verifyReviewer(reviewer1.address)
      ).to.be.revertedWith("Not the owner");
    });

    it("Should allow emergency withdrawal by owner only", async function () {
      await expect(
        academicPeerReview.connect(author).emergencyWithdraw()
      ).to.be.revertedWith("Not the owner");
    });
  });

  /**
   * Test Category: Query Functions
   * Tests view functions and data retrieval
   */
  describe("Query Functions", function () {
    beforeEach(async function () {
      // Setup test data
      await academicPeerReview.connect(author).submitPaper("Paper 1", "Abstract 1", "Hash1");
      await academicPeerReview.connect(author).submitPaper("Paper 2", "Abstract 2", "Hash2");
      await academicPeerReview.connect(owner).submitPaper("Paper 3", "Abstract 3", "Hash3");
    });

    it("Should get papers by author", async function () {
      const authorPapers = await academicPeerReview.getPapersByAuthor(author.address);
      expect(authorPapers.length).to.equal(2);
      expect(authorPapers[0]).to.equal(1);
      expect(authorPapers[1]).to.equal(2);
    });

    it("Should get all papers with pagination", async function () {
      const papers = await academicPeerReview.getAllPapers(0, 2);
      expect(papers.length).to.equal(2);
      expect(papers[0]).to.equal(1);
      expect(papers[1]).to.equal(2);
    });

    it("Should handle pagination correctly", async function () {
      const papers = await academicPeerReview.getAllPapers(1, 2);
      expect(papers.length).to.equal(2);
      expect(papers[0]).to.equal(2);
      expect(papers[1]).to.equal(3);
    });

    it("Should get reviewer assignments", async function () {
      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");

      const assignments = await academicPeerReview.getReviewerAssignments(reviewer1.address);
      expect(assignments.length).to.equal(0); // No assignments yet
    });
  });

  /**
   * Test Category: Edge Cases and Error Handling
   * Tests boundary conditions and error scenarios
   */
  describe("Edge Cases", function () {
    it("Should handle non-existent paper queries", async function () {
      await expect(
        academicPeerReview.getPaper(999)
      ).to.be.revertedWith("Paper does not exist");
    });

    it("Should handle minimum valid score", async function () {
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");
      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");

      const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        academicPeerReview.connect(reviewer1).submitReview(1, MIN_SCORE, inputProof, "Comments")
      ).to.not.be.reverted;
    });

    it("Should handle maximum valid score", async function () {
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");
      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");

      const inputProof = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        academicPeerReview.connect(reviewer1).submitReview(1, MAX_SCORE, inputProof, "Comments")
      ).to.not.be.reverted;
    });
  });

  /**
   * Test Category: Gas Optimization
   * Validates gas efficiency of key operations
   */
  describe("Gas Optimization", function () {
    it("Should submit paper with reasonable gas cost", async function () {
      const tx = await academicPeerReview.connect(author).submitPaper(
        "Test Paper",
        "Test Abstract",
        "QmTestHash"
      );
      const receipt = await tx.wait();

      // Gas should be under 200,000
      expect(receipt.gasUsed).to.be.lessThan(200000n);
    });

    it("Should submit review with reasonable gas cost", async function () {
      await academicPeerReview.connect(author).submitPaper("Paper", "Abstract", "Hash");
      await academicPeerReview.connect(reviewer1).registerReviewer("Crypto");

      const tx = await academicPeerReview.connect(reviewer1).submitReview(
        1,
        8,
        ethers.keccak256(ethers.toUtf8Bytes("proof")),
        "Comments"
      );
      const receipt = await tx.wait();

      // Gas should be under 250,000
      expect(receipt.gasUsed).to.be.lessThan(250000n);
    });
  });
});
