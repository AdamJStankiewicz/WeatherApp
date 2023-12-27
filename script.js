var curTemperature;

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
    var latlong = await getCoordinates();
    var lat = latlong[0], 
        long = latlong[1];

    console.log("CONSOLE: Lat: " + lat + " Long: " + long);
    let obj;

    const res = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=1aa8bbe615945e439d974fb3504738ee&units=imperial");

    obj = await res.json();

    curTemperature = obj["main"]["temp"];

    document.getElementById("temperature").textContent = "The current temperature is: " +  curTemperature + "F";
}

async function getCoordinates() {
    const apiUrl = await fetch("https://us1.locationiq.com/v1/search?key=pk.143ca4fe36f259c3ed41b80e7ddb7835&q=Lousville%2C%20KY&format=json");
    let data = await apiUrl.json();
    let latitude = data[0].lat;
    let longitude = data[0].lon;
    document.getElementById("latlong").textContent = "Lat: " + latitude + " Long: " + longitude;
    return[latitude,longitude];
}