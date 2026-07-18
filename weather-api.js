const cityInput = document.querySelector("input[type=text]");
const searchButton = document.querySelector("#searchbutton");

// Enter key event listener 👇
cityInput.addEventListener("keydown", (event) => {
  // console.log(event.target);
  // console.log(event.key);

  if (event.key === "Enter") {
    event.preventDefault();

    searchButton.click();
  }
});
// Enter key event listener 👆

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
      // console.log(WeatherData);
      const currentWeatherData = getCurrentWeatherData(WeatherData);
      const dailyWeatherData = getDailyWeatherData(WeatherData);
      const hourlyWeatherData = getHourlyWeatherData(WeatherData);
      console.log(hourlyWeatherData);

      displayLocationInfo(locationData);
      displayCurrentWeatherInfo(currentWeatherData);
      displayDailyWeatherInfo(dailyWeatherData);
      displayHourlyWeatherInfo(hourlyWeatherData);
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

const getDailyWeatherData = (WeatherData) => {
  return WeatherData.dailyData.daily;
};

const displayDailyWeatherInfo = (dailyWeatherData) => {
  // To Change the daily Weekday 👇
  const dataDailyDay = document.querySelectorAll("[data-daily=date]");
  const dataDailyDayArray = [...dataDailyDay];

  dataDailyDayArray.forEach((Day) => {
    const dayIndex = dataDailyDayArray.indexOf(Day);
    // console.log(dayIndex);

    const date = new Date(dailyWeatherData.time[dayIndex]);
    // console.log(date);

    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
    }).format(date);
    // console.log(weekday);

    Day.textContent = weekday;
  });
  // To Change the daily Weekday 👆

  // To Change the hourly in the hourly card section Weekday 👇
  const dataHourlyDay = document.querySelectorAll("[data-daily=date2]");
  const dataHourlyDayArray = [...dataHourlyDay];
  // console.log(dataHourlyDayArray);

  dataHourlyDayArray.forEach((Day) => {
    const dayIndex = dataHourlyDayArray.indexOf(Day);
    // console.log(dayIndex);

    const date = new Date(dailyWeatherData.time[dayIndex]);
    // console.log(date);

    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);
    // console.log(weekday);

    Day.textContent = weekday;
  });

  // To Change the hourly in the hourly card section Weekday 👆

  // To Change the daily Weather icon 👇
  const dataDailyIcon = document.querySelectorAll("[data-daily=weather-icon]");
  const dataDailyIconArray = [...dataDailyIcon];

  // console.log(dataDailyIconArray);
  dataDailyIconArray.forEach((icon) => {
    const iconIndex = dataDailyIconArray.indexOf(icon);
    // console.log(iconIndex);

    const weather_code = dailyWeatherData.weather_code[iconIndex];
    // console.log(weather_code);

    switch (true) {
      // Sunny
      case weather_code <= 1:
        icon.setAttribute("src", "./assets/images/icon-sunny.webp");
        break;
      // Partly-Cloudy
      case weather_code == 2:
        icon.setAttribute("src", "./assets/images/icon-partly-cloudy.webp");
        break;
      // Overcast
      case weather_code == 3:
        icon.setAttribute("src", "./assets/images/icon-overcast.webp");
        break;
      // Fog
      case weather_code <= 48:
        icon.setAttribute("src", "./assets/images/icon-fog.webp");
        break;
      // Drizzle
      case weather_code <= 57:
        icon.setAttribute("src", "./assets/images/icon-drizzle.webp");
        break;
      // Rain
      case weather_code <= 67:
        icon.setAttribute("src", "./assets/images/icon-rain.webp");
        break;
      // Snow
      case weather_code <= 77:
        icon.setAttribute("src", "./assets/images/icon-snow.webp");
        break;
      // Rain Showers
      case weather_code <= 82:
        icon.setAttribute("src", "./assets/images/icon-rain.webp");
        break;
      // Snow Showers
      case weather_code <= 86:
        icon.setAttribute("src", "./assets/images/icon-snow.webp");
        break;
      // Thunderstorm
      case weather_code <= 99:
        icon.setAttribute("src", "./assets/images/icon-storm.webp");
        break;

      // Default(Nothing happens)
      default:
        break;
    }
  });
  // To Change the daily Weather icon 👆

  // To Change the daily Max Temperature 👇

  const dataDailyTempMax = document.querySelectorAll("[data-daily=max_temp]");
  const dataDailyTempMaxArray = [...dataDailyTempMax];

  dataDailyTempMaxArray.forEach((tempMax) => {
    const tempMaxIndex = dataDailyTempMaxArray.indexOf(tempMax);
    // console.log(tempMaxIndex);

    tempMax.textContent = `${dailyWeatherData.temperature_2m_max[tempMaxIndex]}°`;
  });

  // To Change the daily Max Temperature 👆

  // To Change the daily Min Temperature 👇

  const dataDailyTempMin = document.querySelectorAll("[data-daily=min_temp]");
  const dataDailyTempMinArray = [...dataDailyTempMin];

  dataDailyTempMinArray.forEach((tempMin) => {
    const tempMinIndex = dataDailyTempMinArray.indexOf(tempMin);
    // console.log(tempMinIndex);

    tempMin.textContent = `${dailyWeatherData.temperature_2m_min[tempMinIndex]}°`;
  });

  // To Change the daily Min Temperature 👆
};

const getHourlyWeatherData = (WeatherData) => {
  return WeatherData.hourlyData.hourly;
};

