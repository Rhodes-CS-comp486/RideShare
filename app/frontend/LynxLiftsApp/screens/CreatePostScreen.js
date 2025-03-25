import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text } from 'react-native-gesture-handler';

const CreatePostScreen = ({ navigation, route }) => {
    const [rhodesID, setRhodesID] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [postText, setPostText] = useState('');
    const [error, setError] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [selectingPickup, setSelectingPickup] = useState(true); // Toggle between pick-up and drop-off selection

    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        return timeRegex.test(time);
    };

    const handlePost = () => {
        if (!validateTimeFormat(pickupTime)) {
            setError("Invalid time format. Use HH:MM AM/PM (e.g., 10:30 AM).");
            return;
        }
        if (!pickupLocation || !dropoffLocation) {
            setError("Please select both pickup and dropoff locations.");
            return;
        }

        route.params.addPost({
            rhodesID,
            time: pickupTime,
            text: postText,
            pickup: pickupLocation,
            dropoff: dropoffLocation
        });

        navigation.goBack();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <TextInput 
                    style={styles.input}
                    placeholder="Rhodes ID"
                    placeholderTextColor="#FAF2E6"
                    onChangeText={setRhodesID}
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
                    placeholder="Write your post"
                    placeholderTextColor="#FAF2E6"
                    value={postText}
                    onChangeText={setPostText}
                    multiline
                />

                {/* Map View */}
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

                        if (selectingPickup) {
                            setPickupLocation(location);
                            //console.log("Selected Pickup Location:", location);
                        } else {
                            setDropoffLocation(location);
                            //console.log("Selected Dropoff Location:", location);
                        }
                    
                    }}
                >
                    {pickupLocation && (
                        <Marker coordinate={pickupLocation} title="Pickup Location" pinColor="blue" />
                    )}
                    {dropoffLocation && (
                        <Marker coordinate={dropoffLocation} title="Dropoff Location" pinColor="red" />
                    )}
                </MapView>

                {/* Toggle Button */}
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
    listView: {
        position: 'absolute',
        top: 50,
        zIndex: 10,
        width: '100%',
        backgroundColor: '#FAF2E6',
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
        marginBottom: 10,
    },
    toggleButton: {
        backgroundColor: '#4C3A51',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
    },
    toggleButtonText: {
        color: '#FAF2E6',
        fontSize: 16,
    }
});

export default CreatePostScreen;