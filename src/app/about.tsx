import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Skill = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const skills: Skill[] = [
  { id: "1", label: "React Native та Expo", icon: "phone-portrait-outline" },
  { id: "2", label: "JavaScript / TypeScript", icon: "code-slash-outline" },
  { id: "3", label: "Фотографія", icon: "camera-outline" },
  { id: "4", label: "Подорожі містами України", icon: "map-outline" },
  { id: "5", label: "Читання книг", icon: "book-outline" },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={skills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>

            <View style={styles.avatarWrapper}>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://api.dicebear.com/7.x/thumbs/png?seed=student",
                }}
              />
            </View>

            <Text style={styles.title}>Крайнічук Леонід</Text>
            <Text style={styles.subtitleText}>
              Студент(ка) курсу React Native
            </Text>

            <Text style={styles.description}>
              Привіт! Я цікавлюсь мобільною розробкою та люблю створювати зручні
              й красиві додатки. Окрім програмування, захоплююсь фотографією та
              подорожами, особливо старовинними містами Західної України. React
              Native вирішив(ла) вивчати, бо це дозволяє одразу створювати
              застосунки для iOS та Android з одного коду. Найбільше подобається
              бачити, як інтерфейс оживає на екрані телефону.
            </Text>

            <Text style={styles.subtitle}>Навички та інтереси</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon} size={22} color="#2f6fed" />
            </View>
            <Text style={styles.skillText}>{item.label}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2f6fed",
    fontWeight: "500",
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#2f6fed",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b3a5c",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 16,
    color: "#2f6fed",
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1b3a5c",
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "left",
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 6,
    borderRadius: 14,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eaf1ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  skillText: {
    fontSize: 16,
    color: "#1b3a5c",
    fontWeight: "500",
  },
});
