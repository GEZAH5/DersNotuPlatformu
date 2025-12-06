import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth'; // Firebase Auth importu

// KRİTİK DÜZELTME: Ekranları doğrudan './screens/' klasöründen çekiyoruz.
import GirisEkrani from './screens/GirisEkrani';
import KayitOlEkrani from './screens/KayitOlEkrani';
import NotlarimEkrani from './screens/NotlarimEkrani';
import KesfetEkrani from './screens/KesfetEkrani';
import NotYuklemeEkrani from './screens/NotYuklemeEkrani';
import ProfilEkrani from './screens/ProfilEkrani';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ----------------------------------------------------
// ANA UYGULAMA SEKME NAVİGATOR'Ü (LOGİN SONRASI)
// ----------------------------------------------------
function AnaUygulamaTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Notlarim') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Kesfet') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Yukle') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Notlarim" component={NotlarimEkrani} />
            <Tab.Screen name="Kesfet" component={KesfetEkrani} />
            <Tab.Screen name="Yukle" component={NotYuklemeEkrani} />
            <Tab.Screen name="Profil" component={ProfilEkrani} />
        </Tab.Navigator>
    );
}

// ----------------------------------------------------
// GİRİŞ/KAYIT STACK NAVİGATOR'Ü (LOGOUT SONRASI)
// ----------------------------------------------------
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Giris" component={GirisEkrani} />
            <Stack.Screen name="KayitOl" component={KayitOlEkrani} />
        </Stack.Navigator>
    );
}

// ----------------------------------------------------
// ANA UYGULAMA COMPONENT'İ (Oturum Kontrolü)
// ----------------------------------------------------
export default function App() {
    const [initializing, setInitializing] = useState(true); 
    const [user, setUser] = useState(null); 

    // Kullanıcı oturum durumu değiştiğinde çağrılır
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; 
    }, []);

    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Oturum Kontrol Ediliyor...</Text>
            </View>
        );
    }

    // Navigasyon Mantığı:
    return (
        <NavigationContainer>
            {user ? (
                // Kullanıcı varsa: Ana Uygulama Sekmeleri gösterilir
                <AnaUygulamaTabs />
            ) : (
                // Kullanıcı yoksa: Giriş/Kayıt Ekranları gösterilir
                <AuthStack />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});