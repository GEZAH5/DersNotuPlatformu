import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; 
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker'; 
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotYuklemeEkrani({ navigation }) {
    const [baslik, setBaslik] = useState('');
    const [dersAdi, setDersAdi] = useState('');
    const [bolum, setBolum] = useState('');
    const [konu, setKonu] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFileUri, setSelectedFileUri] = useState(null);
    const [fileName, setFileName] = useState('');

    const user = auth().currentUser;
    
    const pickFile = async (isCamera) => {
        try {
            let image;
            if (isCamera) {
                image = await ImagePicker.openCamera({
                    mediaType: 'photo',
                    width: 1000,
                    height: 1000,
                    cropping: false,
                });
            } else {
                image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    width: 1000,
                    height: 1000,
                    cropping: false,
                });
            }

            if (image) {
                setSelectedFileUri(image.path);
                const pathParts = image.path.split('/');
                setFileName(pathParts[pathParts.length - 1] || 'not_fotografi.jpg');
            }
        } catch (error) {
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log('Kullanıcı işlemi iptal etti');
            } else {
                console.error("Seçim Hatası:", error);
                Alert.alert('Hata', 'Kamera/Galeri erişiminde bir sorun oluştu veya izinler eksik.');
            }
        }
    };


    // --- Yükleme İşlevi ---
    const handleUpload = async () => {
        if (!user) {
            Alert.alert('Hata', 'Giriş yapmalısınız.');
            return;
        }

        if (!baslik || !dersAdi || !bolum || !konu || !selectedFileUri) {
            Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun ve bir dosya seçin.');
            return;
        }

        setLoading(true);

        try {
            // Kullanıcının kullanıcı adını Firestore'dan çekme
            const userDoc = await firestore().collection('Users').doc(user.uid).get();
            const usernameToSave = userDoc.data()?.username || user.email; 

            // 1. Dosyayı Firebase Storage'a Yükle
            const storageRef = storage().ref(`notes/${user.uid}/${fileName}_${Date.now()}`);
            const task = storageRef.putFile(selectedFileUri);

            await task;
            const fileURL = await storageRef.getDownloadURL();

            // 2. Not Bilgilerini Firestore'a Kaydet
            await firestore().collection('Notes').add({
                baslik,
                dersAdi,
                bolum,
                konu,
                userId: user.uid,
                username: usernameToSave, // KULLANICI ADI GÖNDERİLİYOR
                fileURL: fileURL,
                contentType: 'image',
                yuklenmeTarihi: firestore.FieldValue.serverTimestamp(),
                begeniler: 0,
                yorumSayisi: 0,
            });

            Alert.alert('Başarılı', 'Ders notu başarıyla yüklendi!');
            
            // Alanları sıfırla
            setBaslik('');
            setDersAdi('');
            setBolum('');
            setKonu('');
            setSelectedFileUri(null);
            setFileName('');
            
        } catch (error) {
            console.error("Yükleme Hatası:", error);
            Alert.alert('Yükleme Hatası', 'Dosya yüklenirken bir sorun oluştu.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Yeni Ders Notu Yükle</Text>

            <View style={styles.fileButtonsContainer}>
                <TouchableOpacity 
                    style={styles.fileButton} 
                    onPress={() => pickFile(true)}
                >
                    <Icon name="camera-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Kamera ile Çek</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.fileButton, {backgroundColor: '#1E90FF'}]} 
                    onPress={() => pickFile(false)}
                >
                    <Icon name="image-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Galeriden Seç</Text>
                </TouchableOpacity>
            </View>

            {selectedFileUri && (
                <Text style={styles.fileNameText}>Seçilen Dosya: {fileName}</Text>
            )}

            <TextInput
                style={styles.input}
                placeholder="Başlık (Örn: Üstel Fonksiyonlar)"
                value={baslik}
                onChangeText={setBaslik}
            />
            <TextInput
                style={styles.input}
                placeholder="Ders Adı (Örn: Matematik 101)"
                value={dersAdi}
                onChangeText={setDersAdi}
            />
            <TextInput
                style={styles.input}
                placeholder="Bölüm/Ünite (Örn: 2. Ünite)"
                value={bolum}
                onChangeText={setBolum}
            />
            <TextInput
                style={styles.input}
                placeholder="Konu Etiketi (Örn: Türev, Limit)"
                value={konu}
                onChangeText={setKonu}
            />

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.uploadButtonText}>Notu Yayınla</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        // 🛑 BU DEĞER YAZILARI AŞAĞI ÇEKER. İhtiyaca göre 40, 50, 60 gibi bir değer seçebilirsiniz.
        paddingTop: 50, 
        paddingHorizontal: 20, 
        backgroundColor: '#f0f0f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    fileButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    fileButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
    fileNameText: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 15,
        textAlign: 'center',
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
    uploadButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});