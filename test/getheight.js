const dice = require("../dice/dice")

dice.GetHeight(function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
