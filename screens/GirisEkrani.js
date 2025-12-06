import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // MUTLAKA DAHİL OLMALI

export default function GirisEkrani({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
            return;
        }

        try {
            // 1. Firebase Authentication ile giriş yap
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 2. KRİTİK ADIM: Profil verisini çekmeye zorla. 
            // Bu, Profil ekranındaki onSnapshot dinleyicisini anında tetikler.
            const profileRef = firestore().collection('Users').doc(user.uid);
            const profileSnapshot = await profileRef.get();

            if (!profileSnapshot.exists) {
                 // Eğer profil verisi eksikse, varsayılan bir veri oluşturulur (eski hesaplar için).
                 await profileRef.set({
                    email: user.email,
                    username: user.email.split('@')[0],
                    createdAt: firestore.FieldValue.serverTimestamp(),
                 }, { merge: true });
            }
            
            // Başarılı: App.tsx'teki dinleyici tetiklenir ve Ana Uygulamaya geçiş yapılır.

        } catch (error) {
            let errorMessage = "Giriş başarısız. Bilgilerinizi kontrol edin.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "E-posta veya şifre hatalı.";
            }
            Alert.alert('Hata', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NOTİKA'ya Giriş Yap</Text>
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <Button title="Giriş Yap" onPress={handleSignIn} color="#007AFF" />

            {/* Kayıt Ol butonu */}
            <TouchableOpacity onPress={() => navigation.navigate('KayitOl')}>
                <Text style={styles.link}>Hesabım yok, Kayıt Ol</Text>
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