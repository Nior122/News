import {
  useGetFeaturedArticle,
  useListArticles,
  useListEditorsPicks,
  useListTrendingArticles,
} from "@workspace/api-client-react";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ArticleCard } from "@/components/ArticleCard";
import { HeroCard } from "@/components/HeroCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SkeletonCard, SkeletonHero } from "@/components/SkeletonCard";
import { useColors } from "@/hooks/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const {
    data: featured,
    isLoading: featuredLoading,
    refetch: refetchFeatured,
  } = useGetFeaturedArticle();

  const {
    data: trending,
    isLoading: trendingLoading,
    refetch: refetchTrending,
  } = useListTrendingArticles({ limit: 5 });

  const {
    data: editorsPicks,
    isLoading: editorsLoading,
    refetch: refetchEditors,
  } = useListEditorsPicks({ limit: 4 });

  const {
    data: latestData,
    isLoading: latestLoading,
    refetch: refetchLatest,
  } = useListArticles({ page: 1, limit: 8 });

  const isRefreshing = false;

  const onRefresh = useCallback(() => {
    refetchFeatured();
    refetchTrending();
    refetchEditors();
    refetchLatest();
  }, []);

  const isLoading = featuredLoading || trendingLoading;

  const topPadding = Platform.OS === "web" ? 67 : 0;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 80 },
      ]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* SCROLLTEK Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.foreground }]}>
          SCROLL<Text style={{ color: colors.primary }}>TEK</Text>
        </Text>
      </View>

      {/* Hero / Featured */}
      <View style={styles.section}>
        {featuredLoading ? (
          <SkeletonHero />
        ) : featured ? (
          <HeroCard article={featured} />
        ) : null}
      </View>

      {/* Trending */}
      <View style={styles.section}>
        <SectionHeader title="Trending Now" />
        {trendingLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          trending?.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="compact" />
          ))
        )}
      </View>

      {/* Editors Picks */}
      {(editorsLoading || (editorsPicks && editorsPicks.length > 0)) && (
        <View style={styles.section}>
          <SectionHeader title="Editor's Picks" />
          {editorsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            editorsPicks?.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))
          )}
        </View>
      )}

      {/* Latest */}
      <View style={styles.section}>
        <SectionHeader title="Latest Articles" />
        {latestLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          latestData?.articles?.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  logo: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 24,
  },
});
