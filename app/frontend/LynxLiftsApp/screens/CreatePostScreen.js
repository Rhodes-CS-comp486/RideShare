import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert, ScrollView, SafeAreaView, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import { Text } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_KEY, API_URL } from '@env';

const CreatePostScreen = ({ navigation, route }) => {
    const [passengerrhodesID, setPassengerRhodesID] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [pickupTime, setPickupTime] = useState(null);
    const [pickuptimestamp, setpickuptimestamp] = useState('');
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [rideState, setRideState] = useState(false);
    const [payment, setPayment] = useState('');
    const [estimatedpayment, setestimatedpayment] = useState('');
    const [errors, setErrors] = useState({
        pickupDate: '',
        pickupTime: '',
        payment: '',
        locations: ''
    });    
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const { user } = route.params;
    const [selectingPickup, setSelectingPickup] = useState(true);
    const [locationsFinalized, setLocationsFinalized] = useState(false);
    const [promptText, setPromptText] = useState("Click on the map to select the pickup location");
    const mapKey = `${pickupLocation?.latitude ?? 0}-${pickupLocation?.longitude ?? 0}-${dropoffLocation?.latitude ?? 0}-${dropoffLocation?.longitude ?? 0}`;


    const formatTimePosted = () => new Date().toISOString();

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
                    
                    //Set Estimated Payment
                    const estimatedpayment = calculateestimatedpayment(fetchedDistance, fetchedDuration);
                    setestimatedpayment(estimatedpayment);

                    console.log(estimatedpayment);

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

    const calculateestimatedpayment = (distanceStr, durationStr) => {
        const baseFare = 1.0;
        const costPerMile = 0.75;
        const costPerMinute = 0.25;
    
        const miles = parseFloat(distanceStr.replace(' mi', ''));
        const minutes = parseFloat(durationStr.replace(' mins', '').replace(' min', ''));
    
        if (isNaN(miles) || isNaN(minutes)) return '';
    
        const estimate = baseFare + (miles * costPerMile) + (minutes * costPerMinute);
        return estimate.toFixed(2); // returns as string like "5.25"
    };

    const getPickupTimestamp = () => {
        if (!pickupDate || !pickupTime) return null;
        const [month, day, year] = pickupDate.split('-');
        const combined = new Date(year, month - 1, day, pickupTime.getHours(), pickupTime.getMinutes());
        return combined.toISOString(); 
    };

    useEffect(() => {
        if (user?.rhodesid) {
            setPassengerRhodesID(user.rhodesid);
        }
    }, [user]);  

    useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            fetchDistanceAndDuration();
        }
    }, [pickupLocation, dropoffLocation]);    

    const formatTimeSelection = (date) => {
        if (!date) return '';
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        return `${hours}:${strMinutes} ${ampm}`;
    }

    const handleDayPress = (day) => {
        const [year, month, dayOf] = day.dateString.split('-');
        const formattedDate = `${month}-${dayOf}-${year}`;
        setPickupDate(formattedDate);
        setMarkedDates({
            [day.dateString]: { selected: true, marked: true, selectedColor: '#BF4146' }
        });
    };

    const getAddressFromCoords = async (lat, lng) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
            );
            if (response.data.status === 'OK') {
                return response.data.results[0].formatted_address;
            } else {
                console.warn('Geocoding failed:', response.data.status);
                return `Lat: ${lat}, Lng: ${lng}`; // fallback
            }
        } catch (error) {
            console.error('Error with reverse geocoding:', error);
            return `Lat: ${lat}, Lng: ${lng}`; // fallback
        }
    };    

    const handlePost = async () => {
        let newErrors = { pickupDate: '', pickupTime: '', payment: '', locations: '' };
        let hasError = false;

        const pickuptimestamp = getPickupTimestamp();
        console.log(pickuptimestamp)

        if (!pickupDate) {
            newErrors.pickupDate = "Please select a date to be picked up.";
            hasError = true;
        }

        if (!pickupTime) {
            newErrors.pickupTime = "Please pick a time to be picked up.";
            hasError = true;
        }

        if (!payment) {
            newErrors.payment = "Please select a payment option.";
            hasError = true;
        }

        if (!pickupLocation || !dropoffLocation) {
            newErrors.locations = "Please select both pickup and dropoff locations.";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        } else {
            setErrors({ pickupDate: '', pickupTime: '', payment: '', locations: '' });
        }
    
        // Get addresses
        const pickupAddress = await getAddressFromCoords(pickupLocation.latitude, pickupLocation.longitude);
        const dropoffAddress = await getAddressFromCoords(dropoffLocation.latitude, dropoffLocation.longitude);
    
        // Show confirmation alert
        Alert.alert(
            "Confirm Your Ride Details",
            `Pickup location:\n${pickupAddress}\n\nDropoff location:\n${dropoffAddress}\n\nTotal Cost: $${estimatedpayment}`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            const response = await axios.post(`${API_URL}/api/feed`, {
                                passengerrhodesid: passengerrhodesID,
                                pickuptime: pickupTime ? formatTimeSelection(pickupTime) : '',
                                pickuplocation: pickupAddress,
                                dropofflocation: dropoffAddress,
                                ridestate: rideState,
                                payment: payment,
                                pickupdate: pickupDate,
                                distance: distance,
                                duration: duration,
                                timeposted: formatTimePosted(),
                                estimatedpayment: estimatedpayment,
                                pickuptimestamp: pickuptimestamp,
                            });
    
                            console.log("Post created:", response.data);
                            Alert.alert("Success", "Your ride post has been created!");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error posting:", error);
                            Alert.alert("Error", "Failed to create post. Please try again.");
                        }
                    },
                },
            ]
        );
    };    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                keyboardShouldPersistTaps="handled"
            >

                <SafeAreaView style={styles.container}>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } })}
                    style={{
                        position: 'absolute',
                        top: 64,
                        left: 18,
                        zIndex: 999,
                        backgroundColor: '#FAF2E6',
                        borderRadius: 16,
                        padding: 6,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                    >
                    <Image
                        source={require('../assets/x.png')}
                        style={{ width: 20, height: 20, tintColor: '#6683A9' }}
                        resizeMode="contain"
                    />
                    </TouchableOpacity>
                    <TextInput 
                        style={[styles.input, { marginTop: 50 }]}
                        placeholder="Pickup Date (MM-DD-YYYY)" 
                        placeholderTextColor="#FAF2E6"
                        value={pickupDate}
                        editable={false}
                        
                    />
                    {errors.pickupDate !== '' && (
                        <Text style={styles.errorText}>{errors.pickupDate}</Text>
                    )}
                    <View>
                        <Calendar 
                        style={styles.calendar}
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        minDate={new Date().toISOString().split('T')[0]} 
                        />
                    </View>
                    <TouchableOpacity onPress={() => setOpenTimePicker(true)} style={{ width: '90%' }}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Pickup Time (click here to select)"
                            placeholderTextColor="#FAF2E6"
                            value={pickupTime ? formatTimeSelection(pickupTime) : ''}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>
                    {/* Time Picker */}
                    <DatePicker
                        modal
                        open={openTimePicker}
                        date={pickupTime || new Date()} 
                        mode="time"
                        onConfirm={(date) => {
                            setOpenTimePicker(false);
                            setPickupTime(date); 
                        }}
                        onCancel={() => setOpenTimePicker(false)}
                    />
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 }}>
                        {['Venmo', 'Cashapp', 'PayPal', 'Zelle', 'Cash'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.button2,
                                    {
                                        justifyContent: 'center',
                                        margin: 5,
                                        width: 100,
                                        backgroundColor: payment === option ? '#8B0000' : '#BF4146',
                                    }
                                ]}
                                onPress={() => setPayment(option)}
                            >
                                <Text style={{ color: '#FAF2E6', fontSize: 14, textAlign: 'center' }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.payment !== '' && (
                        <Text style={styles.errorText}>{errors.payment}</Text>
                    )}
                    <Text style={{ color: '#FAF2E6', fontSize: 16, textAlign: 'center', marginBottom: 5 }}>
                        {promptText}
                    </Text>

                <View style={styles.mapContainer}>
                    <MapView
                        key={mapKey}
                        style={styles.map}
                        initialRegion={{
                            latitude: 35.1495,
                            longitude: -90.0490,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                        onPress={async (e) => {
                            if (locationsFinalized) return;
                            const coords = e.nativeEvent.coordinate;
                            const location = {
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                                address: `Lat: ${coords.latitude}, Lng: ${coords.longitude}`,
                            };
                        
                            if (selectingPickup) {
                                setPickupLocation(location);
                                setPromptText("Click on the map again to select the dropoff location");
                                setSelectingPickup(false);
                            } else {
                                setDropoffLocation(location);
                                setPromptText("Pickup and dropoff selection has been made");
                                setLocationsFinalized(true);
                            }
                        
                        }}
                    >
                        {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup Location" pinColor="blue" />}
                        {dropoffLocation && <Marker coordinate={dropoffLocation} title="Dropoff Location" pinColor="red" />}
                    </MapView>
                    {locationsFinalized && (
                        <TouchableOpacity
                            style={{width: '100%', alignItems: 'center', backgroundColor: '#A62C2C'}}
                            onPress={() => {
                                setPickupLocation(null);
                                setDropoffLocation(null);
                                setPromptText("Click on the map to select the pickup location");
                                setSelectingPickup(true);
                                setLocationsFinalized(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                    )}
            </View>
            {errors.locations !== '' && (
                <Text style={styles.errorText}>{errors.locations}</Text>
            )}
                    <TouchableOpacity style={styles.button1} onPress={handlePost}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </SafeAreaView>
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

    button1: {
        backgroundColor: '#A62C2C',
        width: '30%',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },

    button2: {
        width: '24%',
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
});

export default CreatePostScreen;