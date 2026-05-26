import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; avatarUrl: string };
  publishedAt: string;
  readTime: number;
  imageUrl: string;
  views: number;
}

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const colors = useColors();

  if (variant === "compact") {
    return (
      <Pressable
        style={[styles.compact, { borderBottomColor: colors.border }]}
        onPress={() => router.push(`/article/${article.slug}` as any)}
      >
        <View style={styles.compactText}>
          <Text
            style={[styles.compactCategory, { color: colors.primary }]}
            numberOfLines={1}
          >
            {article.category}
          </Text>
          <Text
            style={[styles.compactTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <View style={styles.meta}>
            <Feather name="clock" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {article.readTime} min read
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.compactImage}
          contentFit="cover"
        />
      </Pressable>
    );
  }

  if (variant === "horizontal") {
    return (
      <Pressable
        style={[styles.horizontal, { backgroundColor: colors.card, borderRadius: colors.radius }]}
        onPress={() => router.push(`/article/${article.slug}` as any)}
      >
        <Image
          source={{ uri: article.imageUrl }}
          style={[styles.horizontalImage, { borderRadius: colors.radius }]}
          contentFit="cover"
        />
        <View style={styles.horizontalContent}>
          <Text style={[styles.category, { color: colors.primary }]} numberOfLines={1}>
            {article.category}
          </Text>
          <Text
            style={[styles.horizontalTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <View style={styles.meta}>
            <Feather name="clock" size={11} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {article.readTime}m
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }]}
      onPress={() => router.push(`/article/${article.slug}` as any)}
    >
      <Image
        source={{ uri: article.imageUrl }}
        style={[styles.cardImage, { borderRadius: colors.radius }]}
        contentFit="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.category, { color: colors.primary }]} numberOfLines={1}>
          {article.category}
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={[styles.excerpt, { color: colors.mutedForeground }]} numberOfLines={2}>
          {article.excerpt}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {article.author.name}
            </Text>
            <Text style={[styles.dot, { color: colors.mutedForeground }]}>·</Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {formatDate(article.publishedAt)}
            </Text>
          </View>
          <View style={styles.meta}>
            <Feather name="clock" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {article.readTime} min
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginBottom: 16,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    fontSize: 12,
  },
  compact: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
    alignItems: "center",
  },
  compactText: {
    flex: 1,
    gap: 4,
  },
  compactCategory: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  compactTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 19,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  horizontal: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  horizontalImage: {
    width: 90,
    height: 90,
  },
  horizontalContent: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  horizontalTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 19,
  },
});
