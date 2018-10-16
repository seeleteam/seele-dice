const dice = require("../dice/dice")

dice.GetBalance("0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", function(err, data){
    console.log("callback")
    if (err){
        console.log(err)
        console.log("callback Error")
        return
    }
    
    console.log(data)
    console.log("callback Success")
})
