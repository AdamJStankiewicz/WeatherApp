var curTemperature;

async function getWeather(){

    let obj;
    
    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=38.2266178&lon=-85.7208747&appid=1aa8bbe615945e439d974fb3504738ee&units=imperial");

    obj = await res.json();

    curTemperature = obj["main"]["temp"];

    document.getElementById("temperature").textContent = "The current temperature is: " +  curTemperature + "F";
}