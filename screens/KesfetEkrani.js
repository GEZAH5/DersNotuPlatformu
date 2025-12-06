import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function KesfetEkrani({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNotes, setFilteredNotes] = useState([]);

    // Firestore'dan tüm notları çekme
    useEffect(() => {
        const subscriber = firestore()
            .collection('Notes')
            .orderBy('yuklenmeTarihi', 'desc') // En yeniyi en üste getir
            .onSnapshot(querySnapshot => {
                const loadedNotes = [];
                querySnapshot.forEach(documentSnapshot => {
                    loadedNotes.push({
                        id: documentSnapshot.id,
                        ...documentSnapshot.data(),
                    });
                });
                setNotes(loadedNotes);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    // Arama filtreleme mantığı
    useEffect(() => {
        if (!searchQuery) {
            setFilteredNotes(notes);
            return;
        }
        
        const lowerCaseQuery = searchQuery.toLowerCase();
        const results = notes.filter(note => {
            return (
                note.baslik.toLowerCase().includes(lowerCaseQuery) ||
                note.dersAdi.toLowerCase().includes(lowerCaseQuery) ||
                note.bolum.toLowerCase().includes(lowerCaseQuery) ||
                note.konu.toLowerCase().includes(lowerCaseQuery) 
            );
        });
        setFilteredNotes(results);
    }, [searchQuery, notes]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.noteCard} 
            onPress={() => navigation.navigate('NotDetay', { noteId: item.id })}
        >
            <View style={styles.headerRow}>
                <Text style={styles.noteTitle}>{item.baslik}</Text>
                <Text style={styles.noteUser}>@{item.username || 'Anonim'}</Text>
            </View>
            <View style={styles.tagRow}>
                <Text style={styles.noteTag}>Ders: {item.dersAdi}</Text>
                <Text style={styles.noteTag}>Bölüm: {item.bolum}</Text>
                <Text style={styles.noteTag}>Konu: {item.konu}</Text>
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
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Keşfet</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Ders, Bölüm veya Konu Ara..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredNotes}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Henüz not yüklenmemiş veya aramanızla eşleşen not bulunamadı.</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
    loading: { flex: 1, justifyContent: 'center' },
    pageTitle: { fontSize: 28, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' },
    searchInput: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
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
    noteUser: {
        fontSize: 12,
        color: '#007AFF',
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
    },
    noteTag: {
        fontSize: 12,
        backgroundColor: '#e6f7ff',
        color: '#007AFF',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4
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