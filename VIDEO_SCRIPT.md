# Privacy-Preserving Academic Peer Review System - Video Script

**Duration**: 60 seconds
**Target Audience**: Developers, Academic Institutions, Blockchain Enthusiasts

---

## Scene 1: Opening & Problem Introduction (0-12 seconds)

**Visual**:
- Animated title card: "Privacy-Preserving Academic Peer Review"
- Transition to graphics showing traditional peer review problems (bias icons, locked files, question marks)

**Screen Text Overlay**:
- "Traditional peer review faces challenges"
- "Bias • Lack of anonymity • Opacity"

---

## Scene 2: Solution Introduction (13-25 seconds)

**Visual**:
- Code editor showing AcademicPeerReview.sol contract
- Highlight key functions: submitPaper(), submitReview()
- Animated encryption visualization (plaintext → encrypted data → blockchain)

**Screen Text Overlay**:
- "FHE-Based Solution"
- "Encrypted Reviews • Anonymous Voting"
- "Blockchain Transparency"

---

## Scene 3: Key Features Demo (26-42 seconds)

**Visual Split Screen**:

**Left Side** - Smart Contract Code:
```solidity
function submitReview(
    uint256 paperId,
    uint8 score,
    bytes32 inputProof,
    string memory comments
)
```

**Right Side** - Frontend Application:
- Show paper submission form
- Reviewer registration interface
- Review submission with encrypted scores (visual padlock icons)
- Score aggregation dashboard

**Screen Text Overlay**:
- "Submit Papers"
- "Register Reviewers"
- "Encrypted Scores"
- "Secure Aggregation"

---

## Scene 4: FHEVM Technology Highlight (43-52 seconds)

**Visual**:
- Animation showing FHE encryption process:
  - Score input (8/10)
  - Input proof generation
  - Encrypted storage (bytes32 hash visualization)
  - Homomorphic aggregation
  - Selective decryption

**Screen Text Overlay**:
- "Powered by FHEVM"
- "Fully Homomorphic Encryption"
- "Compute on Encrypted Data"

---

## Scene 5: Results & Call to Action (53-60 seconds)

**Visual**:
- Quick montage of key benefits (icons with checkmarks):
  - Reviewer anonymity ✓
  - Encrypted scores ✓
  - Transparent process ✓
  - Tamper-proof ✓

**Screen Text Overlay**:
- "Complete Privacy + Full Transparency"
- "Built for Academic Integrity"
- GitHub repository URL
- "Zama Bounty Submission - December 2025"

**Ending Frame**:
- Project logo
- "Privacy-Preserving Academic Peer Review"
- "Powered by FHEVM"

---

## Technical Requirements

### Screen Recording Sections
1. **Terminal**: Contract compilation and deployment
   ```bash
   npx hardhat compile
   npx hardhat test
   ```

2. **Code Editor**: Show contract structure
   - contracts/AcademicPeerReview.sol (lines 1-50)
   - Highlight key structs: Paper, Reviewer, Review

3. **Browser**: Frontend application demo
   - http://localhost:3000
   - Walkthrough: Submit paper → Register reviewer → Submit review

4. **Test Output**: Show passing test results
   ```
   ✓ Paper submission
   ✓ Reviewer registration
   ✓ Encrypted review submission
   ✓ Score aggregation
   ```

### Visual Effects
- **Transitions**: Smooth fades (0.3s duration)
- **Animations**:
  - Encryption visualization (particles flowing into lock)
  - Data flow diagrams (input → encryption → blockchain → decryption)
  - Checkmark reveals for features
- **Color Scheme**:
  - Primary: Blue (#3B82F6) - Trust, Technology
  - Secondary: Purple (#8B5CF6) - Privacy, Encryption
  - Accent: Green (#10B981) - Success, Verification

### Text Styling
- **Title Font**: Bold, sans-serif (Poppins Bold)
- **Body Font**: Clean, readable (Inter Regular)
- **Code Font**: Monospace (Fira Code)
- **Font Sizes**:
  - Main title: 48px
  - Section headers: 32px
  - Body text: 24px
  - Code snippets: 18px

### Audio
- **Background Music**: Modern, tech-inspired (low volume, 20%)
- **Sound Effects**:
  - Typing sounds for code sections
  - Success chime for feature reveals
  - Lock sound for encryption visualization
  - Blockchain confirmation sound

### B-Roll Footage Suggestions
- Academic papers being reviewed (stock footage)
- University campus or library (establishing shots)
- Hands typing on keyboard (close-up)
- Network visualization (animated graphics)
- Lock and key metaphors (encrypted data)

---

## Shot List

| Shot # | Duration | Type | Content |
|--------|----------|------|---------|
| 1 | 3s | Graphic | Title card with logo |
| 2 | 4s | Animation | Problem visualization |
| 3 | 5s | Graphic | Solution introduction |
| 4 | 5s | Screen Record | Code editor - contract overview |
| 5 | 3s | Animation | Encryption process |
| 6 | 4s | Screen Record | Frontend - paper submission |
| 7 | 3s | Screen Record | Frontend - reviewer registration |
| 8 | 4s | Screen Record | Frontend - review submission |
| 9 | 3s | Screen Record | Encrypted scores dashboard |
| 10 | 6s | Animation | FHE technology explanation |
| 11 | 3s | Screen Record | Test results |
| 12 | 5s | Animation | Benefits checklist |
| 13 | 3s | Graphic | Call to action |
| 14 | 2s | Graphic | Ending card |

**Total**: 60 seconds

---

## Camera Angles (for presenter sections, if applicable)

- **Medium Shot**: Presenter introduction (if used)
- **Over-the-Shoulder**: Code writing demonstration
- **Close-Up**: Terminal commands and test execution
- **Screen Recording**: Full screen for application demos

---

## Post-Production Notes

### Color Grading
- Slightly boost blues and purples for tech feel
- Maintain high contrast for code readability
- Consistent color temperature throughout

### Text Animations
- Fade in from bottom (0.4s)
- Type-writer effect for code snippets
- Reveal animations for bullet points

### Pacing
- Fast-paced but clear
- Pause 1s on important information
- Quick cuts between scenes (0.5s transitions)

### Accessibility
- Include closed captions
- High contrast text overlays
- Clear, readable fonts (minimum 24px for body text)
- Alternative text for all graphics

---

## Export Settings

**Resolution**: 1920x1080 (Full HD)
**Frame Rate**: 30 fps
**Bitrate**: 10 Mbps
**Format**: MP4 (H.264 codec)
**Audio**: AAC, 192 kbps, 48 kHz

---

## Distribution Platforms

- YouTube (primary)
- GitHub repository (embedded)
- Twitter/X (promotional clip)
- LinkedIn (professional audience)
- Zama submission portal

---

## SEO Keywords

- FHEVM
- Fully Homomorphic Encryption
- Academic Peer Review
- Privacy-Preserving Blockchain
- Zama Bounty
- Smart Contract Privacy
- Decentralized Academia
- Anonymous Voting
- Encrypted Reviews

---

## Quality Checklist

- [ ] All visuals are clear and readable
- [ ] Audio is balanced (narration and music)
- [ ] Captions are accurate and synchronized
- [ ] Code snippets are visible and properly formatted
- [ ] Transitions are smooth and professional
- [ ] Total duration is 60 seconds (±2 seconds)
- [ ] All links and URLs are visible
- [ ] Brand colors are consistent
- [ ] Export quality is 1080p minimum
- [ ] File size is optimized for upload
