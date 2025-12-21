// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ExampleContract
 * @notice Template contract demonstrating FHEVM basics
 * @dev This is a placeholder contract to be replaced with your implementation
 */
contract ExampleContract {
    address public owner;

    event ValueStored(address indexed user, uint256 value);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Example function to demonstrate basic functionality
     * @param value Value to store
     */
    function storeValue(uint256 value) external {
        // Add your implementation here
        emit ValueStored(msg.sender, value);
    }

    /**
     * @notice Get contract owner
     * @return Address of the owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
}
