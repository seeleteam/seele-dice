const dice = require("../dice/dice")

var keypair = {"PublicKey":"0xd3ee9ab572ed74f0b837ad9ea86f85e30e1dd6d1", "PrivateKey":"0xf1f3a35c187e360b7a8b795270e382bced7b6b8eaf4ac2826aa81e5d7b61ef48"}
// var keypair = {"PublicKey":"0xaf7796ecd82da1ac006a45285ba9900ef0c7d461", "PrivateKey":"0x652a7bd5991407c64173643dfeed4ba47de81c0937bb29d94bda4f6551b6e491"}
// var keypair = {"PublicKey":"0x983dbebd54c1a78a0126fb21095d213f53fc7641", "PrivateKey":"0xf04384f455e22655844864ad3cb214abd8a7a84c806ebc5a71836ed79c197fa3"}
// var keypair = {"PublicKey":"0xd33474acdec14ffca5f729dae3bbcdae2930a1a1", "PrivateKey":"0x6d1f85693db116011b340dfc0ffd5824af192666562f995136e5d371f4a46356"}
// var keypair = {"PublicKey":"0x2813cbedc420f207bbc8b85c5a4feaa9a831b5a1", "PrivateKey":"0xbc9356b2a96b966dafd8cf427bec0aa872a4a74593e1c5345e38a26f698a7be7"}

var args = {"RollUnder":90, "Payout":111, "Bet": 100, "GasPrice":2, "GasLimit":200000}
dice.Sendtx(keypair, args, function(data){
    console.log("callback")
    console.log(data)
    if (data instanceof Error){
        console.log("callback Error")
        return
    }
    
    console.log("callback Success")
})
