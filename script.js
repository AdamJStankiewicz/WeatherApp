var curTemperature;

var geo = true;

function init() {
    var city = localStorage['city'];
    var state = localStorage['state'];

    var cityInput = document.getElementById("city");
    var stateInput = document.getElementById("state");

    if(city) cityInput.setAttribute('value',city);
    if(state) stateInput.setAttribute('value',state);

    if(geo) getLocation();
    console.log("INITIALIZED!");
}

function weatherClick(dwn){
    const btn = document.getElementById("wtherBtn");
    if(dwn){
        btn.classList.add("animate");
    }
    else{
        btn.style.backgroundColor = "#00b8c9";
        getWeatherManual();
        setTimeout(removeAnim,250);
    }

}

function removeAnim(){
    const btn = document.getElementById("wtherBtn");
    btn.classList.remove("animate");
}

async function getWeatherAuto(lat,long){
    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=1aa8bbe615945e439d974fb3504738ee&units=imperial");

    obj = await res.json();

    curTemperature = Math.round(obj["main"]["temp"]);

    document.getElementById("temperature").textContent = "The current temperature is: " +  curTemperature + "F";

    let weatherType = obj.weather[0].main;
    
    //find pics for the following
    switch (weatherType) {
        case "Thunderstorm":
            //img = (insert url)
            break;
        case "Drizzle":
            break;
        case "Rain":
            let img = "images/RainCloud.png"
            break;
        case "Snow":
            break;
        case "Clear":
            break;
        case "Clouds":
            break;
        default:
            //shows normal logo if its not the other weather types
            break;
      }
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

    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=1aa8bbe615945e439d974fb3504738ee&units=imperial");

    obj = await res.json();

    curTemperature = Math.round(obj["main"]["temp"]);

    document.getElementById("temperature").textContent = "The current temperature is: " +  curTemperature + "F";
    //document.getElementById("latlong").textContent = "Lat: " + lat + " Long: " + long;
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

