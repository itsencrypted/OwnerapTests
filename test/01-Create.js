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
  
    beforeEach('setup for each test', async () => {
        ownerap = await Ownerap.new()
    })

    describe('Create - owner', function () {
        it('check if creator is owner at create', async() => {         
            var response = await ownerap.quantOwner()
            assert.equal(response, 1, 'owner is not 1')
        }) 

        //O que mais deve ser verificado com o owner na criação do contrato?

        it('check that Registry is empty at create', async() => {           
            var response = await ownerap.info()
            assert.equal(response, "", 'Registry is not empty at create')
        })
    });
   
    describe('Create - quant', function () {
        it('check if minApproval = 1 at create', async() => {
            var response = await ownerap.minApproval()
            assert.equal(response, 1, 'minApproval is wrong at create')            
        })
        
        it('check if quantOwner = 1 at create', async() => {  
            var response = await ownerap.owner(owner1)
            assert.equal(response, true, 'owner is wrong at create')       
        })

        it('check if countApproval = 0 at create', async() => {
            var response = await ownerap.countApproval()
            assert.equal(response, 0, 'countApproval is not zero at create')            
        })
    });    

    describe('Approval', function () {

        it('owner1 can approve', async() => {
            await ownerap.doApproval({from: owner1})
            var response = await ownerap.checkApproval(owner1)
            assert.equal(response, true, 'Owner can approve at create')  
        })

        it('nononwer1 cannot doApproval', async() => {
            await truffleAssert.reverts(ownerap.doApproval({from: nonowner1 }))
        })        
        
    });
})