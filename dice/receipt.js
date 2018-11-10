const seelejs = require('seele.js')
const SeelediceABI = "[{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"senders\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"creator\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"dice\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"
const client = new seelejs('117.50.20.218')
// const client = new seelejs()

// client.getBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1")

client.getReceiptByTxHash("0x1f61eca441878dd631a7e734bd0e25a96979d1f9f8fc12fc12f397c7c4fe62a3", SeelediceABI, function(err, receipt){
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