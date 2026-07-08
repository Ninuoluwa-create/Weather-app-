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
      // console.log(locationData);

      // if (locationData === undefined) {
      //   throw new Error("Could not fetch location data");
      // }
      console.log(`${locationData.lat}\n${locationData.long}`);

      getWeatherData(locationData);
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
  console.log(data);

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
  console.log(locationData);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=weather_code,temperature_2m&models=best_match&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto&wind_speed_unit=mph`,
  );
  //  console.log(response);
  if (!response.ok) {
    throw new Error("Could not fetch resources ");
  }
  // console.log(response);
  const data = await response.json();
  console.log(data);
};
