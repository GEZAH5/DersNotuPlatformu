import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function KesfetEkrani({ navigation }) {
    const [allNotes, setAllNotes] = useState([]); // Tüm notlar
    const [filteredNotes, setFilteredNotes] = useState([]); // Filtrelenmiş notlar
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState(''); // Arama metni

    // --- Notları Firebase'den Çekme ---
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

                setAllNotes(notesArray); // Tüm notları kaydet
                setFilteredNotes(notesArray); // Başlangıçta hepsi filtrelenmiş olarak görünür
                setLoading(false);
            }, error => {
                console.error("Firestore okuma hatası:", error);
                setLoading(false);
            });

        return () => subscriber();
    }, []);
    
    // --- Arama ve Filtreleme İşlevi ---
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredNotes(allNotes);
            return;
        }

        const lowerCaseSearch = searchText.toLowerCase();
        const results = allNotes.filter(note => {
            // Başlık, Ders Adı, Konu veya Kullanıcı Adına göre filtrele
            return (
                (note.baslik && note.baslik.toLowerCase().includes(lowerCaseSearch)) ||
                (note.dersAdi && note.dersAdi.toLowerCase().includes(lowerCaseSearch)) ||
                (note.konu && note.konu.toLowerCase().includes(lowerCaseSearch)) ||
                (note.username && note.username.toLowerCase().includes(lowerCaseSearch)) // Kullanıcı Adı ile arama
            );
        });
        setFilteredNotes(results);
    }, [searchText, allNotes]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.noteCard} 
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
            
            {/* 🛑 ARAMA KISMI */}
            <TextInput
                style={styles.searchInput}
                placeholder="Başlık, Ders Adı veya Kullanıcı Adı Ara..."
                value={searchText}
                onChangeText={setSearchText}
            />

            <FlatList
                data={filteredNotes} 
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Sonuç bulunamadı.</Text>}
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    searchInput: { // Arama Kutusu Style
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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