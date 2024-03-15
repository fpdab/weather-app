import "./styles/main.css"
const key = `f4e2c2e239134ea482f94754241103`

class WeatherObject {
  constructor(data, type, date) {
    this.name = data.location.name
    this.region = data.location.region
    this.country = data.location.country
    if (type === "current") {
      this.condition = data.current.condition.text
      this.icon = data.current.condition.icon
      this.temperature = data.current.temp_c
      this.feelsLike = data.current.feelslike_c
      this.precipitation = data.current.precip_mm
      this.pressure = data.current.pressure_mb
      this.cloud = data.current.cloud
      this.humidity = data.current.humidity
      this.last_updated = data.current.last_updated
    } else if (type === "history" || type === "forecast") {
      this.condition =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].condition.text
      this.icon =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].condition.icon
      this.temperature =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].temp_c
      this.feelsLike =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].feelslike_c
      this.precipitation =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].precip_mm
      this.pressure =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].pressure_mb
      this.cloud =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].cloud
      this.humidity =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].humidity
      this.last_updated =
        data.forecast.forecastday[data.forecast.forecastday.length - 1].hour[
          date.hour
        ].last_updated
    }
  }
}

//type current, search, future, history (date &dt=2024-04-12)
async function getData(townID, type, date) {
  const url = `http://api.weatherapi.com/v1/${type}.json?key=${key}&q=${townID}&aqi=no${date.date}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}

async function makeTown(townID, type, date) {
  const data = await getData(townID, type, date)
  console.log(data)
  const town = new WeatherObject(data, type, date)
  return town
}

function parseAutocompletion(data) {
  let array = []
  data.forEach((element) => {
    array.push({
      name: element.name,
      region: element.region,
      country: element.country,
      url: element.url,
    })
  })
  return array
}

async function getAutocompletion(inp) {
  const result = parseAutocompletion(await getData(inp, "search", {}))
  return result
}

async function logTownWeather(townName, type, date) {
  const town = await makeTown(townName, type, date)
  return town
}

async function logTownNames(input) {
  const suggestion = await getAutocompletion(input)
  return suggestion
}

function display(res) {
  const display = document.querySelector(".display")

  while (display.firstChild) {
    display.firstChild.remove()
  }

  const header = document.createElement("div")
  header.setAttribute("class", "header")
  const overview = document.createElement("div")
  overview.setAttribute("class", "overview")
  const info = document.createElement("div")
  info.setAttribute("class", "info")

  const regex = /[a-z]*\/[0-9a-z.]*$/gm
  const iconSRC = `./weather/64x64/${res.icon.match(regex)}`

  console.log(iconSRC)
  //import iconIMG from iconSRC

  header.innerHTML = `
  <div class="name">${res.name}</div>
  <div class="region">${res.region}</div>
  <div class="country">${res.country}</div>
  <div class="time">${res.last_updated}</div>
  `
  overview.innerHTML = `
  <div class="icon"><img src=${iconSRC}></img></div>
  <div class="temperatures">
  <div class="temperature">${res.temperature}&deg;C</div>
  <div class="feelslike">Feels Like <div class="number">${res.feelsLike}&deg;C</div></div>
  </div>
  <div class="condition"><p>${res.condition}</p></div>
  `
  info.innerHTML = `
  <div class="precipitation">Precipitation: </div><div class="number">${res.precipitation} mm</div><hr>
  <div class="humidity">Humidity: </div><div class="number">${res.humidity}%</div><hr>
  <div class="cloud">Cloud cover: </div><div class="number">${res.cloud}%</div><hr>
  <div class="pressure">Pressure: </div><div class="number">${res.pressure} hPa</div>
   `
  display.appendChild(header)
  display.appendChild(overview)
  display.appendChild(info)
}

async function chooseAPI() {
  const town = document.querySelector("#town")
  let chosenDate = moment(document.querySelector("#date").value)
  let todayDate = moment(new Date()) //.format("YYYY-MM-DD")

  chosenDate = moment(chosenDate.format("YYYY-MM-DD"))
  todayDate = moment(todayDate.format("YYYY-MM-DD"))
  const difference = chosenDate.diff(todayDate, "days") + 1
  chosenDate = chosenDate.format("YYYY-MM-DD")
  todayDate = todayDate.format("YYYY-MM-DD")
  console.log(chosenDate)
  console.log(todayDate)
  console.log(difference)
  if (chosenDate == todayDate) {
    const res = await logTownWeather(town.value, "current", {})
    display(res)
  } else if (chosenDate > todayDate) {
    const res = await logTownWeather(town.value, "forecast", {
      date: `&days=${difference}`,
      hour: `12`,
    })
    display(res)
  }
}

function init() {
  const confirm = document.querySelector("#confirm")
  confirm.addEventListener("click", chooseAPI)
}

init()

//DOM manipulation template
//for (let element of suggestion) {
//    logTownWeather(element.url)
//  }

//logTownNames("Lon")
//logTownWeather("Wroclaw", "history", { date: "&dt=2024-03-13", hour: 17 })
//logTownWeather("London", "forecast", { date: "&days=1" })
//logTownWeather("Boca Chica", "current", {})
