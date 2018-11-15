const REFRESH_INTERVAL_MILLISECONDS = 1000
let userBalance, maxWinSeele
let alltimes = seeleutil.toBigNumber(0), usertimes = alltimes, allwin = alltimes, userwin = alltimes, allwintimes = alltimes, userwintimes = alltimes
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
        dice.filterBlockTx(height, '2', dice.ContractAddress, REFRESH_INTERVAL_MILLISECONDS, refreshAllBets)
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
    }, REFRESH_INTERVAL_MILLISECONDS)
    
    // contract balance
    setInterval(function () {
        dice.GetBalance(dice.ContractAddress).then(data => {
            $('#poolAmount').text(seeleutil.fromFan(data.Balance))
            maxWinSeele = seeleutil.toBigNumber(data.Balance).div(2)
            if (maxWinSeele.lt(seeleutil.toFan($('.winSeele').text()))) {
                updateBetAndPayoutOnWin()
            }
        }).catch(err => {console.log(err)})
    }, REFRESH_INTERVAL_MILLISECONDS)
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
    if (winSeele.gt(maxWinSeele)){
        winSeele = maxWinSeele
    }
    $('.winSeele').text(seeleutil.fromFan(winSeele))
    $('#payout').text(seeleutil.toBigNumber(winSeele).div(newBet).toFixed(3))
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
        showBets(data)
    }).catch(err => {console.log(err)})
}

function showBets(data){
    // get username
    let userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    let bettor = userJsonStrUser ? userJsonStrUser.username : ''
    let pushTr
    if (data.Event == 'winAction') {
        pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + seeleutil.fromFan(data.Bet) + ' Seele' + '</td>' + '<td>' + data.Roll + '</td>' + '<td style="color:#d3f709;">' + seeleutil.fromFan(data.Payout) + ' Seele' + '</td>' + '</tr>'
    } else if (data.Event == 'lossAction') {
        pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + seeleutil.fromFan(data.Bet)+ ' Seele' + '</td>' + '<td style="color:#f20765;">' + data.Roll + '</td>' + '<td>' + '</td>' + '</tr>'
    }
    // AllBets
    $('.dataError').hide()
    $('.dataError').after(pushTr)
    alltimes = alltimes.plus(1)
    allwintimes = data.Event == 'winAction' ? allwintimes.plus(1) : allwintimes
    $('.all-number').text(alltimes)
    $('.all-individual').text(allwintimes.div(alltimes).times(100))
     // MyBets
    if (data.Bettor == bettor){
        $('.noData').hide()
        $('.noData').after(pushTr)
        usertimes = usertimes.plus(1)
        userwin = data.Event == 'winAction' ? userwin.plus(seeleutil.fromFan(seeleutil.toBigNumber(data.Payout).minus(data.Bet))) : userwin.minus(seeleutil.fromFan(data.Bet))
        userwintimes = data.Event == 'winAction' ? userwintimes.plus(1) : userwintimes
        $('.my-number').text(usertimes)
        $('.my-individual').text(userwintimes.div(usertimes).times(100))
        $('.profitBalance').text(userwin)
    }
    var height = $('#tabs_container').height()
    var trNumber = $('.showleft').find('tr')
    if (trNumber.length < 3) {
        height = height
    } else {
        var tableHeight = trNumber.length - 2
        height = 80 + (42 * tableHeight)
    }
    $('#tabs_container').css('min-height', height + 'px')
    $('.result').hide()
    $('.dask').hide()
    clearInterval(printResultID)
    clearTimeout(resultTimeOutID)
}
