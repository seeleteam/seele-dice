const service = require('./randServer')
const http = require('http');

http.createServer(function (req, res) {
    var data = "";

    req.on('data', function (chunk) {
        data += chunk;
    })

    req.on('end', function () {
        console.log("You've sent:", data, 'by', req.url);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type' : 'application/json'})
        try{
            content = JSON.parse(data)
            switch (content.method) {
                case 'GetRand':
                    let rand = JSON.stringify(service.GetRand())
                    console.log('rand:', rand)
                    res.end(rand, 'utf8')
                    break;
                case 'SettleBet':
                    service.SettleBet(content.params.commit, content.params.txHash).then(settleTxHash => {
                        console.log("settleTxHash:", settleTxHash);
                        res.end(JSON.stringify({"settleTxHash" : settleTxHash}), 'utf8')
                    }).catch(err => {
                        console.log(err)
                        res.end(err.message, 'utf8')
                    })
                    break;
                case 'Register':
                    service.Register().then(keypair => {
                        console.log("keypair: " + JSON.stringify(keypair));
                        res.end(JSON.stringify(keypair), 'utf8')
                    }).catch(err => {
                        console.log(err)
                        res.end(err.message, 'utf8')
                    })
                    break;
                default:
                    res.end('Invalid request', 'utf8')
                    break;
            }
        } catch (err) {
            console.log(err)
            res.end(err.message, 'utf8')
        }
    });
}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');