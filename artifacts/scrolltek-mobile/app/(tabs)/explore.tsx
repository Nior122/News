import {
  useListCategories,
  useListPopularArticles,
} from "@workspace/api-client-react";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useColors } from "@/hooks/useColors";

const CATEGORY_ICONS: Record<string, string> = {
  tech: "💻",
  ai: "🤖",
  culture: "🎭",
  lifestyle: "✨",
  productivity: "⚡",
  trending: "🔥",
  phones: "📱",
  default: "📰",
};

export default function ExploreScreen() {
  const colors = useColors();
  const { data: categories, isLoading: catsLoading } = useListCategories();
  const { data: popular, isLoading: popLoading } = useListPopularArticles({ limit: 6 });

  const topPadding = Platform.OS === "web" ? 67 : 0;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Categories */}
      <SectionHeader title="Browse Categories" />
      {catsLoading ? (
        <View style={styles.catGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              style={[
                styles.catChip,
                { backgroundColor: colors.muted, borderRadius: colors.radius },
              ]}
            />
          ))}
        </View>
      ) : (
        <View style={styles.catGrid}>
          {categories?.map((cat) => {
            const icon = CATEGORY_ICONS[cat.slug.toLowerCase()] ?? CATEGORY_ICONS.default;
            return (
              <Pressable
                key={cat.slug}
                style={[
                  styles.catChip,
                  { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
                ]}
                onPress={() => router.push(`/category/${cat.slug}` as any)}
              >
                <Text style={styles.catIcon}>{icon}</Text>
                <Text style={[styles.catName, { color: colors.foreground }]} numberOfLines={1}>
                  {cat.name}
                </Text>
                <Text style={[styles.catCount, { color: colors.mutedForeground }]}>
                  {cat.articleCount}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Popular this week */}
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Popular This Week" />
        {popLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          popular?.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="horizontal" />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catChip: {
    width: "47%",
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  catIcon: {
    fontSize: 22,
  },
  catName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  catCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
