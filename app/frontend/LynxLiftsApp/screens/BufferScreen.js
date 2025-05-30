import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const BufferScreen = ({ navigation, route }) => {
    const { user } = route.params;

    if (!user.rhodesid) {
        Alert.alert("User", "RhodesID not found")
    }

    const handleNavigation = (role) => {
        if (role === 'driver') {
            navigation.navigate('Status', { user: { rhodesid: user.rhodesid } });
        } else {
            navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } }); 
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}><Text style={styles.boldText}>Welcome {user.username},</Text></Text>
            <Text style={styles.welcomeText}>I want to login as the:</Text>
            
            <TouchableOpacity style={styles.button} onPress={() => handleNavigation('driver')}>
                <Text style={styles.buttonText}>Driver</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => handleNavigation('feed')}>
                <Text style={styles.buttonText}>Passenger</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#80A1C2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        color: '#FAF2E6',
        fontSize: 20,
        marginBottom: 10,
    },
    boldText: {
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#A62C2C',
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 15,
    },
    buttonText: {
        color: '#FAF2E6',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default BufferScreen;
