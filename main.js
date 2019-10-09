// Require FS and AXIOS.
const fs = require('fs'), axios = require('axios');

// Time Variables
const date = Math.floor(Date.now() / 1000);

// Keys and URLs
const cityCode = OWM_CITY_CODE, api_key = 'OpenWeatherMap_API_KEY', ifttt_key = 'IFTTT_API_KEY', owm_url = `http://api.openweathermap.org/data/2.5/forecast?id=${cityCode}&APPID=${api_key}`;

setInterval(() => {
  let sunsetLocal = 0;
  axios.get(owm_url).then(response => console.log(response.data.city.sunset));

  axios.get(owm_url).then(response => {
    const sunset = response.data.city.sunset;
    let sunsetFucc = { time: sunset }, data = JSON.stringify(sunsetFucc);

    fs.writeFileSync('sunset_cache.json', data);
  });

  let rawdata = fs.readFileSync('sunset_cache.json'), sunsetJSON = JSON.parse(rawdata);
  sunsetLocal = sunsetJSON.time;
  let timeto = sunsetLocal - date;


  console.log(date);
  console.log(sunsetLocal);
  console.log(`${timeto} seconds left`);

  // Hourly Check
  axios.post(`https://maker.ifttt.com/trigger/test_check/with/key/${ifttt_key}`, {
    value1: `${sunsetLocal}`,
    value2: `${Math.floor(timeto / 60)} minutes left.`,
  });

  for (let i = 0; i < 60; i++) {
    // Create local variable for storing the sunset time
    sunsetLocal = 0;

    // Read the current JSON information
    rawdata = fs.readFileSync('sunset_cache.json');
    sunsetJSON = JSON.parse(rawdata);
    sunsetLocal = sunsetJSON.time;
    console.log(sunsetLocal);

    // Execute sunset check
    if (date >= sunsetLocal && date <= (sunsetLocal + 300000)) {
      // Send post request to IFTTT
      axios.post(`https://maker.ifttt.com/trigger/light_on_sunset/with/key/${ifttt_key}`);
      console.log('Sunset');
    } else {
      console.log('No Sunset');
    }
  }
}, 60000);

