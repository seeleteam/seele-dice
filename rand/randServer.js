const createKeccakHash = require('keccak')
const BigNumber = require('bignumber.js');
const secp256k1 = require('secp256k1')
const fs = require('fs')
const dice = require("../dice/dice2")
const seelejs = require('seele.js')
let client
if (typeof document !== 'undefined' && document.domain){
    client = new seelejs(document.domain + '/seelens')
} else{
    client = new seelejs('http://117.50.20.218:8037')
}

class RandService{
    constructor(){
        let file = fs.readFileSync('croupier.keypair.cfg').toString()
        let keypair = JSON.parse(file)
        this.privatekey = keypair.PrivateKey
        this.publickey = keypair.PublicKey
        this.betsPath = 'bets.' + new Date().toLocaleDateString() + '.db'
        if (!fs.existsSync(this.betsPath)) {
            this.bets = {}
            fs.createWriteStream(this.betsPath).end(JSON.stringify(this.bets))
            return
        } else {
            let bets = fs.readFileSync(this.betsPath).toString()
            this.bets = JSON.parse(bets)
        }
    }

    GetRand(){
        let privatekey = this.privatekey.substring(2)
        let source = new BigNumber(Math.floor(Math.random()*100000000+1))
        let timestamp = new BigNumber(Date.now())
        let reveal = (source.multipliedBy(timestamp)).toString(16)
        if (reveal.length % 2 != 0){
            reveal = '0' + reveal
        }
        let c = Buffer.from(reveal, 'hex')
        let commit = createKeccakHash('keccak256').update(c).digest()
        let sig = secp256k1.sign(commit, Buffer.from(privatekey, 'hex'))
        // save the bets
        this.bets['0x' + commit.toString('hex')] = '0x' + reveal
        fs.writeFileSync(this.betsPath, JSON.stringify(this.bets))
        return {
            'commit' : '0x' + commit.toString('hex'),
            'r' : '0x' + sig.signature.slice(0, 32).toString('hex'),
            's' : '0x' + sig.signature.slice(32, 64).toString('hex'),
            'v' : sig.recovery.toString()
        }
    }

    async SettleBet(commit, txHash){
        let reveal = this.bets[commit]
        if (!reveal){
            throw new Error('cannot find reveal by commit: ' + commit)
        }
        let betTx = await dice.filterTxByTxHash(txHash)
        // console.log(JSON.stringify(betTx))
        let [payload, nonce] = await Promise.all([
            client.generatePayload(dice.SeeleDiceABI, 'settleBet', [reveal, betTx.blockHash]),
            client.getAccountNonce(this.publickey),
        ])

        let rawTx = {
            "From" : this.publickey,
            "To" : dice.ContractAddress,
            "Amount" : 0,
            "AccountNonce" : nonce,
            "GasPrice": 1,
            "GasLimit": 3000000,
            "Timestamp":0,
            "Payload": payload
        }
        let tx = await client.generateTx(this.privatekey, rawTx)
        // console.log(JSON.stringify(tx))

        let result = await client.addTx(tx)
        if (result){
            return tx.Hash
        }

        throw new Error('add tx result is: ' + result)
    }

    async Register(){
        let keypair = client.wallet.createbyshard(1)
        if (dice.GetRegistrations() > 0){
            let [payload, nonce] = await Promise.all([
                client.generatePayload(dice.SeeleDiceABI, 'register', [keypair.publickey]),
                client.getAccountNonce(this.publickey),
            ])
            
            let rawTx = {
                "From" : this.publickey,
                "To" : dice.ContractAddress,
                "Amount" : 0,
                "AccountNonce" : nonce,
                "GasPrice": 1,
                "GasLimit": 3000000,
                "Timestamp":0,
                "Payload": payload
            }
            let tx = await client.generateTx(this.privatekey, rawTx)
            let result = await client.addTx(tx)
            if (result){
                keypair.isReceivedGift = true
                return keypair
            }

            throw new Error('add tx result is: ' + result)
        }

        return keypair
    }
}

module.exports = new RandService()
