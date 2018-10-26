/* 
author: Miya_yang
time:2018.10.11
*/
const dice = require('dice.js')
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
        $('.getOdds').text((100).division(currentVal).toFixed(3))
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
      return formatNumber(integer)
    } else if (/^\d+$/.test(stringVal)) {
      return formatNumber(value / 100000000)
    } else {
      return formatNumber(value)
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
  dice.GetHeight(function (data) {
    if (data instanceof Error) {
      console.log('callback Error GetHeight')
      return
    }
    var height = data
    // get block hash 
    dice.FilterBlockTx(height, function (data) {
      console.log('callback')
      console.log(data)
      if (data === 'end') {
        $('.dataSuccess').hide()
        $('.dataError').show()
        console.log('fileter over')
        return
      }
      if (data instanceof Error) {
        $('.dataSuccess').hide()
        $('.dataError').show()
        console.log('callback Error')
        return
      }
      var txHash = data.blockHash
      // get all bets info
      dice.GetReceipt(txHash, function (data) {
        console.log('callback')
        console.log(data)
        if (data instanceof Error) {
          console.log('callback Error')
          return
        }
        $('.dataSuccess').show()
        $('.dataError').hide()
        $('.listTimeAll').text(data.Time)
        $('.listBetAll').text(data.Bettor)
        $('.listRollUnderAll').text(data.RollUnder)
        $('.listBetAll').text(balanceValueInteger(data.Bet) + '.' + balanceValueDecimal(data.Bet))
        $('.listRollAll').text(data.Roll)
        $('.listPayoutAll').text(balanceValueInteger(data.Payout) + '.' + balanceValueDecimal(data.Payout))
        console.log('callback Success')
      })
      console.log('callback Success')
    })
    console.log('callback Success')
  })
  // No user login
  var betsSeele = $('.getVal').val()
  console.log(betsSeele)
  var getOdds = $('.getOdds').text()
  console.log(getOdds)
  var indemnity = betsSeele * getOdds
  console.log(indemnity)
  $('.winSeele').text(indemnity)
  $('.halve').click(function () {
    var betsSeele = $('.getVal').val()
    var getOdds = $('.getOdds').text()
    var indemnity = betsSeele * getOdds
    $('.winSeele').text(indemnity)
    var betsSeeleHalve = $('.getVal').val() / 2
    $('.multiple,.all').removeClass('current')
    $(this).addClass('current')
    $('.getVal').val($('.getVal').val() / 2)
    $('.winSeele').text((betsSeeleHalve).mul(getOdds))
  })
  $('.multiple').click(function () {
    var betsSeele = $('.getVal').val()
    var getOdds = $('.getOdds').text()
    var indemnity = betsSeele * getOdds
    $('.winSeele').text(indemnity)
    var betsSeeleMul = $('.getVal').val() * 2
    $('.halve,.all').removeClass('current')
    $(this).addClass('current')
    $('.getVal').val($('.getVal').val() * 2)
    $('.winSeele').text((betsSeeleMul).mul(getOdds))
  })
  $('.all').click(function () {
    var betsSeele = $('.getVal').val()
    var getOdds = $('.getOdds').text()
    var indemnity = betsSeele * getOdds
    $('.winSeele').text(indemnity)
    $('.multiple,.halve').removeClass('current')
    $(this).addClass('current')
    $('.login').show()
  })
  // click login
  $('#loginTab-1 button,.quicklink button').click(function () {
    if (validform().form()) {
      var getUsername = $('#username').val()
      var getPrivate = aesEncryption($('#private').val())
      var getPassword = $('#password').val()
      var keyArray = {
        username: getUsername,
        private: getPrivate,
        password: getPassword
      }
      sessionStorage.setItem('user', JSON.stringify(keyArray))
      var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
      var getStorageUsername = userJsonStrUser.username
      $('.getUserName').text(getStorageUsername)
      dice.GetBalance(getStorageUsername, function (data) {
        $('.login').hide()
        $('.loginImg').show()
        $('.loginHeadButton').hide()
        $('.rollButton').show()
        $('.loginButton').hide()
        if (data instanceof Error) {
          $('.accountBalance').text('0')
          // $('.halve,.multiple,.all').click(function() {
          //   $('.result').show()
          //   $('.result').text('Your balance is 0. Please check your account.')
          //   setTimeout(function() {
          //     $('.result').hide()
          //   }, 2000)
          //   return false
          // })
          return
        }
        // var betsSeele = $('.getVal').val()
        // var getOdds = $('.getOdds').text()
        // var indemnity = (betsSeele).mul(getOdds)
        // $('.winSeele').text(indemnity)
        // var balance = data.Balance / 100000000
        // var mostBets = balance / 2
        // $('.accountBalance').text(balance)
        // if (indemnity > mostBets) {
        //   $('.bets ul li').click(function() {
        //     $(this).siblings('li').removeClass('current')
        //     $(this).addClass('current')
        //   })
        //   $('.getVal').val(mostBets.division(getOdds))
        //   $('.winSeele').text(mostBets)
        // }
        // $('.halve').click(function() {
        //   var getOdds = $('.getOdds').text()
        //   var indemnity = (betsSeele).mul(getOdds)
        //   $('.winSeele').text(indemnity)
        //   var betsSeeleHalve = $('.getVal').val() / 2
        //   $('.multiple,.all').removeClass('current')
        //   $(this).addClass('current')
        //   $('.getVal').val($('.getVal').val() / 2)
        //   $('.winSeele').text((betsSeeleHalve).mul(getOdds))
        // })
        // $('.multiple').click(function() {
        //   var getOdds = $('.getOdds').text()
        //   var indemnity = (betsSeele).mul(getOdds)
        //   $('.winSeele').text(indemnity)
        //   var betsSeeleMul = $('.getVal').val() * 2
        //   $('.halve,.all').removeClass('current')
        //   $(this).addClass('current')
        //   $('.getVal').val($('.getVal').val() * 2)
        //   $('.winSeele').text((betsSeeleMul).mul(getOdds))
        // })
        // $('.all').click(function() {
        //   var getOdds = $('.getOdds').text()
        //   var indemnity = (betsSeele).mul(getOdds)
        //   $('.winSeele').text(indemnity)
        //   $('.multiple,.halve').removeClass('current')
        //   $(this).addClass('current')
        //   $('.getVal').val(balance)
        //   $('.winSeele').text((balance).mul(getOdds))
        // })
      })
    }
  })
  // longinImg mouse
  $('.loginImg').mouseover(function () {
    $('.personalInformation').show()
  })
  $(document).bind('click', function () {
    $('.personalInformation').hide()
  })
  // logout
  $('.logout').click(function () {
    $('.personalInformation').hide()
    $('.loginImg').hide()
    $('.loginHeadButton').show()
    $('.loginButton').show()
    $('.rollButton').hide()
  })
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
    $('.gasPrice').text(gasPricePost)
    $('.gasLimit').text(gasLimitPost)
    $('.rollUnder').text(roll)

    // get nonce
    dice.GetAccountNonce(getStorageUsername, function (data) {
      console.log('callback')
      console.log(data)
      if (data instanceof Error) {
        console.log('callback Error')
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
    // get sessionStorage
    var userJsonStrUser = JSON.parse(sessionStorage.getItem('user'))
    // get private
    var getStoragePrivate = aesDecrypt(userJsonStrUser.private)

    // post data
    var from = $('.from').text()
    var betAmount = $('.betAmount').text() * 100000000
    var rollPayout = $('.payOut').text()
    var gasPrice = $('.gasPrice').text()
    var gasLimit = $('.gasLimit').text()
    var rollUnder = $('.rollUnder').text()

    // sendTx
    var keypair = {
      'PublicKey': from,
      'PrivateKey': getStoragePrivate
    }
    var args = {
      'RollUnder': rollUnder,
      'Payout': rollPayout,
      'Bet': betAmount,
      'GasPrice': gasPrice,
      'GasLimit': gasLimit
    }
    dice.Sendtx(keypair, args, function (data) {
      if (data instanceof Error) {
        console.log('callback Error')
        return
      } else {
        dice.GetReceipt(data, function (data) {
          console.log('callback')
          console.log(data)
          if (data instanceof Error) {
            console.log('callback Error')
            return
          }
          $('.listTime').text(data.Time)
          $('.listBet').text(data.Bettor)
          $('.listRollUnder').text(data.RollUnder)
          $('.listBet').text(balanceValueInteger(data.Bet) + '.' + balanceValueDecimal(data.Bet))
          $('.listRoll').text(data.Roll)
          $('.listPayout').text(balanceValueInteger(data.Payout) + '.' + balanceValueDecimal(data.Payout))
          $('.result').show()
          $('.beData').show()
          $('.noData').hide()
          if (data.Event == 'winAction') {
            $('.result').show()
            $('.result').text('Congratulations on winning.')
            setTimeout(function () {
              $('.result').hide()
            }, 2000)
          } else if (data.Event == 'lossAction') {
            $('.result').show()
            $('.result').text("I'm sorry you failed.")
            setTimeout(function () {
              $('.result').hide()
            }, 2000)
          }
          console.log('callback Success')
        })
      }
      console.log('callback Success')
    })
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