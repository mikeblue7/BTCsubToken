const BTCsubToken = artifacts.require('BTCsubToken');
// 'BTCsub', 'BSU', 18
const TOTAL_SUPPLY = 1000000000;

contract('BTCsubToken', function (accounts) {
    var token;
    const OWNER = accounts[0];
    const RECIPIENT = accounts[1];
    const USER = accounts[2];

    beforeEach(function () {
        return BTCsubToken.deployed().then(function (instance) {
            token = instance;
        });
    });


    it('has a name', function () {
        return token.name().then(function (_name) {
            assert.equal(_name.toString(), 'BTCsub', "Wrong Token name");
        })
    });

    it('has a symbol', async function () {
        return token.symbol().then(function (_symbol) {
            assert.equal(_symbol.toString(), 'BSU', "Wrong Token symbol");
        })
    });

    it('has 18 decimals', async function () {
        return token.decimals().then(function (_decimals) {
            assert.equal(_decimals.toString(), '18', "Wrong Token decimals");
        })
    });

    it('assigns the initial total supply to the creator', async function () {

        return token.totalSupply().then(function (_supply) {
            var total;
            assert.equal(_supply.toString(), TOTAL_SUPPLY.toString(), "Wrong total supply");
            total = _supply.toString();
            return token.balanceOf(OWNER).then(function (balance) {
                assert.equal(balance.toString(), total, "Wrong balance");
            })
        })
    });

    it('Check transfer and balances', async function () {

        var ownerBalance = await token.balanceOf(OWNER);
        var recipientBalance = await token.balanceOf(RECIPIENT);

        assert.equal(ownerBalance, TOTAL_SUPPLY, "Owner balance is not total supply");
        assert.equal(recipientBalance, 0, "Recipient balance is not 0");


        var transfer = await token.transfer(RECIPIENT, 1000000, { from: OWNER }); // 1M

        assert.equal(transfer.logs[0].event, "Transfer", "Did not emit Transfer Event");

        var ownerBalance = await token.balanceOf(OWNER);
        var recipientBalance = await token.balanceOf(RECIPIENT);

        assert.equal(ownerBalance, TOTAL_SUPPLY - 1000000, "Owner balance is not total supply - 1M");
        assert.equal(recipientBalance, 1000000, "Recipient balance is not 1M");

    });

    it('Check approvals and balances and tranferFrom', async function () {

        var recipientAllowance = await token.allowance(OWNER, RECIPIENT);
        
        assert.equal(recipientAllowance, 0, "Allowance is not 0");


        // this will throw error if amount != 0
        try {
            var approve = await token.approve(RECIPIENT, 100);

        }
        catch{
            console.log("THROW ERROR");
        }

        var approve = await token.approve(RECIPIENT, 0);
        assert.equal(approve.logs[0].event, "Approval", "Approve event not emitted");
        var recipientAllowance = await token.allowance(OWNER, RECIPIENT);
        assert.equal(recipientAllowance, 0, "Allowance is not 0");


        var increaseAllowance = await token.increaseAllowance(RECIPIENT, 1000);
        assert.equal(increaseAllowance.logs[0].event, "Approval", "Approve event not emitted");
        var recipientAllowance = await token.allowance(OWNER, RECIPIENT);
        assert.equal(recipientAllowance, 1000, "Allowance is not 1000");


        var decreaseAllowance = await token.decreaseAllowance(RECIPIENT, 500);
        assert.equal(decreaseAllowance.logs[0].event, "Approval", "Approve event not emitted");
        var recipientAllowance = await token.allowance(OWNER, RECIPIENT);
        assert.equal(recipientAllowance, 500, "Allowance is not 500");

        var transferFrom = await token.transferFrom(OWNER, USER, 250, { from: RECIPIENT });
        assert.equal(transferFrom.logs[0].event, "Transfer", "Transfer event not emitted");

        var ownerBalance = await token.balanceOf(OWNER);
        var recipientBalance = await token.balanceOf(RECIPIENT);
        var userBalance = await token.balanceOf(USER);
        var recipientAllowance = await token.allowance(OWNER, RECIPIENT);
        assert.equal(ownerBalance, TOTAL_SUPPLY - 1000000 - 250, "Owner balance is not total supply - 1M - 250");
        assert.equal(recipientBalance, 1000000, "Recipient balance is not 1M");
        assert.equal(userBalance, 250, "User balance is not 250");
        assert.equal(recipientAllowance, 250, "Allowance is not 250");

    });

});