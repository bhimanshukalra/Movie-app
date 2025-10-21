import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 text-sm font-normal">{label}:</Text>
    <Text className="text-light-100 text-sm font-bold mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const movieId = typeof id === "string" ? id : id[0];
  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(movieId));

  const imageSource = {
    uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
  };
  const budget = Math.round((movie?.budget ?? 0) / 1_000_000);
  const revenue = Math.round((movie?.revenue ?? 0) / 1_000_000);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-red-500">Error: {error?.message}</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View>
          <Image
            source={imageSource}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">
              {movie?.runtime} mins
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round((movie?.vote_average || 0) / 2)} / 5
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview || "N/A"} />
          <MovieInfo
            label="Genres"
            value={
              movie?.genres.map((genre) => genre.name).join(" - ") || "N/A"
            }
          />

          {budget > 0 && (
            <MovieInfo label="Budget" value={`$${budget} million`} />
          )}
          {revenue > 0 && (
            <MovieInfo label="Revenue" value={`$${revenue} million`} />
          )}

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                .map((company) => company.name)
                .join(" - ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={"#fff"}
        />
        <Text className="text-white">Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  scrollViewContentContainer: { paddingBottom: 80 },
});
