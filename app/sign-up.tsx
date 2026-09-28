import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTheme } from "@/context/ThemeContext";
import { AuthInput } from "@/components/AuthInput";
import { authStyles as styles } from "@/components/authStyles";

export default function SignUpScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { colors } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі обов'язкові поля!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають!");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Помилка", "Пароль має містити мінімум 8 символів!");
      return;
    }

    setIsLoading(true);
    try {
      // Після успішної реєстрації сесія створюється автоматично,
      // а захист маршрутів у app/_layout.tsx відкриє основний додаток
      await signIn("password", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        flow: "signUp",
      });
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Помилка реєстрації",
        "Не вдалося створити профіль. Можливо, такий email вже використовується.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View
              style={[styles.iconContainer, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="person-add" size={38} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              Новий акаунт
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Створіть профіль для збереження ваших списків справ
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              icon="person-outline"
              placeholder="Ваше ім'я"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
            <AuthInput
              icon="mail-outline"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <AuthInput
              icon="lock-closed-outline"
              placeholder="Пароль (мін. 8 символів)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <AuthInput
              icon="shield-checkmark-outline"
              placeholder="Підтвердження пароля"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Зареєструватися</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>
              Вже маєте акаунт?{" "}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/sign-in")
              }
            >
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Увійти
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
