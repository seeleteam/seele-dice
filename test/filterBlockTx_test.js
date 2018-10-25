const dice = require("../dice/dice")

dice.FilterBlockTx(6066, function(data){
    console.log("callback")
    console.log(data)

    if (data === "end"){
        console.log("fileter over")
    }

    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
