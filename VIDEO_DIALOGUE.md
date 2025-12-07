# Privacy-Preserving Academic Peer Review System - Video Narration

**Narrator Voice**: Professional, clear, moderately paced

---

## Full Narration Script

Welcome to the Privacy-Preserving Academic Peer Review System, a revolutionary solution built with FHEVM technology.

Traditional academic peer review faces critical challenges. Reviewer bias, lack of anonymity, and opaque processes undermine the integrity of scientific publishing.

Our solution leverages Fully Homomorphic Encryption to transform peer review. With FHE, reviewers can submit scores and feedback in encrypted form, ensuring complete privacy while maintaining transparency through blockchain technology.

Let me show you how it works. Authors submit their papers to the smart contract, which stores metadata on-chain and references the full document on IPFS.

Reviewers register with their areas of expertise and receive verification from the system administrator.

When submitting a review, scores are encrypted using FHE input proofs. The encrypted data is stored on the blockchain, making it impossible to identify individual reviewers or their scores before the review period ends.

The smart contract performs homomorphic aggregation on the encrypted scores, computing the average without ever decrypting individual values.

Once the review period concludes, only the paper author and system administrator can request score revelation. The aggregated result determines whether the paper is accepted or rejected.

This system demonstrates key FHEVM concepts: encrypted storage, input proof validation, access control patterns, homomorphic operations, and selective decryption.

The result is a peer review system that guarantees reviewer anonymity, protects score confidentiality, and provides a verifiable transparent process, all while being tamper-proof through blockchain technology.

Built for academic integrity, powered by FHEVM. Check out the full implementation on GitHub and see how privacy and transparency can coexist.

Thank you for watching this Zama Bounty submission for December 2025.

---

## Alternative Narration (Slightly Different Pacing)

Academic peer review is broken. Bias creeps in when reviewers know who wrote the paper. Honest reviewers fear retaliation. Centralized systems can be manipulated.

We built a better solution using Fully Homomorphic Encryption.

Here's the innovation: every review score is encrypted before it hits the blockchain. Reviewers submit their evaluations anonymously. No one can see individual scores, not even the blockchain validators.

The smart contract aggregates these encrypted scores using homomorphic operations. That means calculations happen on encrypted data, without ever decrypting it.

Watch this: an author submits a paper. Verified reviewers receive assignments. Each reviewer submits an encrypted score between one and ten. The contract aggregates all scores while they remain encrypted.

Only after the review period ends can authorized parties request the final result. The system automatically accepts or rejects the paper based on the aggregated score.

This isn't just theory. Our implementation includes a fully functional smart contract, comprehensive test suite, and a user-friendly frontend application.

We demonstrate five core FHEVM concepts: encrypted data storage, input proof validation, granular access control, homomorphic computation, and selective decryption.

The platform also includes a reputation system for reviewers, time-bound review periods, and role-based permissions to ensure only authorized participants can perform specific actions.

This is privacy-preserving peer review. No bias. No retaliation. Complete transparency. Cryptographically enforced.

Ready for academic integrity to enter the blockchain era? Explore our code, run the tests, and see the future of decentralized academic publishing.

Zama Bounty Track submission, December 2025.

---

## Short Version (45 seconds)

Traditional peer review has a problem: bias and lack of anonymity compromise academic integrity.

Our solution uses Fully Homomorphic Encryption to enable private, tamper-proof reviews.

Authors submit papers. Reviewers register and get verified. When submitting reviews, scores are encrypted using FHE input proofs.

The smart contract aggregates encrypted scores without decrypting them. Only authorized parties can reveal the final result after the review period.

This demonstrates key FHEVM concepts: encrypted storage, access control, homomorphic operations, and selective decryption.

The result? Complete reviewer anonymity, confidential scores, transparent processes, and blockchain security.

Privacy and transparency, working together for academic integrity. Powered by FHEVM.

---

## Key Talking Points (Bullet Format)

**Opening Hook**
Academic peer review needs privacy without sacrificing transparency.

**Problem Statement**
Reviewer bias affects paper acceptance.
Lack of anonymity discourages honest feedback.
Centralized systems lack verifiable processes.

**Solution Introduction**
FHEVM enables computation on encrypted data.
Blockchain provides transparent, tamper-proof records.
Smart contracts automate the entire review workflow.

**Technical Implementation**
Solidity smart contract with FHE encryption.
Input proofs ensure data integrity.
Homomorphic aggregation preserves privacy.
Access control limits decryption rights.

**Key Features**
Submit papers with IPFS storage.
Register and verify reviewers.
Submit encrypted scores from one to ten.
Automated status updates based on aggregated results.
Reputation system incentivizes quality reviews.

**FHEVM Concepts Demonstrated**
Encrypted storage of sensitive data.
Input proof validation for security.
Role-based access control patterns.
Homomorphic operations on encrypted values.
Selective decryption for authorized parties.

