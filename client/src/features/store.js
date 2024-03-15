// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import moviesReducer from "./movies/movieSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, moviesReducer);

export const store = configureStore({
  reducer: { movies: persistedReducer },
});

export const persistor = persistStore(store);
