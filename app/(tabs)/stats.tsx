import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ThemeColors } from "@/types";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accentColor: string;
  colors: ThemeColors;
}

function StatCard({ icon, label, value, accentColor, colors }: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${accentColor}22` }]}>
        <Ionicons name={icon} size={24} color={accentColor} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const { colors } = useTheme();
  // Персональна статистика поточного користувача (рахується на бекенді)
  const stats = useQuery(api.todos.getStats);
  const totalCount = stats?.total ?? 0;
  const activeCount = stats?.active ?? 0;
  const completedCount = stats?.completed ?? 0;
  const progressPercent = stats?.completionRate ?? 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            📊 Статистика
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Огляд вашої продуктивності
          </Text>
        </View>

        <View style={styles.grid}>
          <StatCard
            icon="list-outline"
            label="Всього завдань"
            value={String(totalCount)}
            accentColor={colors.primary}
            colors={colors}
          />
          <StatCard
            icon="time-outline"
            label="Активні"
            value={String(activeCount)}
            accentColor="#f59e0b"
            colors={colors}
          />
          <StatCard
            icon="checkmark-circle-outline"
            label="Виконані"
            value={String(completedCount)}
            accentColor={colors.success}
            colors={colors}
          />
          <StatCard
            icon="trending-up-outline"
            label="Прогрес"
            value={`${progressPercent}%`}
            accentColor={colors.danger}
            colors={colors}
          />
        </View>

        <View
          style={[
            styles.progressCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              Загальний прогрес
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {progressPercent}%
            </Text>
          </View>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.bg }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
  },
  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
});
