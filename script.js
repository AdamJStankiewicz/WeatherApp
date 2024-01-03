var curTemperature;
var minTemperature;
var maxTemperature;

var geo = true;
var unit = "imperial";
var unitSymbol = "F";

function init() {
    var city = localStorage['city'];
    var state = localStorage['state'];
    
    var cityInput = document.getElementById("city");
    var stateInput = document.getElementById("state");

    if(city) cityInput.setAttribute('value',city);
    if(state) stateInput.setAttribute('value',state);

    if(localStorage['unit'] && localStorage['unitSymbol']){
        unit = localStorage['unit'];
        unitSymbol = localStorage['unitSymbol'];
        document.getElementById("unitBtn").textContent = unitSymbol;
    }
    
    if(!city && !state) {
        if(geo) getLocation();
    }
    else{
        getWeatherManual();
    }
    console.log("INITIALIZED!");
}

function weatherClick(dwn){
    const btn = document.getElementById("wtherBtn");
    const rel = document.getElementById("reload");
    if(dwn){
        btn.classList.add("animate");
        rel.classList.add("animateSpin");
    }
    else{
        getWeatherManual();
        setTimeout(removeAnim,250,"wtherBtn","animate");
        setTimeout(removeAnim,250,"reload","animateSpin");
    }
}

function removeAnim(ele,anim){
    const btn = document.getElementById(ele);
    btn.classList.remove(anim);
}

async function getWeatherAuto(lat,long){
    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=1aa8bbe615945e439d974fb3504738ee&units="+unit);

    obj = await res.json();

    curTemperature = Math.round(obj["main"]["temp"]);
    minTemperature = Math.round(obj["main"]["temp_min"]);
    maxTemperature = Math.round(obj["main"]["temp_max"]);

    document.getElementById("temperature").textContent = "Current: " + curTemperature + unitSymbol;
    document.getElementById("max").textContent = "High: " + maxTemperature + unitSymbol;
    document.getElementById("min").textContent = "Low: " + minTemperature + unitSymbol;


    let weatherType = obj["weather"][0]["main"];
    setIcon(weatherType);
}
    
async function getWeatherManual(){
    var cityInput = document.getElementById("city").value;
    var stateInput = document.getElementById("state").value.toUpperCase();
    localStorage['city'] = cityInput;
    localStorage['state'] = stateInput;

    if(cityInput === "" || stateInput === ""){
        return;
    }
    console.log(cityInput);
    var latlong = await getCoordinates(cityInput,stateInput);
    var lat = latlong[0], 
        long = latlong[1];

    console.log("CONSOLE: Lat: " + lat + " Long: " + long);
    let obj;

    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=1aa8bbe615945e439d974fb3504738ee&units="+unit);

    obj = await res.json();

    curTemperature = Math.round(obj["main"]["temp"]);
    minTemperature = Math.round(obj["main"]["temp_min"]);
    maxTemperature = Math.round(obj["main"]["temp_max"]);

    document.getElementById("temperature").textContent = "Current: " + curTemperature + unitSymbol;
    document.getElementById("max").textContent = "High: " + maxTemperature + unitSymbol;
    document.getElementById("min").textContent = "Low: " + minTemperature + unitSymbol;


    //document.getElementById("latlong").textContent = "Lat: " + lat + " Long: " + long;
    
    let weatherType = obj["weather"][0]["main"];
    setIcon(weatherType);
}

async function getCoordinates(city,state) {
    const apiUrl = await fetch("https://us1.locationiq.com/v1/search?key=pk.143ca4fe36f259c3ed41b80e7ddb7835&q="+city+"%2C%20"+state+"&format=json");
    let data = await apiUrl.json();
    let latitude = data[0].lat;
    let longitude = data[0].lon;
    return[latitude,longitude];
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } 
}

async function setPosition(position) {
    let response = await fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&apiKey=9db07f86b535474abaffd1a6960a0095");
    let data = await response.json();
    
    let city = data.features[0].properties["city"];
    let state = data.features[0].properties["state_code"];

    fillInfo(city,state);
    
    console.log("Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude);
    
    getWeatherAuto(position.coords.latitude,position.coords.longitude);
}

function fillInfo(city,state){
    var cityInput = document.getElementById("city");
    var stateInput = document.getElementById("state");

    cityInput.setAttribute('value',city);
    stateInput.setAttribute('value',state);
}

function setIcon(weatherType){
    switch (weatherType) {
        case "Thunderstorm":
            document.getElementById("img").src = "images/wi-thunderstorm.svg";
            break;
        case "Drizzle":
            document.getElementById("img").src = "images/wi-showers.svg";
            break;
        case "Rain":
            document.getElementById("img").src = "images/wi-showers.svg";
            break;
        case "Snow":
            document.getElementById("img").src = "images/wi-snow.svg";
            break;
        case "Clear":
            document.getElementById("img").src = "images/wi-day-sunny.svg";
            break;
        case "Clouds":
            document.getElementById("img").src = "images/wi-cloudy.svg";
            break;
        default:
            document.getElementById("img").src = "images/wi-cloud.svg";
            break;
      }
}

function toggleUnit(dwn){
    const btn = document.getElementById("unitBtn");

    if(dwn){
        btn.classList.add("animate");
    }
    else{
        setTimeout(removeAnim,250,"unitBtn","animate");
    

        if(unit === "imperial"){
            unitSymbol = "C";
            unit = "metric";
            document.getElementById("unitBtn").textContent = "F";
        }
        else {
            unitSymbol = "F";
            unit = "imperial";
            document.getElementById("unitBtn").textContent = "C";
        }
        localStorage['unit'] = unit;
        localStorage['unitSymbol'] = unitSymbol;

        if(curTemperature) getWeatherManual();
    }
}