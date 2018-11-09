'use strict'
const seelejs = require('seele.js')
const fs = require('fs')
const ContractAddress = "0x1530970beb222c02a6a7c23aff6b7ba0372d0002"

let client = new seelejs('117.50.20.218')
// let client = new seelejs()
// let client = new seelejs(document.domain+'/seelens')
var generatePayloadTask = function(data){
    errorTask(data)
	return client.sendSync("generatePayload", SeelediceABI, "dice", data)
}

class Dice2{
    constructor(){
        this.ContractAddress = ContractAddress
        let data = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.ABI')
        this.SeelediceABI = data.toString()
    }

    GetCroupier(){
        let self = this;
        return client.sendSync("generatePayload", self.SeelediceABI, "croupier", []).then(payload =>{
            console.log(payload)
            return client.sendSync("call", self.ContractAddress, payload, -1)
        })
    }
}

module.exports = new Dice2()

let a = new Dice2()
a.GetCroupier().then(data=>{
    console.log(data)
})