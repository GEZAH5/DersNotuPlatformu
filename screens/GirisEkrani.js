import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

// 'navigation' prop'unu (ekranlar arası geçiş için) alıyoruz
const GirisEkrani = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notika</Text>
      <Text style={styles.subtitle}>Ders Notları Platformu</Text>

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

   {/* Giriş Yap Butonu (Navigasyon Eklendi) */}
<TouchableOpacity 
  style={styles.buttonPrimary}
  // 'AnaUygulama' ekranına (alt menülü bölüme) git
  onPress={() => navigation.navigate('AnaUygulama')} 
>
  <Text style={styles.buttonTextPrimary}>Giriş Yap</Text>
</TouchableOpacity>
      {/* Kayıt Ol Butonu (Navigasyon Eklendi) */}
      <TouchableOpacity 
        style={styles.buttonSecondary}
        // 'KayitOl' ekranına gitmek için 'navigation.navigate' kullanıyoruz
        onPress={() => navigation.navigate('KayitOl')} 
      >
        <Text style={styles.buttonTextSecondary}>Hesabın yok mu? Kayıt Ol</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

// Stilleri ekliyoruz
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 48, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 18, textAlign: 'center', color: 'gray', marginBottom: 40 },
  input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#f9f9f9' },
  buttonPrimary: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonTextPrimary: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonSecondary: { padding: 10, alignItems: 'center' },
  buttonTextSecondary: { color: '#007AFF', fontSize: 14 },
});

// Component'i dışa aktar (Kırmızı Ekran hatası almamak için bu şart)
export default GirisEkrani;