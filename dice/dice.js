'use strict'
const seelejs = require('seele.js')
const SeelediceABI = "[{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"senders\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"creator\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"dice\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"inputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"diceNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"}]"
const ContractAddress = "0xedf195e667b32d036f2a73aa37153068fd090012"

// let client = new seelejs('117.50.20.218')
// let client = new seelejs()
// let client = new seelejs(document.domain+'/seelens')
let client
if (typeof document !== 'undefined' && document.domain){
    client = new seelejs(document.domain + '/seelens')
} else{
    client = new seelejs('117.50.20.218')
}

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

var getReceiptTask = function(data){
    errorTask(data)
    return client.sendSync("getReceiptByTxHash", data.txhash, data.abi)
}

var getTxTask = function(data){
    errorTask(data)
    return client.sendSync("getTransactionByHash", data)
}

var getBlockTask = function(data){
    errorTask(data)
    return client.sendSync("getBlock", data.blockHash || "", data.blockHeight || -1, false)
}

var errorTask = function(data){
    if (data instanceof Error){
        throw data
    }

    return data
}

class Dice{
    constructor(){
        this.ContractAddress = ContractAddress
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
              "To" : ContractAddress,
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
        client.getBalance(account, callbackFunction)
    }

    GetAccountNonce(account, callbackFunction) {
        client.getAccountNonce(account, callbackFunction)
    }

    GetHeight(callbackFunction) {
        client.getBlockHeight(callbackFunction)
    }

    GetReceipt(txHash, callbackFunction) {
        let Bettor, RollUnder, Bet, Roll, Payout, Event
        
        Promise.all([getReceiptTask({"txhash":txHash, "abi":SeelediceABI}), getTxTask(txHash)]).then(function(data){
            data.forEach(r => {
                errorTask(r)
                if (r.failed) {
                    console.log(r)
                    errorTask(new Error(r.result))
                }
            })
            let log = JSON.parse(data[0].logs[0])
            Event = log.Event
            Bettor = log.Args[0]
            RollUnder = log.Args[1]
            Roll = log.Args[2]
            if (Event === "winAction"){
                Payout = log.Args[3]
            }
            Bet = data[1].transaction.amount
            return {"blockHash":data[1].blockHash}
        }).then(getBlockTask).then(function(data){
            errorTask(data)
            callbackFunction({
                "Time":new Date(data.header.CreateTimestamp*1000),
                "Bettor":Bettor,
                "RollUnder":RollUnder,
                "Bet":Bet,
                "Roll":Roll,
                "Payout":Payout,
                "Event":Event,
            })
        }).catch(callbackFunction)
    }

    FilterBlockTx(height, callbackFunction){
        client.filterBlockTx(height, ContractAddress, "2", callbackFunction)
    }
}

module.exports = new Dice()
