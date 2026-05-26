import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function SkeletonCard() {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const bg = { backgroundColor: colors.muted };

  return (
    <Animated.View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius, opacity }]}>
      <View style={[styles.image, bg]} />
      <View style={styles.content}>
        <View style={[styles.tag, bg]} />
        <View style={[styles.titleLine, bg]} />
        <View style={[styles.titleLineShort, bg]} />
        <View style={[styles.metaLine, bg]} />
      </View>
    </Animated.View>
  );
}

export function SkeletonHero() {
  const colors = useColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.hero,
        { backgroundColor: colors.muted, borderRadius: colors.radius, opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  tag: {
    width: 60,
    height: 12,
    borderRadius: 4,
  },
  titleLine: {
    width: "90%",
    height: 16,
    borderRadius: 4,
  },
  titleLineShort: {
    width: "60%",
    height: 16,
    borderRadius: 4,
  },
  metaLine: {
    width: "40%",
    height: 12,
    borderRadius: 4,
  },
  hero: {
    height: 300,
  },
});
