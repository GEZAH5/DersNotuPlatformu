import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab = createMaterialTopTabNavigator();

/**
 * Bu component, "Yüklediklerim" sekmesinin içeriğini gösterir.
 * Artık App.tsx'ten gelen 'notlar' listesini kullanır.
 */
// navigation ve notlar prop'larını alıyoruz
function YuklediklerimScreen({ navigation, notlar }) { 
  return (
    <ScrollView style={styles.tabContentContainer}>
      {/* Eğer not listesi boşsa mesaj göster */}
      {notlar.length === 0 && (
        <Text style={styles.bosListeMesaji}>Henüz yüklenmiş not yok.</Text>
      )}
      {/* App.tsx'ten gelen 'notlar' listesini map ile dönüyoruz */}
      {notlar.map((not) => (
        <TouchableOpacity 
          key={not.id} // ID'yi key olarak kullanıyoruz
          style={styles.notKarti}
          // NotDetay ekranına SADECE notun ID'sini değil, TÜM not nesnesini gönderiyoruz
          onPress={() => navigation.navigate('NotDetay', { not: not })} 
        >
          <View style={styles.notIkon}></View>
          <View style={styles.notMetin}>
            <Text style={styles.notBaslik}>{not.baslik}</Text>
            {/* Ders bilgisini gösterelim */}
            <Text style={styles.notDers}>{not.ders || 'Ders Belirtilmemiş'}</Text> 
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
 * Bu ana component, "Notlarım" ekranını oluşturur ve Top Tab Navigator'ı barındırır.
 * App.tsx'ten gelen 'notlar' listesini YuklediklerimScreen'e iletir.
 */
// notlar prop'unu App.tsx'ten alıyoruz
const NotlarimEkrani = ({ navigation, notlar }) => { 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notlarım</Text>
      
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF', 
          tabBarInactiveTintColor: 'gray', 
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, 
          tabBarStyle: { backgroundColor: '#f9f9f9' }, 
          tabBarIndicatorStyle: { backgroundColor: '#007AFF', height: 3 }, 
        }}
      >
        {/* YuklediklerimScreen'e 'notlar' listesini prop olarak iletiyoruz */}
        <TopTab.Screen name="Yüklediklerim">
          {(props) => <YuklediklerimScreen {...props} notlar={notlar} />} 
        </TopTab.Screen>
        <TopTab.Screen name="Favorilerim" component={FavorilerimScreen} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15, 
  },
  tabContentContainer: { 
    flex: 1,
    padding: 15, // Kenarlardan boşluğu biraz azalttık
  },
  bosListeMesaji: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
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
    backgroundColor: '#e0e0e0', 
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