const dice = require("../dice/dice")

var keypair = {"PublicKey":"0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", "PrivateKey":"0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48"}
var args = {"RollUnder":90, "Payout":90, "Bet": 100, "GasPrice":2, "GasLimit":200000}
dice.Sendtx(keypair, args, function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    console.log("callback Success")
})
