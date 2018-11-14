const c = require('../../rand/randClient')

c.GetRand().then(data => {
    console.log('data')
    console.log(data)
}).catch(err => {
    console.log('err')
    console.log(err)
})

// c.SettleBet({'commit' : '0x831ff3a0d17302359a6a9cc1b26c708777db93bc15ea5ec571eee3f8cfb116f3', 'txHash' : '0x6bd6586db69bbafad1b948942e40b14cf507aa70aa94f60c765fd3e9931e69b7'}).then(data => {
//     console.log('data')
//     console.log(data)
// }).catch(err => {
//     console.log('err')
//     console.log(err)
// })