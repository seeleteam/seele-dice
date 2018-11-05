const dice = require("../dice/dice")

dice.GetReceipt("0xc6d83fb560857b346bfa6cc2a789c3cfc19b8dc9f264dc9bdd7c31a28d435df6", function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
