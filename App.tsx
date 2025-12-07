import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // Stabil Stack Navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth'; 

// --- Ekranların Import Edilmesi ---
import GirisEkrani from './screens/GirisEkrani';
import KayitOlEkrani from './screens/KayitOlEkrani';
import NotlarimEkrani from './screens/NotlarimEkrani';
import KesfetEkrani from './screens/KesfetEkrani';
import NotYuklemeEkrani from './screens/NotYuklemeEkrani';
import ProfilEkrani from './screens/ProfilEkrani';
// 🛑 KRİTİK EKSİK: NotDetayEkrani'nı buraya eklemeliyiz!
import NotDetayEkrani from './screens/NotDetayEkrani'; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Sekme Navigator'ü ---
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

// --- Auth Stack ---
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Giris" component={GirisEkrani} />
            <Stack.Screen name="KayitOl" component={KayitOlEkrani} />
        </Stack.Navigator>
    );
}

// --- ANA COMPONENT ---
export default function App() {
    const [initializing, setInitializing] = useState(true); 
    const [user, setUser] = useState(null); 

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

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Kullanıcı varsa: 
                    <>
                        <Stack.Screen name="AnaUygulama" component={AnaUygulamaTabs} />
                        
                        {/* 🛑 ÇÖZÜM: 'NotDetay' ekranını buraya ekliyoruz! 
                           Bu, "navigate with payload" hatasını çözer. */}
                        <Stack.Screen 
                            name="NotDetay" 
                            component={NotDetayEkrani} 
                            options={{ headerShown: true, title: 'Not Detay' }} 
                        />
                    </>
                ) : (
                    // Kullanıcı yoksa: Auth Stack
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
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