const fetch = require('node-fetch');
require('dotenv').config();

const clarifaiUserId = process.env.CLARIFAI_USER_ID;
const clarifaiAppId = process.env.CLARIFAI_APP_ID;
const clarifaiApiKey = process.env.CLARIFAI_API_KEY;

const handleClarifaiApiCall = async (req, res) => {
    const raw = JSON.stringify({
        "user_app_id": {
              "user_id": clarifaiUserId,
              "app_id": clarifaiAppId
          },
        "inputs": [
          {
            "data": {
              "image": {
                "url": req.body.input
              }
            }
          }
        ]
      });
      
      const clarifaiRequestOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Key ${clarifaiApiKey}`
        },
        body: raw
      };
      
      const response = await fetch("https://api.clarifai.com/v2/models/face-detection/outputs", clarifaiRequestOptions)
      const data = await response.json();
      res.send(data);
}


const handleImageEntry = (req, res, knex) => {
    const { id } = req.body;
    knex('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get count'))
}

module.exports = {
    handleImageEntry,
    handleClarifaiApiCall
};