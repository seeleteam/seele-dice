'use strict'
const seelejs = require('seele.js')
const randClient = require('../rand/randClient')
const BigNumber = require('bignumber.js');
// const fs = require('fs')
// SeeleDice2ABI is the input ABI used to generate the binding from.
const SeeleDice2ABI = "[{\"constant\":false,\"inputs\":[{\"name\":\"registrant\",\"type\":\"address\"}],\"name\":\"register\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"registrations\",\"outputs\":[{\"name\":\"\",\"type\":\"uint8\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"croupier\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"destory\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"rollUnder\",\"type\":\"uint8\"},{\"name\":\"commit\",\"type\":\"bytes32\"},{\"name\":\"r\",\"type\":\"bytes32\"},{\"name\":\"s\",\"type\":\"bytes32\"},{\"name\":\"v\",\"type\":\"uint8\"}],\"name\":\"placeBet\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"maxProfit\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"beneficiary\",\"type\":\"address\"},{\"name\":\"withdrawAmount\",\"type\":\"uint256\"}],\"name\":\"withdrawFunds\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"amount\",\"type\":\"uint256\"},{\"name\":\"rollUnder\",\"type\":\"uint8\"}],\"name\":\"getDiceWinAmount\",\"outputs\":[{\"name\":\"winAmount\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"pure\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"lockedInBets\",\"outputs\":[{\"name\":\"\",\"type\":\"uint128\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"reveal\",\"type\":\"bytes\"},{\"name\":\"blockHash\",\"type\":\"bytes32\"}],\"name\":\"settleBet\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"newCroupier\",\"type\":\"address\"}],\"name\":\"setCroupier\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_maxProfit\",\"type\":\"uint256\"}],\"name\":\"setMaxProfit\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"c\",\"type\":\"address\"}],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"constructor\"},{\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"FailedPayment\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"Payment\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"rollUnder\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"bet\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"}],\"name\":\"lossAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"rollUnder\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"bet\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"randNumber\",\"type\":\"uint256\"},{\"indexed\":false,\"name\":\"winValue\",\"type\":\"uint256\"}],\"name\":\"winAction\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"FailedRegisterPayment\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"beneficiary\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"RegisterPayment\",\"type\":\"event\"}]"
// SeeleDice2Bin is the compiled bytecode used for deploying new contracts.
const SeeleDice2Bin = `0x60806040819052635be7bd986000556001805460ff1916600a1790556020806113b4833981016040525160068054600160a060020a03191633179055600160a060020a038116151561004e5750335b60078054600160a060020a031916600160a060020a0383161790556005655af3107a4000046003555061132e806100866000396000f3006080604052600436106100c45763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416634420e48681146100c657806346ec06e5146100e75780636b5c5f39146101125780636bdebcc91461014357806377b7572c146101585780638da5cb5b14610178578063b539cd551461018d578063c1075329146101b4578063cb67284d146101d8578063df88126f146101f6578063e7c25c3514610230578063f8bb201c14610254578063fbd668a914610275575b005b3480156100d257600080fd5b506100c4600160a060020a036004351661028d565b3480156100f357600080fd5b506100fc6105b7565b6040805160ff9092168252519081900360200190f35b34801561011e57600080fd5b506101276105c0565b60408051600160a060020a039092168252519081900360200190f35b34801561014f57600080fd5b506100c46105cf565b6100c460ff600435811690602435906044359060643590608435166106f7565b34801561018457600080fd5b50610127610a56565b34801561019957600080fd5b506101a2610a65565b60408051918252519081900360200190f35b3480156101c057600080fd5b506100c4600160a060020a0360043516602435610a6b565b3480156101e457600080fd5b506101a260043560ff60243516610b7b565b34801561020257600080fd5b5061020b610cc2565b604080516fffffffffffffffffffffffffffffffff9092168252519081900360200190f35b34801561023c57600080fd5b506100c4602460048035828101929101359035610cda565b34801561026057600080fd5b506100c4600160a060020a0360043516611142565b34801561028157600080fd5b506100c46004356111d5565b600754600160a060020a03163314610315576040805160e560020a62461bcd02815260206004820152602c60248201527f4f6e6c7943726f7570696572206d6574686f64732063616c6c6564206279206e60448201527f6f6e2d63726f75706965722e0000000000000000000000000000000000000000606482015290519081900360840190fd5b5b600054620151800142106103415760008054620151800190556001805460ff1916600a179055610316565b600154600060ff909116116103a0576040805160e560020a62461bcd02815260206004820152601b60248201527f526567697374726174696f6e206973206f76657220746f646179210000000000604482015290519081900360640190fd5b600080548152600260209081526040808320600160a060020a038516845290915290205460ff1615610442576040805160e560020a62461bcd02815260206004820152602260248201527f596f75206861766520616c7265616479207265676973746572656420746f646160448201527f792e000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b3031624c4b4011156104c4576040805160e560020a62461bcd02815260206004820152602d60248201527f43616e6e6f74206166666f726420746f206c6f7365207468697320726567697360448201527f74726174696f6e20676966742e00000000000000000000000000000000000000606482015290519081900360840190fd5b604051600160a060020a03821690600090624c4b409082818181858883f1935050505015610571576001805460001960ff808316919091011660ff19918216178255600080548152600260209081526040808320600160a060020a0387168085529083529281902080549094169094179092558251624c4b408152925190927f12d723a84cc4db40e9b2d984a6c142ca55fec1806603f0206da5a54cd38d338492908290030190a26105b4565b60408051624c4b4081529051600160a060020a038316917f42c6470b2367e9f44055af970002eb44cd0809998efd4d40c6b48dcea8a4461e919081900360200190a25b50565b60015460ff1681565b600754600160a060020a031681565b600654600160a060020a03163314610633576040805160e560020a62461bcd02815260206004820152602660248201526000805160206112e383398151915260448201526000805160206112c3833981519152606482015290519081900360840190fd5b6004546fffffffffffffffffffffffffffffffff16156106e9576040805160e560020a62461bcd02815260206004820152604860248201527f416c6c20626574732073686f756c642062652070726f6365737365642028736560448201527f74746c6564206f7220726566756e64656429206265666f72652073656c662d6460648201527f657374727563742e000000000000000000000000000000000000000000000000608482015290519081900360a40190fd5b600654600160a060020a0316ff5b600084815260056020526040812080549091908190819015610789576040805160e560020a62461bcd02815260206004820152602160248201527f4265742073686f756c6420626520696e20612027636c65616e2720737461746560448201527f2e00000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b349250620f424083101580156107a4575064e8d4a510008311155b1515610820576040805160e560020a62461bcd02815260206004820152602d60248201527f4265742073686f756c642062652077697468696e2072616e67655b4d494e5f4260448201527f45542c204d41585f4245545d2e00000000000000000000000000000000000000606482015290519081900360840190fd5b849150600160ff8316116108355784601b0191505b60408051600080825260208083018085528c905260ff861683850152606083018b9052608083018a9052925160019360a0808501949193601f19840193928390039091019190865af115801561088f573d6000803e3d6000fd5b5050604051601f190151600754600160a060020a039081169116149050610900576040805160e560020a62461bcd02815260206004820152601d60248201527f4543445341207369676e6174757265206973206e6f742076616c69642e000000604482015290519081900360640190fd5b61090a838a610b7b565b6003549091508301811115610969576040805160e560020a62461bcd02815260206004820152601a60248201527f6d617850726f666974206c696d69742076696f6c6174696f6e2e000000000000604482015290519081900360640190fd5b600480546fffffffffffffffffffffffffffffffff1981166fffffffffffffffffffffffffffffffff9182168401821617918290553031911611156109f8576040805160e560020a62461bcd02815260206004820152601f60248201527f43616e6e6f74206166666f726420746f206c6f73652074686973206265742e00604482015290519081900360640190fd5b50508155600101805460ff191660ff969096169590951765ffffffffff0019166101004364ffffffffff16021779ffffffffffffffffffffffffffffffffffffffff0000000000001916336601000000000000021790945550505050565b600654600160a060020a031681565b60035481565b600654600160a060020a03163314610acf576040805160e560020a62461bcd02815260206004820152602660248201526000805160206112e383398151915260448201526000805160206112c3833981519152606482015290519081900360840190fd5b60045430316fffffffffffffffffffffffffffffffff90911682011115610b40576040805160e560020a62461bcd02815260206004820152601160248201527f4e6f7420656e6f7567682066756e64732e000000000000000000000000000000604482015290519081900360640190fd5b604051600160a060020a0383169082156108fc029083906000818181858888f19350505050158015610b76573d6000803e3d6000fd5b505050565b600080600560ff841610801590610b965750606060ff841611155b1515610c12576040805160e560020a62461bcd02815260206004820152603b60248201527f57696e2070726f626162696c697479206f7574206f662072616e67655b4d494e60448201527f5f524f4c4c554e4445522c204d41585f524f4c4c554e4445525d2e0000000000606482015290519081900360840190fd5b5060648304620f4240811015610c285750620f42405b83811115610ca6576040805160e560020a62461bcd02815260206004820152602260248201527f42657420646f65736e2774206576656e20636f76657220686f7573652065646760448201527f652e000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b60ff8316818503606402811515610cb957fe5b04949350505050565b6004546fffffffffffffffffffffffffffffffff1681565b60075460009081908190819081908190819081908190600160a060020a03163314610d75576040805160e560020a62461bcd02815260206004820152602c60248201527f4f6e6c7943726f7570696572206d6574686f64732063616c6c6564206279206e60448201527f6f6e2d63726f75706965722e0000000000000000000000000000000000000000606482015290519081900360840190fd5b8b8b604051808383808284376040805191909301819003902060008181526005602052929092206001810154929e509c505064ffffffffff61010090910416995050504388109050610e37576040805160e560020a62461bcd02815260206004820152603360248201527f736574746c6542657420696e207468652073616d6520626c6f636b206173207060448201527f6c6163654265742c206f72206265666f72652e00000000000000000000000000606482015290519081900360840190fd5b60fa8701431115610eb8576040805160e560020a62461bcd02815260206004820152602260248201527f426c6f636b686173682063616e2774206265207175657269656420627920455660448201527f4d2e000000000000000000000000000000000000000000000000000000000000606482015290519081900360840190fd5b86408a14610ec557600080fd5b8754600189015460008a5560405191975060ff8116965066010000000000009004600160a060020a031694508c908c908c90602001808484808284379091019283525050604080518083038152602092830191829052805190945090925082918401908083835b60208310610f4b5780518252601f199092019160209182019101610f2c565b5181516020939093036101000a60001901801990911692169190911790526040519201829003909120955060649250859150610f849050565b066001019150610f948686610b7b565b600480546fffffffffffffffffffffffffffffffff808216849003166fffffffffffffffffffffffffffffffff19909116179055905060ff85168210156110e157604051600160a060020a0385169082156108fc029083906000818181858888f193505050501561104357604080518281529051600160a060020a038616917fd4f43975feb89f48dd30cabbb32011045be187d1e11c8ea9faa43efc35282519919081900360200190a2611083565b604080518281529051600160a060020a038616917fac464fe4d3a86b9121261ac0a01dd981bfe0777c7c9d9c8f4473d31a9c0f9d2d919081900360200190a25b60408051600160a060020a038616815260ff87166020820152808201889052606081018490526080810183905290517f5bbb901653d2d40c1d3da70243e850189c93a6b8df13ea4c6358ecb43bcd2f9d9181900360a00190a1611134565b60408051600160a060020a038616815260ff871660208201528082018890526060810184905290517f1dd06eecd9186ada4c96d5c20a65902e11116d813ec37bf3d8162edfba011d459181900360800190a15b505050505050505050505050565b600654600160a060020a031633146111a6576040805160e560020a62461bcd02815260206004820152602660248201526000805160206112e383398151915260448201526000805160206112c3833981519152606482015290519081900360840190fd5b6007805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600654600160a060020a03163314611239576040805160e560020a62461bcd02815260206004820152602660248201526000805160206112e383398151915260448201526000805160206112c3833981519152606482015290519081900360840190fd5b6512309ce540008111156112bd576040805160e560020a62461bcd02815260206004820152603160248201527f6d617850726f6669742073686f756c6420626520612073616e65206e756d626560448201527f725b302c204d41585f50524f4649545d2e000000000000000000000000000000606482015290519081900360840190fd5b60035556006f776e65722e00000000000000000000000000000000000000000000000000004f6e6c794f776e6572206d6574686f64732063616c6c6564206279206e6f6e2da165627a7a7230582008da20529875772aff4e50bc39303291f3850682cc426990cea51b918d6b4da70029`