**Benefits Summary**
Complete reviewer anonymity.
Score confidentiality until revelation.
Verifiable transparent process.
Tamper-proof blockchain storage.
Bias prevention through cryptography.

**Call to Action**
Explore the GitHub repository.
Review the smart contract code.
Run the comprehensive test suite.
Experience the frontend application.
See how FHE transforms peer review.

**Closing Statement**
Built for academic integrity, powered by FHEVM technology.

---

## Technical Terms Pronunciation Guide

- **FHEVM**: "F-H-E-V-M" (spell out each letter)
- **Homomorphic**: "ho-mo-MOR-fik"
- **IPFS**: "I-P-F-S" (spell out each letter)
- **Solidity**: "so-LID-i-ty"
- **Hardhat**: "HARD-hat"
- **bytes32**: "bytes thirty-two"
- **uint256**: "u-int two fifty-six"
- **Zama**: "ZAH-mah"

---

## Tone & Delivery Guidelines

**Pace**: Medium, clear enunciation
**Energy**: Professional but enthusiastic
**Emphasis**: Highlight key benefits and technical innovations
**Pauses**: Brief pause after introducing each major concept

**Important Words to Emphasize**:
- Privacy
- Encrypted
- Anonymous
- Transparent
- Homomorphic
- Tamper-proof
- Blockchain
- FHEVM

**Avoid**:
- Overly technical jargon without explanation
- Speaking too fast (remember, 60 seconds total)
- Monotone delivery
- Uncertain or hesitant language

---

## Background Music Suggestions

**Genre**: Tech/Electronic, Corporate, Inspirational
**Mood**: Modern, Professional, Innovative
**Tempo**: Medium (100-120 BPM)
**Energy**: Uplifting but not overwhelming

**Recommended Tracks** (royalty-free):
- "Digital Innovation" (corporate tech)
- "Future Technology" (electronic ambient)
- "Blockchain Dreams" (modern tech)
- "Scientific Progress" (inspirational corporate)

**Volume Mixing**:
- Music at 20% during narration
- Slight increase to 30% during visual-only sections
- Fade out completely during code demonstrations

---

## Emphasis Patterns

**Strong Emphasis** (louder, slower):
"Fully Homomorphic Encryption"
"Complete privacy"
"Blockchain transparency"
"Academic integrity"

**Medium Emphasis** (clear, distinct):
"Encrypted scores"
"Anonymous voting"
"Tamper-proof"
"Access control"

**Light Emphasis** (normal pace):
Technical details
Feature lists
Process descriptions

---

## Accessibility Notes

**Captions**:
All narration must be accurately captioned.
Include sound effect descriptions in brackets: [encryption sound]
Use proper capitalization for technical terms: FHEVM, IPFS.

**Audio Description** (for extended version):
Describe visual elements not covered in narration.
Mention when code is shown on screen.
Describe animations and transitions.

---

## Quality Assurance

**Before Recording**:
Practice reading the script aloud three times.
Time each reading to ensure 60-second target.
Mark natural breathing points.
Identify difficult words and practice pronunciation.

**During Recording**:
Use quality microphone in quiet environment.
Record multiple takes of each section.
Maintain consistent volume and distance from mic.
Record room tone for audio editing.

**After Recording**:
Remove mouth clicks and breathing sounds.
Apply light compression and EQ.
Normalize audio levels to -3dB.
Sync perfectly with video timeline.

---

## Script Variations

**For Different Audiences**:

**Academic Audience**:
Emphasize research integrity, peer review challenges, publication bias.

**Developer Audience**:
Highlight FHEVM implementation, smart contract patterns, testing approach.

**Business Audience**:
Focus on problem-solution fit, market need, real-world applications.

**General Audience**:
Simplify technical terms, emphasize benefits, reduce jargon.

---

## Call-to-Action Variations

**Standard**:
"Check out the full implementation on GitHub."

**Engagement Focused**:
"Star the repository and join the conversation."

**Developer Focused**:
"Clone the repo, run the tests, and contribute."

**Academic Focused**:
"Learn how FHE can transform academic publishing."

**Competition Focused**:
"See our Zama Bounty submission and explore the code."

---

## Backup Short Versions

**30-Second Version**:
Traditional peer review lacks privacy and transparency. Our FHEVM solution enables encrypted, anonymous reviews stored on blockchain. Reviewers submit encrypted scores. The smart contract aggregates them homomorphically. Only authorized parties can decrypt results. Complete privacy, full transparency, academic integrity. Powered by FHEVM.

**15-Second Version**:
Privacy-preserving peer review using FHEVM. Encrypted reviews, anonymous voting, blockchain transparency. Academic integrity meets cryptographic privacy.

**5-Second Version**:
Anonymous academic peer review powered by FHEVM.
