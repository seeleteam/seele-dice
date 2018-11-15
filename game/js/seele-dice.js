/* 
author: Miya_yang
time:2018.10.11
*/
const dice = require('dice2.js')
const seeleutil = require('seele-util.js')

let alltimes = seeleutil.toBigNumber(0), usertimes = alltimes, allwin = alltimes, userwin = alltimes, allwintimes = alltimes, userwintimes = alltimes
$(document).ready(function ($) {
  // tab
  $('#tab').tabulous({
    effect: 'slideLeft'
  })

  // Initial bet amount
  $('.getVal').val(0.5)

  // transaction popup
  $('.rollButton button').click(function () {
    // pulic
    var bet = $('.getVal').val()
    var roll = $('.setWin').text()
    var payout = $('.winSeele').text()
    var gasPricePost = 1
    var gasLimitPost = 3000000
    if (bet == '') {
      $('.result').show()
      $('.result').text('Please bet first.')
      setTimeout(function () {
        $('.result').hide()
      }, 2000)
      return false
    } else if (roll == '0') {
      $('.result').show()
      $('.result').text('Please play a game first.')
      setTimeout(function () {
        $('.result').hide()
      }, 2000)
      return false
    }
    // get username
    var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    var getStorageUsername = userJsonStrUser.username

    $('.from').text(getStorageUsername)
    $('.betAmount').text(bet)
    $('.payOut').text(payout)
    $('.gasPrice').val(gasPricePost)
    $('.gasLimit').val(gasLimitPost)
    $('.rollUnder').text(roll)

    // get nonce
    dice.GetAccountNonce(getStorageUsername).then(nonce => {
      $('.transactionMain table tr:nth-child(4) td:nth-child(2)').text(nonce)
    }).catch(err => {console.log(err)})
    $('.transaction').show()
  })
  // close transction
  $('.transaction ul li:nth-child(1) button,.transaction .close').click(function () {
    $('.transaction').hide()
  })
  // post transction data
  $('.transaction ul li:nth-child(2) button').click(function () {
    reRollResult()
    $('.transaction').hide()
  })
  // close playPopup
  $('.playPopup .close').click(function () {
    $('.playPopup').hide()
  })
  // show how to play
  $('.play').click(function () {
    $('.playPopup').show()
  })
  $('.getImageName').change(function () {
    var str = $(this).val()
    var fileName = getFileName(str)
    var fileExt = str.substring(str.lastIndexOf('.') + 1)
    $('.setImageName').val(fileName)
    // console.log(fileName + '\r\n' + fileExt);
  })
})

function showBets(obj, data){
    let pushTr
    if (data.Event == 'winAction') {
        pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + seeleutil.fromFan(data.Bet) + ' Seele' + '</td>' + '<td>' + data.Roll + '</td>' + '<td style="color:#d3f709;">' + seeleutil.fromFan(data.Payout) + ' Seele' + '</td>' + '</tr>'
    } else if (data.Event == 'lossAction') {
        pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + seeleutil.fromFan(data.Bet)+ ' Seele' + '</td>' + '<td style="color:#f20765;">' + data.Roll + '</td>' + '<td>' + '</td>' + '</tr>'
    }
    if (obj == 'All'){ // AllBets
        $('.dataError').hide()
        $('.dataError').after(pushTr)
        alltimes = alltimes.plus(1)
        allwintimes = data.Event == 'winAction' ? allwintimes.plus(1) : allwintimes
        $('.all-number').text(alltimes)
        $('.all-individual').text(allwintimes.div(alltimes).times(100))
    } else { // MyBets
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
}

function reRollResult() {
    // get sessionStorage
    var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    // get private
    var getStoragePrivate = aesDecrypt(userJsonStrUser.private)

    // post data
    var from = $('.from').text()
    var betAmount = Math.floor($('.betAmount').text() * 100000000)
    var rollPayout = Math.floor($('.payOut').text() * 100000000)
    var gasPrice = $('.gasPrice').val()
    var gasLimit = $('.gasLimit').val()
    var rollUnder = $('.rollUnder').text()

    // sendTx
    var keypair = {
      'PublicKey': from,
      'PrivateKey': getStoragePrivate
    }
    var args = {
      'RollUnder': Number(rollUnder),
      'Payout': Number(rollPayout),
      'Bet': Number(betAmount),
      'GasPrice': Number(gasPrice),
      'GasLimit': Number(gasLimit)
    }
    $('.result').show()
    $('.dask').show()
    $('.result').text('Loading results...')
    dice.Roll(keypair, args).then(data => {
      showBets('My', data)
    }).catch(err => {
      console.log(err)
      $('.result').hide()
      $('.dask').hide()
    })
}

// get file name
function getFileName(path) {
    var pos1 = path.lastIndexOf('/')
    var pos2 = path.lastIndexOf('\\')
    var pos = Math.max(pos1, pos2)
    if (pos < 0) {
    return path
    } else {
    return path.substring(pos + 1)
    }
}

// date change
function date() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var date1 = date.getDate()
    var hour = date.getHours()
    var minutes = date.getMinutes()
    var second = date.getSeconds()
    var dateNew = year + '-' + month + '-' + date1 + ' ' + hour + ':' + minutes + ':' + second
    return dateNew
}