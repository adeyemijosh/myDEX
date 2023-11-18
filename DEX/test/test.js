const WalletContract = artifacts.require('WalletContract');
const Tulupay = artifacts.require('Token');
const Dex = artifacts.require('Dex');

//WALLET TEST

contract("WalletContract", (accounts) => {
    it('should prevent invalid withdrawals', async () => {
        const ticker = web3.utils.fromAscii('TKN');
        const tokenAddress = accounts[1];  // This should be a real address in a real scenario
        const amount = web3.utils.toWei('1', 'ether');  // 1 token (in wei)

        // Deploy the WalletContract
        const walletContract = await WalletContract.new();

        // Add the token to the wallet using the deployed contract instance
        await walletContract.addToken(ticker, tokenAddress, { from: accounts[0] });

        // Attempt to withdraw more tokens than the account has using the deployed contract instance
        try {
            await walletContract.withdraw(amount, ticker, { from: accounts[0] });
            assert.fail('Expected an error, but the transaction succeeded');
        } catch (err) {
            assert.include(err.message, 'Not sufficient funds', 'Expected "Not sufficient funds" error');
        }
    });
});


//TOKEN TEST
contract('Tulupay', (accounts) => {
    it('should have the correct initial supply, name, and symbol', async () => {
        const tokenInstance = await Tulupay.deployed();

        const name = await tokenInstance.name();
        const symbol = await tokenInstance.symbol();
        const totalSupply = await tokenInstance.totalSupply();

        assert.equal(name, 'Token', 'Token has the wrong name');
        assert.equal(symbol, 'TKN', 'Token has the wrong symbol');
        assert.equal(totalSupply.toString(), '1000000000000000000000000', 'Token has the wrong initial supply');
    });

    it('should allow transfers between accounts', async () => {
        const tokenInstance = await Token.deployed();

        const sender = accounts[0];
        const receiver = accounts[1];
        const amount = web3.utils.toWei('100', 'ether'); // Transfer 100 TULU

        const initialBalanceSender = await tokenInstance.balanceOf(sender);
        const initialBalanceReceiver = await tokenInstance.balanceOf(receiver);

        await tokenInstance.transfer(receiver, amount, { from: sender });

        const finalBalanceSender = await tokenInstance.balanceOf(sender);
        const finalBalanceReceiver = await tokenInstance.balanceOf(receiver);

        assert.equal(
            finalBalanceSender.toString(),
            initialBalanceSender.sub(web3.utils.toBN(amount)).toString(),
            'Sender balance not updated correctly'
        );
        assert.equal(
            finalBalanceReceiver.toString(),
            initialBalanceReceiver.add(web3.utils.toBN(amount)).toString(),
            'Receiver balance not updated correctly'
        );
    });
});

//DEX TEST
contract('Dex', (accounts) => {
    let dexInstance;
    let walletInstance;
    const trader = accounts[0];
    const ticker = web3.utils.fromAscii('TKN');
    const amount = web3.utils.toWei('10', 'ether');
    const price = web3.utils.toWei('2', 'ether');

    beforeEach(async () => {
        dexInstance = await Dex.new();
        walletInstance = await WalletContract.new();
        await walletInstance.addToken(ticker, dexInstance.address, { from: trader });

        // Ensure the trader's balance is more than sufficient for these tests
        const sufficientAmount = web3.utils.toWei('1', 'ether'); // Increase the balance
        await walletInstance.deposit(sufficientAmount, ticker, { from: trader });
    });

    it('should prevent creating a BUY order without sufficient funds', async () => {
        // Attempt to create a BUY order with the available balance
        try {
            await dexInstance.createLimitOrder(ticker, amount, price, 0, { from: trader });
            assert.fail('Expected an error, but the transaction succeeded');
        } catch (err) {
            assert.include(err.message, 'Not sufficient funds', 'Expected "Not sufficient funds" error');
        }

    });
});
