pragma solidity ^0.4.0;


contract SeeleDice{
    uint constant MODULO = 100;

    // There is minimum and maximum bets.
    uint constant MIN_BET = 10000000;     // 0.1 Seele
    uint constant MAX_AMOUNT = 10000 * 100000000; // 10000 Seele

    // Each bet is deducted 1% in favour of the house, but no less than some minimum.
    uint constant HOUSE_EDGE_PERCENT = 1;
    uint constant HOUSE_EDGE_MINIMUM_AMOUNT = 1000000;     // 0.01 Seele

    // EVM BLOCKHASH opcode can query no further than 256 blocks into the
    // past. Given that settleBet uses block hash of placeBet as one of
    // complementary entropy sources, we cannot process bets older than this
    // threshold.
    uint constant BET_EXPIRATION_BLOCKS = 250;
    
    // Adjustable max profit for a single bet.
    uint public maxProfit;

    // Funds that are locked in potentially winning bets. Prevents contract from
    // committing to bets it cannot pay out.
    uint128 public lockedInBets;

    // Mapping from commits to all currently active & processed bets.
    mapping (uint => Bet) bets;

    address public owner;
    address public croupier;

    // A structure representing a single bet.
    struct Bet {
        uint amount;
        uint8 rollUnder;
        // Block number of placeBet tx.
        uint40 placeBlockNumber;
        // Address of a gambler, used to pay out winning bets.
        address gambler;
    }

    // Events that are issued to make statistic recovery easier.
    event FailedPayment(address indexed beneficiary, uint amount);
    event Payment(address indexed beneficiary, uint amount);
    
    event lossAction(address sender, uint256 rollUnder, uint256 randNumber);
    event winAction(address sender, uint256 rollUnder, uint256 randNumber, uint256 winValue);
    
    constructor(address c) public payable{
        owner = msg.sender;
        croupier = c;
    }
    
    // Standard modifier on methods invokable only by contract owner.
    modifier onlyOwner {
        require (msg.sender == owner, "OnlyOwner methods called by non-owner.");
        _;
    }

    // Standard modifier on methods invokable only by contract owner.
    modifier onlyCroupier {
        require (msg.sender == croupier, "OnlyCroupier methods called by non-croupier.");
        _;
    }

    // Fallback function deliberately left empty. It's primary use case
    // is to top up the bank roll.
    function () public payable {
    }

    // Change the croupier address.
    function setCroupier(address newCroupier) external onlyOwner {
        croupier = newCroupier;
    }

    // Funds withdrawal to cover costs of the operation.
    function withdrawFunds(address beneficiary, uint withdrawAmount) external onlyOwner {
        require (withdrawAmount <= address(this).balance, "Increase amount larger than balance.");
        require (lockedInBets + withdrawAmount <= address(this).balance, "Not enough funds.");
        
        beneficiary.transfer(withdrawAmount);
    }

    // Change max bet reward. Setting this to zero effectively disables betting.
    function setMaxProfit(uint _maxProfit) external onlyOwner {
        require (_maxProfit < MAX_AMOUNT, "maxProfit should be a sane number.");
        maxProfit = _maxProfit;
    }

    function placeBet(uint256 rollUnder, uint commit, bytes32 r, bytes32 s) external payable {
        // Check that the bet is in 'clean' state.
        Bet storage bet = bets[commit];
        require (bet.gambler == address(0), "Bet should be in a 'clean' state.");

        uint amount = msg.value;
        require (amount >= 0 && amount <= MAX_AMOUNT, "Amount should be within range.");
        
        bytes32 signatureHash = keccak256(abi.encodePacked(commit));
        require (croupier == ecrecover(signatureHash, 27, r, s), "ECDSA signature is not valid.");

        uint winAmount = getDiceWinAmount(amount, rollUnder);

        // Enforce max profit limit.
        require (winAmount <= amount + maxProfit, "maxProfit limit violation.");

        // Lock funds.
        lockedInBets += uint128(winAmount);

        // Check whether contract has enough funds to process this bet.
        require (lockedInBets <= address(this).balance, "Cannot afford to lose this bet.");

        // Store bet parameters on blockchain.
        bet.amount = amount;
        bet.rollUnder = uint8(rollUnder);
        bet.placeBlockNumber = uint40(block.number);
        bet.gambler = msg.sender;
    }

    function settleBet(uint reveal, bytes32 blockHash) external onlyCroupier {
        uint commit = uint(keccak256(abi.encodePacked(reveal)));

        Bet storage bet = bets[commit];
        uint placeBlockNumber = bet.placeBlockNumber;
        
        // Check that bet has not expired yet (see comment to BET_EXPIRATION_BLOCKS).
        require (block.number > placeBlockNumber, "settleBet in the same block as placeBet, or before.");
        require (block.number <= placeBlockNumber + BET_EXPIRATION_BLOCKS, "Blockhash can't be queried by EVM.");
        require (blockhash(placeBlockNumber) == blockHash);
        
        // Fetch bet parameters into local variables (to save gas).
        uint amount = bet.amount;
        uint rollUnder = bet.rollUnder;
        address gambler = bet.gambler;

        // Check that bet is in 'active' state.
        require (amount != 0, "Bet should be in an 'active' state.");

        // Move bet into 'processed' state already.
        bet.amount = 0;

        // The RNG - combine "reveal" and blockhash of placeBet using Keccak256. Miners
        // are not aware of "reveal" and cannot deduce it from "commit" (as Keccak256
        // preimage is intractable), and house is unable to alter the "reveal" after
        // placeBet have been mined (as Keccak256 collision finding is also intractable).
        bytes32 entropy = keccak256(abi.encodePacked(reveal, blockHash));

        // Do a roll by taking a modulo of entropy. Compute winning amount.
        uint randNumber = uint(entropy) % MODULO;

        uint winAmount = getDiceWinAmount(amount, rollUnder);

        // Unlock the bet amount, regardless of the outcome.
        lockedInBets -= uint128(winAmount);

        if (randNumber < rollUnder) {
            if (gambler.send(winAmount)) {
                emit Payment(gambler, winAmount);
            } else {
                emit FailedPayment(gambler, winAmount);
            }

            emit winAction(gambler, rollUnder, randNumber, winAmount);
        } else {
            emit lossAction(gambler, rollUnder, randNumber);
        }
    }

    // Get the expected win amount after house edge is subtracted.
    function getDiceWinAmount(uint amount, uint rollUnder) private pure returns (uint winAmount) {
        require (1 < rollUnder && rollUnder < MODULO - 1, "Win probability out of range.");

        uint houseEdge = amount * HOUSE_EDGE_PERCENT / 100;

        if (houseEdge < HOUSE_EDGE_MINIMUM_AMOUNT) {
            houseEdge = HOUSE_EDGE_MINIMUM_AMOUNT;
        }

        require (houseEdge <= amount, "Bet doesn't even cover house edge.");
        winAmount = (amount - houseEdge) * MODULO / rollUnder;
    }

    function destory() external onlyOwner {
        require (lockedInBets == 0, "All bets should be processed (settled or refunded) before self-destruct.");
        selfdestruct(owner);
    }
}