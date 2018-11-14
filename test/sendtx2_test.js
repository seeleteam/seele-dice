const dice = require("../dice/dice2")
const keypair = {"PublicKey":"0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", "PrivateKey":"0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48"}
const args = {"RollUnder":50, "Payout":111, "Bet": 100000000, "GasPrice":2, "GasLimit":200000}

// console.log(dice)
// console.log(dice.Properties)
// let croupier = dice.GetCroupier().croupier
// console.log(croupier)
// console.log(dice.GetOwner().owner)
// console.log(dice.GetMaxProfit())
// console.log(dice.GetLockedInBets())
// console.log(dice.GetDiceWinAmount(1000000, 5))
// console.log(dice.GetBalance(keypair.PublicKey))
// console.log(dice.GetAccountNonce(keypair.PublicKey))
// console.log(dice.GetHeight())
// dice.Roll(keypair, args).then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err)
// })
dice.GetReceipt('0xb018586ea56a00b3ad541800e2c86d351421451793ff2748a5c3bfe2653598a1').then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})
// dice.filterBlockTx(console.log)
// console.log(dice.GetRegistrations())
// dice.Register().then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err)
// })
// console.log(dice.GetBalance('0xa9db3e978b38ec10235e8cc841941720bab75941'))
// let content = {'123':312}
// console.log(content)
// content['asdf'] = 123
// console.log(content)
// console.log(content['123'])
// console.log(content['asdf'])

