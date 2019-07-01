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
  
    beforeEach('Owner1 does one approval', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1})
    })
        
    describe('check Approval - Owner1', function () {

        it('Owner1 did 1 approval', async() => {
            var response = await ownerap.checkApproval(owner1)
            assert.equal(response, true, 'Owner did not approve')  
        })

        it('arrayApproval shows Owner1 address at index 1', async() => {
            var response = await ownerap.arrayApproval(1);
            assert.equal(response, owner1, 'Owner is not the address on index 1')
        }) 
        
        /*it('listApproval displays owner at index 1 and nothing else', async() => {
            var response = await ownerap.listApproval();
            console.log(length.listApproval);
            assert.equal(response, 'listApproval is not showing the expected response')
        })*/

        it('mapApproval displays Owner1 address at index 1', async() => {
            var response = await ownerap.mapApproval(owner1);
            assert.equal(response, 1, 'Owner is not on the map as index 1');
        })

        it('Owner1 can setInfo with info1 in it ', async() => {
            await ownerap.setInfo(info1, {from: owner1});
            var response = await ownerap.info();
            assert.equal(response, info1, 'Info1 was not properly registered by the owner');
        })

        it('!!!RED ALERT!!!: nonOwner1 can setInfo with info1 in case there is a min Approval', async() => {
            await ownerap.setInfo(info1,{from: nonowner1 });
            var response = await ownerap.info();
            assert.equal(response, info1, 'Info1 was not properly registered by the owner')
        })

        it('Owner is able to cancel approval', async() => {
            await ownerap.cancelApproval({from: owner1});
            var response = await ownerap.checkApproval(owner1);
            assert.equal(response, false, 'Owner could not cancel approval')  
        })

        it('Owner is UNABLE to change minApproval from 1 to 2 if there is only 1 owner', async() => {
            await truffleAssert.reverts(ownerap.changeMinApproval(2,{from: owner1 }))
        })
  
    });
})