const MIN_LEFT = 5, MIN_BAR_LFFT = 35
const MAX_RIGHT = 96, MAX_BAR_RIGHT = 20
$(function(){
    // progress
    let scroll = document.getElementById('scroll')
    let bar = document.getElementById('bar')
    let mask = document.getElementById('mask')
    let ptxt = document.getElementsByTagName('p')[0]
    bar.onmousedown = function (event) {
        event = event || window.event
        let leftVal = event.clientX - this.offsetLeft
        document.onmousemove = function (event) {
            event = event || window.event
            barleft = event.clientX - leftVal
            if (barleft < MIN_BAR_LFFT) {
                barleft = MIN_BAR_LFFT
            } else if (barleft > scroll.offsetWidth - bar.offsetWidth - MAX_BAR_RIGHT) {
                barleft = scroll.offsetWidth - bar.offsetWidth - MAX_BAR_RIGHT
            }
            mask.style.width = barleft + 10 + 'px'
            ptxt.style.left = barleft - 18 + 'px'
            bar.style.left = barleft + 'px'
            ptxt.innerHTML = parseInt(barleft / (scroll.offsetWidth - bar.offsetWidth) * 100)
            // setWin
            $('.setWin').text(ptxt.innerHTML)
            // setChance
            $('.setChance').text(ptxt.innerHTML - 1)
            updateBetAndPayoutOnWin()
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
        }
    }

    document.onmouseup = function () {
        document.onmousemove = null
    }
})