let client
if (typeof document !== 'undefined' && document.domain){
    client = new seelejs(document.domain + '/seelens')
} else{
    client = new seelejs('http://117.50.20.218:8037')
}

class Dice2{
    /** 
     * @example
     * this.SeelediceABI = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.ABI').toString()
     * this.SeeleDiceBin = fs.readFileSync('../contract/SeeleDice2/SeeleDice2.Bytecode').toString()
     * this.Properties = {
     *     'croupier' : client.sendSync("generatePayload", this.SeelediceABI, "croupier", []),
     *     'owner' : client.sendSync("generatePayload", this.SeelediceABI, "owner", []),
     *     'maxProfit' : client.sendSync("generatePayload", this.SeelediceABI, "maxProfit", []),
     *     'lockedInBets' : client.sendSync("generatePayload", this.SeelediceABI, "lockedInBets", []),
     * }
     */
    constructor(){
        this.ContractAddress = "0x528a1f24ac97b124991ef88972187644d6a40012"
        this.SeeleDiceABI = SeeleDice2ABI
        this.SeeleDiceBin = SeeleDice2Bin
        this.Properties = {
            croupier: '0x6b5c5f39',
            owner: '0x8da5cb5b',
            maxProfit: '0xb539cd55',
            lockedInBets: '0xdf88126f',
            registrations: '0x46ec06e5',
        }
        this.MODULO = 100
        // Register
        this.REGISTRATION_GIFT = 5000000; // 0.05 Seele
        // There is minimum and maximum bet.
        this.MIN_BET = new BigNumber('1000000') // 0.01 Seele
        this.MAX_BET = new BigNumber('10000').multipliedBy(new BigNumber('100000000')) // 10000 Seele
        // There is minimum and maximum rollUnder.
        this.MIN_ROLLUNDER = 5
        this.MAX_ROLLUNDER = 96
        // Each bet is deducted 1% in favour of the house, but no less than some minimum.
        this.HOUSE_EDGE_PERCENT = 1 // %1
        this.HOUSE_EDGE_MINIMUM_AMOUNT = 1000000 // 0.01 Seele
        // EVM BLOCKHASH opcode can query no further than 256 blocks into the
        // past. Given that settleBet uses block hash of placeBet as one of
        // complementary entropy sources, we cannot process bets older than this
        // threshold.
        this.BET_EXPIRATION_BLOCKS = 250
        // Adjustable max profit for a single bet.
        // uint constant MAX_PROFIT = MAX_BET * MODULO / MIN_ROLLUNDER;
    }

