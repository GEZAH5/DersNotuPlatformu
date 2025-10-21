import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// 'navigation' prop'unu alıyoruz, "Giriş Yap"a geri dönebilmek için
const KayitOlEkrani = ({ navigation }) => {
  
  const [adSoyad, setAdSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hesap Oluştur</Text>

      <TextInput
        style={styles.input}
        placeholder="Adınız Soyadınız"
        value={adSoyad}
        onChangeText={setAdSoyad}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta Adresi"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Şifrenizi Tekrar Girin"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      {/* Kayıt Ol Butonu */}
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonTextPrimary}>Kayıt Ol</Text>
      </TouchableOpacity>

      {/* Giriş Yap'a Geri Dön Butonu (Navigasyon Eklendi) */}
      <TouchableOpacity 
        style={styles.buttonSecondary}
        // 'Giris' ekranına geri gitmek için 'navigation.navigate'
        onPress={() => navigation.navigate('Giris')} 
      >
        <Text style={styles.buttonTextSecondary}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

// Stiller (GirisEkrani.js ile neredeyse aynı)
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 30 },
  input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#f9f9f9' },
  buttonPrimary: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonTextPrimary: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonSecondary: { padding: 10, alignItems: 'center' },
  buttonTextSecondary: { color: '#007AFF', fontSize: 14 },
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default KayitOlEkrani;