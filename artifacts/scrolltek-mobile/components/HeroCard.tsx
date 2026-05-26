import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface HeroCardProps {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: { name: string };
    readTime: number;
    imageUrl: string;
    publishedAt: string;
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function HeroCard({ article }: HeroCardProps) {
  const colors = useColors();

  return (
    <Pressable
      style={[styles.hero, { borderRadius: colors.radius }]}
      onPress={() => router.push(`/article/${article.slug}` as any)}
    >
      <Image
        source={{ uri: article.imageUrl }}
        style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>FEATURED</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.category, { color: colors.primary }]}>
          {article.category}
        </Text>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>{article.author.name}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{formatDate(article.publishedAt)}</Text>
          <Text style={styles.dot}>·</Text>
          <Feather name="clock" size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.metaText}>{article.readTime} min</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 300,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#4a90e2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  content: {
    padding: 16,
    gap: 6,
  },
  category: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    lineHeight: 26,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  dot: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
});
