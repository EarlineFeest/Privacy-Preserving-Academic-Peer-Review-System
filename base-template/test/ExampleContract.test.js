const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @title ExampleContract Test Suite
 * @notice Template test file demonstrating testing patterns
 */
describe("ExampleContract", function () {
  let exampleContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get test accounts
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const ExampleContract = await ethers.getContractFactory("ExampleContract");
    exampleContract = await ExampleContract.deploy();
    await exampleContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await exampleContract.owner()).to.equal(owner.address);
    });

    it("Should return owner address via getOwner()", async function () {
      expect(await exampleContract.getOwner()).to.equal(owner.address);
    });
  });

  describe("Store Value", function () {
    it("Should emit ValueStored event", async function () {
      const value = 123;

      await expect(exampleContract.connect(user1).storeValue(value))
        .to.emit(exampleContract, "ValueStored")
        .withArgs(user1.address, value);
    });

    it("Should allow any user to store value", async function () {
      const value = 456;

      await expect(exampleContract.connect(user2).storeValue(value))
        .to.not.be.reverted;
    });
  });
});
