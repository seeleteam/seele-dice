const MIN_LEFT = 5
const MAX_RIGHT = 96
$(function(){
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

    // BET AMOUNT Change
    $('.getVal').keyup(function () {
        payoutOnWinChange()
    })
})

// Payout On Win Change
function payoutOnWinChange() {
    var betsSeele = $('.getVal').val()
    var getOdds = $('.getOdds').text()
    var indemnity = Number(betsSeele).mul(getOdds)
    $('.winSeele').text(indemnity)
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