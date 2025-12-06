import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth'; 
import firestore from '@react-native-firebase/firestore'; 

export default function KayitOlEkrani({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const handleSignUp = async () => {
        if (!email || !password || !username) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            // 1. Firebase Authentication ile kullanıcı oluştur
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. Firestore'a kullanıcı profilini kaydet (Profil ekranı için zorunlu)
            await firestore().collection('Users').doc(user.uid).set({
                email: user.email,
                username: username,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert('Başarılı', 'Kayıt başarılı! Uygulamaya yönlendiriliyorsunuz.');
            // Başarılı olursa App.tsx'teki dinleyici tetiklenir ve Ana Uygulamaya geçiş yapılır.

        } catch (error) {
            let errorMessage = "Kayıt sırasında bir hata oluştu: " + error.message;
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Şifreniz en az 6 karakter olmalıdır.";
            }
            Alert.alert('Hata', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NOTİKA'ya Kayıt Ol</Text>
            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre (min. 6 karakter)"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <Button title="Kayıt Ol" onPress={handleSignUp} color="#007AFF"/>
            
            <TouchableOpacity onPress={() => navigation.navigate('Giris')}>
                <Text style={styles.link}>Zaten hesabım var, Giriş Yap</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, marginBottom: 30, textAlign: 'center', fontWeight: 'bold' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 8 },
    link: { color: '#007AFF', textAlign: 'center', marginTop: 20, fontSize: 16 }
});