const dice = require("../dice/dice")

dice.GetReceipt("0xb829a9da8be78402db686a44355fa43ebc60366f8394517102a35973e4d9aa78", function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
