import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./animations.css";
import "./App.css";

import Scene from "./scene";
import Card from "./components/Card";

import { Cloud, Search } from "@material-ui/icons";

const API_KEY = `6409ee75b6ffc020adb31a565296a4bb`;

function App() {
  const dispatch = useDispatch();

  const weatherData = useSelector((store) => store.weatherData);
  const searchVal = useSelector((store) => store.searchVal);

  const [loading, setLoading] = useState(false);

  const getWeather = (city) => {
    setLoading(true);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((weatherData) => {
        setLoading(false);
        if (weatherData.weather) {
          dispatch({ type: "INIT_WEATHER_DATA", payload: weatherData });
          Scene.initScene({
            time: new Date(Date.now()),
            weatherType: weatherData.weather[0].main.toLowerCase(),
          });
        } else {
          dispatch({ type: "INIT_WEATHER_DATA", payload: { error: true } });
        }
      });
  };

  // initing three
  useEffect(() => {
    Scene.initScene({ time: new Date(Date.now()) });
  }, []);

  return (
    <div className="app column centered">
      <h1>
        <Cloud /> Hello
      </h1>
      <div className="column centered form">
        <div className="row centered">
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: "CHANGE_SEARCHVAL", payload: e.target.value })
            }
            value={searchVal}
          />
          <button
            className="row icon centered search-btn"
            onClick={() => getWeather(searchVal)}>
            <Search />
          </button>
        </div>
      </div>
      {loading && <h1>Loading</h1>}
      {weatherData &&
        (weatherData.error ? (
          <h1>City is not found</h1>
        ) : (
          <Card wthr={weatherData} />
        ))}
    </div>
  );
}

export default App;
