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
  
    beforeEach('Owner1 adds Owner2', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1});
        await ownerap.addOwner(owner2);
    })
        
    describe('Owner1 adds a new Owner (Owner2)', function () {

        it('owner1 can addOwner >> owner2  ', async() => {
            var response = await ownerap.owner(owner2);
            assert.equal(response, true, 'owner2 was not properly added by the owner');
        })

        it('once owner2 is added countApproval goes back to zero ', async() => {
            var response = await ownerap.countApproval();
            assert.equal(response, 0, 'countApproval is different than zero');
        })

        it('owner2 can do an Approval ', async() => {
            await ownerap.doApproval({from: owner2});
            var response = await ownerap.countApproval();
            assert.equal(response, 1, 'Owner2 was not able to approve');
        })


        it('Owner2 is on index 1 of the Approval array', async() => {
            await ownerap.doApproval({from: owner2});
            var response = await ownerap.checkApproval(owner2);
            assert.equal(response, 1, 'Owner2 did not approve');
        })

        it('Owner1 also approves and goes to index 2 of the Approval array', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.doApproval({from: owner1});
            var response = await ownerap.checkApproval(owner1);
            assert.equal(response, 2, 'Owner1 did not approve');
        })

        it('quantOwner is now 2 (owner1 & owner2)  ', async() => {
            var response = await ownerap.quantOwner();
            assert.equal(response, 2, 'number of Owners is different than 2');
        })
        
    });

    describe('Owner3 is Added by Owner2', function () {

        it('owner2 can addOwner >> owner3  ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner3, {from: owner2});
            var response = await ownerap.owner(owner3);
            assert.equal(response, true, 'owner3 was not properly added by the owner');
        });

        it('once owner3 is added countApproval goes back to zero ', async() => {
            var response = await ownerap.countApproval();
            assert.equal(response, 0, 'countApproval is different than zero');
        })

        it('owner3 can do an Approval ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner3, {from: owner2});
            await ownerap.doApproval({from: owner3});
            var response = await ownerap.countApproval();
            assert.equal(response, 1, 'Owner3 was not able to approve');
        })
    });

    describe('Owner4 is Added by Owner2', function () {

        it('owner2 can addOwner >> owner4  ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner4, {from: owner2});
            var response = await ownerap.owner(owner4);
            assert.equal(response, true, 'owner4 was not properly added by the owner');
        });

        it('once owner4 is added countApproval goes back to zero ', async() => {
            var response = await ownerap.countApproval();
            assert.equal(response, 0, 'countApproval is different than zero');
        })

        it('owner4 can do an Approval ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner4, {from: owner2});
            await ownerap.doApproval({from: owner4});
            var response = await ownerap.countApproval();
            assert.equal(response, 1, 'Owner4 was not able to approve');
        })
    });

    describe('Owner5 is Added by Owner2', function () {

        it('owner2 can addOwner >> owner5  ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner5, {from: owner2});
            var response = await ownerap.owner(owner5);
            assert.equal(response, true, 'owner5 was not properly added by the owner');
        });

        it('once owner5 is added countApproval goes back to zero ', async() => {
            var response = await ownerap.countApproval();
            assert.equal(response, 0, 'countApproval is different than zero');
        })

        it('owner5 can do an Approval ', async() => {
            await ownerap.doApproval({from: owner2});
            await ownerap.addOwner(owner5, {from: owner2});
            await ownerap.doApproval({from: owner5});
            var response = await ownerap.countApproval();
            assert.equal(response, 1, 'Owner4 was not able to approve');
        })
    });

    describe('Non-Owners cannot add new Owners', function () {

        it('nonowner1 cannot addOwner >> owner5  ', async() => {
            await ownerap.doApproval({from: owner2});
            await truffleAssert.reverts(ownerap.addOwner(owner5, {from: nonowner1 }))
        });

        it('nonowner2 cannot addOwner >> owner3  ', async() => {
            await ownerap.doApproval({from: owner2});
            await truffleAssert.reverts(ownerap.addOwner(owner3, {from: nonowner2 }))
        });

    });

})