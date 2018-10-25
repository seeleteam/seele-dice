# seele-dice

In root floder runs:
browserify -r .\dice\dice.js:dice.js > dice.js

## seele.js version

1.3.2

## FilterBlockTx

When this call ends, the callback function is called and the data is "end".

```js
dice.FilterBlockTx(6066, function(data){
    console.log("callback")
    console.log(data)

    if (data === "end"){
        console.log("fileter over")
    }

    if (data instanceof Error){
        console.log("callback Error")
        return
    }

    console.log("callback Success")
})
```