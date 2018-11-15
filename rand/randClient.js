const http = require('http');

class RandClient{
    constructor(){
        this.options = {
            hostname : '127.0.0.1',
            port : 8888,
            method : 'POST',
          }
    }

    GetRand(){
        return sendReq(this.options, JSON.stringify({
            id:      new Date().getTime(),
            method:  'GetRand'
        }))
    }

    SettleBet(betData){
        return sendReq(this.options, JSON.stringify({
            id : new Date().getTime(),
            method : 'SettleBet',
            params : betData
        }))
    }

    Register(){
        return sendReq(this.options, JSON.stringify({
            id : new Date().getTime(),
            method : 'Register'
        }))
    }
}

function sendReq(opts, rpcData) {
    return new Promise((resolve, reject) => {
        const req = http.request(opts, function(res) {
            var data = ''
            res.setEncoding('utf8')
            res.on('data', function(chunk) {
                data += chunk
            })
            res.on('end', function() {
                try {
                    data = JSON.parse(data)
                    return resolve(data)
                } catch (err) {
                    return reject(err.message+' : '+data)
                }
            })
        })

        req.on('error', reject)
        req.end(rpcData)
    })
}

module.exports = new RandClient()