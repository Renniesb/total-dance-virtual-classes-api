var express = require('express');
var router = express.Router();

//get the correct dance videos based on the dance type and dance level that the user provides
router.get('/videos/:danceType/:danceLevel', (req,res,next) => {
    req.app.get('db')
    .from('videos')
    .where('videos.dancetype', req.params.danceType )
    .andWhere('videos.dancelevel', req.params.danceLevel)
    .then(videos => {
        res.json(videos)
    })
    .catch(next);
});

module.exports = router;