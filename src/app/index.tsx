import { Link } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [counter, setCounter] = useState<number>(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Моя навчальна подорож 👋</Text>
        <Text style={styles.counter}>Counter: {counter}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.smallButton}
            onPress={() => setCounter(counter + 1)}
          >
            <Text style={styles.smallButtonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.smallButton}
            onPress={() => setCounter(counter - 1)}
          >
            <Text style={styles.smallButtonText}>Subtract</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navSection}>
          <Link href="/city" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.navCard}>
              <Ionicons name="business-outline" size={22} color="#fff" />
              <Text style={styles.navCardText}>Моє місто</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/about" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.navCard}>
              <Ionicons name="person-outline" size={22} color="#fff" />
              <Text style={styles.navCardText}>Про мене</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b3a5c",
    textAlign: "center",
    marginBottom: 8,
  },
  counter: {
    fontSize: 20,
    color: "#2f6fed",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  smallButton: {
    backgroundColor: "#2f6fed",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navSection: {
    gap: 14,
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1b3a5c",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  navCardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
