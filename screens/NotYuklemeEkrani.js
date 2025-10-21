import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

// 'NotYuklemeEkrani' adında bir component oluştur
// handleNotEkle prop'unu App.tsx'ten alıyoruz
const NotYuklemeEkrani = ({ navigation, handleNotEkle }) => {

  // Form alanları için state'ler
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [bolum, setBolum] = useState('');
  const [sinif, setSinif] = useState('');
  const [ders, setDers] = useState('');
  const [konu, setKonu] = useState('');
  const [etiketler, setEtiketler] = useState('');

  return (
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

        {/* Dosya Seç Butonu (Şimdilik işlevsiz) */}
        <TouchableOpacity
          style={styles.buttonSecondary}
          // onPress={dosyaSec} // Dosya seçme işlevi daha sonra eklenecek
        >
          <Text style={styles.buttonTextSecondary}>Dosya Seç (PDF/Metin)</Text>
        </TouchableOpacity>

        {/* Notu Yükle Butonu (İŞLEVSSELLİK EKLENDİ) */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => { // Butona basıldığında çalışacak kod
            // 1. Yeni not nesnesini oluştur
            const yeniNot = {
              baslik: baslik,
              aciklama: aciklama,
              bolum: bolum,
              sinif: sinif,
              ders: ders,
              konu: konu,
              etiketler: etiketler.split(',').map(tag => tag.trim()), // Etiketleri ayır ve boşlukları temizle
              begeni: 0 // Başlangıçta 0 beğeni
              // ID'yi App.tsx'teki handleNotEkle ekleyecek
            };

            // 2. App.tsx'teki fonksiyonu çağırarak listeye ekle
            handleNotEkle(yeniNot);

            // 3. Kullanıcıyı "Notlarım" ekranına geri yönlendir
            navigation.navigate('AnaUygulama', { screen: 'Notlarım' });

            // 4. Formu temizle
            setBaslik('');
            setAciklama('');
            setBolum('');
            setSinif('');
            setDers('');
            setKonu('');
            setEtiketler('');
          }}
        >
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
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#007AFF',
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

// Component'i dışa aktar
export default NotYuklemeEkrani;