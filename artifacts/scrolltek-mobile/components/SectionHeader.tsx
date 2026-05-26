import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { borderLeftColor: colors.primary }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 14,
    marginTop: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
});
