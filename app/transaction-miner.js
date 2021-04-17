const Transaction=require('../wallet/transaction');

class TransactionMiner{
    constructor({blockchain,transactionPool,wallet,pubsub}){
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.wallet=wallet;
        this.pubsub=pubsub;
    }
    mineTransactions(){
        //get the transaction pool's valid transactions

        //generate miner's reward

        //add a block consisting of these transactions to the blockchain

        //broadcast the updated blockchain

        //clear the pool

        const validTransactions=this.transactionPool.validTransactions();
        validTransactions.push(
            Transaction.rewardTransaction({minerWallet:this.wallet})
        );

        this.blockchain.addBlock({data:validTransactions});

        this.pubsub.broadcastChain();

        this.transactionPool.clear();
    }

}

module.exports=TransactionMiner;