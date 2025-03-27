import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Keyboard, 
    TouchableWithoutFeedback, 
    Alert 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text } from 'react-native-gesture-handler';
import axios from 'axios';

const CreatePostScreen = ({ navigation, route }) => {
    const [passengerrhodesID, setPassengerRhodesID] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [rideState, setRideState] = useState(false);
    const [payment, setPayment] = useState('');
    const [error, setError] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [selectingPickup, setSelectingPickup] = useState(true);

    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        return timeRegex.test(time);
    };

    const handlePost = async () => {
        console.log("Posting..."); // Debugging

        if (!validateTimeFormat(pickupTime)) {
            setError("Invalid time format. Use HH:MM AM/PM (e.g., 10:30 AM).");
            return;
        }
        if (!pickupLocation || !dropoffLocation) {
            setError("Please select both pickup and dropoff locations.");
            return;
        }

        if (!pickupLocation?.address || !dropoffLocation?.address) {
            setError("Please select both pickup and dropoff locations.");
            return;
        }

        setError('');

        try {
            const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';
            const response = await axios.post(`${API_URL}/api/feed`, {
                passengerrhodesid: passengerrhodesID,
                pickuptime: pickupTime,
                pickuplocation: pickupLocation?.address,
                dropofflocation: dropoffLocation?.address,
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    value={pickupLocation?.address || ''}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Dropoff Location"
                    placeholderTextColor="#FAF2E6"
                    value={dropoffLocation?.address || ''}
                />
                <TouchableOpacity 
                    style={[styles.toggleButton, rideState ? styles.activeButton : styles.inactiveButton]}
                    onPress={() => setRideState(!rideState)}
                >
                    <Text style={styles.buttonText}>{rideState ? "Active" : "Inactive"}</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Payment Type (e.g. Venmo, Cashapp, etc."
                    placeholderTextColor="#FAF2E6"
                    value={payment}
                    onChangeText={setPayment}
                />
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 35.1495,
                        longitude: -90.0490,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    onPress={(e) => {
                        const coords = e.nativeEvent.coordinate;
                        const location = {
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            address: `Lat: ${coords.latitude}, Lng: ${coords.longitude}`,
                        };
                        selectingPickup ? setPickupLocation(location) : setDropoffLocation(location);
                    }}
                >
                    {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup Location" pinColor="blue" />}
                    {dropoffLocation && <Marker coordinate={dropoffLocation} title="Dropoff Location" pinColor="red" />}
                </MapView>
                <TouchableOpacity 
                    style={styles.toggleButton} 
                    onPress={() => setSelectingPickup(!selectingPickup)}
                >
                    <Text style={styles.toggleButtonText}>
                        {selectingPickup ? "Set Dropoff Location" : "Set Pickup Location"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handlePost}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#80A1C2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
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
    map: {
        width: '90%',
        height: 300,
        marginVertical: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#A62C2C',
        width: '30%',
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
    errorText: { color: '#FAF2E6', marginBottom: 10 },
    toggleButton: { padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
    activeButton: { backgroundColor: '#4CAF50' },
    inactiveButton: { backgroundColor: '#A62C2C' },
});

export default CreatePostScreen;