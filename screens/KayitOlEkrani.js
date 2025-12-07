import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Firestore import edildi

export default function KayitOlEkrani({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // 🛑 YENİ: Kullanıcı Adı State'i
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !username) { // Kontrole username eklendi
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Kullanıcı Adı Kontrolü (Opsiyonel ama önerilir):
        if (username.length < 3) {
            Alert.alert('Hata', 'Kullanıcı adı en az 3 karakter olmalıdır.');
            return;
        }

        setLoading(true);

        try {
            // 1. Kullanıcıyı Firebase Auth ile oluştur
            const response = await auth().createUserWithEmailAndPassword(email, password);
            const user = response.user;

            // 2. Kullanıcı bilgilerini Firestore'a kaydet
            await firestore().collection('Users').doc(user.uid).set({
                email: email,
                username: username, // 🛑 KRİTİK: Kullanıcı adını kaydet
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!');
            navigation.navigate('Giris');

        } catch (error) {
            let errorMessage = 'Kayıt başarısız oldu. Lütfen tekrar deneyin.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Geçersiz e-posta formatı.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Şifre en az 6 karakter olmalıdır.';
            }
            Alert.alert('Hata', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Yeni Hesap Oluştur</Text>

            {/* 🛑 YENİ: Kullanıcı Adı Girişi */}
            <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="E-posta"
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Giris')}>
                <Text style={styles.linkText}>Zaten hesabınız var mı? Giriş Yapın</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f0f0f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 16,
    },
});