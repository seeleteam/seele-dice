'use strict'
const seelejs = require('seele.js')
const SeelediceABI = "[{\"constant\":true,\"inputs\":[],\"name\":\"creator\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"dice\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"senders\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"
const contractAddress = "0x3a9d33113491f164cd6f4be582529643127a0002"

// client = new seelejs('106.75.118.187')
let client = new seelejs()

var generatePayloadTask = function(data){
    errorTask(data)
	return client.sendSync("generatePayload", SeelediceABI, "dice", data)
}

var getAccountNonceTask = function(data){
    errorTask(data)
    return client.sendSync("getAccountNonce", data)
}

var sendtxTask = function(data){
    errorTask(data)
    return client.sendSync("addTx", data)
}

var errorTask = function(data){
    if (data instanceof Error){
        console.log(data)
        throw data
    }

    return data
}

class Dice{
    constructor(){

    }

    Sendtx(keypair, args, callbackFunction) {
      var hash = ""
      Promise.all([generatePayloadTask([args.RollUnder.toString(), args.Payout.toString()]), getAccountNonceTask(keypair.PublicKey)]).then(function(data){
          data.forEach(r => {
              errorTask(r)
          })
          let payload = data[0], nonce = data[1]
          
          var rawTx = {
              "From" : keypair.PublicKey,
              "To" : contractAddress,
              "Amount" : args.Bet || 0,
              "AccountNonce" : nonce,
              "GasPrice":args.GasPrice || 1,
              "GasLimit":args.GasLimit || 3000000,
              "Timestamp":0,
              "Payload": payload
          }
          return client.generateTx(keypair.PrivateKey, rawTx)
      }).then(function(data){
          errorTask(data)
          hash = data.Hash
          console.log(data)
          return data
      }).then(sendtxTask).then(function(data){
          errorTask(data)
          if (data){
              callbackFunction(hash)
              return
          }
          
          throw new Error(data)
      }).catch(callbackFunction)
    }

    GetBalance(account, callbackFunction) {
        if (!account){
            client.getBalance(contractAddress, callbackFunction)
            return 
        }
        client.getBalance(account, callbackFunction)
    }

    GetAccountNonce(account, callbackFunction) {
        client.getAccountNonce(account, callbackFunction)
    }
}

module.exports = new Dice()
