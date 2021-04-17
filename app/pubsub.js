const PubNub=require('pubnub');


const credentials={
    publishKey:'pub-c-da71aafd-37e6-42b5-b0d5-ac5e86f1fb71',
    subscribeKey:'sub-c-ba5ec0d8-8ffd-11eb-9de7-3a1dcc291cdf',
    secretKey:'sec-c-NzE0MzliMTgtYzQ2Mi00YTdkLTk3MzUtYjQ0NmZjMTAxYzk5'
};

const CHANNELS={
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN',
    TRANSACTION:'TRANSACTION'
};

class PubSub{
    constructor({blockchain,transactionPool,wallet})
    {
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;
        this.pubnub=new PubNub(credentials);
        this.wallet = wallet;

        this.pubnub.subscribe({channels:Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());
    }

    listener (){
        return{
            message:messageObject=>{
                const {channel,message}=messageObject;

                console.log(`Message received. Channel ${channel}.Message ${message}`)
                const parsedMessage = JSON.parse(message);

                switch(channel){
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage,true,()=>{
                            this.transactionPool.clearBlockchainTransactions({
                                chain:parsedMessage
                            });
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                            inputAddress:this.wallet.publicKey
                        })) {
                            this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                    default:
                        return;
                }                
            }
        };
    }

    publish({channel,message}){
        // this.pubnub.unsubscribe(channel,()=>{
        //     this.pubnub.publish({channel,message},()=>{
        //         this.pubnub.subscribe(channel);
        //     });
        // });  
        this.pubnub.publish({ message, channel });     
    }

    broadcastChain(){
        this.publish({
            channel:CHANNELS.BLOCKCHAIN,
            message:JSON.stringify( this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction){
        this.publish({
            channel:CHANNELS.TRANSACTION,
            message:JSON.stringify(transaction)
        });
    }
}

//testing code
// const testPubSub=new PubSub();
// testPubSub.publish({channel:CHANNELS.TEST,message:'hello pubnub'});

module.exports=PubSub;