export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovie = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `/search/movie?query=${encodeURIComponent(query)}`
    : "/discover/movie?sort_by=popularity.desc";

  const url = `${TMDB_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }
  const data = await response.json();
  const results: Movie[] = data.results;
  return results;
};
