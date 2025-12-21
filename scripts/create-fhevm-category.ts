#!/usr/bin/env ts-node

/**
 * create-fhevm-category - CLI tool to generate FHEVM projects with multiple examples from a category
 *
 * Usage: ts-node scripts/create-fhevm-category.ts <category> [output-dir]
 *
 * Example: ts-node scripts/create-fhevm-category.ts academic-review ./output/academic-review-examples
 */

import * as fs from 'fs';
import * as path from 'path';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
  Magenta = '\x1b[35m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

// Contract item interface
interface ContractItem {
  path: string;
  test: string;
  description: string;
}

// Category configuration interface
interface CategoryConfig {
  name: string;
  description: string;
  contracts: ContractItem[];
  additionalDeps?: Record<string, string>;
}

// Category definitions
const CATEGORIES: Record<string, CategoryConfig> = {
  'academic-review': {
    name: 'Academic Review System',
    description: 'Privacy-preserving academic peer review system demonstrating all FHEVM concepts',
    contracts: [
      {
        path: 'contracts/AcademicPeerReview.sol',
        test: 'test/AcademicPeerReview.test.js',
        description: 'Full privacy-preserving review system with encrypted scoring',
      },
      {
        path: 'contracts/SimpleAcademicReview.sol',
        test: 'test/AcademicPeerReview.test.js',
        description: 'Simplified version for learning FHEVM basics',
      },
    ],
  },
  'privacy-applications': {
    name: 'Privacy-Preserving Applications',
    description: 'Collection of privacy-preserving applications using FHEVM',
    contracts: [
      {
        path: 'contracts/AcademicPeerReview.sol',
        test: 'test/AcademicPeerReview.test.js',
        description: 'Academic peer review with encrypted scores',
      },
    ],
  },
};

function copyDirectoryRecursive(source: string, destination: string, excludeDirs: string[] = []): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      if (excludeDirs.includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath, excludeDirs);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function generateReadme(category: string, contracts: ContractItem[]): string {
  const categoryInfo = CATEGORIES[category];

  return `# FHEVM Examples: ${categoryInfo.name}

${categoryInfo.description}

## 📦 Included Examples

This project contains ${contracts.length} example contract${contracts.length > 1 ? 's' : ''}:

${contracts.map((contract, i) => {
  const name = path.basename(contract.path, '.sol');
  return `${i + 1}. **${name}** - ${contract.description}`;
}).join('\n')}

## Quick Start

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Package manager
- **MetaMask**: For frontend interaction (optional)

### Installation

1. **Install dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**

   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Compile all contracts**

   \`\`\`bash
   npm run compile
   \`\`\`

4. **Run all tests**

   \`\`\`bash
   npm run test
   \`\`\`

## Contracts

${contracts.map(contract => {
  const name = path.basename(contract.path, '.sol');
  return `### ${name}

${contract.description}

Located in \`contracts/${name}.sol\`

Run specific tests:
\`\`\`bash
npm test
\`\`\`
`;
}).join('\n')}

## Deployment

### Local Network

\`\`\`bash
# Start local node (Terminal 1)
npx hardhat node

# Deploy all contracts (Terminal 2)
npm run deploy:local
\`\`\`

### Sepolia Testnet

\`\`\`bash
# Deploy all contracts
npm run deploy:sepolia

# Verify contracts
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
\`\`\`

### FHEVM Testnet

\`\`\`bash
# Deploy to FHEVM testnet
npm run deploy:fhevm
\`\`\`

## Available Scripts

| Script | Description |
|--------|-------------|
| \`npm run compile\` | Compile all contracts |
| \`npm run test\` | Run all tests |
| \`npm run test:gas\` | Run tests with gas reporting |
| \`npm run test:coverage\` | Generate coverage report |
| \`npm run clean\` | Clean build artifacts |
| \`npm run deploy:local\` | Deploy to local network |
| \`npm run deploy:sepolia\` | Deploy to Sepolia testnet |
| \`npm run deploy:fhevm\` | Deploy to FHEVM testnet |

## FHEVM Concepts Demonstrated

This project demonstrates all five key FHEVM concepts:

1. **Encrypted Storage** - Store sensitive data on-chain in encrypted form
2. **Input Proofs** - Prove plaintext values match encrypted ciphertext
3. **Access Control** - Control who can decrypt specific encrypted data
4. **Homomorphic Operations** - Perform computations on encrypted data
5. **Selective Decryption** - Decrypt results only to authorized parties

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Examples](https://docs.zama.org/protocol/examples)
- [Hardhat Documentation](https://hardhat.org/docs)

## Frontend (if included)

To run the React frontend:

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
`;
}

