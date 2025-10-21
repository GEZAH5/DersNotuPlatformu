import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

// 'NotDetayEkrani' adında bir component oluştur
// Bu ekran, tasarımınızdaki "Not Detayları Ekranı"dır
const NotDetayEkrani = ({ route, navigation }) => {
  
  // 'NotlarimEkrani'ndan gönderilen 'notId'yi (veya not bilgisini) almak için
  // const { notId } = route.params; 

  // Örnek Veri (Tasarımınızdaki gibi)
  const notBasligi = "Ders Notu Başlığı";
  const yukleyen = "Elif Yılmaz";
  const tarih = "20.10.2025";
  const begeniSayisi = 128;
  const yorumSayisi = 45;
  const notIcerigi = "Bu, ders notunun içeriğidir. Eğer PDF ise burada bir PDF görüntüleyici (WebView) olur, eğer metin ise bu şekilde görünür...";
  
  const yorumlar = [
    { id: 1, kisi: "Ayşe Demir", yorum: "Harika bir özet, teşekkürler!" },
    { id: 2, kisi: "Mehmet Can", yorum: "Sınavda çok yardımcı oldu." },
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        {/* Not Başlığı ve Bilgileri */}
        <View style={styles.header}>
          <Text style={styles.baslik}>{notBasligi}</Text>
          <Text style={styles.bilgi}>Yükleyen: {yukleyen} - {tarih}</Text>
        </View>

        {/* Notun İçeriği (Metin veya PDF Görüntüleyici) */}
        <View style={styles.contentContainer}>
          <Text style={styles.icerik}>{notIcerigi}</Text>
        </View>

        {/* Beğeni, Yorum, İndir Butonları */}
        <View style={styles.butonContainer}>
          <Text>{begeniSayisi} Beğeni</Text>
          <Text>{yorumSayisi} Yorum</Text>
          <TouchableOpacity style={styles.indirButon}>
            <Text style={styles.indirText}>İndir</Text>
          </TouchableOpacity>
        </View>

        {/* Yorumlar Başlığı */}
        <Text style={styles.yorumBaslik}>Yorumlar</Text>

        {/* Yorum Listesi */}
        {yorumlar.map((yorum) => (
          <View key={yorum.id} style={styles.yorumKarti}>
            <Text style={styles.yorumKisi}>{yorum.kisi}</Text>
            <Text style={styles.yorumMetin}>{yorum.yorum}</Text>
          </View>
        ))}

      </SafeAreaView>
    </ScrollView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  baslik: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bilgi: {
    fontSize: 14,
    color: 'gray',
  },
  contentContainer: {
    padding: 20,
  },
  icerik: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  butonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  indirButon: {
    backgroundColor: '#4CAF50', // Yeşil İndir butonu
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  indirText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  yorumBaslik: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  yorumKarti: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  yorumKisi: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  yorumMetin: {
    fontSize: 14,
    color: '#555',
  },
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default NotDetayEkrani;