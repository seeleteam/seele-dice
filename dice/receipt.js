const seelejs = require('seele.js')
const client = new seelejs()
const SeelediceABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"creator\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"dice\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"senders\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"
// client = new seelejs('106.75.118.187')

client.getBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1")

client.getReceiptByTxHash("0x4d9b4c615081c7dc755cbb5b5e2ac0560c765a17312796a22d49a45c468cad3c", SeelediceABI, function(err, receipt){
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