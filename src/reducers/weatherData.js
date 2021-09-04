const weatherDataReducer = (state = null, action) => {
  switch (action.type) {
    case "INIT_WEATHER_DATA":
      return { ...action.payload };
    default:
      return state;
  }
};

export default weatherDataReducer;
