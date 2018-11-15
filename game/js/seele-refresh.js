let maxPayoutOnWin, userBalance
$(function() {
    // $('#bets').on('change', function() {
    //     console.log('#bets changed')
    // });

    // $('.winSeele').on('change', function() {
    //     console.log('.winSeele changed')
    // });
    refreshBalance()

    // Half button
    $('.halve').click(function() {
        $('#bets').val(seeleutil.toBigNumber($('#bets').val()).div(2))
        $('.multiple,.all').removeClass('current')
        $(this).addClass('current')
        updateBetAndPayoutOnWin()
    });

    // Double button
    $('.multiple').click(function() {
        $('#bets').val(seeleutil.toBigNumber($('#bets').val()).times(2))
        $('.halve,.all').removeClass('current')
        $(this).addClass('current')
        updateBetAndPayoutOnWin()
    });

    // Max button
    $('.all').click(function() {
        $('.multiple,.halve').removeClass('current')
        $(this).addClass('current')
        $('#bets').val(getMaxUserBet())
        updateBetAndPayoutOnWin()
    });

    dice.GetHeight().then(height => {
        dice.filterBlockTx(height, '2', dice.ContractAddress, refreshAllBets)
    }).catch(err => {console.log(err)})
})

function refreshBalance() {
    // user balance
    setInterval(function () {
        var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
        if (!userJsonStrUser || !userJsonStrUser.username){
            userBalance = null
            return
        }
        dice.GetBalance(userJsonStrUser.username).then(data => {
            $('.accountBalance').text(seeleutil.fromFan(data.Balance))
            userBalance = seeleutil.toBigNumber(data.Balance)
            if (userBalance.lt(seeleutil.toFan($('#bets').val()))){
                updateBetAndPayoutOnWin()
            }
        }).catch(err => {console.log(err)})
    }, 1000)
    
    // contract balance
    setInterval(function () {
        dice.GetBalance(dice.ContractAddress).then(data => {
            $('#poolAmount').text(seeleutil.fromFan(data.Balance))
            maxPayoutOnWin = seeleutil.toBigNumber(data.Balance).div(2)
            if (maxPayoutOnWin.lt(seeleutil.toFan($('.winSeele').text()))) {
                updateBetAndPayoutOnWin()
            }
        }).catch(err => {console.log(err)})
    }, 1000)
}

function updateBetAndPayoutOnWin() {
    // Bet
    let newBet = seeleutil.toFan($('#bets').val())
    if (getMaxUserBet().lt(newBet)) {
        newBet = getMaxUserBet()
        $('#bets').val(seeleutil.fromFan(newBet))
    }
    if (dice.MIN_BET.gt(newBet)) {
        newBet = dice.MIN_BET
        $('#bets').val(seeleutil.fromFan(newBet))
    }
    
    // RollUnder - todo - bar need change
    let rollUnder = $('#rollUnder').text()
    if (rollUnder > dice.MAX_ROLLUNDER) {
        rollUnder = dice.MAX_ROLLUNDER
    }
    if (rollUnder < dice.MIN_ROLLUNDER) {
        rollUnder = dice.MIN_ROLLUNDER
    }
    $('#rollUnder').text(rollUnder)

    // Payout On Win
    let winSeele = dice.GetDiceWinAmount(newBet, rollUnder)
    if (maxPayoutOnWin && maxPayoutOnWin.lt(winSeele)) {
        winSeele = maxPayoutOnWin
    }
    $('.winSeele').text(seeleutil.fromFan(winSeele))
    $('#payout').text(seeleutil.toBigNumber(winSeele).div(newBet))
}

// Get max user bet against contract balance and payout
function getMaxUserBet() {
    if (userBalance && userBalance.lt(dice.MAX_BET)) {
        return userBalance
    }
    return dice.MAX_BET
}

function refreshAllBets(txHash){
    dice.GetReceipt(txHash).then(data => {
        if (!data){
            return
        }
        showBets('All', data)
    }).catch(err => {console.log(err)})
  }