import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import Constants from "expo-constants";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";
const APP_NAME = Constants.expoConfig?.name ?? "Todo App";

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { completedCount, totalCount, clearCompleted, clearAll } = useTodos();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);

  // Після signOut() захист маршрутів у app/_layout.tsx сам перенаправить на /sign-in
  const handleSignOut = () => {
    Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з додатку?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Вийти",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (err) {
            Alert.alert("Помилка", "Не вдалося вийти з акаунта.");
            console.error(err);
          }
        },
      },
    ]);
  };

  const handleClearCompleted = () => {
    if (completedCount === 0) {
      Alert.alert("Немає завдань", "Немає виконаних завдань для очищення.");
      return;
    }
    Alert.alert(
      "Очистити виконані завдання",
      `Ви впевнені, що хочете видалити ${completedCount} виконаних завдань?`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await clearCompleted();
            } catch (err) {
              Alert.alert("Помилка", "Не вдалося очистити виконані завдання.");
              console.error(err);
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    if (totalCount === 0) {
      Alert.alert("Список порожній", "Немає завдань для видалення.");
      return;
    }
    Alert.alert(
      "Видалити всі завдання",
      "Ця дія видалить усі завдання без можливості відновлення. Продовжити?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAll();
            } catch (err) {
              Alert.alert("Помилка", "Не вдалося видалити всі завдання.");
              console.error(err);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            ⚙️ Налаштування
          </Text>
        </View>

        {/* Блок профілю користувача */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text
              style={[styles.userName, { color: colors.text }]}
              numberOfLines={1}
            >
              {user?.name ?? "Користувач"}
            </Text>
            <Text
              style={[styles.userEmail, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {user?.email ?? ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            accessibilityLabel="Вийти з акаунта"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Блок теми */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            ОФОРМЛЕННЯ
          </Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.rowText, { color: colors.text }]}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Блок дій із завданнями */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            КЕРУВАННЯ ЗАВДАННЯМИ
          </Text>
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: colors.border }]}
            onPress={handleClearCompleted}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name="checkmark-done-outline"
                size={22}
                color={colors.success}
              />
              <Text style={[styles.rowText, { color: colors.text }]}>
                Очистити виконані завдання
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
              <Text style={[styles.rowText, { color: colors.danger }]}>
                Видалити всі завдання
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Блок "Про додаток" */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            ПРО ДОДАТОК
          </Text>
          <View style={styles.aboutRow}>
            <Text style={[styles.appName, { color: colors.text }]}>
              📝 {APP_NAME}
            </Text>
            <Text style={[styles.appVersion, { color: colors.textMuted }]}>
              Версія {APP_VERSION}
            </Text>
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
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: "500",
  },
  aboutRow: {
    paddingVertical: 14,
  },
  appName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
  },
});
