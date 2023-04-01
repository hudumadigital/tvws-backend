const express = require('express')

const app = express()


app.get('/', (req, res) => {
    res.send('Consider yourself warned')
})


app.listen(4000, () => {
    return console.log('Up and running')
})
