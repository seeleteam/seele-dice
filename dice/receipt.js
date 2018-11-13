const seelejs = require('seele.js')
const fs = require('fs')
const client = new seelejs('http://117.50.20.218:8037')
// const client = new seelejs()

// client.getBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1")
let SeelediceABI = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.ABI').toString()
client.getReceiptByTxHash("0x9822ed6412f1586646163700608054628715640e8c7564598c83a9b7b07cc20c", SeelediceABI).then(data =>{
    console.log("data!")
    console.log(data)
}).catch(err => {
    console.log("err?")
    console.log(err)
})

// client.getTransactionByHash("0x5ca0cd4235eac3a77463150cbddee3f28d6da326104de0a2cd41e60028d262e7", function(err, tx){
// 	if (err){
// 		console.log(err)
// 		return 
// 	}
//     console.log(tx)


//     client.getLogs(tx.blockHeight, "0xedf195e667b32d036f2a73aa37153068fd090012", "0x655dc916988b3746402901627e8485408dccba300f8396bcc750826ca9a92182")
// })