# Automation Scripts

This directory contains automation tools for generating standalone FHEVM example repositories and documentation.

## Available Scripts

### create-fhevm-example.ts

Generates complete standalone repositories for FHEVM examples.

**Usage:**
```bash
ts-node scripts/create-fhevm-example.ts <example-name> [output-dir]
```

**Examples:**
```bash
# Generate privacy-preserving academic review example
ts-node scripts/create-fhevm-example.ts privacy-academic-review ./my-review-system

# Generate simple academic review example
ts-node scripts/create-fhevm-example.ts simple-academic-review ./simple-review
```

**Available Examples:**
- `privacy-academic-review` - Full privacy-preserving academic peer review system
- `simple-academic-review` - Simplified version for learning purposes

**What it does:**
1. Copies the entire project structure
2. Verifies contract files
3. Updates package.json with example-specific information
4. Generates a comprehensive README
5. Creates a ready-to-use standalone repository

### generate-docs.ts

Generates GitBook-formatted documentation from contracts and tests.

**Usage:**
```bash
ts-node scripts/generate-docs.ts <example-name>
ts-node scripts/generate-docs.ts --all
```

**Examples:**
```bash
# Generate docs for a specific example
ts-node scripts/generate-docs.ts privacy-academic-review

# Generate docs for all examples
ts-node scripts/generate-docs.ts --all
```

**What it does:**
1. Reads contract and test files
2. Extracts code and documentation
3. Generates GitBook-compatible markdown
4. Creates formatted code tabs
5. Updates SUMMARY.md index
6. Adds quick reference sections

**Output Structure:**
```
docs/
├── SUMMARY.md                          # GitBook navigation index
├── privacy-academic-review.md          # Main example documentation
└── simple-academic-review.md           # Simplified example documentation
```

## NPM Scripts

For convenience, the following npm scripts are available in package.json:

```bash
# Create standalone example repositories
npm run create-example privacy-academic-review ./output

# Generate documentation
npm run generate-docs privacy-academic-review
npm run generate-all-docs

# Show available examples
npm run help:examples
```

## Documentation Format

Generated documentation includes:

1. **Title and Description** - Clear explanation of the example
2. **FHEVM Concepts** - Key concepts demonstrated with explanations
3. **Code Tabs** - Interactive GitBook tabs for contract and test code
4. **Installation Instructions** - Step-by-step setup guide
5. **Quick Reference** - Common commands for compilation, testing, and deployment

## Adding New Examples

To add a new example:

1. **Add to EXAMPLES_MAP** in `create-fhevm-example.ts`:
   ```typescript
   'new-example': {
     contract: 'contracts/NewExample.sol',
     test: 'test/NewExample.test.js',
     description: 'Description of what this example demonstrates',
   }
   ```

2. **Add to EXAMPLES_CONFIG** in `generate-docs.ts`:
   ```typescript
   'new-example': {
     title: 'New Example',
     description: 'Detailed description...',
     contract: 'contracts/NewExample.sol',
     test: 'test/NewExample.test.js',
     output: 'docs/new-example.md',
     category: 'Basic Examples',
     concepts: [
       'Concept 1 - Explanation',
       'Concept 2 - Explanation'
     ]
   }
   ```

3. **Test the example**:
   ```bash
   npm run compile
   npm run test
   ```

4. **Generate documentation**:
   ```bash
   ts-node scripts/generate-docs.ts new-example
   ```

5. **Create standalone repository**:
   ```bash
   ts-node scripts/create-fhevm-example.ts new-example ./test-output
   cd test-output
   npm install && npm test
   ```

## File Structure

```
scripts/
├── README.md                  # This file
├── create-fhevm-example.ts    # Repository generator
└── generate-docs.ts           # Documentation generator
```

## Requirements

- Node.js v16 or higher
- TypeScript (`npm install -g typescript`)
- ts-node (`npm install -g ts-node`)

## Troubleshooting

### "File not found" errors

Make sure you're running the scripts from the project root directory:
```bash
cd /path/to/AcademicReviewSystem
ts-node scripts/generate-docs.ts privacy-academic-review
```

### TypeScript compilation errors

Install dependencies:
```bash
npm install
```

### Permission errors on Unix systems

Make scripts executable:
```bash
chmod +x scripts/*.ts
```

## Integration with GitBook

To integrate generated documentation with GitBook:

1. Generate all documentation:
   ```bash
   npm run generate-all-docs
   ```

2. The `docs/` folder is ready for GitBook:
   ```
   docs/
   ├── SUMMARY.md                    # Navigation structure
   ├── privacy-academic-review.md    # Example pages
   └── simple-academic-review.md
   ```

3. Deploy to GitBook:
   - Connect your repository to GitBook
   - Point GitBook to the `docs/` folder
   - GitBook will automatically use SUMMARY.md for navigation

## Best Practices

1. **Keep Examples Focused** - Each example should demonstrate one clear concept
2. **Document Thoroughly** - Include detailed comments in contracts and tests
3. **Test Extensively** - Ensure all examples compile and pass tests
4. **Update Documentation** - Regenerate docs after any code changes
5. **Verify Standalone Repos** - Test generated repositories independently

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [GitBook Documentation](https://docs.gitbook.com)
- [Hardhat Documentation](https://hardhat.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Built for the Zama Bounty Track - December 2025**
