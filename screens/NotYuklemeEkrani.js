import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

// 'NotYuklemeEkrani' adında bir component oluştur
const NotYuklemeEkrani = ({ navigation }) => {
  
  // Form alanları için state'leri tanımla
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [bolum, setBolum] = useState('');
  const [sinif, setSinif] = useState('');
  const [ders, setDers] = useState('');
  const [konu, setKonu] = useState('');
  const [etiketler, setEtiketler] = useState('');

  return (
    // 'ScrollView' sayesinde form uzunsa ekran kaydırılabilir olur
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Yeni Not Yükle</Text>

        {/* Not Başlığı */}
        <TextInput
          style={styles.input}
          placeholder="Not Başlığı"
          value={baslik}
          onChangeText={setBaslik}
        />

        {/* Açıklama */}
        <TextInput
          style={styles.inputMultiline}
          placeholder="Açıklama"
          value={aciklama}
          onChangeText={setAciklama}
          multiline
        />

        {/* Bölüm */}
        <TextInput
          style={styles.input}
          placeholder="Bölüm (Örn: YBS)"
          value={bolum}
          onChangeText={setBolum}
        />

        {/* Sınıf */}
        <TextInput
          style={styles.input}
          placeholder="Sınıf (Örn: 2. Sınıf)"
          value={sinif}
          onChangeText={setSinif}
        />

        {/* Ders */}
        <TextInput
          style={styles.input}
          placeholder="Ders (Örn: YBS241)"
          value={ders}
          onChangeText={setDers}
        />

        {/* Konu */}
        <TextInput
          style={styles.input}
          placeholder="Konu"
          value={konu}
          onChangeText={setKonu}
        />

        {/* Etiketler */}
        <TextInput
          style={styles.input}
          placeholder="Etiketler (virgülle ayırın)"
          value={etiketler}
          onChangeText={setEtiketler}
        />

        {/* Dosya Seç Butonu */}
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonTextSecondary}>Dosya Seç (PDF/Metin)</Text>
        </TouchableOpacity>

        {/* Notu Yükle Butonu (Tasarımınızdaki yeşil buton) */}
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonTextPrimary}>Notu Yükle</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </ScrollView>
  );
};

// Stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  inputMultiline: {
    height: 120, // Açıklama alanı daha yüksek
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top', // Metni yukarıdan başlat
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50', // Yeşil buton
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20, // Üstteki butonla arasına boşluk
  },
  buttonTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#007AFF', // Mavi buton
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonTextSecondary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default NotYuklemeEkrani;