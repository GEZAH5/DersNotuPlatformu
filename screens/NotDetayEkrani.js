import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotDetayEkrani() {
    const route = useRoute();
    // 🛑 KRİTİK: Navigasyondan gelen noteId'yi al
    const { noteId } = route.params; 

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const user = auth().currentUser;

    // --- Not ve Beğeni Durumunu Çekme ---
    useEffect(() => {
        if (!noteId) return;

        // 1. Not Verisini Çekme
        const noteSubscriber = firestore()
            .collection('Notes')
            .doc(noteId)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setNote({ ...documentSnapshot.data(), id: documentSnapshot.id });
                    setLoading(false);
                } else {
                    Alert.alert('Hata', 'Not bulunamadı.');
                    setLoading(false);
                }
            }, error => {
                console.error("Detay Not Çekme Hatası:", error);
                setLoading(false);
            });

        // 2. Beğeni Durumunu Kontrol Etme
        let likeSubscriber = () => {};
        if (user) {
            likeSubscriber = firestore()
                .collection('Notes')
                .doc(noteId)
                .collection('Likes')
                .doc(user.uid)
                .onSnapshot(docSnapshot => {
                    setIsLiked(docSnapshot.exists);
                });
        }
        
        // 3. Yorumları Çekme
        const commentSubscriber = firestore()
            .collection('Notes')
            .doc(noteId)
            .collection('Comments')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const commentList = [];
                querySnapshot.forEach(doc => {
                    commentList.push({ ...doc.data(), id: doc.id });
                });
                setComments(commentList);
            });


        // Abone Temizliği
        return () => {
            noteSubscriber();
            likeSubscriber();
            commentSubscriber();
        };
    }, [noteId, user]);

    // --- Beğenme İşlevi ---
    const handleLike = async () => {
        if (!user) {
            Alert.alert('Giriş Gerekli', 'Beğenmek için giriş yapmalısınız.');
            return;
        }

        try {
            const likeRef = firestore().collection('Notes').doc(noteId).collection('Likes').doc(user.uid);
            const noteRef = firestore().collection('Notes').doc(noteId);

            if (isLiked) {
                // Beğeniyi Kaldır
                await likeRef.delete();
                // Notun begeniler sayısını azalt
                await noteRef.update({
                    begeniler: firestore.FieldValue.increment(-1)
                });
            } else {
                // Beğen
                await likeRef.set({ userId: user.uid });
                // Notun begeniler sayısını artır
                await noteRef.update({
                    begeniler: firestore.FieldValue.increment(1)
                });
            }
        } catch (error) {
            console.error("Beğenme Hatası:", error);
            Alert.alert('Hata', 'Beğenme işlemi başarısız oldu.');
        }
    };

    // --- Yorum Yapma İşlevi ---
    const handleComment = async () => {
        if (!user) {
            Alert.alert('Giriş Gerekli', 'Yorum yapmak için giriş yapmalısınız.');
            return;
        }
        if (!commentText.trim()) return;

        try {
            const noteRef = firestore().collection('Notes').doc(noteId);
            
            // Yorumu kaydet
            await noteRef.collection('Comments').add({
                userId: user.uid,
                username: user.email,
                text: commentText,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            // Yorum sayısını artır
            await noteRef.update({
                yorumSayisi: firestore.FieldValue.increment(1)
            });

            setCommentText('');
        } catch (error) {
            console.error("Yorum Hatası:", error);
            Alert.alert('Hata', 'Yorum gönderme başarısız oldu.');
        }
    };
    
    // --- Yükleniyor Ekranı ---
    if (loading || !note) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, color: '#333' }}>Not yükleniyor...</Text>
            </View>
        );
    }
    
    // --- Yorum Bileşeni ---
    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <Text style={styles.commentUsername}>{item.username || 'Kullanıcı'}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
        </View>
    );

    // --- Ana İçerik ---
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{note.baslik}</Text>
                <Text style={styles.subtitle}>{note.dersAdi} - {note.bolum} ({note.konu})</Text>
                
                <Text style={styles.metadata}>Yükleyen: {note.username || 'Anonim'}</Text>
                <Text style={styles.metadata}>
                    Tarih: {note.yuklenmeTarihi ? note.yuklenmeTarihi.toDate().toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                </Text>

                <View style={styles.imageContainer}>
                    {note.fileURL ? (
                        // 🛑 KRİTİK: Firebase Storage'dan gelen URL ile fotoğrafı göster!
                        <Image source={{ uri: note.fileURL }} style={styles.noteImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.noImageText}>Görüntü Yüklenemedi.</Text>
                    )}
                </View>

                {/* Beğeni Butonu ve Sayacı */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                        <Icon 
                            name={isLiked ? "heart" : "heart-outline"} 
                            size={30} 
                            color={isLiked ? "#FF3B30" : "#333"} 
                        />
                        <Text style={styles.likeCount}>{note.begeniler || 0}</Text>
                    </TouchableOpacity>
                </View>

                {/* Yorumlar Başlığı */}
                <Text style={styles.commentsTitle}>Yorumlar ({comments.length})</Text>

                {/* Yorum Listesi */}
                <FlatList
                    data={comments}
                    renderItem={renderComment}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // İç ScrollView içinde olduğundan false
                />
            </ScrollView>

            {/* Yorum Yazma Alanı (KeyboardAvoidingView içinde) */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Yorumunuzu yazın..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
                    <Icon name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f7',
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    metadata: {
        fontSize: 14,
        color: '#999',
        marginBottom: 3,
    },
    imageContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        padding: 10,
    },
    noteImage: {
        width: '100%',
        aspectRatio: 1, // Kare oranında gösterir
        borderRadius: 8,
    },
    noImageText: {
        color: '#ccc',
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    likeCount: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 10,
    },
    commentContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentUsername: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 2,
    },
    commentText: {
        fontSize: 16,
        color: '#333',
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    commentInput: {
        flex: 1,
        maxHeight: 100,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    }
});