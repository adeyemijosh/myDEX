// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './walletContract.sol';

contract Dex is DexContract {
  enum Side {
    BUY,
    SELL
  }

  struct Order {
    uint id;
    address trader;
    Side side;
    bytes32 ticker;
    uint amount;
    uint price;
  }

  mapping(bytes32 => mapping(uint => Order[])) public orderBook;

  // Add a new order to the order book
  function createLimitOrder(
    bytes32 ticker,
    uint amount,
    uint price,
    Side side
  ) public {
    // Validate that the token exists in the walletContract
    require(
      tokenMapping[ticker].tokenAddress != address(0),
      "Token doesn't exist"
    );  

    if (side == Side.BUY) {
      // Add logic for handling buy orders
      // Check if the trader has sufficient balance to create the order
      require(
        balances[msg.sender][ticker] >= amount * price,
        'Not sufficient funds'
      );
    } else {
      // Add logic for handling sell orders
      // Check if the trader has sufficient balance to create the order
      require(balances[msg.sender][ticker] >= amount, 'Not sufficient funds');
    }

    uint orderBookIndex = orderBook[ticker][uint(side)].length;
    orderBook[ticker][uint(side)].push(
      Order(orderBookIndex, msg.sender, side, ticker, amount, price)
    );
  }
}
