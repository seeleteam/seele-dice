const dice = require("../dice/dice")

dice.GetBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", function(err, data){
    console.log("callback")
    console.log(data)
    if (err){
        console.log("callback Error")
        return
    }
    console.log("callback Success")
})
