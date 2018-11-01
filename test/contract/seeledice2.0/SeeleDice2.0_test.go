package contract

import (
	"fmt"
	"io/ioutil"
	"math/big"
	"math/rand"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/seeleteam/e2e-blackbox/testcase/contract"

	"github.com/seeleteam/go-seele/common"
	"github.com/stretchr/testify/assert"
)

var (
	binFile = "./SeeleDice2.0.bin"
	abiFile = "./SeeleDice2.0.abi"
)

var accounts = []string{
	"../../../config/keyfile/shard1-0x0a57a2714e193b7ac50475ce625f2dcfb483d741",
	"../../../config/keyfile/shard1-0x2a87b6504cd00af95a83b9887112016a2a991cf1",
	"../../../config/keyfile/shard1-0x3b691130ec4166bfc9ec7240217fc8d08903cf21",
	"../../../config/keyfile/shard1-0x4fb7c8b0287378f0cf8b5a9262bf3ef7e101f8d1",
	"../../../config/keyfile/shard1-0xec759db47a65f6537d630517f6cd3ca39c6f93d1",
}

func Test_SeeleDice_MoreAccount(t *testing.T) {
	// deploy contract
	if !common.FileOrFolderExists(binFile) {
		t.Fatal("bin file not found")
	}
	bytes, err := ioutil.ReadFile(binFile)
	assert.Nil(t, err)

	receipt := contract.HandleTx(t, 0, contract.CmdClient, contract.KeyFileShard1, "", string(bytes))
	fmt.Println("receipt.Contract:", receipt.Contract)
	// rand(t, contract.CmdClient, receipt.Contract)

	f, err := os.OpenFile("rands.txt", os.O_CREATE|os.O_WRONLY, 0666)
	assert.Nil(t, err)

	count := 1000
	for index := 0; index < count; index++ {
		i := roll(t, contract.CmdClient, accounts[0], receipt.Contract)
		fmt.Println("count:", index+1, " i:", i)
		f.WriteString(i.String() + "\n")
	}

	fmt.Println("over")
}

func roll(t *testing.T, command, from, contractAddr string) *big.Int {
	if !common.FileOrFolderExists(abiFile) {
		t.Fatal("abi file not found")
	}

	s1 := rand.NewSource(time.Now().Unix())
	r1 := rand.New(s1)
	magicNumber := r1.Int63()
	// magicHash := hexutil.BytesToHex(crypto.Keccak256(big.NewInt(magicNumber).Bytes()))
	// fmt.Println("magicNumber:", magicNumber)
	// fmt.Println("magicHash:", magicHash)
	// call rand contract
	payload := contract.GeneratePayload(t, command, abiFile, "rand", strconv.FormatInt(magicNumber, 10))
	payload = payload[strings.IndexAny(payload, "0x"):strings.IndexAny(payload, "\n")]
	fmt.Println("payload:", payload)

	receipt := contract.HandleTx(t, 0, contract.CmdClient, from, contractAddr, payload)
	// fmt.Println("Result:", receipt.Result)
	i, b := big.NewInt(0).SetString(receipt.Result[2:], 16)
	assert.Equal(t, true, b)

	return i
}