const displayHourlyWeatherInfo = (hourlyWeatherData) => {
  const hourIcon = document.querySelectorAll(".cast-item img");
  const hourIconArray = [...hourIcon];
  // console.log(hourIconArray);

  const hourTemp = document.querySelectorAll(".cast-item strong");
  const hourTempArray = [...hourTemp];
  // console.log(hourTempArray);

  const daySelect = document.querySelector("#weekday-select");

  let extraIndex = 0;
  const updatingExtraIndex = (addedIndex) => {
    extraIndex = 0;
    extraIndex = extraIndex + addedIndex;
    console.log(extraIndex);
  };

  // daySelect.addEventListener("change", (event) => {
  //     const addedIndex = parseInt(event.target.value);
  //     console.log(addedIndex);
  //     updatingExtraIndex(addedIndex);
  //   })

  daySelect.addEventListener("change", (event) => {
    extraIndex = parseInt(event.target.value);
    // console.log(extraIndex);
    // updatingExtraIndex(extraIndex);

    // To Change the hourly Weather icon when another weekday is selected 👇
    hourIconArray.forEach((icon) => {
      const iconIndex = hourIconArray.indexOf(icon);
      // console.log(iconIndex);
      const weather_code =
        hourlyWeatherData.weather_code[iconIndex + extraIndex];
      // console.log(weather_code);

      switch (true) {
        // Sunny
        case weather_code <= 1:
          icon.setAttribute("src", "./assets/images/icon-sunny.webp");
          break;
        // Partly-Cloudy
        case weather_code == 2:
          icon.setAttribute("src", "./assets/images/icon-partly-cloudy.webp");
          break;
        // Overcast
        case weather_code == 3:
          icon.setAttribute("src", "./assets/images/icon-overcast.webp");
          break;
        // Fog
        case weather_code <= 48:
          icon.setAttribute("src", "./assets/images/icon-fog.webp");
          break;
        // Drizzle
        case weather_code <= 57:
          icon.setAttribute("src", "./assets/images/icon-drizzle.webp");
          break;
        // Rain
        case weather_code <= 67:
          icon.setAttribute("src", "./assets/images/icon-rain.webp");
          break;
        // Snow
        case weather_code <= 77:
          icon.setAttribute("src", "./assets/images/icon-snow.webp");
          break;
        // Rain Showers
        case weather_code <= 82:
          icon.setAttribute("src", "./assets/images/icon-rain.webp");
          break;
        // Snow Showers
        case weather_code <= 86:
          icon.setAttribute("src", "./assets/images/icon-snow.webp");
          break;
        // Thunderstorm
        case weather_code <= 99:
          icon.setAttribute("src", "./assets/images/icon-storm.webp");
          break;

        // Default(Nothing happens)
        default:
          break;
      }
    });
    // To Change the hourly Weather icon when another weekday is selected 👆

    // To Change the hourly Weather temp when another weekday is selected 👇
    hourTempArray.forEach((temp) => {
      const tempIndex = hourTempArray.indexOf(temp);
      // console.log(tempIndex);

      temp.textContent = `${hourlyWeatherData.temperature_2m[tempIndex + extraIndex]}°`;
    });
    // To Change the hourly Weather temp when another weekday is selected 👆
  });

  // To Change the hourly Weather icon 👇
  hourIconArray.forEach((icon) => {
    const iconIndex = hourIconArray.indexOf(icon);
    // console.log(iconIndex);
    const weather_code = hourlyWeatherData.weather_code[iconIndex + extraIndex];
    // console.log(weather_code);

    switch (true) {
      // Sunny
      case weather_code <= 1:
        icon.setAttribute("src", "./assets/images/icon-sunny.webp");
        break;
      // Partly-Cloudy
      case weather_code == 2:
        icon.setAttribute("src", "./assets/images/icon-partly-cloudy.webp");
        break;
      // Overcast
      case weather_code == 3:
        icon.setAttribute("src", "./assets/images/icon-overcast.webp");
        break;
      // Fog
      case weather_code <= 48:
        icon.setAttribute("src", "./assets/images/icon-fog.webp");
        break;
      // Drizzle
      case weather_code <= 57:
        icon.setAttribute("src", "./assets/images/icon-drizzle.webp");
        break;
      // Rain
      case weather_code <= 67:
        icon.setAttribute("src", "./assets/images/icon-rain.webp");
        break;
      // Snow
      case weather_code <= 77:
        icon.setAttribute("src", "./assets/images/icon-snow.webp");
        break;
      // Rain Showers
      case weather_code <= 82:
        icon.setAttribute("src", "./assets/images/icon-rain.webp");
        break;
      // Snow Showers
      case weather_code <= 86:
        icon.setAttribute("src", "./assets/images/icon-snow.webp");
        break;
      // Thunderstorm
      case weather_code <= 99:
        icon.setAttribute("src", "./assets/images/icon-storm.webp");
        break;

      // Default(Nothing happens)
      default:
        break;
    }
  });
  // To Change the hourly Weather icon 👆

  // To Change the hourly Weather temperature 👇
  hourTempArray.forEach((temp) => {
    const tempIndex = hourTempArray.indexOf(temp);
    // console.log(tempIndex);

    temp.textContent = `${hourlyWeatherData.temperature_2m[tempIndex + extraIndex]}°`;
  });
  // To Change the hourly Weather temperature 👆

  daySelect.selectedIndex = 0;
};
