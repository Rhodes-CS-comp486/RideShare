import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
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
                onChangeText={setRhodesID}
            />
            <TextInput 
                style={styles.input}
                placeholder="Pickup Time (HH:MM AM/PM)"
                value={pickupTime}
                onChangeText={setPickupTime}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Write your post"
                multiline
                value={postText}
                onChangeText={setPostText}
            />
            <Button title="Post" onPress={handlePost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10 },
    errorText: { color: 'red', marginBottom: 10},
});

export default CreatePostScreen;