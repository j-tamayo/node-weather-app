const yargs = require('yargs');

const axios = require('axios');

const argv = yargs.options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather  for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encoded_address = encodeURIComponent(argv.address);
var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encoded_address;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS'){
        throw new Error('Unable to find that address');
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/2bf302a65003e77dae115d5f7b2e1db0/${lat},${lng}`;

    console.log(JSON.stringify(response.data.results[0].formatted_address, undefined, 2));

    return axios.get(weatherUrl);

}).then((response) => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`);

}).catch((e) => {
    if (e.code === 'ENOTFOUND'){
        console.log('Unable to connect to API servers.');
    } else {
        console.log(e.message);
    }
    
});