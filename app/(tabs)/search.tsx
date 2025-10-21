import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovie } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovie({ query: searchQuery }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (movies?.length && movies[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => <MovieCard {...item} />,
    []
  );

  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  const ListEmptyComponent = useCallback(
    () =>
      !loading && !error ? (
        <View className="mt-10 px-5">
          <Text className="text-center text-gray-500">
            {searchQuery.trim()
              ? "No movies found."
              : "Start typing to search for movies."}
          </Text>
        </View>
      ) : null,
    [loading, error, searchQuery]
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  className="my-3"
                />
              )}
              {error && (
                <Text className="text-red-500 px-5 my-3">
                  Error: {error.message}
                </Text>
              )}
              {!loading && !error && searchQuery.trim() && movies?.length && (
                <Text className="text-xl text-white font-bold mt-3">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
            </View>
          </>
        }
        ListEmptyComponent={<ListEmptyComponent />}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "flex-start",
    gap: 16,
    marginVertical: 16,
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
