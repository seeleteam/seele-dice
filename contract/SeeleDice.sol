pragma solidity ^0.4.0;


contract SeeleDice{

    mapping(address=>uint256) public seeders;
    address[] public senders;
    
    constructor() public {

    }
    
    function rand() public returns(uint256) {
        uint256 r1;
        for (uint i = 0; i < senders.length; i++) {
            r1 = uint256(keccak256(r1, senders[i], seeders[senders[i]]));
        }
        uint256 random = uint256(keccak256(r1, block.difficulty, now));

        return random%100;

    }
    
    function dice(uint256 winValue, uint256 diceNumber) public returns(bool){
        if (seeders[msg.sender] == 0) {
            senders.push(msg.sender);
        }
        seeders[msg.sender]++;
        
        uint256 randNumber = rand();
        if (randNumber < diceNumber){
            return true;
        }
        
        return false;
    }

}