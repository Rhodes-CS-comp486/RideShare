import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import axios from 'axios';

const CreatePostScreen = ({ navigation, route }) => {
    const [passengerrhodesID, setPassengerRhodesID] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [rideState, setRideState] = useState(false);
    const [payment, setPayment] = useState('');
    const [error, setError] = useState('');


    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        return timeRegex.test(time);
    }

    const handlePost = async () => {
        if (!validateTimeFormat(pickupTime)) {
            setError("Invalid time format. Use HH:MM AM/PM (e.g., 10:30 AM).")
            return;
        } 

        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/feed', {
                passengerrhodesid: passengerrhodesID,
                pickuptime: pickupTime,
                pickuplocation: pickupLocation,
                dropofflocation: dropoffLocation,
                ridestate: rideState,
                payment: payment
            });

            console.log("Post created:", response.data);
            Alert.alert("Success", "Your ride post has been created!");

            navigation.goBack();
        }
        catch (error) {
            console.error("Error posting:", error);
            Alert.alert("Error", "Failed to create post. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder="Rhodes ID"
                placeholderTextColor="#FAF2E6"
                onChangeText={setPassengerRhodesID}
            />
            <TextInput 
                style={styles.input}
                placeholder="Pickup Time (HH:MM AM/PM)"
                placeholderTextColor="#FAF2E6"
                value={pickupTime}
                onChangeText={setPickupTime}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Pickup Location"
                placeholderTextColor="#FAF2E6"
                value={pickupLocation}
                onChangeText={setPickupLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Dropoff Location"
                placeholderTextColor="#FAF2E6"
                value={dropoffLocation}
                onChangeText={setDropoffLocation}
            />
            <TouchableOpacity 
                style={[styles.toggleButton, rideState ? styles.activeButton : styles.inactiveButton]}
                onPress={() => setRideState(!rideState)}
            >
                <Text style={styles.buttonText}>{rideState ? "Active" : "Inactive"}</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Payment"
                placeholderTextColor="#FAF2E6"
                value={payment}
                onChangeText={setPayment}
            />
            <TouchableOpacity style={styles.button} onPress={handlePost}>
                <Text style={styles.buttonText}>Post</Text>
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
    input: {
        width: '90%',
        height: 40,
        backgroundColor: '#BF4146',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginVertical: 5,
        color: '#FAF2E6',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#A62C2C',
        width: '30%',
        fontSize: 18,
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FAF2E6',
        fontSize: 18,
        fontWeight: '600',
    },
    errorText: { 
        color: '#FAF2E6', 
        marginBottom: 10 
    },
    toggleButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    activeButton: {
        backgroundColor: '#4CAF50',  // green when active
    },
    inactiveButton: {
        backgroundColor: '#A62C2C',  // red when inactive
    },
    
});

export default CreatePostScreen;