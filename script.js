var curTemperature;

function init() {
    var city = localStorage['city'];
    var state = localStorage['state'];

    var cityInput = document.getElementById("city");
    var stateInput = document.getElementById("state");

    if(cityInput){
        cityInput.setAttribute('value',city);
    }
    if(stateInput){
        stateInput.setAttribute('value',state);
    }
    console.log("INITIALIZED!");
}

function fillInfo(city,state){
    document.getElementById("city").value = city;
}

function weatherClick(dwn){
    const btn = document.getElementById("wtherBtn");
    if(dwn){
        btn.classList.add("animate");
    }
    else{
        btn.style.backgroundColor = "#00b8c9";
        getWeather();
        setTimeout(removeAnim,250);
    }

}

function removeAnim(){
    const btn = document.getElementById("wtherBtn");
    btn.classList.remove("animate");
}

async function getWeather(){
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