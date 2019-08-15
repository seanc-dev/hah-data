const NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

let geocoder = NodeGeocoder(options);

module.exports = function (location) {

    return new Promise(function (resolve, reject) {
        geocoder.geocode(location, function (err, data) {
            if (err || !data.length) reject(err);
            resolve(data);
        })
    })
}