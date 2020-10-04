var express = require('express')
var router = express.Router()
// const { route } = require('.')
// const jsonBodyParser = express.json()

router.get('/videos/:danceType/:danceLevel', (req,res,next) => {
    req.app.get('db')
    .from('videos')
    .where('videos.dancetype', req.params.danceType )
    .andWhere('videos.dancelevel', req.params.danceLevel)
    .then(videos => {
        res.json(videos)
    })
    .catch(next)
})

module.exports = router;