function createCategoryProject(category: string, outputDir: string): void {
  const rootDir = path.resolve(__dirname, '..');

  // Validate category
  if (!CATEGORIES[category]) {
    error(`Unknown category: ${category}\n\nAvailable categories:\n${Object.keys(CATEGORIES).map(k => `  - ${k}: ${CATEGORIES[k].name}`).join('\n')}`);
  }

  const categoryInfo = CATEGORIES[category];
  info(`Creating FHEVM project: ${categoryInfo.name}`);
  info(`Output directory: ${outputDir}`);

  // Check if output directory exists
  if (fs.existsSync(outputDir)) {
    error(`Output directory already exists: ${outputDir}`);
  }

  // Step 1: Copy entire project
  log('\n📋 Step 1: Copying project structure...', Color.Cyan);
  copyDirectoryRecursive(
    rootDir,
    outputDir,
    ['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist', '.git', 'build', 'output']
  );
  success('Project structure copied');

  // Step 2: Update package.json
  log('\n📦 Step 2: Updating package.json...', Color.Cyan);
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = `fhevm-examples-${category}`;
  packageJson.description = categoryInfo.description;
  packageJson.homepage = `https://github.com/zama-ai/fhevm-examples/${category}`;

  // Add additional dependencies if needed
  if (categoryInfo.additionalDeps) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...categoryInfo.additionalDeps,
    };
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  success('package.json updated');

  // Step 3: Generate README
  log('\n📝 Step 3: Generating README...', Color.Cyan);
  const readme = generateReadme(category, categoryInfo.contracts);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Final summary
  log('\n' + '='.repeat(60), Color.Green);
  success(`FHEVM ${categoryInfo.name} project created successfully!`);
  log('='.repeat(60), Color.Green);

  log('\n📊 Project Summary:', Color.Magenta);
  log(`  Category: ${categoryInfo.name}`);
  log(`  Contracts: ${categoryInfo.contracts.length}`);
  log(`  Location: ${path.relative(process.cwd(), outputDir)}`);

  log('\n📦 Next steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');

  log('\n🎉 Happy coding with FHEVM!', Color.Cyan);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    log('FHEVM Category Project Generator', Color.Cyan);
    log('\nUsage: ts-node scripts/create-fhevm-category.ts <category> [output-dir]\n');
    log('Available categories:', Color.Yellow);
    Object.entries(CATEGORIES).forEach(([key, info]) => {
      log(`  ${key}`, Color.Green);
      log(`    ${info.name}`, Color.Cyan);
      log(`    ${info.description}`, Color.Reset);
      log(`    Contracts: ${info.contracts.length}`, Color.Blue);
    });
    log('\nExamples:', Color.Yellow);
    log('  ts-node scripts/create-fhevm-category.ts academic-review ./output/academic-review');
    log('  ts-node scripts/create-fhevm-category.ts privacy-applications ./output/privacy-apps\n');
    process.exit(0);
  }

  const category = args[0];
  const outputDir = args[1] || path.join(process.cwd(), 'output', `fhevm-examples-${category}`);

  createCategoryProject(category, outputDir);
}

main();
