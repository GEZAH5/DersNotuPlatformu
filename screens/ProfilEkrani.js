import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'; 
import auth from '@react-native-firebase/auth'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

const ProfilEkrani = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); 
    const user = auth().currentUser; 

    // --- LOGOUT İŞLEVİ ---
    const handleLogout = () => {
        Alert.alert(
            "Çıkış Yap",
            "Oturumu sonlandırmak istediğinizden emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Evet",
                    onPress: async () => {
                        try {
                            await auth().signOut(); 
                        } catch (error) {
                            console.error("Çıkış yapılırken hata oluştu:", error);
                            Alert.alert("Hata", "Çıkış yapılamadı.");
                        }
                    }
                }
            ]
        );
    };

    // --- FIRESTORE'DAN KULLANICI PROFİLİNİ ÇEKME ---
    useEffect(() => {
        if (!user || !user.uid) {
            setLoading(false);
            setUserData(null);
            return;
        }

        setLoading(true);

        const subscriber = firestore()
            .collection('Users')
            .doc(user.uid)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot && documentSnapshot.exists) { 
                    setUserData(documentSnapshot.data());
                } else {
                    setUserData({ username: user.email, email: user.email }); 
                }
                setLoading(false);
            }, (error) => {
                console.error("Profil çekilirken Firestore hatası:", error);
                setUserData(null);
                setLoading(false); 
            });

        return () => subscriber(); 
    }, [user?.uid]); 

    // KRİTİK KONTROL 1: Yükleme Ekranı
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, color: '#555' }}>Profil yükleniyor...</Text>
            </View>
        );
    }
    
    // KRİTİK KONTROL 2: Oturum Açın Ekranı (Yükleme bittiyse ve hala user/userData yoksa)
    if (!user || !userData) {
         return (
            <View style={styles.container}>
                <Text style={styles.title}>Oturum Açın</Text>
                <Text style={styles.infoText}>Oturum bilgileri bulunamadı veya yüklenemedi. Lütfen tekrar giriş yapın.</Text>
                
                <TouchableOpacity 
                    style={styles.girisYapButton} 
                    onPress={handleLogout} 
                >
                    <Text style={styles.buttonText}>GİRİŞ YAP</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- BAŞARILI PROFİL GÖRÜNÜMÜ ---
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profilim</Text>
            
            <Icon name="person-circle-outline" size={100} color="#007AFF" style={styles.profileIcon} />

            <View style={styles.infoBox}>
                <Icon name="person" size={20} color="#007AFF" style={styles.iconStyle} />
                <View>
                    <Text style={styles.label}>Kullanıcı Adı:</Text>
                    <Text style={styles.data}>{userData.username || user.email}</Text>
                </View>
            </View>
            
            <View style={styles.infoBox}>
                <Icon name="mail" size={20} color="#007AFF" style={styles.iconStyle} />
                <View>
                    <Text style={styles.label}>E-posta:</Text>
                    <Text style={styles.data}>{user.email}</Text>
                </View>
            </View>

            {/* ÇIKIŞ YAP Butonu */}
            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>ÇIKIŞ YAP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    profileIcon: { marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30, marginTop: 50 },
    infoBox: {
        width: '100%', padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 15,
        borderLeftWidth: 5, borderLeftColor: '#007AFF', flexDirection: 'row', alignItems: 'center',
    },
    iconStyle: { marginRight: 15 },
    label: { fontSize: 14, fontWeight: '600', color: '#555' },
    data: { fontSize: 18, color: '#333', marginTop: 5 },
    logoutButton: {
        marginTop: 30, backgroundColor: '#FF3B30', paddingVertical: 12, paddingHorizontal: 40,
        borderRadius: 25, width: '80%', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    },
    girisYapButton: {
        marginTop: 30, backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 40,
        borderRadius: 25, width: '80%', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    infoText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
});

export default ProfilEkrani;