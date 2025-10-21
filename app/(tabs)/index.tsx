import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovie } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search for a movie"
          />
          <>
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>
            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </>
        </View>
      </ScrollView>
    </View>
  );
}
