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
  
    beforeEach('Owner1 registers info1 in the system', async () => {
        ownerap = await Ownerap.new();
        await ownerap.doApproval({from: owner1})
        await ownerap.setInfo(info1)
    })
        
    describe('Owner1 registers info1', function () {


        it('owner1 can setInfo with info1 in it ', async() => {
            var response = await ownerap.info();
            assert.equal(response, info1, 'Info1 was not properly registered by the owner');
        })

        it('countApproval goes back to zero after registry is done', async() => {
            var response = await ownerap.countApproval();
            assert.equal(response, 0, 'Count Approval is different than zero');
        })

        it('checkApproval goes back to zero for owner1 after registry is done', async() => {
            var response = await ownerap.checkApproval(owner1);
            assert.equal(response, 0, 'Count Approval is different than zero');
        })

        it('last information stored is still Informacao 1 ', async() => {
            var response = await ownerap.info();
            assert.equal(response, info1, 'Informacao 1 is not the message displaying');
        })
        
    });
}) 