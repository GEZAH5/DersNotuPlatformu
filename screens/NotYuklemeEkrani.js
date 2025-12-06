import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Image, PermissionsAndroid, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore'; 
import storage from '@react-native-firebase/storage'; 
import auth from '@react-native-firebase/auth'; 
// Sadece Image Picker'ın iki fonksiyonunu kullanıyoruz
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; 

export default function NotYuklemeEkrani() {
    const [baslik, setBaslik] = useState('');
    const [dersAdi, setDersAdi] = useState('');
    const [bolum, setBolum] = useState('');
    const [konu, setKonu] = useState('');
    const [fotoUri, setFotoUri] = useState(null); 
    const [fileName, setFileName] = useState(null); 
    const [uploading, setUploading] = useState(false);

    const user = auth().currentUser;

    // --- İZİN İSTEME FONKSİYONU (Sadece Kamera) ---
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    Alert.alert('İzin Reddi', 'Kamera izni olmadan fotoğraf çekilemez.');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; 
    };

    // --- 1. FOTOĞRAF ÇEKME ---
    const takePicture = async () => {
        const hasPermission = await requestCameraPermission(); 
        if (!hasPermission) return; 
        
        launchCamera({
            mediaType: 'photo',
            quality: 0.7,
            includeBase64: false,
        }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setFotoUri(response.assets[0].uri);
                setFileName(`Fotoğraf-${new Date().getTime()}.jpg`);
            }
        });
    };
    
    // --- 2. GALERİDEN FOTOĞRAF SEÇME (YENİ İŞLEV) ---
    const selectPictureFromGallery = () => {
        // Bu fonksiyon, Kamera kadar sıkı izin istemez ve Android'de sorun çıkarmaz.
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.7,
        }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setFotoUri(response.assets[0].uri);
                // Dosya adını orijinal dosya adıyla veya varsayılan bir adla ayarla
                const name = response.assets[0].fileName || `GaleriFoto-${new Date().getTime()}.jpg`;
                setFileName(name); 
            }
        });
    };

    // --- NOTU YAYINLA ---
    const handleNotYukle = async () => {
        if (!baslik || !dersAdi || !bolum || !fotoUri) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm form alanlarını doldurun ve bir fotoğraf seçin/çekin.');
            return;
        }

        setUploading(true);
        const timestamp = firestore.FieldValue.serverTimestamp();
        const fileExtension = fileName.split('.').pop();
        const pathInStorage = `notes/${user.uid}/${new Date().getTime()}_${fileName}`;

        try {
            const reference = storage().ref(pathInStorage);
            await reference.putFile(fotoUri);
            const fileURL = await reference.getDownloadURL(); 

            await firestore().collection('Notes').add({
                userId: user.uid,
                username: user.displayName || user.email,
                baslik: baslik,
                dersAdi: dersAdi,
                bolum: bolum,
                konu: konu,
                fileURL: fileURL,
                dosyaAdi: fileName,
                yuklenmeTarihi: timestamp,
                begeniler: 0,
                yorumSayisi: 0,
                contentType: 'image',
            });

            Alert.alert('Başarılı', 'Notunuz başarıyla yüklendi ve yayınlandı!');
            setBaslik(''); setDersAdi(''); setBolum(''); setKonu(''); setFotoUri(null); setFileName(null);

        } catch (error) {
            console.error("Yükleme Hatası:", error);
            Alert.alert('Yükleme Hatası', 'Yüklenirken bir sorun oluştu: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Yeni Not Yükle</Text>

            {/* Meta Veri Alanları */}
            <TextInput style={styles.input} placeholder="Not Başlığı" onChangeText={setBaslik} value={baslik} />
            <TextInput style={styles.input} placeholder="Ders Adı (Örn: YBS 201)" onChangeText={setDersAdi} value={dersAdi} />
            <TextInput style={styles.input} placeholder="Bölüm (Örn: İşletme)" onChangeText={setBolum} value={bolum} />
            <TextInput style={styles.input} placeholder="Konu Etiketi (Örn: Pazarlama)" onChangeText={setKonu} value={konu} />
            
            {/* Önizleme Alanı */}
            {fotoUri ? (
                <View style={styles.imagePreviewContainer}>
                    <Text style={styles.selectedFile}>Fotoğraf Hazır: {fileName}</Text>
                    <Image source={{ uri: fotoUri }} style={styles.imagePreview} />
                </View>
            ) : (
                <Text style={styles.selectedFile}>Henüz fotoğraf seçilmedi</Text>
            )}

            {/* BUTONLAR (Kamera ve Galeri) */}
            
            <View style={styles.buttonSpacing}>
                <Button title="Kamera ile Not Fotoğrafı Çek" onPress={takePicture} color="#28a745" />
            </View>

            <View style={styles.buttonSpacing}>
                <Button 
                    title="Galeriden Fotoğraf Seç" 
                    onPress={selectPictureFromGallery} 
                    color="#007AFF" // Mavi renk yaptık
                />
            </View>
            
            <View style={styles.uploadButton}>
                <Button 
                    title={uploading ? "Yükleniyor..." : "Notu Yayınla"} 
                    onPress={handleNotYukle} 
                    disabled={uploading || !fotoUri}
                    color="#FF3B30"
                />
            </View>

            {uploading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 8 },
    selectedFile: { marginVertical: 15, fontSize: 16, textAlign: 'center', color: '#555' },
    imagePreviewContainer: { alignItems: 'center', marginVertical: 15 },
    imagePreview: { width: 150, height: 150, borderRadius: 10 },
    uploadButton: { marginTop: 30, marginBottom: 50 },
    buttonSpacing: { marginBottom: 10 },
});