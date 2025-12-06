import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotlarimEkrani({ navigation }) {
    const [myNotes, setMyNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = auth().currentUser;

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // --- SADECE GİRİŞ YAPMIŞ KULLANICININ NOTLARINI FİLTRELE ---
        const subscriber = firestore()
            .collection('Notes')
            .where('userId', '==', user.uid) // Kullanıcının ID'sine göre filtrele
            .orderBy('yuklenmeTarihi', 'desc') 
            .onSnapshot(querySnapshot => {
                const loadedNotes = [];
                querySnapshot.forEach(documentSnapshot => {
                    loadedNotes.push({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data(),
                    });
                });
                setMyNotes(loadedNotes);
                setLoading(false);
            }, error => {
                console.error("Notlarim ekranı hata:", error);
                setLoading(false);
            });

        return () => subscriber(); // Dinlemeyi sonlandır
    }, [user]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.noteCard} 
            onPress={() => navigation.navigate('NotDetay', { noteId: item.id })}
        >
            <View style={styles.headerRow}>
                <Text style={styles.noteTitle}>{item.baslik}</Text>
                <Text style={styles.noteTag}>Ders: {item.dersAdi}</Text>
            </View>
            <View style={styles.interactionRow}>
                <Text style={styles.interactionText}>
                    <Icon name="heart-outline" size={14} /> {item.begeniler}
                </Text>
                <Text style={styles.interactionText}>
                    <Icon name="chatbubble-outline" size={14} /> {item.yorumSayisi}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loading} color="#007AFF" />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.pageTitle}>Yüklediğim Notlar</Text>
                
                <FlatList
                    data={myNotes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Henüz hiç not yüklemediniz.</Text>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    container: { 
        flex: 1, 
        paddingHorizontal: 10, 
    },
    loading: { flex: 1, justifyContent: 'center' },
    // KRİTİK DÜZELTME: Başlığı daha da aşağı çekmek için 40px boşluk ekliyoruz.
    pageTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginTop: 40, // Değer 40'a yükseltildi
        marginBottom: 20, 
        textAlign: 'center' 
    },
    noteCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    noteTag: {
        fontSize: 14,
        color: '#007AFF',
    },
    interactionRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    interactionText: {
        fontSize: 14,
        color: '#777',
        marginRight: 15,
    },
    listContent: { paddingBottom: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#aaa' }
});