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
  
    beforeEach('Owner1 adds a new Owner - Owner3', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1});
        await ownerap.addOwner(owner3);
        await ownerap.doApproval({from: owner3});
    })
        
    describe('Deleting Owners', function () {

        it('Non-Owner1 tries to add Owner4 and fails ', async() => {
            await truffleAssert.reverts(ownerap.addOwner(owner4, {from: nonowner1}));
        });

        it('Owner3 can delete Owner1 ', async() => {
            await ownerap.delOwner(owner1, {from: owner3});
            var response = await ownerap.owner(owner1);
            assert.equal(response, false, 'Owner 3 could NOT delete Owner 1') 
        }); 
        
        it('Non-Owner1 tries to delete Owner3 and fails ', async() => {
            await truffleAssert.reverts(ownerap.delOwner(owner3, {from: nonowner1})); 
        });  
    });

})