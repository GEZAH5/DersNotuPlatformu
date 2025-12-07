import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
// navigation prop'unu kullanacağımız için import etmeye gerek yok, direkt props'tan alacağız.

export default function KesfetEkrani({ navigation }) { // navigation prop'u burada alındı
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = firestore()
            .collection('Notes')
            .orderBy('yuklenmeTarihi', 'desc')
            .onSnapshot(querySnapshot => {
                const notesArray = [];
                querySnapshot.forEach(documentSnapshot => {
                    notesArray.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });

                setNotes(notesArray);
                setLoading(false);
            }, error => {
                console.error("Firestore okuma hatası:", error);
                setLoading(false);
            });

        // Aboneliği temizle
        return () => subscriber();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.noteCard} 
            // 🛑 KRİTİK DÜZELTME: Not ID'sini alarak Detay Ekranına yönlendir!
            // Eğer navigation prop'u alınıyorsa, onPress'in çalışmama ihtimali düşüktür.
            onPress={() => navigation.navigate('NotDetay', { noteId: item.id })}
        >
            <View style={styles.headerRow}>
                <Icon name="person-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.username}>{item.username || 'Anonim'}</Text>
            </View>
            <Text style={styles.title}>{item.baslik}</Text>
            <Text style={styles.subtitle}>{item.dersAdi} - {item.bolum}</Text>
            <View style={styles.footerRow}>
                <View style={styles.iconText}>
                    <Icon name="heart-outline" size={16} color="#FF3B30" />
                    <Text style={styles.countText}>{item.begeniler || 0}</Text>
                </View>
                <View style={styles.iconText}>
                    <Icon name="chatbubble-outline" size={16} color="#34C759" />
                    <Text style={styles.countText}>{item.yorumSayisi || 0}</Text>
                </View>
                <Text style={styles.dateText}>
                    {item.yuklenmeTarihi ? item.yuklenmeTarihi.toDate().toLocaleDateString('tr-TR') : 'Tarih Yok'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Tüm Notları Keşfet</Text>
            <FlatList
                data={notes}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Henüz yüklenmiş not bulunmamaktadır.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        padding: 20,
        paddingBottom: 10,
    },
    listContainer: {
        padding: 20,
        paddingTop: 0,
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    username: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 5,
    },
    iconText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    countText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 'auto',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    }
});