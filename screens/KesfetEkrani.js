import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, TouchableOpacity } from 'react-native';

// 'KesfetEkrani' adında bir component oluştur
const KesfetEkrani = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Keşfet</Text>
        
        {/* Arama Çubuğu */}
        <TextInput
          style={styles.searchBar}
          placeholder="Ders, konu veya etiket ara..."
        />

        {/* Kategoriler (Örnek) */}
        <Text style={styles.sectionTitle}>Kategoriler</Text>
        <View style={styles.kategoriContainer}>
          <TouchableOpacity style={styles.kategoriKarti}><Text style={styles.kategoriText}>Matematik</Text></TouchableOpacity>
          <TouchableOpacity style={styles.kategoriKarti}><Text style={styles.kategoriText}>Fizik</Text></TouchableOpacity>
          <TouchableOpacity style={styles.kategoriKarti}><Text style={styles.kategoriText}>YBS</Text></TouchableOpacity>
          <TouchableOpacity style={styles.kategoriKarti}><Text style={styles.kategoriText}>Tarih</Text></TouchableOpacity>
          <TouchableOpacity style={styles.kategoriKarti}><Text style={styles.kategoriText}>Yazılım</Text></TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  searchBar: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 30, // Arama çubuğu ile kategoriler arasına boşluk
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  kategoriContainer: {
    flexDirection: 'row', // Butonları yan yana diz
    flexWrap: 'wrap', // Sığmazsa alt satıra indir
    paddingHorizontal: 20,
  },
  kategoriKarti: {
    backgroundColor: '#007AFF', // Mavi kategori butonu
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  kategoriText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default KesfetEkrani;