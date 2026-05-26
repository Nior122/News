import { Feather } from "@expo/vector-icons";
import { useGetArticle, useListRelatedArticles } from "@workspace/api-client-react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArticleCard } from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { data: article, isLoading, error } = useGetArticle(slug ?? "");
  const { data: related } = useListRelatedArticles(slug ?? "", {
    query: { enabled: !!slug },
  });

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={36} color={colors.mutedForeground} />
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Article not found
        </Text>
        <Pressable onPress={() => router.back()} style={[styles.btn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
          <Text style={styles.btnText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const bodyText = article.body ? stripHtml(article.body) : article.excerpt;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPadding + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <Pressable
        onPress={() => router.back()}
        style={[
          styles.backBtn,
          { top: topPadding + 12, backgroundColor: "rgba(0,0,0,0.5)" },
        ]}
      >
        <Feather name="arrow-left" size={20} color="#fff" />
      </Pressable>

      {/* Hero image */}
      <Image
        source={{ uri: article.imageUrl }}
        style={styles.heroImage}
        contentFit="cover"
      />

      {/* Article content */}
      <View style={styles.content}>
        {/* Category */}
        <Text style={[styles.category, { color: colors.primary }]}>
          {article.category}
        </Text>

        {/* Title */}
        <Text style={[styles.title, { color: colors.foreground }]}>
          {article.title}
        </Text>

        {/* Subtitle */}
        {article.subtitle && (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {article.subtitle}
          </Text>
        )}

        {/* Author & meta */}
        <View style={[styles.authorRow, { borderBottomColor: colors.border, borderTopColor: colors.border }]}>
          <Image
            source={{ uri: article.author.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.foreground }]}>
              {article.author.name}
            </Text>
            <Text style={[styles.publishedAt, { color: colors.mutedForeground }]}>
              {formatDate(article.publishedAt)}
            </Text>
          </View>
          <View style={styles.readInfo}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.readTime, { color: colors.mutedForeground }]}>
              {article.readTime} min
            </Text>
          </View>
        </View>

        {/* Body */}
        <Text style={[styles.body, { color: colors.foreground }]}>
          {bodyText}
        </Text>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {article.tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: colors.secondary, borderRadius: 4 }]}
              >
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Views */}
        <View style={[styles.viewsRow, { borderTopColor: colors.border }]}>
          <Feather name="eye" size={14} color={colors.mutedForeground} />
          <Text style={[styles.viewsText, { color: colors.mutedForeground }]}>
            {article.views.toLocaleString()} views
          </Text>
        </View>

        {/* Related articles */}
        {related && related.length > 0 && (
          <View style={styles.related}>
            <Text style={[styles.relatedTitle, { color: colors.foreground }]}>
              Related Articles
            </Text>
            {related.slice(0, 3).map((a) => (
              <ArticleCard key={a.slug} article={a} variant="compact" />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 4,
  },
  btnText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: 260,
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  publishedAt: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  readInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTime: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  body: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  viewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
  },
  viewsText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  related: {
    gap: 0,
  },
  relatedTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    marginBottom: 14,
  },
});
