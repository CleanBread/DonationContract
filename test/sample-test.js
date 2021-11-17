const DonationContract = artifacts.require('DonationContract');
const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('DonationContract', ([alice, bob, cale]) => {
  const ONE = new BN('1000000000000000000');

  let contractInstance;
  beforeEach(async () => {
    contractInstance = await DonationContract.new({
      from: alice,
    });
  });

  context('test DonationContract', () => {
    it('should be able to donate', async () => {
      await contractInstance.donate({ from: bob, value: ONE });
      const donate = await contractInstance.ownerToDonation(bob, { from: bob });

      expect(donate).bignumber.equal(ONE);
    });

    it('should not be able to withdraw donats for not owner', async () => {
      await contractInstance.donate({ from: bob, value: ONE });
      await expectRevert(
        contractInstance.withdraw(bob, { from: bob }),
        'Ownable: caller is not the owner',
      );
    });

    it('should be able to withdraw donats for owner', async () => {
      const ownerBalanceBefore = await web3.eth.getBalance(cale);
      await contractInstance.donate({ from: bob, value: ONE });
      await contractInstance.withdraw(cale, { from: alice });
      const ownerBalanceAfter = await web3.eth.getBalance(cale);

      expect(ownerBalanceBefore).bignumber.equal(
        new BN(ownerBalanceAfter).sub(ONE),
      );
    });
  });
});
