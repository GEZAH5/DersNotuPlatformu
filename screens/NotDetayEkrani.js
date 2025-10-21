import React, { useState } from 'react'; // useState eklendi
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
// İkonlar için Icon component'ini import ediyoruz (zaten kurulu)
import Icon from 'react-native-vector-icons/Ionicons'; 

const NotDetayEkrani = ({ route, navigation }) => {
  const { not } = route.params;

  // Beğeni durumunu ve sayısını tutmak için state
  const [liked, setLiked] = useState(false); // Başlangıçta beğenilmemiş
  const [likeCount, setLikeCount] = useState(not?.begeni || 0); // Gelen notun beğeni sayısı veya 0

  // Yorumları (geçici) tutmak için state
  const [yorumlar, setYorumlar] = useState([
    { id: 1, kisi: "Ayşe Demir", yorum: "Harika bir özet, teşekkürler!" },
    { id: 2, kisi: "Mehmet Can", yorum: "Sınavda çok yardımcı oldu." },
  ]);
  // Yeni yorum metnini tutmak için state
  const [yeniYorum, setYeniYorum] = useState('');

  if (!not) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Not bilgileri yüklenemedi.</Text>
      </SafeAreaView>
    );
  }

  // Beğenme fonksiyonu (sadece state'i günceller)
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
      setLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setLiked(true);
    }
    // Gerçek uygulamada burada veritabanına kaydetme işlemi olurdu
  };

  // Yorum ekleme fonksiyonu (sadece state'i günceller)
  const handleYorumEkle = () => {
    if (yeniYorum.trim() === '') return; // Boş yorum eklenmesin

    const eklenecekYorum = {
      id: Math.random().toString(), // Geçici ID
      kisi: "Mevcut Kullanıcı", // Gerçek uygulamada giriş yapmış kullanıcı adı
      yorum: yeniYorum,
    };
    setYorumlar([...yorumlar, eklenecekYorum]); // Listeye ekle
    setYeniYorum(''); // Yorum kutusunu temizle
    // Gerçek uygulamada burada veritabanına kaydetme işlemi olurdu
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        {/* Not Başlığı ve Bilgileri */}
        <View style={styles.header}>
          <Text style={styles.baslik}>{not.baslik || 'Başlık Yok'}</Text>
          <Text style={styles.bilgi}>Ders: {not.ders || 'Belirtilmemiş'}</Text>
        </View>

        {/* Notun Açıklaması */}
        <View style={styles.contentContainer}>
          <Text style={styles.icerik}>{not.aciklama || 'Açıklama yok.'}</Text>
        </View>

        {/* Etiketler */}
        {not.etiketler && not.etiketler.length > 0 && (
          <View style={styles.etiketContainer}>
            <Text style={styles.etiketBaslik}>Etiketler:</Text>
            <View style={styles.etiketler}>
              {not.etiketler.map((etiket, index) => (
                <Text key={index} style={styles.etiket}>{etiket}</Text>
              ))}
            </View>
          </View>
        )}

        {/* --- YENİ BUTONLAR --- */}
        <View style={styles.butonContainer}>
          {/* Beğen Butonu */}
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Icon 
              name={liked ? "heart" : "heart-outline"} // Beğenildiyse dolu kalp, değilse boş kalp
              size={24} 
              color={liked ? "red" : "gray"} // Beğenildiyse kırmızı
            />
            <Text style={styles.actionText}>{likeCount} Beğeni</Text>
          </TouchableOpacity>

          {/* Yorum İkonu (Sadece görsel) */}
          <View style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={24} color="gray" />
            <Text style={styles.actionText}>{yorumlar.length} Yorum</Text>
          </View>

          {/* İndir Butonu (Hâlâ işlevsiz) */}
          <TouchableOpacity style={[styles.actionButton, styles.indirButon]}>
            <Icon name="download-outline" size={24} color="#fff" />
            <Text style={styles.indirText}>İndir</Text>
          </TouchableOpacity>
        </View>
        {/* --- BUTONLAR BİTTİ --- */}

        {/* --- YORUMLAR BÖLÜMÜ GÜNCELLENDİ --- */}
        <Text style={styles.yorumBaslik}>Yorumlar</Text>

        {/* Yorum Ekleme Alanı */}
        <View style={styles.yorumEkleContainer}>
          <TextInput
            style={styles.yorumInput}
            placeholder="Yorumunuzu yazın..."
            value={yeniYorum}
            onChangeText={setYeniYorum}
            multiline
          />
          <TouchableOpacity style={styles.yorumGonderButton} onPress={handleYorumEkle}>
            <Text style={styles.yorumGonderText}>Gönder</Text>
          </TouchableOpacity>
        </View>

        {/* Yorum Listesi */}
        {yorumlar.length === 0 ? (
          <Text style={styles.yorumYokMesaji}>Henüz yorum yapılmamış.</Text>
        ) : (
          yorumlar.map((yorum) => (
            <View key={yorum.id} style={styles.yorumKarti}>
              <Text style={styles.yorumKisi}>{yorum.kisi}</Text>
              <Text style={styles.yorumMetin}>{yorum.yorum}</Text>
            </View>
          ))
        )}
        {/* --- YORUMLAR BİTTİ --- */}

      </SafeAreaView>
    </ScrollView>
  );
};

// Stiller (Yeni stiller eklendi)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  baslik: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  bilgi: { fontSize: 14, color: 'gray', marginBottom: 3 },
  contentContainer: { padding: 20 },
  icerik: { fontSize: 16, lineHeight: 24, color: '#444' },
  etiketContainer: { paddingHorizontal: 20, marginBottom: 15, },
  etiketBaslik: { fontWeight: 'bold', marginBottom: 5 },
  etiketler: { flexDirection: 'row', flexWrap: 'wrap' },
  etiket: { backgroundColor: '#e0e0e0', borderRadius: 5, paddingVertical: 3, paddingHorizontal: 8, marginRight: 5, marginBottom: 5, fontSize: 12 },
  butonContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 10 },
  actionButton: { // Beğen ve Yorum için genel stil
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: 'gray',
  },
  indirButon: { // İndir butonu için ek stil
    backgroundColor: '#4CAF50', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  indirText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  yorumBaslik: { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  yorumEkleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  yorumInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  yorumGonderButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  yorumGonderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  yorumYokMesaji: {
    textAlign: 'center',
    color: 'gray',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  yorumKarti: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 15, marginHorizontal: 20, marginBottom: 10 },
  yorumKisi: { fontWeight: 'bold', marginBottom: 3 },
  yorumMetin: { fontSize: 14, color: '#555' },
});

// Component'i dışa aktar
export default NotDetayEkrani;