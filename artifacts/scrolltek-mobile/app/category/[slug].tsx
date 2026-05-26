import { Feather } from "@expo/vector-icons";
import { useListArticles } from "@workspace/api-client-react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArticleCard } from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useListArticles(
    { category: slug, page, limit: 12 },
    { query: { enabled: !!slug } }
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const categoryName = slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Category";

  return (
    <FlatList
      data={data?.articles ?? []}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <ArticleCard article={item} />}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 40 },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {categoryName}
            </Text>
            {data && (
              <Text style={[styles.count, { color: colors.mutedForeground }]}>
                {data.total} articles
              </Text>
            )}
          </View>
        </View>
      }
      ListFooterComponent={
        data?.hasMore ? (
          <Pressable
            style={[styles.loadMore, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}
            onPress={() => setPage((p) => p + 1)}
            disabled={isFetching}
          >
            {isFetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.loadMoreText, { color: colors.primary }]}>
                Load More
              </Text>
            )}
          </Pressable>
        ) : null
      }
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <View style={styles.empty}>
            <Feather name="inbox" size={36} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No articles in this category
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  count: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  loadMore: {
    padding: 14,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
  },
  loadMoreText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
