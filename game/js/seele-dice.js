/* 
author: Miya_yang
time:2018.10.11
*/
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
  var scroll = document.getElementById('scroll');
  var bar = document.getElementById('bar');
  var mask = document.getElementById('mask');
  var ptxt = document.getElementsByTagName('p')[0];
  var barleft = 0;
  ptxt.innerHTML = "0";
  bar.onmousedown = function (event) {
    var event = event || window.event;
    var leftVal = event.clientX - this.offsetLeft;
    var that = this;
    document.onmousemove = function (event) {
      var event = event || window.event;
      var currentVal = $('#scroll p').text()
      barleft = event.clientX - leftVal;
      if (barleft < 0) {
        barleft = 0;
      } else if (barleft > scroll.offsetWidth - bar.offsetWidth) {
        barleft = scroll.offsetWidth - bar.offsetWidth;
      }
      if (ptxt.innerHTML == '100') {
        mask.style.width = barleft + 20 + 'px';
        ptxt.style.left = barleft - 10 + "px";
        that.style.left = barleft + 10 + "px";
      } else if (ptxt.innerHTML == '0') {
        mask.style.width = barleft + 10 + 'px';
        ptxt.style.left = "-26px";
        that.style.left = "-7px";
        $('.getOdds').text('0')
      } else {
        mask.style.width = barleft + 10 + 'px';
        ptxt.style.left = barleft - 18 + 'px';
        that.style.left = barleft + 'px';
        // odds calculation
        $('.getOdds').text((100).division(currentVal).toFixed(3))
      }
      ptxt.innerHTML = parseInt(barleft / (scroll.offsetWidth - bar.offsetWidth) * 100);
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }

  }
  document.onmouseup = function () {
    document.onmousemove = null;
  }
  // repair javascript Floating-point number bug
  function accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) { }
    try {
      m += s2.split(".")[1].length
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }
  Number.prototype.mul = function (arg) {
    return accMul(arg, this);
  }

  function accDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * pow(10, t2 - t1);
    }
  }
  Number.prototype.division = function (arg) {
    return accDiv(this, arg);
  }

  // bets click
  var betsSeele = $('.getVal').val()
  if (betsSeele !== '' || betsSeele !== null) {
    var isLogin = true
    var getOdds = $('.getOdds').text()
    var indemnity = betsSeele * getOdds
    $('.winSeele').text(indemnity)
    if (isLogin == true) {
      var balance = 20000000
      var mostBets = balance / 2
      if (indemnity > mostBets) {
        var indemnity = betsSeele * getOdds
        $('.winSeele').text(indemnity)
        $('.bets ul li').click(function () {
          $(this).siblings('li').removeClass('current')
          $(this).addClass('current')
        })
        $('.getVal').val(balance / 4)
        $('.winSeele').text(balance / 2)
      } else {
        $('.halve').click(function () {
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
          var getOdds = $('.getOdds').text()
          var indemnity = betsSeele * getOdds
          $('.winSeele').text(indemnity)
          var betsSeeleAll = 5000 //usrs.balance
          $('.multiple,.halve').removeClass('current')
          $(this).addClass('current')
          $('.getVal').val(betsSeeleAll)
          $('.winSeele').text((betsSeeleAll).mul(getOdds))
        })
      }
    } else {
      $('.halve').click(function () {
        var getOdds = $('.getOdds').text()
        var indemnity = betsSeele * getOdds
        $('.winSeele').text(indemnity)
        $('.multiple,.all').removeClass('current')
        $(this).addClass('current')
        $('.getVal').val($('.getVal').val() / 2)
        $('.winSeele').text(indemnity)
      })
      $('.multiple').click(function () {
        var getOdds = $('.getOdds').text()
        var indemnity = betsSeele * getOdds
        $('.winSeele').text(indemnity)
        $('.halve,.all').removeClass('current')
        $(this).addClass('current')
        $('.getVal').val($('.getVal').val() * 2)
        $('.winSeele').text(indemnity)
      })
      $('.all').click(function () {
        $('.login').show()
      })
    }
  } else { }

  $('.loginImg').hide()
  $('.loginHeadButton').show()
  $('.personalInformation').hide()
  $('.rollButton').hide()
  $('.loginButton').show()
  $('.transaction').hide()
  $('.login').hide()
  $('.playPopup').hide()
  // login close
  $('.login .close,.loginTab_container button').click(function () {
    $('.login').hide()
    $('.loginImg').show()
    $('.loginHeadButton').hide()
    $('.rollButton').show()
    $('.loginButton').hide()
  })
  // show login
  $('.loginButton button,.quicklink button').click(function () {
    $('.login').show()
  })
  // longinImg mouse
  $('.loginImg').mouseover(function () {
    $('.personalInformation').show()
  })
  $(document).bind("click", function () {
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
    $('.transaction').show()
  })
  // close transction
  $('.transaction ul li:nth-child(1) button,.transaction .close').click(function () {
    $('.transaction').hide()
  })
  // post transction data
  $('.transaction ul li:nth-child(2) button').click(function () {
    // post data
    // var from = $('.transactionMain table tr:nth-child(1) td:nth-child(2)').text()
    // var to = $('.transactionMain table tr:nth-child(2) td:nth-child(2)').text()
    // var amount = $('.transactionMain table tr:nth-child(3) td:nth-child(2)').text()
    // var accountNonce = $('.transactionMain table tr:nth-child(4) td:nth-child(2)').text()
    // var quantity = $('.transactionMain table tr:nth-child(5) td:nth-child(2)').text()
    // var gasPrice = $('.transactionMain table tr:nth-child(6) td:nth-child(2)').text()
    // var gasLimit = $('.transactionMain table tr:nth-child(7) td:nth-child(2)').text()
    // var payload = $('.transactionMain table tr:nth-child(8) td:nth-child(2)').text()
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
});