require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API call to fetch rover data
app.get('/latest/:rover', async (req, res) => {
    const rover = req.params.rover;

    try {
        let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({roverData: roverData.latest_photos})
    } catch (err) {
        console.log('Error with API call:', err);
    }
})

app.listen(port, () => console.log(`Mars Dashboard app listening on port ${port}!`))