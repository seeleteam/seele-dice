const dice = require("../dice/dice")

dice.GetReceipt("0x239415713dc0b3fbb605e9784593a2b6b130c0498e470e5a82fd3f75823c850e", function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
