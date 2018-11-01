package contract

import (
	"fmt"
	"io/ioutil"
	"math/big"
	"os"
	"strconv"
	"strings"
	"testing"

	"github.com/magiconair/properties/assert"

	"github.com/seeleteam/go-seele/common"
	"github.com/seeleteam/seele-dice/test/contract"
)

var (
	binFile = "./SeeleDice.bin"
	abiFile = "./SeeleDice.abi"
)

var accounts = []string{
	"../config/keyfile/shard1-0x0a57a2714e193b7ac50475ce625f2dcfb483d741",
	"../config/keyfile/shard1-0x2a87b6504cd00af95a83b9887112016a2a991cf1",
	"../config/keyfile/shard1-0x3b691130ec4166bfc9ec7240217fc8d08903cf21",
	"../config/keyfile/shard1-0x4fb7c8b0287378f0cf8b5a9262bf3ef7e101f8d1",
	"../config/keyfile/shard1-0xec759db47a65f6537d630517f6cd3ca39c6f93d1",
}

func Test_SeeleDice_MoreAccount(t *testing.T) {
	if !common.FileOrFolderExists(binFile) {
		t.Fatal("bin file not found")
	}
	bytes, err := ioutil.ReadFile(binFile)
	if err != nil {
		t.Fatal(err)
	}

	// deploy contract
	receipt := contract.HandleTx(t, 9000000000, contract.CmdClient, contract.KeyFileShard1, "", string(bytes))
	fmt.Println("receipt.Contract:", receipt.Contract)

	f, err := os.OpenFile("rands.txt", os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		t.Fatal(err)
	}

	// r1 := rand.New(rand.NewSource(time.Now().Unix()))
	count, sum := 10000, 0
	fmt.Println("count bet rollUnder payout roll result sum")
	for index := 0; index < count; {
		for _, account := range accounts {
			// bet, rollUnder := 50, r1.Intn(100)+1
			bet, rollUnder := 50, 51
			payout := bet * 100 / rollUnder

			randNumber, result := roll(t, account, receipt.Contract, bet, rollUnder, payout)
			if result {
				sum -= payout - bet
			} else {
				sum += bet
			}
			fmt.Printf("count:%d, %d %d %d %d %t %d\n", index+1, bet, rollUnder, payout, randNumber, result, sum)
			f.WriteString(fmt.Sprintf("%d\n", sum))
			index++
		}
	}

	fmt.Println("sum:", sum)
	fmt.Println("over")
}

func roll(t *testing.T, from, contractAddr string, bet, rollUnder, payout int) (*big.Int, bool) {
	payload := contract.GeneratePayload(t, contract.CmdClient, abiFile, "dice", strconv.Itoa(rollUnder), strconv.Itoa(payout))
	payload = payload[strings.IndexAny(payload, "0x"):strings.IndexAny(payload, "\n")]
	fmt.Println("payload:", payload)

	receipt := contract.HandleTx(t, bet, contract.CmdClient, from, contractAddr, payload)
	// fmt.Println("receipt:", receipt)
	fmt.Println("Logs:", receipt.Logs[0])
	i := parseRandNumber(t, receipt.Logs[0])

	// fmt.Println("Result:", receipt.Result)
	if receipt.Result == "0x0000000000000000000000000000000000000000000000000000000000000001" {
		return i, true
	}
	return i, false
}

func parseRandNumber(t *testing.T, logs interface{}) *big.Int {
	log, ok := logs.(map[string]interface{})
	if !ok {
		t.Fatal("Logs:", logs)
	}
	data, ok := log["data"].([]interface{})
	if !ok {
		t.Fatal("data:", log["data"])
	}
	randNumber, ok := data[2].(string)
	if !ok {
		t.Fatal("randNumber:", data[2])
	}
	i, b := big.NewInt(0).SetString(randNumber[2:], 16)
	assert.Equal(t, true, b)
	return i
}

func getRand(t *testing.T, command, from, contractAddr string) *big.Int {
	if !common.FileOrFolderExists(abiFile) {
		t.Fatal("abi file not found")
	}

	// call rand contract
	payload := contract.GeneratePayload(t, command, abiFile, "rand")
	payload = payload[strings.IndexAny(payload, "0x"):strings.IndexAny(payload, "\n")]
	// fmt.Println("payload:", payload)

	receipt := contract.HandleTx(t, 0, contract.CmdClient, from, contractAddr, payload)
	// fmt.Println("Result:", receipt.Result)
	i, b := big.NewInt(0).SetString(receipt.Result[2:], 16)
	assert.Equal(t, true, b)

	return i
}
