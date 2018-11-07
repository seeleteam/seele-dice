/* 
author: Miya_yang
time:2018.10.11
*/
const dice = require('dice.js')
const minUserBet = 0.00000001 // seele

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
  $('.loginButton button').click(function () {
    $('.login').show()
  })
  // login close
  $('.close').click(function () {
    $('.login').hide()
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
  // setInterval(function () {
  //   // get block height
  //   dice.GetHeight(function (data) {
  //     if (data instanceof Error) {
  //       console.log('callback Error GetHeight')
  //       console.log('GetHeight' + data)
  //       return
  //     }
  //     var height = data
  //     // get block hash 
  //     dice.FilterBlockTx(height, function (data) {
  //       console.log('callback')
  //       if (data === 'end') {
  //         $('.dataSuccess').hide()
  //         $('.dataError').show()
  //         console.log('fileter over')
  //         console.log('FilterBlockTx' + data)
  //         return
  //       }
  //       if (data instanceof Error) {
  //         $('.dataSuccess').hide()
  //         $('.dataError').show()
  //         console.log('callback Error')
  //         console.log('FilterBlockTx' + data)
  //         return
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
  //         $('.dataSuccess').show()
  //         $('.dataError').hide()
  //         $('.listTimeAll').text(date(data.Time))
  //         $('.listBetAll').text(data.Bettor)
  //         $('.listRollUnderAll').text(data.RollUnder)
  //         $('.listBetAll').text(balanceValueInteger(data.Bet) + balanceValueDecimal(data.Bet))
  //         $('.listRollAll').text(data.Roll)
  //         $('.listPayoutAll').text(balanceValueInteger(data.Payout) + balanceValueDecimal(data.Payout))
  //         console.log('callback Success')
  //       })
  //       console.log('callback Success')
  //     })
  //     console.log('callback Success')
  //   })
  // }, 3000)

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
    if (maxPayoutOnWin > 0) {
      updateBetAndPayoutOnWin(getMaxUserBet())
      $('.multiple,.halve').removeClass('current')
      $(this).addClass('current')
    }
  })

  function updateBetAndPayoutOnWin(newBet) {
    // Bet
    if (newBet > getMaxUserBet()) {
      newBet = getMaxUserBet()
    }
    if (newBet < minUserBet) {
      newBet = minUserBet
    }
    $('.getVal').val(watchDecimal(newBet))
    // Payout On Win
    var getOdds = $('.getOdds').text()
    if (getOdds > 0) {
      $('.winSeele').text(watchDecimal(Number(newBet).mul(getOdds)))
    }
  }

  // Get max user bet against contract balance and payout
  function getMaxUserBet() {
    if (maxPayoutOnWin > 0) {
      var payout = $('.getOdds').text()
      return maxPayoutOnWin / payout
    }
  }

  // Refresh user and contract balance
  var refreshBalanceId, maxPayoutOnWin

  function refreshBalance() {
    // user balance
    var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    refreshBalanceId = setInterval(function () {
      dice.GetBalance(userJsonStrUser.username, function (data) {
        if (data instanceof Error) {
          return
        }
        $('.accountBalance').text(data.Balance / 100000000)
      })
    }, 1000)

    // contract balance
    setInterval(function () {
      dice.GetBalance(dice.ContractAddress, function (data) {
        if (data instanceof Error) {
          return
        }
        maxPayoutOnWin = Number(data.Balance / 200000000)
        if (watchDecimal($('.winSeele').text()) > maxPayoutOnWin) {
          updateBetAndPayoutOnWin(getMaxUserBet())
        }
      })
    }, 1000)
  }

  // Refresh roll result
  var reRollResultId

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
    dice.Sendtx(keypair, args, function (data) {
      if (data instanceof Error) {
        return
      }
      reRollResultId = setInterval(function () {
        $('.result').show()
        $('.dask').show()
        $('.result').text('Loading results...')
        dice.GetReceipt(data, function (data) {
          if (data instanceof Error) {
            // console.log(data + 'my bets')
            return
          }
          $('.noData').hide()
          if (data.Event == 'winAction') {
            var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + balanceValueInteger(data.Bet) + balanceValueDecimal(data.Bet) + ' Seele' + '</td>' + '<td>' + data.Roll + '</td>' + '<td style="color:#d3f709;">' + balanceValueInteger(data.Payout) + balanceValueDecimal(data.Payout) + ' Seele' + '</td>' + '</tr>'
          } else if (data.Event == 'lossAction') {
            var pushTr = '<tr>' + '<td>' + date(data.Time) + '</td>' + '<td>' + data.Bettor + '</td>' + '<td>' + data.RollUnder + '</td>' + '<td>' + balanceValueInteger(data.Bet) + balanceValueDecimal(data.Bet) + ' Seele' + '</td>' + '<td style="color:#f20765;">' + data.Roll + '</td>' + '<td>' + '</td>' + '</tr>'
          }
          $('.noData').after(pushTr)
          var height = $('#tabs_container').height()
          var trNumber = $('.showleft').find('tr')
          console.log(trNumber.length)
          if (trNumber.length < 3) {
            height = height
          } else {
            var tableHeight = trNumber.length - 2
            height = 80 + (42 * tableHeight)
          }
          $('#tabs_container').css('min-height', height + 'px')
          window.clearInterval(reRollResultId)
          $('.result').hide()
          $('.dask').hide()
        })
      }, 3000)
    })
  }

  // Show login box
  $('.loginHeadButton').click(function () {
    $('.login').show()
  })

  // User login
  $('#loginTab-1 button').click(function () {
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
    dice.GetAccountNonce(getStorageUsername, function (data) {
      console.log('callback')
      if (data instanceof Error) {
        console.log('callback Error')
        console.log('GetAccountNonce' + data)
        return
      }
      console.log('callback Success')
      $('.transactionMain table tr:nth-child(4) td:nth-child(2)').text(data)
    })
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