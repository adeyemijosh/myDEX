// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract WalletContract {
  struct Token {
    bytes32 ticker;
    address tokenAddress;
  }

  bytes32[] public tokenList;
  mapping(bytes32 => Token) public tokenMapping;
  mapping(address => mapping(bytes32 => uint256)) public balances;

  // Function to add a new token to the wallet
  function addToken(bytes32 ticker, address addressToken) external {
    tokenMapping[ticker] = Token(ticker, addressToken);
    tokenList.push(ticker);
  }

  // Modifier to check if a token exists
  modifier tokenExist(bytes32 ticker) {
    require(
      tokenMapping[ticker].tokenAddress != address(0),
      "Token doesn't exist"
    );
    _;
  }

  // Constructor to initialize the contract and add some initial tokens
  constructor() {
    addToken('ETH', address(0x3da9ea1622ee74cf87144e3d2c7f7cce4d167d9c)); //your token pair
    addToken('TKN', address(0x0d6C86477b18A027c379FF611CeAB1fC80330335)); //you get this token address when you deploy your contract
  }

  // Function to deposit tokens into the wallet
  function deposit(uint amount, bytes32 ticker) external tokenExist(ticker) {
    IERC20(tokenMapping[ticker].tokenAddress).transferFrom(
      msg.sender,
      address(this),
      amount
    );
    balances[msg.sender][ticker] += amount;
  }

  // Function to withdraw tokens from the wallet
  function withdraw(uint amount, bytes32 ticker) external {
    require(tokenMapping[ticker].tokenAddress != address(0));
    require(balances[msg.sender][ticker] >= amount, 'Not sufficient funds');
    IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
    balances[msg.sender][ticker] -= amount;
  }
}
