// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Tulupay is ERC20 {
  constructor() ERC20('token', 'TKN') {
    //change this to your token name and ticker
    _mint(msg.sender, 1000000 * 10 ** 18);
  }
}
