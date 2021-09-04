import { combineReducers } from "redux";

import weatherDataReducer from "./weatherData";
import searchValReducer from "./searchVal";

const allReducers = combineReducers({
  weatherData: weatherDataReducer,
  searchVal: searchValReducer,
});

export default allReducers;
