const dice = require("../dice/dice")

dice.GetReceipt("0x9aa41b4a70b553150368c6cbe7c007dfabc4b0ac942a848ffb42521fb0d13772", function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
