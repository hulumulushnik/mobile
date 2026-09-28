import { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TodoProvider } from "@/context/TodoContext";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "EXPO_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` (creates .env.local) or add the variable manually, then restart with `npx expo start -c`. For EAS builds set it in Environment variables on expo.dev.",
  );
}

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

// Адаптер SecureStore: токени зберігаються в iOS Keychain / Android Keystore
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

// expo-secure-store не працює у вебі: там Convex Auth використовує localStorage
const authStorage = Platform.OS === "web" ? undefined : secureStorage;

const isAuthRoute = (segment?: string) =>
  segment === "sign-in" || segment === "sign-up";

/** Неавторизований користувач може бачити лише sign-in / sign-up */
function RedirectToSignIn() {
  const segments = useSegments();
  const router = useRouter();
  const first = segments[0] as string | undefined;

  useEffect(() => {
    if (!isAuthRoute(first)) {
      router.replace("/sign-in");
    }
  }, [first, router]);

  return null;
}

/** Авторизований користувач не повинен залишатися на sign-in / sign-up */
function RedirectToApp() {
  const segments = useSegments();
  const router = useRouter();
  const first = segments[0] as string | undefined;

  useEffect(() => {
    if (isAuthRoute(first)) {
      router.replace("/(tabs)");
    }
  }, [first, router]);

  return null;
}

function RootLayoutContent() {
  const { isDarkMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Єдиний навігатор: усі екрани зареєстровані, доступ керується нижче */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>

      {/* 1. Перевірка збереженої сесії: перекриваємо екран індикатором */}
      <AuthLoading>
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.loading,
            { backgroundColor: colors.bg },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuthLoading>

      {/* 2. Неавторизований стан → екран входу */}
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>

      {/* 3. Авторизований стан → основний додаток із табами */}
      <Authenticated>
        <RedirectToApp />
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <SafeAreaProvider>
        <ThemeProvider>
          <TodoProvider>
            <RootLayoutContent />
          </TodoProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ConvexAuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
});