    GetCroupier(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.croupier, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let croupier = data.result
        return {"croupier" : "0x" + croupier.substring(croupier.length-40)}
    }

    GetOwner(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.owner, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let owner = data.result
        return {"owner" : "0x" + owner.substring(owner.length-40)}
    }

    GetMaxProfit(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.maxProfit, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let maxProfit = data.result
        return parseInt(maxProfit, 16)
    }

    GetLockedInBets(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.lockedInBets, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let lockedInBets = data.result
        return parseInt(lockedInBets, 16)
    }

    GetRegistrations(){
        let data = client.sendSync("call", this.ContractAddress, this.Properties.registrations, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let registrations = data.result
        return parseInt(registrations, 16)
    }

    GetDiceWinAmount(bet, rollUnder){
        let payload = client.sendSync("generatePayload", this.SeeleDiceABI, "getDiceWinAmount", [bet.toString(), rollUnder.toString()])
        let data = client.sendSync("call", this.ContractAddress, payload, -1)
        if (data.failed){
            throw new Error(data.result)
        }

        let payout = data.result
        return parseInt(payout, 16)
    }

    GetBalance(account) {
        return client.sendSync('getBalance', account)
    }

    GetAccountNonce(account) {
        return client.sendSync('getAccountNonce', account)
    }

    GetHeight() {
        return client.sendSync('getBlockHeight')
    }

    async PlaceBet(keypair, args){
        let rand = await randClient.GetRand(), self = this
        let [payload, nonce] = await Promise.all([
            client.generatePayload(self.SeeleDiceABI, 'placeBet', [args.RollUnder.toString(), rand.commit, rand.r, rand.s, rand.v]),
            client.getAccountNonce(keypair.PublicKey),
        ])

        let rawTx = {
            "From" : keypair.PublicKey,
            "To" : self.ContractAddress,
            "Amount" : args.Bet || 0,
            "AccountNonce" : nonce,
            "GasPrice":args.GasPrice || 1,
            "GasLimit":args.GasLimit || 3000000,
            "Timestamp":0,
            "Payload": payload
        }
        let tx = await client.generateTx(keypair.PrivateKey, rawTx)
        // console.log(JSON.stringify(tx))

        let result = await client.addTx(tx)
        if (result){
            return {'commit' : rand.commit, 'txHash' : tx.Hash}
        }

        throw new Error('add tx result is: ' + result)
    }

    async GetReceipt(txHash) {
        let settleTx = await this.filterTxByTxHash(txHash)
        let receipt = await client.getReceiptByTxHash(txHash, this.SeeleDiceABI)
        // console.log(receipt)
        if (receipt.failed){
            throw new Error(receipt)
        }

        let log, payout
        if (receipt.logs.length == 2) { // winAction
            log = JSON.parse(receipt.logs[1])
            payout = log.Args[4]
        } else if (receipt.logs.length == 1) { // lossAction
            log = JSON.parse(receipt.logs[0])
        } else {
            console.log('other tx function receipt')
            return
        }

        let block = await client.getBlock(settleTx.blockHash, -1, false)
        return {
            "Time":new Date(block.header.CreateTimestamp*1000),
            "Bettor":log.Args[0],
            "RollUnder":log.Args[1],
            "Bet":log.Args[2],
            "Roll":log.Args[3],
            "Payout":payout,
            "Event":log.Event,
        }
    }

    // const args = {"RollUnder":50, "Payout":111, "Bet": 100000000, "GasPrice":2, "GasLimit":200000}
    async Roll(keypair, args){
        // RollUnder in [MIN_ROLLUNDER, MAX_ROLLUNDER]
        if (!args.RollUnder || args.RollUnder < this.MIN_ROLLUNDER || args.RollUnder > this.MAX_ROLLUNDER){
            Promise.reject('RollUnder[' + args.RollUnder + '] may be out of range [' + this.MIN_ROLLUNDER + ', ' + this.MAX_ROLLUNDER + ']')
        }
        // Bet in [MIN_BET, MAX_BET]
        if (!args.Bet || args.Bet < this.MIN_BET || args.Bet > this.MAX_BET){
            Promise.reject('Bet[' + args.Bet + '] may be out of range [' + this.MIN_BET + ', ' + this.MAX_BET + ']')
        }

        let betData = await this.PlaceBet(keypair, args)
        // console.log("PlaceBet success!")
        // console.log("betData:", betData)
        let settleData = await randClient.SettleBet(betData)
        // console.log("SettleBet success!")
        // console.log({'placeTxHash':betData.txHash, 'settleTxHash' : settleTxHash})
        return this.GetReceipt(settleData.settleTxHash)
    }

    Register(){
        return randClient.Register()
    }

    filterBlockTx(callbackFunction){
        let height = this.GetHeight(), startTime = Date.now(), endTime
        while (true){
            do{
                endTime = Date.now()
            } while (startTime + 500 > endTime)
            try{
                let txs = client.filterBlockTx(height, this.ContractAddress, "2")
                txs.forEach(tx => {
                    callbackFunction(tx)
                });
                height += 1
            } catch(err) {
                try {
                    let errmsg = JSON.stringify(err.message)
                    if (errmsg.includes('leveldb: not found')) {
                        startTime = Date.now()
                        continue
                    }
                } catch (err1) {
                    console.log("filterBlockTx err")
                    throw err1
                }
            }
        }
    }

    filterTxByTxHash(txHash){
        let self = this, endTime
        do{
            if (!self.startTime){
                self.startTime = Date.now()
            }
            // if (!self.timeout){
            //     self.timeout = 2 * 60 * 1000 // 2 min
            // }
            endTime = Date.now()
        } while (self.startTime + 500 > endTime)
        return client.getTransactionByHash(txHash).then(tx =>{
            if (tx.status !== 'block'){
                self.startTime = Date.now()
                return self.filterTxByTxHash(txHash)
            }

            self.startTime = null
            return tx
        }).catch(err => {
            try {
                let errmsg = JSON.stringify(err.message)
                if (errmsg.includes('leveldb: not found')) {
                    self.startTime = Date.now()
                    return self.filterTxByTxHash(txHash)
                }
            } catch (err1) {
                console.log("filterTxByTxHash err")
                console.log(err1)
                self.startTime = null
                Promise.reject(err1)
            }
        })
    }
}

module.exports = new Dice2()
