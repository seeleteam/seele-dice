pragma solidity ^0.4.0;

contract SeeleDice{
    mapping(uint256=>uint256) internal results;
    address public creator;

    event lossAction(address sender, uint256 diceNumber, uint256 rollNumber);
    event winAction(address sender, uint256 diceNumber, uint256 rollNumber, uint256 winValue);

    constructor() public payable{
        creator = msg.sender;
    }

    // First
    function commit(uint256 diceNumber, uint256 winValue, uint256 magicHash) public payable returns(bool){
        require(100 * msg.value >= winValue * diceNumber, "winValue is to large");
        require(winValue * 2 <= address(this).balance, "I have no enough money to pay you");

        results[magicHash] = uint256(keccak256(abi.encodePacked(diceNumber, winValue, magicHash)));
        return true;
    }

    // Second
    function reveal(uint256 diceNumber, uint256 winValue, uint256 magicHash, uint256 magicNumber) public payable returns(bool){
        require(msg.sender == creator, "who you are?");
        require(magicHash == uint256(keccak256(abi.encodePacked(magicNumber))), "invalid magicNumber");
        require(results[magicHash] == uint256(keccak256(abi.encodePacked(diceNumber, winValue, magicHash))), "invalid parameter");

        uint256 rollNumber = rand(magicNumber);
        // 1 <= rollNumber <= 100
        assert(rollNumber <= 100 && rollNumber >= 1);

        if (rollNumber < diceNumber){
            msg.sender.transfer(winValue);
            emit winAction(msg.sender, diceNumber, rollNumber, winValue);
            return true;
        }

        emit lossAction(msg.sender, diceNumber, rollNumber);
        return false;
    }

    function rand(uint256 magicNumber) public view returns(uint256) {
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, magicNumber)));
        if (block.number % 2 == 0){
            return random % 80 + 20;
        }
        return random % 100 + 1;
    }

    function destory() public {
        require(msg.sender == creator, "who you are?");
        selfdestruct(creator);
    }
}