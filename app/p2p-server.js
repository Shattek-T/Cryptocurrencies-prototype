// Copyright (c) 2025 Shattek-T. All rights reserved.
const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev-app

class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening on peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
           // ws://localhost:5001
           const socket = new Websocket(peer);

           socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log(`Socket connected on: ${socket}`);

        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', message => {
           const data = JSON.parse(message);
           // console.log('data', data);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}

module.exports = P2pServer;
