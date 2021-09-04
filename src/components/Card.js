import React, { useState } from "react";

import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const Card = ({ wthr }) => {
  const { name, wind, weather, main, sys, visibility, timezone } = wthr;

  const [mode, setMode] = useState("demo");
  return (
    <div className="card column">
      {mode === "demo" && (
        <div className="row centered demo-wrapper">
          <h1>{name}</h1>
          <div className="row">
            <div
              className="row centered demo-weather-icon"
              style={{
                background: `url(http://openweathermap.org/img/wn/${weather[0].icon}@2x.png)`,
                backgroundSize: `cover`,
              }}>
              <h2>{main.temp.toFixed(1)} °C</h2>
            </div>
          </div>
        </div>
      )}
      {mode === "full" && (
        <div className="full-data-wrapper column centered">
          <h1>{name}</h1>
          <div className="row centered data-wrapper">
            <div className="column sub-info">
              <h3>Temperature</h3>
              <span>temp: {main.temp.toFixed(1)} °C</span>
              <span>feels like: {main.feels_like.toFixed(1)} °C</span>
              <span>min: {main.temp_min.toFixed(1)} °C</span>
              <span>max: {main.temp_max.toFixed(1)} °C</span>
            </div>
            <div className="divider-vertical"></div>
            <div className="column sub-info">
              <h3>Optional</h3>
              <span>humidity: {main.humidity}</span>
              <span>pressure: {main.pressure}</span>
              <span>visibility: {visibility} m</span>
            </div>
            <div className="divider-vertical"></div>
            <div className="column sub-info">
              <h3>Sun activity</h3>
              <span>
                sunrise: {new Date(sys.sunrise * 1000).getHours()}:
                {new Date(sys.sunrise * 1000).getMinutes()}
              </span>
              <span>
                sunset: {new Date(sys.sunset * 1000).getHours()}:
                {new Date(sys.sunset * 1000).getMinutes()}
              </span>
            </div>
            <div className="divider-vertical"></div>
            <div className="column sub-info">
              <h3>Wind</h3>
              <span>speed: {wind.speed}</span>
              <span>deg: {wind.deg}</span>
            </div>
            <div className="divider-vertical"></div>
            <div className="column centered">
              <span>{weather[0].main}</span>
              <img
                src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                alt={name}
              />
              <span>{weather[0].description}</span>
            </div>
          </div>
        </div>
      )}

      <button
        className="icon row centered"
        onClick={() => setMode(mode === "demo" ? "full" : "demo")}>
        {mode === "demo" ? <ArrowDownward /> : <ArrowUpward />}
      </button>
    </div>
  );
};

export default Card;
