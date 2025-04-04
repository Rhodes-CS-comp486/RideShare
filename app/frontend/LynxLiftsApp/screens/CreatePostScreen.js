import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Keyboard, 
    TouchableWithoutFeedback, 
    Alert,
    ScrollView, 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { Text } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_KEY } from '@env';

const CreatePostScreen = ({ navigation, route }) => {
    const [passengerrhodesID, setPassengerRhodesID] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [pickupTime, setPickupTime] = useState(new Date());
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [rideState, setRideState] = useState(false);
    const [payment, setPayment] = useState('');
    const [error, setError] = useState('');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [selectingPickup, setSelectingPickup] = useState(true);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [mapKey, setMapKey] = useState(0);

    const refreshMap = () => setMapKey((prevKey) => prevKey + 1);

    const fetchDistanceAndDuration = async () => {
        if (pickupLocation && dropoffLocation) {
            try {
                const distanceMatrixURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLocation.latitude},${pickupLocation.longitude}&destinations=${dropoffLocation.latitude},${dropoffLocation.longitude}&key=${API_KEY}`;
    
                const distanceResponse = await axios.get(distanceMatrixURL);
                const data = distanceResponse.data;
    
                console.log("Distance API Response:", JSON.stringify(data, null, 2));
    
                if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
                    const fetchedDistance = data.rows[0].elements[0].distance.text;
                    const fetchedDuration = data.rows[0].elements[0].duration.text;

                    // Update the state with the fetched distance and duration
                    setDistance(fetchedDistance);
                    setDuration(fetchedDuration);

                } else {
                    throw new Error("Unable to fetch distance or duration.");
                }
            } catch (error) {
                console.error("Error fetching distance and duration:", error);
                setDistance(null);
                setDuration(null);
            }
        } else {
            setDistance(null);
            setDuration(null);
        }
    };

    useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            fetchDistanceAndDuration();
        }
    }, [pickupLocation, dropoffLocation]);

    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        return timeRegex.test(time);
    };

    const formatTime = (date) => {
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    const handleDayPress = (day) => {
        const [year, month, dayOf] = day.dateString.split('-');
        const formattedDate = `${month}-${dayOf}-${year}`;
        setPickupDate(formattedDate);
        setMarkedDates({
            [day.dateString]: { selected: true, marked: true, selectedColor: 'blue' }

        });
    };

    const handleMapPress = useCallback((e) => {
        const coords = e.nativeEvent.coordinate;
        if (selectingPickup) {
            setPickupLocation(coords);
        } else {
            setDropoffLocation(coords);
        }
        refreshMap(); 
    }, [selectingPickup]);

    const handlePost = async () => {
        console.log("Posting..."); 
    
        console.log("distance:", distance);
        console.log("duration:", duration);

        if (!pickupDate) {
            setError("Please select a date be picked up.")
            return;
        }

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
                payment: payment,
                pickupdate: pickupDate,
                distance: distance,
                duration: duration,
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
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.container}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Pickup Date (MM-DD-YYYY)" 
                        placeholderTextColor="#FAF2E6"
                        value={pickupDate}
                        onChangeText={setPickupDate}
                    />
                    <View>
                        <Calendar 
                        style={styles.calendar}
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        />
                    </View>
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
                    editable={false}
                        placeholder="Distance"
                        placeholderTextColor="#FAF2E6"
                        value={distance} 
                    />
                    <TextInput
                        style={styles.input}
                    editable={false} 
                        placeholder="Estimated Time"
                        placeholderTextColor="#FAF2E6"
                        value={duration}
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
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: 35.1495,
                            longitude: -90.0490,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        onPress={async (e) => {
                            const coords = e.nativeEvent.coordinate;
                            const location = {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                address: `Lat: ${coords.latitude}, Lng: ${coords.longitude}`,
                            };

                            if (selectingPickup) {
                            setPickupLocation(location);
                        } else {
                            setDropoffLocation(location);
                        }

                        if (pickupLocation && dropoffLocation) {
                            await fetchDistanceAndDuration();
                        }
                        }}
                    >
                        {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup Location" pinColor="blue" />}
                        {dropoffLocation && <Marker coordinate={dropoffLocation} title="Dropoff Location" pinColor="red" />}
                    </MapView>
            </View>
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
            </ScrollView>
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

    calendar: {
        width: '145%',
        height: 360,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 10,
    },
    mapContainer: {
        width: '90%',
        height: 310, 
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 6, 
        borderColor: '#A6C9D3', 
        overflow: 'hidden',
    },

    map: {
        flex: 1, 
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

    toggleButton: { 
        backgroundColor: '#A62C2C',
        padding: 12, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginVertical: 10 
    },

    toggleButtonText: { 
        color: '#FAF2E6', // White text
        fontSize: 16, 
        fontWeight: 'bold' 
    },

    errorText: { color: '#FAF2E6', marginBottom: 10 },
    activeButton: { backgroundColor: '#4CAF50' },
    inactiveButton: { backgroundColor: '#A62C2C' },
});

export default CreatePostScreen;