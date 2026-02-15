import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useWallet } from "@/context/WalletContext";
import { useApp } from "@/context/AppContext";
import { getWisdomForDay } from "@/constants/wisdom";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { connected, connect, publicKey, disconnect } = useWallet();
  const { user, todayCompleted, loading } = useApp();

  const todayWisdom = getWisdomForDay();
  const [glowAnim] = useState(new Animated.Value(0));

  // Pulsing glow animation for streak
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [glowAnim]);

  // Calculate mental state (mock - you can make this real later)
  const getMentalState = () => {
    if (!user) return { emoji: "😐", label: "NEUTRAL", color: "#9CA3AF" };

    const hoursSinceLastPractice = user.lastPracticeDate
      ? (Date.now() - new Date(user.lastPracticeDate).getTime()) /
        (1000 * 60 * 60)
      : 999;

    if (todayCompleted && hoursSinceLastPractice < 1) {
      return { emoji: "🔥", label: "PEAK", color: "#00FF87" };
    } else if (todayCompleted) {
      return { emoji: "😌", label: "CALM", color: "#00D9FF" };
    } else if (hoursSinceLastPractice > 24) {
      return { emoji: "😡", label: "TILTED", color: "#FF4655" };
    }
    return { emoji: "😐", label: "NEUTRAL", color: "#9CA3AF" };
  };

  const mentalState = getMentalState();

  // Get week dots (last 7 days)
  const getWeekDots = () => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const today = new Date().getDay();
    return days.map((day, idx) => ({
      day,
      completed: idx < today,
    }));
  };

  const weekDots = getWeekDots();

  // Onboarding screen (if not connected)
  if (!connected) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={["#0A0E27", "#1A1D3A", "#252A4D"]}
          style={styles.onboardingGradient}
        >
          <View style={styles.onboardingContent}>
            {/* Logo placeholder - you can add an actual logo later */}
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🧘</Text>
            </View>

            <Text style={styles.onboardingTitle}>TiltReset</Text>
            <Text style={styles.onboardingTagline}>
              The Mental Edge For Gamers
            </Text>

            <View style={styles.onboardingFeatures}>
              <Text style={styles.featureText}>⚡ 3-minute mental resets</Text>
              <Text style={styles.featureText}>📈 Track performance gains</Text>
              <Text style={styles.featureText}>🏆 Compete on leaderboards</Text>
              <Text style={styles.featureText}>💎 Earn NFT achievements</Text>
            </View>

            <Pressable style={styles.connectButton} onPress={connect}>
              <LinearGradient
                colors={["#9147FF", "#7B61FF"]}
                style={styles.connectButtonGradient}
              >
                <Text style={styles.connectButtonText}>Connect Wallet</Text>
              </LinearGradient>
            </Pressable>

            <Text style={styles.poweredBy}>Powered by Solana Mobile</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>
    );
  }

  // Main home screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0A0E27", "#1A1D3A"]} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileEmoji}>🎮</Text>
              </View>
              <View>
                <Text style={styles.appName}>TiltReset</Text>
                <Text style={styles.headerSubtext}>Mental Edge</Text>
              </View>
            </View>

            <Pressable onPress={disconnect} style={styles.walletButton}>
              <Text style={styles.walletText}>
                {publicKey?.toBase58().slice(0, 4)}...
              </Text>
              <Text style={styles.walletBalance}>0.5◎</Text>
            </Pressable>
          </View>

          {/* Mental State Meter */}
          <View style={styles.stateCard}>
            <Text style={styles.stateLabel}>Current State:</Text>
            <View style={styles.stateDisplay}>
              <Text style={styles.stateEmoji}>{mentalState.emoji}</Text>
              <Text style={[styles.stateText, { color: mentalState.color }]}>
                {mentalState.label}
              </Text>
            </View>
            {mentalState.label === "TILTED" && (
              <Pressable style={styles.quickResetButton}>
                <Text style={styles.quickResetText}>Quick Reset →</Text>
              </Pressable>
            )}
          </View>

          {/* Streak Card with RGB Glow */}
          <View style={styles.streakCardContainer}>
            <Animated.View
              style={[
                styles.streakGlow,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                },
              ]}
            />
            <LinearGradient
              colors={["#252A4D", "#1A1D3A"]}
              style={styles.streakCard}
            >
              <View style={styles.hexagon}>
                <Text style={styles.streakNumber}>
                  {user?.currentStreak || 0}
                </Text>
                <Text style={styles.streakLabel}>days</Text>
                <Text style={styles.streakEmoji}>🔥</Text>
              </View>

              {/* Week dots */}
              <View style={styles.weekContainer}>
                {weekDots.map((dot, idx) => (
                  <View key={idx} style={styles.weekDayContainer}>
                    <View
                      style={[
                        styles.weekDot,
                        dot.completed && styles.weekDotCompleted,
                      ]}
                    />
                    <Text style={styles.weekDayLabel}>{dot.day}</Text>
                  </View>
                ))}
              </View>

              {/* Progress to next milestone */}
              {!todayCompleted && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${((user?.currentStreak || 0) / 30) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {30 - (user?.currentStreak || 0)} days to 30-Day Seal
                  </Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Wisdom Card (Gaming Quote) */}
          <View style={styles.wisdomCard}>
            <Text style={styles.wisdomLabel}>💭 Pro Tip</Text>
            <Text style={styles.wisdomText}>&ldquo;{todayWisdom.text}&rdquo;</Text>
            <Text style={styles.wisdomSource}>— {todayWisdom.source}</Text>
          </View>

          {/* Primary CTA */}
          {todayCompleted ? (
            <View style={styles.completedCard}>
              <Text style={styles.completedEmoji}>✓</Text>
              <Text style={styles.completedText}>Reset Complete</Text>
              <Text style={styles.completedSubtext}>
                Your mental is peak. Dominate the game! 🎮
              </Text>
            </View>
          ) : (
            <Pressable
              style={styles.practiceButton}
              onPress={() => router.push("/practice")}
            >
              <LinearGradient
                colors={["#9147FF", "#7B61FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.practiceButtonGradient}
              >
                <Text style={styles.practiceButtonText}>
                  {mentalState.label === "TILTED"
                    ? "🚨 Emergency Reset"
                    : "🎮 Pre-Game Warmup"}
                </Text>
                <Text style={styles.practiceButtonSubtext}>
                  3 minutes • Boost focus
                </Text>
              </LinearGradient>
            </Pressable>
          )}

          {/* Live Activity Ticker */}
          <View style={styles.tickerContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.ticker}
            >
              <Text style={styles.tickerText}>🏆 xXSniperXx hit 50 resets</Text>
              <Text style={styles.tickerText}>
                🔥 TTV_Calm on 127-day streak
              </Text>
              <Text style={styles.tickerText}>
                🎯 Top player: FaZe_Zen (247d)
              </Text>
            </ScrollView>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.totalDays || 0}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.longestStreak || 0}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user?.nftsMinted || 0}</Text>
              <Text style={styles.statLabel}>NFTs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>#--</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>

          {/* Achievement Badges */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>🏅 Achievements</Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🎯</Text>
                <Text style={styles.badgeName}>Zen</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>🔥</Text>
                <Text style={styles.badgeName}>Hot</Text>
              </View>
              <View style={[styles.badge, styles.badgeLocked]}>
                <Text style={styles.badgeEmoji}>🔒</Text>
                <Text style={styles.badgeName}>???</Text>
              </View>
            </View>
          </View>

          {/* Bottom padding */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem}>
            <Text style={styles.navIconActive}>🏠</Text>
            <Text style={styles.navLabelActive}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/gallery")}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navLabel}>Stats</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <Text style={styles.navIcon}>🏆</Text>
            <Text style={styles.navLabel}>Lead</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>You</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E27",
  },
  gradient: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Onboarding styles
  onboardingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(145, 71, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoEmoji: {
    fontSize: 64,
  },
  onboardingTitle: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  onboardingTagline: {
    fontSize: 18,
    color: "#9CA3AF",
    marginBottom: 48,
  },
  onboardingFeatures: {
    marginBottom: 48,
    alignItems: "flex-start",
  },
  featureText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  connectButton: {
    width: width - 64,
    borderRadius: 16,
    overflow: "hidden",
  },
  connectButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  poweredBy: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 24,
  },

  // Loading
  loadingText: {
    fontSize: 18,
    color: "#9CA3AF",
  },

  // Main screen
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(145, 71, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileEmoji: {
    fontSize: 24,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  walletButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  walletText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  walletBalance: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14F195",
  },

  // Mental State
  stateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  stateLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  stateDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  stateEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  stateText: {
    fontSize: 24,
    fontWeight: "700",
  },
  quickResetButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  quickResetText: {
    fontSize: 14,
    color: "#9147FF",
    fontWeight: "600",
  },

  // Streak Card
  streakCardContainer: {
    position: "relative",
    marginBottom: 16,
  },
  streakGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    backgroundColor: "#9147FF",
    opacity: 0.5,
  },
  streakCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(145, 71, 255, 0.3)",
  },
  hexagon: {
    alignItems: "center",
    marginBottom: 16,
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  streakLabel: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  streakEmoji: {
    fontSize: 32,
    marginTop: 8,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  weekDayContainer: {
    alignItems: "center",
  },
  weekDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 4,
  },
  weekDotCompleted: {
    backgroundColor: "#00FF87",
  },
  weekDayLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  progressContainer: {
    width: "100%",
    marginTop: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#9147FF",
  },
  progressText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },

  // Wisdom Card
  wisdomCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  wisdomLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  wisdomText: {
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 12,
  },
  wisdomSource: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "right",
  },

  // Practice Button
  practiceButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  practiceButtonGradient: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  practiceButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  practiceButtonSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },

  // Completed Card
  completedCard: {
    backgroundColor: "rgba(0, 255, 135, 0.1)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 135, 0.3)",
  },
  completedEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#00FF87",
    marginBottom: 4,
  },
  completedSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Ticker
  tickerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  ticker: {
    flexDirection: "row",
  },
  tickerText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginRight: 24,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9147FF",
  },
  statLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },

  // Achievements
  achievementsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1A1D3A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  navLabelActive: {
    fontSize: 10,
    color: "#9147FF",
    fontWeight: "600",
  },
});
