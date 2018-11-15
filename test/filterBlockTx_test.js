const dice = require("../dice/dice2")

dice.GetHeight().then(height => {
    dice.filterBlockTx(height, '2', dice.ContractAddress, console.log)
}).catch(err => {console.log(err)})
