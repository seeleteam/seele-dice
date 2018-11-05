const dice = require("../dice/dice")

dice.GetAccountNonce("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
