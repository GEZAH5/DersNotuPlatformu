import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';

// 'ProfilEkrani' adında bir component oluştur
// Bu ekran, tasarımınızdaki "Profil Ekranı"dır
const ProfilEkrani = ({ navigation, handleLogout }) => {
  
  // Örnek kullanıcı verisi
  const kullaniciAdi = "Elif Yılmaz";
  const email = "elifyilmaz@...com";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profilHeader}>
        {/* Profil Resmi (Tasarımınızdaki gibi) */}
        <View style={styles.profilResmi}></View>
        <Text style={styles.kullaniciAdi}>{kullaniciAdi}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Menü Seçenekleri (Tasarımınızdaki gibi) */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Hesap</Text>
          <Text style={styles.menuArrow}>{">"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Ayarlar</Text>
          <Text style={styles.menuArrow}>{">"}</Text>
        </TouchableOpacity>

        {/* Çıkış Yap Butonu (Tasarımınızdaki kırmızı buton) */}
        <TouchableOpacity 
        style={styles.menuItemCikis}
        onPress={handleLogout} // <-- SADECE BU SATIRI EKLE
      >
          <Text style={styles.menuTextCikis}>Çıkış Yap</Text>
          <Text style={styles.menuArrowCikis}>{">"}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profilHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profilResmi: {
    width: 100,
    height: 100,
    borderRadius: 50, // Yuvarlak resim
    backgroundColor: '#e0e0e0', // Resim yeri
    marginBottom: 15,
  },
  kullaniciAdi: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 16,
    color: 'gray',
  },
  menuItemCikis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 20, // Çıkış butonu ile diğerleri arasına boşluk
  },
  menuTextCikis: {
    fontSize: 16,
    color: 'red', // Kırmızı "Çıkış Yap" yazısı
    fontWeight: 'bold',
  },
  menuArrowCikis: {
    fontSize: 16,
    color: 'red', // Kırmızı ok
  }
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default ProfilEkrani;