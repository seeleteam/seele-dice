pragma solidity ^0.4.0;


contract SeeleDice{
    mapping(address=>uint256) internal seeders;
    address[] public senders;
    address public creator;

    event lossAction(address sender, uint256 diceNumber, uint256 randNumber);
    event winAction(address sender, uint256 diceNumber, uint256 randNumber, uint256 winValue);

    constructor() public payable{
        creator = msg.sender;
    }

    function dice(uint256 diceNumber, uint256 winValue) public payable returns(bool){
        require(100 * msg.value >= winValue * diceNumber, "winValue is to large");
        require(winValue * 2 <= address(this).balance, "I have no enough money to pay you");

        if (seeders[msg.sender] == 0) {
            senders.push(msg.sender);
        }

        uint256 randNumber = rand();
        // 1 <= randNumber <= 100
        assert(randNumber <= 100 && randNumber >= 1);

        // It doesn't matter if you cross the border
        seeders[msg.sender] += randNumber;

        if (randNumber < diceNumber){
            msg.sender.transfer(winValue);
            emit winAction(msg.sender, diceNumber, randNumber, winValue);
            return true;
        }

        emit lossAction(msg.sender, diceNumber, randNumber);
        return false;
    }

    function rand() internal view returns(uint256) {
        uint256 r1;
        for (uint i = 0; i < senders.length; i++) {
            r1 = uint256(keccak256(abi.encodePacked(r1, senders[i], seeders[senders[i]], now)));
        }
        uint256 random = uint256(keccak256(abi.encodePacked(r1, block.difficulty, now)));

        return random % 96 + 4;
    }

    function destory() public {
        require(msg.sender == creator, "who you are?");
        selfdestruct(creator);
    }
}
