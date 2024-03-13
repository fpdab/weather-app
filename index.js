const key = `f4e2c2e239134ea482f94754241103`

class WeatherObject {
  constructor(data, type, date) {
    this.name = data.location.name
    this.region = data.location.region
    this.country = data.location.country
    if (type === "current" || type === "forecast") {
      this.condition = data.current.condition.text
      this.temperature = data.current.temp_c
      this.feelsLike = data.current.feelslike_c
      this.precipitation = data.current.precip_mm
      this.pressure = data.current.pressure_mb
    } else if (type === "history") {
      this.condition =
        data.forecast.forecastday[0].hour[date.hour].condition.text
      this.temperature = data.forecast.forecastday[0].hour[date.hour].temp_c
      this.feelsLike = data.forecast.forecastday[0].hour[date.hour].feelslike_c
      this.precipitation =
        data.forecast.forecastday[0].hour[date.hour].precip_mm
      this.pressure = data.forecast.forecastday[0].hour[date.hour].pressure_mb
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
  console.log(town)
  return town
}

async function logTownNames(input) {
  const suggestion = await getAutocompletion(input)
  console.log(suggestion)
  return suggestion
}

/* async function display() {
  const display = document.querySelector(".display")
  const input = document.querySelector("input")
  const res = await logTownWeather(input.value, "current", {})
  const div = document.createElement("div")
  div.setAttribute("class", "container")
  div.innerHTML = `<pre>
  Name: ${res.name}
  Region: ${res.region}
  Country: ${res.country}
  Condition: ${res.condition}
  Temperature: ${res.temperature}
  Feelslike Temperature: ${res.feelsLike}</pre>
  `
  display.appendChild(div)
} */

//DOM manipulation template
//for (let element of suggestion) {
//    logTownWeather(element.url)
//  }

//logTownNames("Lon")
//logTownWeather("Wroclaw", "history", { date: "&dt=2024-03-13", hour: 17 })
//logTownWeather("London", "forecast", { date: "&days=1" })
//logTownWeather("London", "current", {})
