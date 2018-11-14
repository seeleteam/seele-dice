/* 
author: Miya_yang
time:2018.10.11
*/
const dice = require('dice2.js')
const FAN = Number(100000000) // seele

$(document).ready(function ($) {
  // tab
  $('#tab').tabulous({
    effect: 'slideLeft'
  })
  // login
  $('#loginTab').tabulous({
    effect: 'flip'
  })

  // progress
  var scroll = document.getElementById('scroll')
  var bar = document.getElementById('bar')
  var mask = document.getElementById('mask')
  var ptxt = document.getElementsByTagName('p')[0]
  var barleft = 0
  ptxt.innerHTML = '0'
  $('.getOdds').text('0')
  // setWin
  $('.setWin').text('0')
  // setChance
  $('.setChance').text('0')
  bar.onmousedown = function (event) {
    var event = event || window.event
    var leftVal = event.clientX - this.offsetLeft
    var that = this
    document.onmousemove = function (event) {
      var event = event || window.event
      var currentVal = $('#scroll p').text()
      barleft = event.clientX - leftVal
      if (barleft < 0) {
        barleft = 0
      } else if (barleft > scroll.offsetWidth - bar.offsetWidth) {
        barleft = scroll.offsetWidth - bar.offsetWidth
      }
      if (ptxt.innerHTML == '100') {
        mask.style.width = barleft + 20 + 'px'
        ptxt.style.left = barleft - 10 + 'px'
        that.style.left = barleft + 10 + 'px'
      } else if (ptxt.innerHTML == '0') {
        mask.style.width = barleft + 10 + 'px'
        ptxt.style.left = '-26px'
        that.style.left = '-7px'
        $('.getOdds').text('0')
        // setWin
        $('.setWin').text('0')
        // setChance
        $('.setChance').text('0')
      } else {
        mask.style.width = barleft + 10 + 'px'
        ptxt.style.left = barleft - 18 + 'px'
        that.style.left = barleft + 'px'
        // odds calculation
        $('.getOdds').text(Number(100).division(currentVal).toFixed(3))
        payoutOnWinChange()
      }
      ptxt.innerHTML = parseInt(barleft / (scroll.offsetWidth - bar.offsetWidth) * 100)
      // setWin
      $('.setWin').text(ptxt.innerHTML)
      // setChance
      $('.setChance').text(ptxt.innerHTML - 1)
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
    }
  }
  document.onmouseup = function () {
    document.onmousemove = null
  }
  // repair javascript Floating-point number bug
  function accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString()
    s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  }
  Number.prototype.mul = function (arg) {
    return accMul(arg, this);
  }

  function accDiv(arg1, arg2) {
    var t1 = 0,
      t2 = 0,
      r1, r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {}
    with(Math) {
      r1 = Number(arg1.toString().replace('.', ''))
      r2 = Number(arg2.toString().replace('.', ''))
      return (r1 / r2) * pow(10, t2 - t1);
    }
  }
  Number.prototype.division = function (arg) {
    return accDiv(this, arg)
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
  // login variable
  $('.loginHeadButton').show()
  $('.loginButton').show()
  $('.noData').show()
  $('.dataError').show()

  // show login
  $('.loginButton button,.loginHeadButton').click(function () {
    $('.login').show()
    $('.register').hide()
  })
  $('.register button').click(function () {
    var public = $('.register-public').text()
    var private = $('.register-private').text()
    $('#username').val(public)
    $('#private').val(private)
    $('.login').show()
    $('.register').hide()
  })
  // login close
  $('.close').click(function () {
    $('.login').hide()
    $('.register').hide()
  })

  // 128-bit key
  var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  // aes encryption
  function aesEncryption(text) {
    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(text)
    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    var encryptedBytes = aesCtr.encrypt(textBytes);
    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex
  }
  // aes Decrypt
  function aesDecrypt(encryptedHex) {
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5))
    var decryptedBytes = aesCtr.decrypt(encryptedBytes)
    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedText
  }
  // Start with 0x,English and integer only.     
  jQuery.validator.addMethod('isSpecialChar', function (value, element) {
    return this.optional(element) || /^0x[A-Za-z0-9_-]+$/.test(value)
  }, 'Start with 0x,English and integer only.')
  // return validform result
  function validform() {
    return $('#loginValidate').validate({
      debug: true,
      onkeyup: false,
      rules: {
        username: {
          required: true,
          isSpecialChar: true,
          minlength: '32'
        },
        private: {
          required: true,
          minlength: '32'
        }
        // password: {
        //   required: true
        // }
      },
      messages: {
        username: {
          required: 'Keyfile can not be empty.',
          rangelength: 'English and numeric input only.',
          isSpecialChar: 'Start with 0x,English and integer only.',
          minlength: 'Please input not less than 32 characters.'
        },
        private: {
          required: 'Password can not be empty.',
          minlength: 'Please input not less than 32 characters.'
        }
      }
    })
  }
  $(validform())

  // Numerical conversion
  function balanceValueInteger(value) {
    var stringVal = (value / 100000000).toString()
    if (!/^\d+$/.test(stringVal)) {
      var valueSplit = stringVal.split('.')
      var integer = valueSplit[0]
      return Number(integer)
    } else if (/^\d+$/.test(stringVal)) {
      return Number(value / 100000000)
    } else {
      return Number(value)
    }
  }

  function balanceValueDecimal(value) {
    var stringVal = (value / 100000000).toString()
    if (!/^\d+$/.test(stringVal)) {
      var valueSplit = stringVal.split('.')
      var decimal = valueSplit[1]
      return '.' + decimal
    } else if (/^\d+$/.test(stringVal)) {
      return ''
    } else {
      return ''
    }
  }

  // get block height
  // dice.GetHeight(function (data) {
  //   if (data instanceof Error) {
  //     console.log('callback Error GetHeight')
  //     console.log('GetHeight' + data)
  //     return
  //   }
  //   var height = data
  //   // $('.getAllBetsVal').text(height)
  //   // console.log(blockHx)
  //   blockHx
  //   // var getAllBetsHeight = $('.getAllBetsVal').text()
  //   // var blockHx = dice.FilterBlockTx(getAllBetsHeight, function (data) {})
  //   // get block hash 
  //   var blockHx = setInterval(function () {
  //     dice.FilterBlockTx(height, function (data) {
  //       console.log('callback')
  //       console.log(height)
  //       if (data === 'end') {
  //         $('.dataSuccess').hide()
  //         $('.dataError').show()
  //         height = height + 1
  //         blockHx
  //         console.log(height)
  //         console.log('fileter over')
  //         console.log('FilterBlockTxEnd' + data)
  //         return
  //       }
  //       if (data instanceof Error) {
  //         $('.dataSuccess').hide()
  //         $('.dataError').show()
  //         // let height = height + 1
  //         // blockHx
  //         // console.log(height + 'error')
  //         console.log('callback Error')
  //         console.log('FilterBlockTxError' + data)
  //         return
  //       } else {
  //         window.clearInterval(blockHx)
  //       }
  //       var txHash = data.blockHash
  //       // get all bets info
  //       dice.GetReceipt(txHash, function (data) {
  //         console.log('callback')
  //         if (data instanceof Error) {
  //           console.log('callback Error')
  //           console.log(data)
  //           return
  //         }
  //         $('.dataError').hide()
  //         if (data.Event == 'winAction') {
  //           var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + balanceValueInteger(data.Bet) + balanceValueDecimal(data.Bet) + ' Seele' + '</td>' + '<td>' + data.Roll + '</td>' + '<td style="color:#d3f709;">' + balanceValueInteger(data.Payout) + balanceValueDecimal(data.Payout) + ' Seele' + '</td>' + '</tr>'
  //         } else if (data.Event == 'lossAction') {
  //           var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + balanceValueInteger(data.Bet) + balanceValueDecimal(data.Bet) + ' Seele' + '</td>' + '<td style="color:#f20765;">' + data.Roll + '</td>' + '<td>' + '</td>' + '</tr>'
  //         }
  //         $('.dataError').after(pushTr)
  //         var height = $('#tabs_container').height()
  //         var trNumber = $('.showleft').find('tr')
  //         if (trNumber.length < 3) {
  //           height = height
  //         } else {
  //           var tableHeight = trNumber.length - 2
  //           height = 80 + (42 * tableHeight)
  //         }
  //         $('#tabs_container').css('min-height', height + 'px')
  //         window.clearInterval(blockHx)
  //         $('.result').hide()
  //         $('.dask').hide()
  //         console.log('callback Success')
  //       })
  //     })
  //   }, 3000)
  // })

  // Initial bet amount
  $('.getVal').val(0.5)
  // watch decimal
  function watchDecimal(number) {
    var pointLocation = String(number).indexOf('.') + 1
    var count = String(number).length - pointLocation
    if (count > 9) {
      return number.toFixed(9)
    } else {
      return number
    }
  }



  // Half button
  $('.halve').click(function () {
    updateBetAndPayoutOnWin(watchDecimal($('.getVal').val() / 2))
    $('.multiple,.all').removeClass('current')
    $(this).addClass('current')
  })

  // Double button
  $('.multiple').click(function () {
    updateBetAndPayoutOnWin(watchDecimal($('.getVal').val() * 2))
    $('.halve,.all').removeClass('current')
    $(this).addClass('current')
  })

  // Max button
  $('.all').click(function () {
    $('.multiple,.halve').removeClass('current')
    $(this).addClass('current')
    updateBetAndPayoutOnWin(dice.MAX_BET)
  })

  function updateBetAndPayoutOnWin(newBet) {
    // Bet
    newBet *= FAN;
    if (newBet > dice.MAX_BET) {
      newBet = dice.MAX_BET
    }
    if (newBet < dice.MIN_BET) {
      newBet = dice.MIN_BET
    }
    $('#bets').val(watchDecimal(newBet/FAN))

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
    $('.winSeele').text(watchDecimal(winSeele/FAN))
    $('#payout').text(winSeele/newBet)
  }

  // Refresh user and contract balance
  var refreshBalanceId, maxPayoutOnWin

  function refreshBalance() {
    // user balance
    var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    refreshBalanceId = setInterval(function () {
      dice.GetBalance(userJsonStrUser.username).then(data => {
        $('.accountBalance').text(data.Balance / 100000000)
      }).catch(err => {console.log(err)})
    }, 1000)

    // contract balance
    setInterval(function () {
      dice.GetBalance(dice.ContractAddress).then(data => {
        maxPayoutOnWin = Number(data.Balance / 2)
        if (watchDecimal($('.winSeele').text()) > maxPayoutOnWin) {
          updateBetAndPayoutOnWin(dice.MAX_BET)
        }
      }).catch(err => {console.log(err)})
    }, 1000)
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
    dice.Roll(keypair, args).then(data => {
      $('.result').show()
      $('.dask').show()
      $('.result').text('Loading results...')
      $('.noData').hide()
      if (data.Event == 'winAction') {
        var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + watchDecimal(data.Bet/FAN) + ' Seele' + '</td>' + '<td>' + data.Roll + '</td>' + '<td style="color:#d3f709;">' + watchDecimal(data.Payout/FAN) + ' Seele' + '</td>' + '</tr>'
      } else if (data.Event == 'lossAction') {
        var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + watchDecimal(data.Bet/FAN)+ ' Seele' + '</td>' + '<td style="color:#f20765;">' + data.Roll + '</td>' + '<td>' + '</td>' + '</tr>'
      }
      $('.noData').after(pushTr)
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
    }).catch(err => {console.log(err)})
  }

  // User login
  $('.loginShow').click(function () {
    if (validform().form()) {
      var getUsername = $('#username').val()
      var getPrivate = aesEncryption($('#private').val())
      var keyArray = {
        username: getUsername,
        private: getPrivate
      }
      sessionStorage.setItem('user', JSON.stringify(keyArray))
      $('.getUserName').text(getUsername)

      $('.login,.loginHeadButton,.loginButton').hide()
      $('.loginImg,.rollButton').show()
      refreshBalance()
    }
  })
  // User register
  $('.registerShow').click(function () {
    let public = $('#username').val()
    if (public.includes('0x')) {
      $('.result-register').show()
      $('.dask').show()
      $('.register').hide()
      $('.login').show()
    } else {
      $('.register').show()
      $('.login').hide()
    }
  })
  $('.result-cancel').click(function () {
    $('.result-register').hide()
    $('.dask').hide()
  })
  $('.result-ok').click(function () {
    $('.register').show()
    $('.login').hide()
    $('.result-register').hide()
    $('.dask').hide()
  })
  // longinImg,personalInformation mouse
  $('.loginImg,.personalInformation').mouseover(function () {
    $('.personalInformation').show()
  })
  $('.loginImg,.personalInformation').mouseleave(function () {
    $('.personalInformation').hide()
  })

  // Payout On Win Change
  function payoutOnWinChange() {
    var betsSeele = $('.getVal').val()
    var getOdds = $('.getOdds').text()
    var indemnity = Number(betsSeele).mul(getOdds)
    $('.winSeele').text(indemnity)
  }
  // BET AMOUNT Change
  $('.getVal').keyup(function () {
    payoutOnWinChange()
  })

  // logout
  $('.logout').click(function () {
    $('.loginHeadButton,.loginButton').show()
    $('.loginImg,.rollButton,.personalInformation').hide()
    sessionStorage.clear()
    window.clearInterval(refreshBalanceId)
    $('#username').val('')
    $('#private').val('')
  })

  // transaction popup
  $('.rollButton button').click(function () {
    // pulic
    var bet = watchDecimal($('.getVal').val())
    var roll = $('.setWin').text()
    var payout = watchDecimal($('.winSeele').text())
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
  $('.getImageName').change(function () {
    var str = $(this).val()
    var fileName = getFileName(str)
    var fileExt = str.substring(str.lastIndexOf('.') + 1)
    $('.setImageName').val(fileName)
    // console.log(fileName + '\r\n' + fileExt);
  })
})