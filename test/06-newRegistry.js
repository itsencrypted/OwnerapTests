const truffleAssert = require('truffle-assertions');

const Ownerap = artifacts.require('Ownerap');

const {
    decimals,
    ether,
    addressZero,
    owner1,
    owner2,
    owner3,
    owner4,
    owner5,
    nonowner1,
    nonowner2,
    info1,
    info2
  } = require('./dataTest');


  contract('Ownerap', function() {

    let ownerap
  
    beforeEach('Owner1 adds Owner 2 + and Owner 2 setInfo info1', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1});
        await ownerap.addOwner(owner2);
        await ownerap.doApproval({from: owner1});
        await ownerap.doApproval({from: owner2});
        await ownerap.setInfo(info1, {from: owner2});
    })

    describe('checking pre-conditions', function () {

        it('check that current Registry is info1 ', async() => {
            var response = await ownerap.info();
            assert.equal(response, info1, 'Info1 was not properly registered by the owner');
        })

        it('confirm that quantOwners = 2 (owner1 & owner2)  ', async() => {
            var response = await ownerap.quantOwner();
            assert.equal(response, 2, 'number of Owners is different than 2');
        })

        it('confirm that minApproval = 1 ', async() => {
            var response = await ownerap.minApproval();
            assert.equal(response, 1, 'minApproval is different than 1');
        })
    })

        beforeEach('Info1 (owner1 & owner2) >> minApproval changed to 2', async () => {
            ownerap = await Ownerap.new();
            await ownerap.doApproval({from: owner1});
            await ownerap.addOwner(owner2);
            await ownerap.doApproval({from: owner1});
            await ownerap.doApproval({from: owner2});
            await ownerap.setInfo(info1, {from: owner2});
            await ownerap.doApproval({from: owner1});
            await ownerap.doApproval({from: owner2});
        })
    
        describe('Owners need 2 approvals to change Registry', function () {

        it('changeMinApproval to 2 ', async() => {
            await ownerap.changeMinApproval(2, {from: owner1})
            var response = await ownerap.minApproval();
            assert.equal(response, 2, 'minApproval is different than 2');
        })

        it('try to set info2 with only 1 approval and fail', async() => {
            await ownerap.changeMinApproval(2, {from: owner1})
            await ownerap.doApproval({from: owner2});
            await truffleAssert.reverts(ownerap.setInfo(info2, {from: owner2}));
        })

        it('Owner 2 set info2 with 2 approvals and succeeds', async() => {
            await ownerap.changeMinApproval(2, {from: owner1})
            await ownerap.doApproval({from: owner2});
            await ownerap.doApproval({from: owner1});
            await ownerap.setInfo(info2, {from: owner2});
            var response = await ownerap.info();
            assert.equal(response, info2, 'Registry is not info2');
        })

        it('Confirming that nonowner1 is NOT an Owner', async() => {
            var response = await ownerap.owner(nonowner1);
            assert.equal(response, false, 'Non-Owner is an Owner!');
        })

        it('!!!RED ALERT!!!: Non-Owner tries to set info2 with 2 approvals and succeeds', async() => {
            await ownerap.changeMinApproval(2, {from: owner1})
            await ownerap.doApproval({from: owner2});
            await ownerap.doApproval({from: owner1});
            await ownerap.setInfo(info2, {from: nonowner1});
            var response = await ownerap.info();
            assert.equal(response, info2, 'Registry is not info2');
        })
    })
})
