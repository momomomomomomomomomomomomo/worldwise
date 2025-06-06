import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload, error: "" };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        error: "",
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: [...state.cities, action.payload],
        error: "",
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        currentCity: {},
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unkonw Action Type");
  }
}

function CitiesProvider({ fetchURL, children }) {
  const [{ cities, error, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      async function fetchCities() {
        try {
          dispatch({ type: "loading" });
          const res = await fetch(fetchURL);
          const data = await res.json();
          dispatch({ type: "cities/loaded", payload: data });
        } catch {
          dispatch({
            type: "rejected",
            payload: "There was an error Loading cities...",
          });
        }
      }
      fetchCities();
    },
    [fetchURL]
  );
  async function getCity(id) {
    if (+id === currentCity.id) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${fetchURL}/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error Loading city...",
      });
    }
  }
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${fetchURL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "content-type": "application/json" },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city...",
      });
    }
  }
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${fetchURL}/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        getCity,
        createCity,
        deleteCity,
        currentCity,
        isLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("you're using CitiesContext outside of Citiesprovider");
  return context;
}

export { CitiesProvider, useCities };
