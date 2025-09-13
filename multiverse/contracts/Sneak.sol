// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Sneak {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address newOwner) public {
        require(msg.sender == owner, "Not the owner");
        owner = newOwner;
    }
}
