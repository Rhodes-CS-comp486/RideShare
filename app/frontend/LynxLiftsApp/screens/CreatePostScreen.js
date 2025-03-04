import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-gesture-handler';

const CreatePostScreen = ({ navigation, route }) => {
    const [rhodesID, setRhodesID] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState(null); // You can implement image selection later
    const [error, setError] = useState('');

    const validateTimeFormat = (time) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;
        return timeRegex.test(time);
    }

    const handlePost = () => {
        if (!validateTimeFormat(pickupTime)) {
            setError("Invalid time format. Use HH:MM AM/PM (e.g., 10:30 AM).")
            return;
        } 

        route.params.addPost({ time: pickupTime, text: postText, image: postImage });
        
        navigation.goBack();
    };

    return (
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
        marginBottom: 10 },
});

export default CreatePostScreen;