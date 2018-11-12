const dice = require("../dice/dice2")
const keypair = {"PublicKey":"0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", "PrivateKey":"0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48"}
const args = {"RollUnder":50, "Payout":111, "Bet": 100000000, "GasPrice":2, "GasLimit":200000}

// console.log(a.Properties)
// let croupier = a.GetCroupier().croupier
// console.log(croupier)
// console.log(a.GetOwner().owner)
// console.log(a.GetMaxProfit())
// console.log(a.GetLockedInBets())
// console.log(a.GetDiceWinAmount(100000000, 50))
dice.Roll(keypair, args).then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})
// a.GetReceipt('0xcf2a4a9f48f0e19b532a2df3ecb3080f10b9ca93a1d3d3768518d1ee4d26a5ff',100000000)