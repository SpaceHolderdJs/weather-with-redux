const searchValReducer = (state = "", action) => {
  switch (action.type) {
    case "CHANGE_SEARCHVAL":
      return action.payload;
    case "CLEAR_SEARCHVAL":
      return "";
    default:
      return state;
  }
};

export default searchValReducer;
