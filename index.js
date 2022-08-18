const express = require('express')

const app = express()

const port = 3000

app.get('/index.html', function(request,response){
    response.send('/index.html')
})

app.listen(port, () => {
    console.log(`Personal Web App listening on port ${port}`)
})