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
  
    beforeEach('Owner1 does one approval and adds Owner2', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1});
        await ownerap.addOwner(owner2);
        await ownerap.doApproval({from: owner1});
    })
        
    describe('checking pre-conditions', function () {

        it('owner1 did 1 approval', async() => {
            var response = await ownerap.checkApproval(owner1)
            assert.equal(response, true, 'Owner did not approve')
        })

        it('countApproval equals 2 >> owner1 approved 2 times', async() => {
            var response = await ownerap.countApproval()
            assert.equal(response, 2, 'Owner1 did not approve 2 times')
        })
    });

    beforeEach('Owner1 adds Owner 2 and they both do 1 approval each', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1});
        await ownerap.addOwner(owner2);
        await ownerap.doApproval({from: owner1});
        await ownerap.doApproval({from: owner2});
    })

    describe('Owner1 adds Owner 2 and they both do 1 approval each', function () {


        it('owner2 & owner1 did 1 approval each', async() => {
            var response = await ownerap.countApproval()
            assert.equal(response, 2, 'Owner2 did not approve')
        })

        it('arrayApproval shows owner2 address at index 2', async() => {
            var response = await ownerap.arrayApproval(2);
            assert.equal(response, owner2, 'Owner2 is not the address on index 2')
        }) 
        

        it('mapApproval displays owner1 address at index 1', async() => {
            var response = await ownerap.mapApproval(owner1);
            assert.equal(response, 1, 'Owner is not on the map as index 1');
        })

        it('mapApproval displays owner2 address at index 2', async() => {
            var response = await ownerap.mapApproval(owner2);
            assert.equal(response, 2, 'Owner2 is not on the map as index 2');
        })

        it('Owner2 is able to cancel its own approval', async() => {
            await ownerap.cancelApproval({from: owner2});
            var response = await ownerap.checkApproval(owner2);
            assert.equal(response, false, 'Owner could not cancel approval')  
        })

        it('Owner is ABLE to change minApproval from 1 to 2 if there are 2 owners', async() => {
            await ownerap.changeMinApproval(2,{from: owner1 });
            var response = await ownerap.minApproval();
            assert.equal(response, 2, 'Min Approval was not raised to 2')  
        })

        it('Non-Owner is NOT ABLE to change minApproval from 1 to 2 if there are 2 owners', async() => {
            await truffleAssert.reverts(ownerap.changeMinApproval(2, {from: nonowner1 }));
        })

        it('Owner is NOT ABLE to change minApproval from 2 to 3 if there are 2 owners', async() => {
            await truffleAssert.reverts(ownerap.changeMinApproval(3, {from: owner1 }));
        })
    })
    
})