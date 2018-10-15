const seelejs = require('seele.js')
const SeelediceABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"creator\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"dice\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"senders\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"


// client = new seelejs('106.75.118.187')
client = new seelejs()

client.getReceiptByTxHash("0xe3a0769a33c5da47f5442e168986e88e06bee1954e661f19df937cb863201bcc", function(err, receipt){
	if (err){
		console.log(err)
		return 
	}
	console.log(receipt)

	// 0xedf195e667b32d036f2a73aa37153068fd090012
	var contractAddress = receipt.contract
	console.log(contractAddress)
	
	client.generatePayload(SeelediceABI, "dice", ["50", "100"], function(err, payload){
		if (err){
			console.log(err)
			return 
		}

		console.log(payload)

		client.getAccountNonce("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", function(err, nonce){
			if (err){
				console.log(err)
				return 
			}
	
			console.log(nonce)
			var rawTx = {
				"From" : "0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1",
				"To" : contractAddress,
				"Amount" : 50,
				"AccountNonce" : nonce,
				"GasPrice":1,
				"GasLimit":500000,
				"Timestamp":0,
				"Payload": payload
			}
			var tx = client.generateTx("0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48", rawTx)
			console.log(tx);
			client.addTx(tx, function(err, result){
				if (err){
					console.log(err)
					return 
				}
				
				// hash : 0x5ca0cd4235eac3a77463150cbddee3f28d6da326104de0a2cd41e60028d262e7
				console.log(result)
			})
		})
	
	
	})
})



/**
	 A Player
	.\client.exe key --shard 1
	public key:  0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1
	private key: 0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48
*/
//client.getBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1")