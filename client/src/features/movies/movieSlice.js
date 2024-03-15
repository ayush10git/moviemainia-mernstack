import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import movieApi from "../../common/apis/movieApi";
import { APIKey } from "../../common/apis/movieApiKey";

export const fetchAsyncMovies = createAsyncThunk(
  "movies/fetchAsyncMovies",
  async (term) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${term}&type=movie`
    );
    console.log(response.data);
    return response.data;
  }
);

export const fetchAsyncShows = createAsyncThunk(
  "shows/fetchAsyncShows",
  async (term) => {
    const response = await movieApi.get(
      `?apiKey=${APIKey}&s=${term}&type=series`
    );
    return response.data;
  }
);

export const fetchAsyncMovieOrShowDetail = createAsyncThunk(
  "shows/fetchAsyncMovieOrShowDetail",
  async (id) => {
    const response = await movieApi.get(`?apiKey=${APIKey}&i=${id}&Plot=full`);
    return response.data;
  }
);

// export const fetchAsyncEpisodeDetail = createAsyncThunk(
//   "shows/fetchAsyncEpisodeDetail",
//   async (id, season) => {
//     const response = await axios.get(
//       `https://www.omdbapi.com/?apiKey=${APIKey}&i=${id}&Season=${season}`
//     );
//     console.log(response.data)
//     return response.data;
//   }
// );
const initialState = {
  movies: {},
  shows: {},
  selectedMovieOrShow: {},
  episodes: {},
  loader: false,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    removeSelectedMovieOrShow: (state) => {
      state.selectedMovieOrShow = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncMovies.pending, (state) => {
        console.log("pending");
        state.loader = true;
      })
      .addCase(fetchAsyncMovies.fulfilled, (state, { payload }) => {
        console.log("fetched successfully");
        return { ...state, movies: payload, loader: false };
      })
      .addCase(fetchAsyncMovies.rejected, () => {
        console.log("rejected");
      })
      .addCase(fetchAsyncShows.pending, (state) => {
        console.log("pending");
        state.loader = true;
      })
      .addCase(fetchAsyncShows.fulfilled, (state, { payload }) => {
        console.log("fetched successfully");
        return { ...state, shows: payload, loader: false };
      })
      .addCase(fetchAsyncMovieOrShowDetail.fulfilled, (state, { payload }) => {
        console.log("fetched successfully");
        return { ...state, selectedMovieOrShow: payload };
      })
      // .addCase(fetchAsyncEpisodeDetail.fulfilled, (state, { payload }) => {
      //   console.log("fetched successfully");
      //   return { ...state, episodes: payload };
      // });
  },
});

export const { removeSelectedMovieOrShow } = movieSlice.actions;
export const getAllMovies = (state) => state.movies.movies;
export const getAllShows = (state) => state.movies.shows;
export const getSelectedMovieOrShow = (state) =>
  state.movies.selectedMovieOrShow;
export const getLoader = (state) => state.movies.loader;
export const getAllEpisodes = (state) => state.movies.episodes;
export default movieSlice.reducer;
