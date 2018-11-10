const seelejs = require('seele.js')
const fs = require('fs')
const client = new seelejs('http://117.50.20.218:8037')

client.getBalance("0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451")

client.getAccountNonce("0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451", function(err, result){
	if (err){
		throw err
	}

	var accountNonce = result
	var rawTx = {
		"From" : "0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451",
		"To" : "0x0000000000000000000000000000000000000000",
		"Amount" : 50000000000,
		"AccountNonce" : accountNonce,
		"GasPrice":1,
		"GasLimit":3000000,
		"Timestamp":0,
		"Payload": fs.readFileSync('../contract/SeeleDice2/SeeleDice2.Bytecode').toString()
	}
	
    var tx = client.generateTx("0xb60fdfccc1b83d483b0f7c64ee44a84bef998523de6c68d12db94a3fb917842c", rawTx)
	console.log(tx);

	client.addTx(tx, function(err, result){
		if (err){
			console.log(err)
			return 
		}
		
		// hash : 0x2dfda44638180e283aa6bbd59e5f64f8a0af58761bb0650a18d9bcc2bc8cd00e
		console.log(result)
	})
})


// client.getInfo()
// client.getBalance("0x7c00f5a4312a6a3e458a07c2d650ce13c76b68b1")
