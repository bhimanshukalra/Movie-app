import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovie } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovie({ query: "" }));

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const renderLatestMovies = useCallback(() => {
    const renderItem = ({ item }: { item: Movie }) => <MovieCard {...item} />;
    const keyExtractor = (item: Movie) => item.id.toString();

    return (
      <>
        <Text className="text-lg text-white font-bold mt-5 mb-3">
          Latest Movies
        </Text>
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={3}
          columnWrapperStyle={styles.latestMoviesColumnWrapper}
          className="mt-2 pb-32"
          scrollEnabled={false}
        />
      </>
    );
  }, [movies]);

  const renderTrendingMovies = useCallback(() => {
    const renderItem = ({
      item,
      index,
    }: {
      item: TrendingMovie;
      index: number;
    }) => <TrendingCard movie={item} index={index} />;

    const keyExtractor = (item: TrendingMovie) => item.movie_id.toString();
    const ItemSeparatorComponent = () => <View className="w-8" />;

    return (
      <View className="mt-10">
        <Text className="text-lg text-white font-bold mb-3">
          Trending Movies
        </Text>
        <FlatList
          data={trendingMovies}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    );
  }, [trendingMovies]);
  if (moviesLoading || trendingLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        className="mt-10 flex-1 self-center"
      />
    );
  }

  if (moviesError || trendingError) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-red-500">
          Error: {moviesError?.message || trendingError?.message}
        </Text>
      </View>
    );
  }

  const onPressSearchBar = () => {
    router.push("/search");
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="flex-1 mt-5">
          <SearchBar
            onPress={onPressSearchBar}
            placeholder="Search for a movie"
          />
          {trendingMovies && renderTrendingMovies()}
          {renderLatestMovies()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: { minHeight: "100%", paddingBottom: 10 },
  latestMoviesColumnWrapper: {
    justifyContent: "flex-start",
    gap: 20,
    paddingRight: 5,
    marginBottom: 10,
  },
});
