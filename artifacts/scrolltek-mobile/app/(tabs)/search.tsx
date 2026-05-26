import { Feather } from "@expo/vector-icons";
import { useSearchArticles } from "@workspace/api-client-react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArticleCard } from "@/components/ArticleCard";
import { useColors } from "@/hooks/useColors";
import { FlatList } from "react-native";

const SUGGESTIONS = [
  "AI tools", "Samsung", "Productivity", "Android", "iPhone", "Apps",
];

export default function SearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const { data, isLoading } = useSearchArticles(
    { q: submitted, limit: 20 },
    { query: { enabled: submitted.length > 1 } }
  );

  const topPadding = Platform.OS === "web" ? 67 : 0;
  const bottomPadding = Platform.OS === "web" ? 34 : 0;

  const handleSearch = () => {
    setSubmitted(query.trim());
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    setSubmitted(s);
  };

  const articles = data?.articles ?? [];

  return (
    <FlatList
      data={submitted.length > 1 ? articles : []}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => <ArticleCard article={item} />}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPadding + 16, paddingBottom: bottomPadding + 80 },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          {/* Search bar */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Feather name="search" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
              placeholder="Search articles..."
              placeholderTextColor={colors.mutedForeground}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(""); setSubmitted(""); }}>
                <Feather name="x" size={18} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>

          {/* Suggestions */}
          {submitted.length < 2 && (
            <View style={styles.suggestionsSection}>
              <Text style={[styles.suggestLabel, { color: colors.mutedForeground }]}>
                Popular searches
              </Text>
              <View style={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.secondary, borderRadius: 20 },
                    ]}
                    onPress={() => handleSuggestion(s)}
                  >
                    <Text style={[styles.chipText, { color: colors.foreground }]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Results header */}
          {submitted.length > 1 && (
            <View style={styles.resultsHeader}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
                  {data?.total ?? 0} results for "{submitted}"
                </Text>
              )}
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        submitted.length > 1 && !isLoading ? (
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No articles found
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  suggestionsSection: {
    marginBottom: 16,
    gap: 10,
  },
  suggestLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
