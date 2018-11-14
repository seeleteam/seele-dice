const seelejs = require('seele.js')
const client = new seelejs('http://117.50.20.218:8037')


// destory
client.getAccountNonce("0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451").then(result =>{
	var accountNonce = result
	var rawTx = {
		"From" : "0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451",
		"To" : "0xe4dd3e388b2420a452007ab711a0f694133e0012",
		"Amount" : 0,
		"AccountNonce" : accountNonce,
		"GasPrice":1,
		"GasLimit":3000000,
		"Timestamp":0,
		"Payload": '0x6bdebcc9'
		
	}
	
    var tx = client.generateTx("0xb60fdfccc1b83d483b0f7c64ee44a84bef998523de6c68d12db94a3fb917842c", rawTx)
	console.log(tx);

	return client.addTx(tx)
}).then(result =>{
	console.log(result)
}).catch(err =>{console.log(err)})