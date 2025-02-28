import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image } from 'react-native';
// import Post from '../components/Post';


const FeedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  }
  return (
    <View style={styles.container}>
            <Button title="Create Post" onPress={() => navigation.navigate('CreatePost', { addPost })} />
            <FlatList
                data={posts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.post}>
                        <Text>Pickup Time: {item.time}</Text>
                        <Image></Image>
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
    post: { padding: 10, borderBottomWidth: 1, marginBottom: 10 }
});

export default FeedScreen;