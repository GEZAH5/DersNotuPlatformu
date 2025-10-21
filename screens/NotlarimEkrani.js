import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
// Yeni eklediğimiz kütüphaneyi import ediyoruz
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Top Tab Navigator'ı oluşturuyoruz
const TopTab = createMaterialTopTabNavigator();

/**
 * Bu component, "Yüklediklerim" sekmesinin içeriğini gösterir (şimdilik basit bir metin)
 */
function YuklediklerimScreen({ navigation }) {
  // Örnek not verisi (Bu kısmı daha sonra veritabanından alacağız)
  const notlar = [
    { id: 1, baslik: 'Linear Cebir Notları', ders: 'Matematik', begeni: 120 },
    { id: 2, 'baslik': 'Termodinamik Özet', ders: 'Fizik', begeni: 85 },
  ];

  return (
    <ScrollView style={styles.tabContentContainer}>
      {notlar.map((not) => (
        <TouchableOpacity 
          key={not.id} 
          style={styles.notKarti}
          onPress={() => navigation.navigate('NotDetay', { notId: not.id })} // Not Detay'a git
        >
          <View style={styles.notIkon}></View>
          <View style={styles.notMetin}>
            <Text style={styles.notBaslik}>{not.baslik}</Text>
            <Text style={styles.notDers}>{not.ders}</Text>
          </View>
          <Text style={styles.notBegeni}>{not.begeni} beğeni</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

/**
 * Bu component, "Favorilerim" sekmesinin içeriğini gösterir (şimdilik basit bir metin)
 */
function FavorilerimScreen() {
  return (
    <View style={styles.tabContentContainer}>
      <Text>Favori notlarınız burada listelenecek.</Text>
      {/* Buraya da favori notların listesi gelecek */}
    </View>
  );
}

/**
 * Bu ana component, "Notlarım" ekranını oluşturur ve içinde Top Tab Navigator'ı barındırır.
 */
const NotlarimEkrani = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notlarım</Text>
      
      {/* Üst Sekmeleri (Yüklediklerim / Favorilerim) burada oluşturuyoruz */}
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF', // Aktif sekme rengi
          tabBarInactiveTintColor: 'gray', // Pasif sekme rengi
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, // Yazı stili
          tabBarStyle: { backgroundColor: '#f9f9f9' }, // Sekme çubuğu arka planı
          tabBarIndicatorStyle: { backgroundColor: '#007AFF', height: 3 }, // Alttaki çizgi
        }}
      >
        <TopTab.Screen name="Yüklediklerim" component={YuklediklerimScreen} />
        <TopTab.Screen name="Favorilerim" component={FavorilerimScreen} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

// Stiller (Bazıları güncellendi)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Hafif gri arka plan
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15, // Başlıkla sekmeler arasına boşluk
  },
  tabContentContainer: { // Sekmelerin içindeki alan için stil
    flex: 1,
    padding: 20, // Kenarlardan boşluk
  },
  // Not kartı stilleri aynı kaldı
  notKarti: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notIkon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e0e0e0', // İkonun yeri
    marginRight: 15,
  },
  notMetin: {
    flex: 1,
  },
  notBaslik: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notDers: {
    fontSize: 14,
    color: 'gray',
  },
  notBegeni: {
    fontSize: 14,
    color: 'gray',
  },
});

// Component'i dışa aktar
export default NotlarimEkrani;