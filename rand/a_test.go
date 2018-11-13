package cmd

import (
	"fmt"
	"math/big"
	"math/rand"
	"testing"
	"time"

	"github.com/seeleteam/go-seele/common/hexutil"
	"github.com/seeleteam/go-seele/crypto"
)

func Test_pri(t *testing.T) {
	privatekey := "0xb60fdfccc1b83d483b0f7c64ee44a84bef998523de6c68d12db94a3fb917842c"
	bytes, _ := hexutil.HexToBytes(privatekey)
	privkey, _ := crypto.ToECDSA(bytes)
	fmt.Println("PublicKey", privkey.PublicKey)
	pubkey := crypto.GetAddress(&privkey.PublicKey)
	fmt.Println("PublicKey.hex", pubkey.ToHex())
	fmt.Println("Shard", pubkey.Shard())
	// 0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451

	rand := rand.New(rand.NewSource(time.Now().UnixNano()))
	reveal := rand.Int63()
	fmt.Println("reveal:", reveal)
	fmt.Println("reveal.Bytes():", big.NewInt(reveal).Bytes())
	fmt.Println("reveal.hex():", hexutil.BytesToHex(big.NewInt(reveal).Bytes()))
	bbbbb, _ := hexutil.HexToBytes("0xeda63d1f6a1794b4")
	commit := crypto.Keccak256(bbbbb)
	fmt.Println("commit:", commit, "commit.length:", len(commit))
	fmt.Println("commit:", hexutil.BytesToHex(commit))
	signature := *crypto.MustSign(privkey, commit)
	fmt.Println("r:", signature.Sig[:32])
	fmt.Println("s:", signature.Sig[32:64])
	fmt.Println("v:", signature.Sig[64])
	fmt.Println("r:", hexutil.BytesToHex(signature.Sig[:32]))
	fmt.Println("s:", hexutil.BytesToHex(signature.Sig[32:64]))
	fmt.Println("v:", signature.Sig[64])
	// 50,"0xfaf0b85345cd4ec7376ad8398568c0469aa311bb673207180b6cbb6e814d84de","0x761829068b7599ab880e3bf0d767823c60412192b233f0ee20c5de17c467b9a8","0x570c25f622192740b6b8abec9d8fdab6b629bc317d3ded5ab2ed732d2fc40660",1
	// c: 0xfaf0b85345cd4ec7376ad8398568c0469aa311bb673207180b6cbb6e814d84de
	// r: 0x761829068b7599ab880e3bf0d767823c60412192b233f0ee20c5de17c467b9a8
	// s: 0x570c25f622192740b6b8abec9d8fdab6b629bc317d3ded5ab2ed732d2fc40660
	// v: 1
	// =======================================================
	// addr: 0x6d4fca4dc6c49ce8df30e7b2887a08cd4d5a1451
	pub, err := crypto.Ecrecover(commit, signature.Sig)
	fmt.Println("err:", err)
	fmt.Println("pub.hex:", crypto.GetAddress(pub).ToHex())
}

func Test_time(t *testing.T) {
	timestamp := int64(1542086808)
	tm := time.Unix(timestamp, 0)

	fmt.Println(tm.Format("2006-01-02 15:04:05"))

	// UTC
	// tm2, _ := time.Parse("2006-01-02 15:04:05", "2018-11-13 13:26:48")
	toBeCharge := "2018-11-11 13:26:48"
	timeLayout := "2006-01-02 15:04:05"
	loc, _ := time.LoadLocation("Local")
	tm2, _ := time.ParseInLocation(timeLayout, toBeCharge, loc)
	fmt.Println(tm2.Unix())
	fmt.Println(tm2.Format("2006-01-02 15:04:05"))

	tm3 := time.Unix(tm2.Unix(), 0)

	fmt.Println(tm3.Format("2006-01-02 15:04:05"))
}
