const http = require('http');

class RandClient{
    constructor(){
        this.options = {
            hostname : '106.75.87.36',
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
    if (typeof document !== 'undefined' && document.domain){
        if (document.domain.includes('seele')){
            opts.hostname = document.domain + '/randns'
        } else if (document.domain.includes('localhost') || document.domain.includes('127.0.0.1')){
            opts.hostname = '127.0.0.1'
        }
    } else {
        opts.hostname = '106.75.87.36'
    }
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