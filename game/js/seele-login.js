$(function() {
    sessionStorage.clear()

    // Start with 0x,English and integer only.     
    jQuery.validator.addMethod('isSpecialChar', function (value, element) {
    return this.optional(element) || /^0x[A-Za-z0-9_-]+$/.test(value)
    }, 'Start with 0x,English and integer only.')

    $(validform())

      // login
    $('#loginTab').tabulous({
        effect: 'flip'
    })

    // show login
    $('.loginButton button,.loginHeadButton').click(function () {
        $('.login').show()
        $('.register').hide()
    })
    
    // login close
    $('.close').click(function () {
        $('.login').hide()
        $('.register').hide()
    })

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
        }
    })

    // logout
    $('.logout').click(function () {
        $('.loginHeadButton,.loginButton').show()
        $('.loginImg,.rollButton,.personalInformation').hide()
        sessionStorage.clear()
        $('#username').val('')
        $('#private').val('')
    })

    // longinImg,personalInformation mouse
    $('.loginImg,.personalInformation').mouseover(function () {
        $('.personalInformation').show()
    })
    $('.loginImg,.personalInformation').mouseleave(function () {
        $('.personalInformation').hide()
    })

    // User register
    $('.registerShow').click(function () {
        dice.Register().then(keypair => {
            console.log(keypair)
            if (keypair) {
                $('.register-public').text(keypair.publickey)
                $('.register-private').text(keypair.privatekey)
                $('.register').show()
                $('.login').hide()
                if (keypair.isReceivedGift){
                    $('.result').show()
                    $('.dask').show()
                    $('.result').text('Congratulations, '+ seeleutil.fromFan(dice.REGISTRATION_GIFT)+'seele will send this account in 1 minute, please pay attention to view')
                }
            }
        })
    })

    $('.register button').click(function () {
        var public = $('.register-public').text()
        var private = $('.register-private').text()
        $('#username').val(public)
        $('#private').val(private)
        $('.login').show()
        $('.register').hide()
    })

    // login variable
    $('.loginHeadButton').show()
    $('.loginButton').show()
    $('.noData').show()
    $('.dataError').show()
})

// 128-bit key
let key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
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
