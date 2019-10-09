//import fs and got
const fs = require('fs');
const axios = require('axios');

//create time variables
var date = new Date();

const cityCode = OWM_CITY_CODE;
const api_key = 'OpenWeatherMap_API_KEY';
const ifttt_key = 'IFTTT_API_KEY'
const owm_url = `http://api.openweathermap.org/data/2.5/forecast?id=${cityCode}&APPID=${api_key}`

async function main(){
    for(;;){
        var sunsetLocal = 0;

        axios.get('http://api.openweathermap.org/data/2.5/forecast?id=5301388&APPID=f204d06d667a32d5e3224a49fddef6fc')
            .then((response) => {
             console.log(response.data.city.sunset);
        });

        axios.get(owm_url).then((response) => {
            const sunset = response.data.city.sunset;
            // console.log(sunset);
            let sunsetFucc = { 
                time: sunset
            };
                
            let data = JSON.stringify(sunsetFucc);
            fs.writeFileSync('sunset_cache.json', data);
        });
        
        let rawdata = fs.readFileSync('sunset_cache.json');
        let sunsetJSON = JSON.parse(rawdata);
        sunsetLocal = sunsetJSON.time;
        var timestampLocal = Math.floor(date.getTime() / 1000);
        var timeto = sunsetLocal-timestampLocal;


        console.log(timestampLocal);
        console.log(sunsetLocal)
        console.log(`${timeto} seconds left`);

        //HOURLY CHECK
        axios.post(`https://maker.ifttt.com/trigger/test_check/with/key/${ifttt_key}`, {
            value1: `${sunsetLocal}`,
            value2: Math.floor(timeto/60) + " minutes left."
        });

        for(i=0; i<60; i++){
            //create local variable for storing the sunset time
            var sunsetLocal = 0;
            var timestamp = Math.floor(date.getTime() / 1000);

            //read the current JSON information
            let rawdata = fs.readFileSync('sunset_cache.json');
            let sunsetJSON = JSON.parse(rawdata);
            sunsetLocal = sunsetJSON.time;

            console.log(sunsetLocal)

            //Execute sunset check
            if(timestamp>=sunsetLocal && timestamp<=(sunsetLocal+300000)){
                //send post request to IFTTT
                axios.post(`https://maker.ifttt.com/trigger/light_on_sunset/with/key/${ifttt_key}`);
                console.log('sunset time');
            }else{
                console.log('no sunset L')
            }
            // console.log('yeetus');
            // console.log(i);
            let delayres = await delay(60000);
            
        }
    }
}

async function delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
}

main();
