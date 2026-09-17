import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Landmark = {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const landmarks: Landmark[] = [
  {
    id: "1",
    name: "Чернівецький національний університет",
    description:
      "Головна будівля університету — колишня резиденція буковинських митрополитів, внесена до списку Світової спадщини ЮНЕСКО.",
    icon: "school-outline",
  },
  {
    id: "2",
    name: "Німецький народний дім",
    description:
      "Архітектурна перлина в стилі віденського сецесіону в самому центрі міста, сьогодні тут розміщується філармонія.",
    icon: "business-outline",
  },
  {
    id: "3",
    name: "Театральна площа",
    description:
      "Серце старого міста з Музично-драматичним театром імені Ольги Кобилянської та затишними кав'ярнями навколо.",
    icon: "musical-notes-outline",
  },
  {
    id: "4",
    name: "Вірменський колодязь",
    description:
      "Один з найстаріших символів Чернівців, зведений у 1976 році на честь вірменської громади міста.",
    icon: "water-outline",
  },
];

export default function CityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={landmarks}
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

            <Text style={styles.title}>Чернівці</Text>

            <Image
              style={styles.image}
              resizeMode="cover"
              source={require("@/assets/images/Німецький_Народний_Дім.jpg")}
            />

            <Text style={styles.description}>
              Чернівці — місто на заході України, столиця Буковини, відоме
              своєю унікальною австро-угорською архітектурою та затишною
              атмосферою старої Європи. У місті проживає близько 260 тисяч
              людей, і воно щороку приваблює туристів своїми мощеними
              вуличками, кав'ярнями та фестивалями.
            </Text>

            <Text style={styles.subtitle}>Визначні місця</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon} size={26} color="#2f6fed" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeDescription}>{item.description}</Text>
            </View>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b3a5c",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1b3a5c",
    marginTop: 8,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2f6fed",
    marginBottom: 20,
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
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eaf1ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b3a5c",
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});
