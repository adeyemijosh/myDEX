//N:B this is just a DEMO, please do ensure to replace with your REACT or NEXT.js code. 



// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DexContract from './build/contracts/Dex.json'; // Replace with the actual path to your DEX contract ABI

function App() {
  const [provider, setProvider] = useState(null);
  const [dexContract, setDexContract] = useState(null);
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [side, setSide] = useState('BUY'); // Default to BUY, you can add a toggle for BUY/SELL

  useEffect(() => {
    // Initialize Ethereum provider
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        // Initialize DEX contract
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        const dexAddress = DexContract.networks[network.chainId].address;
        const dex = new ethers.Contract(dexAddress, DexContract.abi, signer);
        setDexContract(dex);
      }
    };

    initializeProvider();
  }, []);

  const createLimitOrder = async () => {
    try {
      // Perform checks and validations if needed

      // Create a limit order
      await dexContract.createLimitOrder(selectedToken, amount, price, side);
    } catch (error) {
      console.error('Error creating limit order:', error.message);
    }
  };

  return (
    <div>
      <h1>Berry's Dex-interface</h1>
      <div>
        <label>
          Token:
          <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
            {/* Add options for available tokens */}
            <option value="ETH">ETH</option>
            <option value="TKN">TKN</option>
            {/* Add more options based on available tokens in your DEX */}
          </select>
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Side:
          <select value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </label>
      </div>
      <button onClick={createLimitOrder}>Create Limit Order</button>
    </div>
  );
}

export default App;
