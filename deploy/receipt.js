const seelejs = require('seele.js')

// client = new seelejs('106.75.118.187')
client = new seelejs()

client.getReceiptByTxHash("0x5ca0cd4235eac3a77463150cbddee3f28d6da326104de0a2cd41e60028d262e7", function(err, receipt){
	if (err){
		console.log(err)
		return 
	}
    console.log(receipt)


    // client.getLogs(-1, "0xedf195e667b32d036f2a73aa37153068fd090012", "0x655dc916988b3746402901627e8485408dccba300f8396bcc750826ca9a92182")
})

// client.getTransactionByHash("0x5ca0cd4235eac3a77463150cbddee3f28d6da326104de0a2cd41e60028d262e7", function(err, tx){
// 	if (err){
// 		console.log(err)
// 		return 
// 	}
//     console.log(tx)


//     client.getLogs(tx.blockHeight, "0xedf195e667b32d036f2a73aa37153068fd090012", "0x655dc916988b3746402901627e8485408dccba300f8396bcc750826ca9a92182")
// })