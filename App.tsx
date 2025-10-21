import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ekranlarımızı import ediyoruz
import GirisEkrani from './screens/GirisEkrani';
import KayitOlEkrani from './screens/KayitOlEkrani';
import NotlarimEkrani from './screens/NotlarimEkrani';
import KesfetEkrani from './screens/KesfetEkrani';
import NotYuklemeEkrani from './screens/NotYuklemeEkrani';
import ProfilEkrani from './screens/ProfilEkrani';
import NotDetayEkrani from './screens/NotDetayEkrani';

// Navigatörleri oluşturuyoruz
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- AnaUygulamaTabs Fonksiyonu DÜZELTİLDİ ---
// handleLogout, notlar ve handleNotEkle prop'larını alacak şekilde güncellendi
function AnaUygulamaTabs({ navigation, handleLogout, notlar, handleNotEkle }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Notlarım') { iconName = focused ? 'book' : 'book-outline'; }
          else if (route.name === 'Keşfet') { iconName = focused ? 'search' : 'search-outline'; }
          else if (route.name === 'Yükle') { iconName = focused ? 'add-circle' : 'add-circle-outline'; }
          else if (route.name === 'Profil') { iconName = focused ? 'person' : 'person-outline'; }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* NotlarimEkrani'na notlar listesini iletiyoruz */}
      <Tab.Screen name="Notlarım">
        {(props) => <NotlarimEkrani {...props} notlar={notlar} />}
      </Tab.Screen>
      <Tab.Screen name="Keşfet" component={KesfetEkrani} />
      {/* NotYuklemeEkrani'na handleNotEkle fonksiyonunu iletiyoruz */}
      <Tab.Screen name="Yükle">
        {(props) => <NotYuklemeEkrani {...props} handleNotEkle={handleNotEkle} />}
      </Tab.Screen>
      {/* Profil ekranına handleLogout fonksiyonunu iletiyoruz */}
      <Tab.Screen name="Profil">
        {(props) => <ProfilEkrani {...props} handleLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
// --- DÜZELTME BİTTİ ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  // Yeni state doğru yerde
  const [notlarListesi, setNotlarListesi] = useState([]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        if (userLoggedIn !== null && userLoggedIn === 'true') {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("AsyncStorage okunurken hata:", e);
      } finally {
        setCheckingLogin(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem('userLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (e) {
      console.error("AsyncStorage yazılırken hata:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userLoggedIn');
      setIsLoggedIn(false);
    } catch (e) {
      console.error("AsyncStorage silinirken hata:", e);
    }
  };

  // Yeni fonksiyon doğru yerde
  const handleNotEkle = (yeniNot) => {
    yeniNot.id = Math.random().toString();
    setNotlarListesi(oncekiListe => [...oncekiListe, yeniNot]);
    console.log("App.tsx - Yeni not eklendi, güncel liste:", notlarListesi); // Daha detaylı log
  };

  if (checkingLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            {/* --- Stack.Screen AnaUygulama DÜZELTİLDİ --- */}
            <Stack.Screen name="AnaUygulama">
              {(props) => ( // Prop'ları doğru şekilde iletiyoruz
                <AnaUygulamaTabs
                  {...props}
                  handleLogout={handleLogout}
                  notlar={notlarListesi}
                  handleNotEkle={handleNotEkle}
                />
              )}
            </Stack.Screen>
            {/* --- DÜZELTME BİTTİ --- */}
            <Stack.Screen
              name="NotDetay"
              component={NotDetayEkrani}
              options={{ headerShown: true, title: 'Not Detayı' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Giris">
              {(props) => <GirisEkrani {...props} handleLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen
              name="KayitOl"
              component={KayitOlEkrani}
              options={{ headerShown: true, title: 'Hesap Oluştur' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;