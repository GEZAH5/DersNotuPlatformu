import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // (Popüler bir ikon seti olan Ionicons'u kullanacağız)
// (İkonlar için daha sonra 'react-native-vector-icons' kuracağız)

// 1. TÜM EKRANLARIMIZI IMPORT EDELİM
import GirisEkrani from './screens/GirisEkrani';
import KayitOlEkrani from './screens/KayitOlEkrani';
import NotlarimEkrani from './screens/NotlarimEkrani';
import NotYuklemeEkrani from './screens/NotYuklemeEkrani';
import ProfilEkrani from './screens/ProfilEkrani';
import NotDetayEkrani from './screens/NotDetayEkrani';
import KesfetEkrani from './screens/KesfetEkrani';

// 2. NAVİGATÖRLERİ OLUŞTURALIM
const Stack = createStackNavigator(); // Ekranları üst üste yığmak için
const Tab = createBottomTabNavigator(); // Alt menü çubuğu için

/**
 * Bu fonksiyon, alt menü çubuğumuzu (Tab Navigator) tanımlar.
 * Tasarımınızdaki "Notlarım", "Not Yükle" ve "Profil" ekranlarını yönetir.
 */
// (App.tsx dosyasının ortasındaki fonksiyon)
function AnaUygulamaTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({ 
        headerShown: false,
        tabBarActiveTintColor: '#007AFF', // Aktif ikon rengi
        tabBarInactiveTintColor: 'gray', // Pasif ikon rengi

        // Bu fonksiyon, o anki sekmeye göre doğru ikonu belirler
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Notlarım') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Keşfet') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Yükle') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // İkonu döndürür
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Ekranlarımız (Artık sadece isimleri yeterli) */}
      <Tab.Screen name="Notlarım" component={NotlarimEkrani} />
      <Tab.Screen name="Keşfet" component={KesfetEkrani} />
      <Tab.Screen name="Yükle" component={NotYuklemeEkrani} />
      <Tab.Screen name="Profil" component={ProfilEkrani} />

    </Tab.Navigator>
  );
}
// (Dosyanın geri kalanı aynı kalacak)
/**
 * Bu, projemizin ana navigasyonudur.
 * Giriş yapılmamışsa "Auth" ekranlarını (Giris, KayitOl) gösterir.
 * Giriş yapılmışsa "AnaUygulamaTabs" bölümünü (alt menülü ekranları) gösterir.
 */
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Giris" // Uygulama "Giris" ekranı ile başlasın
        screenOptions={{
          headerShown: false // Tüm ekranlarda başlık çubuğunu varsayılan olarak gizle
        }}
      >
        {/* Giriş Bölümü Ekranları */}
        <Stack.Screen 
          name="Giris" 
          component={GirisEkrani} 
        />
        <Stack.Screen 
          name="KayitOl" 
          component={KayitOlEkrani}
          options={{ headerShown: true, title: 'Hesap Oluştur' }} // Kayıt ekranında başlık görünsün
        />
        
        {/* Ana Uygulama Bölümü (Alt Menü Çubuğu) */}
        <Stack.Screen 
          name="AnaUygulama" // Giriş yapınca buraya yönlendireceğiz
          component={AnaUygulamaTabs} 
        />
        
        {/* Not Detay Ekranı (Alt menü çubuğunun üstüne açılmalı) */}
        <Stack.Screen 
          name="NotDetay" 
          component={NotDetayEkrani} 
          options={{ headerShown: true, title: 'Not Detayı' }} // Detay ekranında başlık görünsün
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;