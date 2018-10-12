/* 
author: Miya_yang
time:2018.10.11
*/
$(document).ready(function($) {
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
  bar.onmousedown = function(event) {
    var event = event || window.event;
    var leftVal = event.clientX - this.offsetLeft;
    var that = this;
    document.onmousemove = function(event) {
      var event = event || window.event;
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
      } else {
        mask.style.width = barleft + 10 + 'px';
        ptxt.style.left = barleft - 18 + 'px';
        that.style.left = barleft + 'px';
      }
      ptxt.innerHTML = parseInt(barleft / (scroll.offsetWidth - bar.offsetWidth) * 100);
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    }

  }
  document.onmouseup = function() {
    document.onmousemove = null;
  }
  // repair javascript Floating-point number bug
  function accMul(arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }
  Number.prototype.mul = function(arg) {
    return accMul(arg, this);
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
        $('.bets ul li').click(function() {
          $(this).siblings('li').removeClass('current')
          $(this).addClass('current')
        })
        $('.getVal').val(balance / 4)
        $('.winSeele').text(balance / 2)
      } else {
        $('.halve').click(function() {
          var betsSeeleHalve = $('.getVal').val() / 2
          $('.multiple,.all').removeClass('current')
          $(this).addClass('current')
          $('.getVal').val($('.getVal').val() / 2)
          $('.winSeele').text((betsSeeleHalve).mul(getOdds))
        })
        $('.multiple').click(function() {
          var betsSeeleMul = $('.getVal').val() * 2
          $('.halve,.all').removeClass('current')
          $(this).addClass('current')
          $('.getVal').val($('.getVal').val() * 2)
          $('.winSeele').text((betsSeeleMul).mul(getOdds))
        })
        $('.all').click(function() {
          var betsSeeleAll = 5000 //usrs.balance
          $('.multiple,.halve').removeClass('current')
          $(this).addClass('current')
          $('.getVal').val(betsSeeleAll)
          $('.winSeele').text((betsSeeleAll).mul(getOdds))
        })
      }
    } else {
      $('.halve').click(function() {
        $('.multiple,.all').removeClass('current')
        $(this).addClass('current')
        $('.getVal').val($('.getVal').val() / 2)
        $('.winSeele').text(indemnity)
      })
      $('.multiple').click(function() {
        $('.halve,.all').removeClass('current')
        $(this).addClass('current')
        $('.getVal').val($('.getVal').val() * 2)
        $('.winSeele').text(indemnity)
      })
      $('.all').click(function() {
        $('.login').show()
      })
    }
  } else {}

  $('.login').hide()
  // login close
  $('.close,.loginTab_container button').click(function() {
    $('.login').hide()
  })
  // show login
  $('.loginButton button,.quicklink button').click(function() {
    $('.login').show()
  })
});