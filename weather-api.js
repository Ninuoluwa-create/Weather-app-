const cityInput = document.querySelector("input[type=text]");
const searchButton = document.querySelector("#searchbutton");

searchButton.addEventListener("click", async (entry) => {
  entry.preventDefault();
  const city = cityInput.value.toLowerCase();

  if (city) {
    try {
      // Explanation{
      //  Array destructuring 👇
      // NOTE: (this will no longer work since the data
      // being returned is an object not an array)

      //   const [lat, long, timezone, name, country] = await getLocationData(city);
      //   console.log(getLocationData(city));
      // Array destructuring 👆

      // object destructuring 👇
      // NOTE: (this will still work since the data
      // being returned is an object not an array)

      // const { lat, long, timezone, name, country } =
      //   await getLocationData(city);

      // object destructuring 👆
      // }

      const locationData = await getLocationData(city);
      console.log(locationData);

      // if (locationData === undefined) {
      //   throw new Error("Could not fetch location data");
      // }
      console.log(`${locationData.lat}\n${locationData.long}`);

      const WeatherData = await getWeatherData(locationData);
      console.log(WeatherData);
      const currentWeatherData = getCurrentWeatherData(WeatherData);

      displayLocationInfo(locationData);
      displayCurrentWeatherInfo(currentWeatherData);
    } catch (error) {
      if (error instanceof TypeError && !navigator.onLine) {
        throw new Error("please connect to internet");
      } else {
        console.error(error);
        //  throw new Error(error);
      }
    }
  } else {
    throw new Error("Please input a city");
    console.error(error);
  }
});

const getLocationData = async (city) => {
  // console.log(city);
  // try{
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
  );

  if (!response.ok) {
    throw new Error("Could not fetch resources ");
  }
  // if (response instanceof TypeError && !navigator.onLine) {
  //   throw new Error("please connect to internet");
  // }

  const data = await response.json();
  // console.log(data);

  if (!data.results) {
    throw new Error("Could not fetch city data");
  }

  // console.log(data.results[0]);
  const latitudeData = data.results[0].latitude;
  const longitudeData = data.results[0].longitude;
  const nameData = data.results[0].name;
  const countryData = data.results[0].country;
  const timezoneData = data.results[0].timezone;

  return {
    lat: latitudeData,
    long: longitudeData,
    timezone: timezoneData,
    name: nameData,
    country: countryData,
  };
  // }

  // catch(error){
  //   if (error instanceof TypeError && !navigator.onLine) {
  //   throw new Error("please connect to internet");
  //   // console.error(error);
  // } else {
  //   // console.error(error);
  //   throw new Error(error);
  // }
  // }
};

const getWeatherData = async (locationData) => {
  // console.log(locationData);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=weather_code,temperature_2m&models=best_match&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto&wind_speed_unit=mph`,
  );
  //  console.log(response);
  if (!response.ok) {
    throw new Error("Could not fetch resources ");
  }
  // console.log(response);
  const data = await response.json();
  // console.log(data);

  const currentData = {
    current: data.current,
    currentUnits: data.current_units,
  };

  const dailyData = {
    daily: data.daily,
    dailyUnits: data.daily_units,
  };
  const hourlyData = {
    hourly: data.hourly,
    hourlyUnits: data.hourly_units,
  };
  // console.log(hourlyData.hourly);

  return { currentData, dailyData, hourlyData };
};

const displayLocationInfo = (locationData) => {
  const cityName = document.querySelector("#cityName");
  cityName.textContent = `${locationData.name}, ${locationData.country}`;
};

const getCurrentWeatherData = (WeatherData) => {
  return WeatherData.currentData.current;
};

const displayCurrentWeatherInfo = (currentWeatherData) => {
  // console.log(currentWeatherData);
  const dataCurrent = document.querySelectorAll("[data-current]");
  const dataCurrentTemp = document.querySelectorAll("[data-current=temp]");
  const dataCurrentHumid = document.querySelector("[data-current=humidity]");
  const dataCurrentWind = document.querySelector("[data-current=wind]");
  const dataCurrentPrec = document.querySelector(
    "[data-current=precipitation]",
  );
  const dataCurrentDate = document.querySelector("[data-current=date]");

  dataCurrentTemp.forEach((value) => {
    value.textContent = `${currentWeatherData.temperature_2m}°`;
  });
  dataCurrentHumid.textContent = `${currentWeatherData.relative_humidity_2m}%`;
  dataCurrentWind.textContent = `${currentWeatherData.wind_speed_10m}mph`;
  dataCurrentPrec.textContent = `${currentWeatherData.precipitation}mm`;

  // Code to change the Date 👇

  // const longName = date.toLocaleDateString("en-US", {
  //   weekday: "long",
  //   timeZone: "UTC",
  // });
  // // "Thursday"

  // const shortName = date.toLocaleDateString("en-US", {
  //   weekday: "short",
  //   timeZone: "UTC",
  // });

  // console.log(longName);

  // "Thu"

  // const isoString = "2026-08-05T12:00:00.000Z";
  // const date = new Date(isoString);

  const date = new Date(currentWeatherData.time);
  // const options = {
  //   weekday: "long",
  //   month: "short",
  //   day: "numeric",
  //   year: "numeric",
  // };
  const options = {
    dateStyle: "full",
    //  timeStyle: "short"
  };
  const currentDate = new Intl.DateTimeFormat("en-US", options).format(date);
  // console.log(currentDate);
  dataCurrentDate.textContent = currentDate;

  // Code to change the Date 👆

  // Code to change the Weather icon 👇
  const dataCurrentIcon = document.querySelector("[data-current=weather-icon]");

  // console.log(dataCurrentIcon);

  const weather_code = currentWeatherData.weather_code;
  // console.log(weather_code);

  switch (true) {
    // Sunny
    case weather_code <= 1:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-sunny.webp");
      break;
    // Partly-Cloudy
    case weather_code == 2:
      dataCurrentIcon.setAttribute(
        "src",
        "./assets/images/icon-partly-cloudy.webp",
      );
      break;
    // Overcast
    case weather_code == 3:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-overcast.webp");
      break;
    // Fog
    case weather_code <= 48:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-fog.webp");
      break;
    // Drizzle
    case weather_code <= 57:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-drizzle.webp");
      break;
    // Rain
    case weather_code <= 67:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-rain.webp");
      break;
    // Snow
    case weather_code <= 77:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-snow.webp");
      break;
    // Rain Showers
    case weather_code <= 82:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-rain.webp");
      break;
    // Snow Showers
    case weather_code <= 86:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-snow.webp");
      break;
    // Thunderstorm
    case weather_code <= 99:
      dataCurrentIcon.setAttribute("src", "./assets/images/icon-storm.webp");
      break;

    // Default(Nothing happens)
    default:
      break;
  }
  // Code to change the Weather icon 👆
};

// time: "2026-07-09T09:00";
// weather_code: 3;
