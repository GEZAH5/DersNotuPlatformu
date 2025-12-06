import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs'; // Dosya indirme kütüphanesi
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotDetayEkrani({ route, navigation }) {
    const { noteId } = route.params; // Keşfet ekranından gelen not ID'si
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isFavorite, setIsFavorite] = useState(false); // Favori durumunu tutar (Beğeni)
    const [comments, setComments] = useState([]); // Yorum listesi için

    const currentUser = auth().currentUser;

    // --- NOTU ÇEKME VE YORUMLARI DİNLEME ---
    useEffect(() => {
        // Not detayını dinle
        const noteSubscriber = firestore()
            .collection('Notes')
            .doc(noteId)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setNote({ id: documentSnapshot.id, ...documentSnapshot.data() });
                } else {
                    Alert.alert('Hata', 'Not bulunamadı.');
                }
                setLoading(false);
            });

        // Yorumları dinle
        const commentSubscriber = firestore()
            .collection('Notes')
            .doc(noteId)
            .collection('Comments')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const loadedComments = [];
                querySnapshot.forEach(doc => {
                    loadedComments.push({ id: doc.id, ...doc.data() });
                });
                setComments(loadedComments);
            });

        return () => {
            noteSubscriber();
            commentSubscriber();
        };
    }, [noteId]);

    // --- YORUM EKLEME İŞLEVİ ---
    const handleAddComment = async () => {
        if (comment.trim() === '') {
            Alert.alert('Boş Yorum', 'Lütfen bir yorum yazın.');
            return;
        }
        try {
            await firestore().collection('Notes').doc(noteId).collection('Comments').add({
                userId: currentUser.uid,
                username: currentUser.displayName || currentUser.email,
                text: comment,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            setComment('');
            // Yorum sayısını Notes ana koleksiyonunda güncelle
            firestore().collection('Notes').doc(noteId).update({
                yorumSayisi: firestore.FieldValue.increment(1)
            });
        } catch (error) {
            Alert.alert('Hata', 'Yorum eklenirken sorun oluştu.');
        }
    };
    
    // --- BEĞENİ VE FAVORİ İŞLEVİ (Sadece beğeni sayısını artırır) ---
    const handleLike = async () => {
        const newLikeCount = note.begeniler + (isFavorite ? -1 : 1);
        try {
            await firestore().collection('Notes').doc(noteId).update({
                begeniler: newLikeCount,
            });
            setIsFavorite(!isFavorite); 
        } catch (error) {
            Alert.alert('Hata', 'Beğeni güncellenemedi.');
        }
    };

    // --- DOSYA İNDİRME İŞLEVİ (RNFS ile) ---
    const handleDownload = async () => {
        if (!note || !note.fileURL || note.fileURL === 'DOSYA_YÜKLENECEK') {
            Alert.alert('Hata', 'Dosya linki geçerli değil. Not yükleme sırasında dosya yüklenmemiş olabilir.');
            return;
        }

        const downloadUrl = note.fileURL;
        const fileName = note.dosyaAdi || 'indirilen_not.pdf';
        const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`; 

        try {
            Alert.alert('İndirme Başladı', `${fileName} dosyası cihazınıza indiriliyor...`);

            const options = {
                fromUrl: downloadUrl,
                toFile: downloadPath,
            };

            const response = await RNFS.downloadFile(options).promise;

            if (response.statusCode === 200) {
                Alert.alert('Başarılı', `${fileName} başarıyla indirildi ve İndirilenler klasörüne kaydedildi!`);
            } else {
                throw new Error(`Sunucudan hata kodu alındı: ${response.statusCode}`);
            }

        } catch (error) {
            console.error("İndirme Hatası:", error);
            Alert.alert('Hata', 'Dosya indirilemedi. Bağlantı veya dosya izni sorunu olabilir.');
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentItem}>
            <Text style={styles.commentUsername}>{item.username}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
        </View>
    );

    if (loading || !note) {
        return <ActivityIndicator size="large" style={styles.loading} color="#007AFF" />;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{note.baslik}</Text>
            
            {/* Not Bilgileri */}
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>**Ders:** {note.dersAdi}</Text>
                <Text style={styles.infoText}>**Bölüm:** {note.bolum}</Text>
                <Text style={styles.infoText}>**Yükleyen:** {note.username}</Text>
                <Text style={styles.infoText}>**Dosya Adı:** {note.dosyaAdi}</Text>
            </View>
            
            {/* Etkileşim ve İndirme */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                    <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? 'red' : 'gray'} />
                    <Text style={styles.likeText}>{note.begeniler}</Text>
                </TouchableOpacity>
                <Button 
                    title="Dosyayı İndir" 
                    onPress={handleDownload} 
                    color="#28a745"
                    disabled={note.fileURL === 'DOSYA_YÜKLENECEK'}
                />
            </View>

            {/* Yorum Alanı */}
            <View style={styles.commentSection}>
                <Text style={styles.sectionTitle}>Yorum Yap</Text>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Bir yorum yazın..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                />
                <Button title="Yorumu Gönder" onPress={handleAddComment} color="#007AFF" disabled={!comment.trim()} />
                
                <Text style={styles.sectionTitleList}>Tüm Yorumlar ({comments.length})</Text>
                {comments.length > 0 ? (
                    comments.map((item) => renderComment({ item }))
                ) : (
                    <Text style={styles.noComment}>Henüz yorum yok.</Text>
                )}
            </View>
            <View style={{height: 50}} /> 
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    loading: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    infoBox: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 20 },
    infoText: { fontSize: 16, marginBottom: 5 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    likeButton: { flexDirection: 'row', alignItems: 'center' },
    likeText: { marginLeft: 5, fontSize: 18, color: 'gray' },
    commentSection: { marginTop: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    sectionTitleList: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    commentInput: { height: 60, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
    commentItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', flexWrap: 'wrap' },
    commentUsername: { fontWeight: 'bold', marginRight: 5, color: '#333' },
    commentText: { flexShrink: 1, color: '#555' },
    noComment: { color: '#888', textAlign: 'center', marginTop: 10 }
});