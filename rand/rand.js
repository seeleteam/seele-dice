const createKeccakHash = require('keccak')
const BigNumber = require('bignumber.js');
const secp256k1 = require('secp256k1')
const fs = require('fs')
// reveal: 2360310757221256559
// reveal.Bytes(): [32 193 130 32 211 180 205 111]
// reveal.hex(): 0x20c18220d3b4cd6f
// commit: [44 66 255 202 254 78 44 77 36 168 135 167 26 51 161 56 50 219 88 5 72 123 126 75 126 49 248 57 151 192 184 8] commit.length: 32
// commit: 0x2c42ffcafe4e2c4d24a887a71a33a13832db5805487b7e4b7e31f83997c0b808
// secKey: [182 15 223 204 193 184 61 72 59 15 124 100 238 68 168 75 239 153 133 35 222 108 104 209 45 185 74 63 185 23 132 44]
// secKey: 0xb60fdfccc1b83d483b0f7c64ee44a84bef998523de6c68d12db94a3fb917842c
// r: [93 155 150 10 253 110 15 253 148 245 174 54 45 18 13 0 27 231 132 117 243 180 133 36 218 1 31 20 121 82 70 57]
// s: [96 81 69 21 155 245 26 193 225 250 12 208 106 34 88 212 88 26 97 60 158 245 235 152 125 50 176 219 62 80 245 55]
// v: 1
// r: 0x5d9b960afd6e0ffd94f5ae362d120d001be78475f3b48524da011f1479524639
// s: 0x605145159bf51ac1e1fa0cd06a2258d4581a613c9ef5eb987d32b0db3e50f537
// v: 1
// PublicKey.hex 0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451
class RandService{
    constructor(){
        let file = fs.readFileSync('croupier.keypair.cfg').toString()
        let keypair = JSON.parse(file)
        this.privatekey = keypair.PrivateKey
        this.publickey = keypair.PublicKey
        this.bets = new Map()
    }

    GetRand(){
        let privatekey = this.privatekey.substring(2)
        // let reveal = new BigNumber("2360310757221256559")
        // Math.random()*10*new Date().getMilliseconds()
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
        this.bets.set('0x' + commit.toString('hex'), '0x' + reveal)
        return{
            'commit' : '0x' + commit.toString('hex'),
            'r' : '0x' + sig.signature.slice(0, 32).toString('hex'),
            's' : '0x' + sig.signature.slice(32, 64).toString('hex'),
            'v' : sig.recovery.toString()
        }
    }
}

module.exports = new RandService()