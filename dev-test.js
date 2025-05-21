// Copyright (c) 2025 Shattek-T. All rights reserved.
// // const Block = require('./blockchain/block');
// //
// // // const block = new Block('2025', Block.genesis().hash, 'bar', 'GREAT');
// // // console.log(block.toString());
// // // console.log(Block.genesis().toString());
// //
// // const funBlock = Block.mineBlock(Block.genesis(), 'Fun');
// // console.log(funBlock.toString());
//
// const Blockchain = require('./blockchain');
//
// const bc = new Blockchain();
//
// for(let i=0; i<10; i++){
//     console.log(bc.addBlock(`fuck ${i}`).toString());
// }

const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());