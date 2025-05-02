import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE_URL = `${API_URL}/api/messages/conversations`;

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};

const PassengerConversationsScreen = ({navigation, route}) => {
  const { user } = route.params;
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          params: { passengerrhodesid: user.rhodesid }
        });

        const formatted = response.data.map((item) => ({
          id: item.driverid, 
          driverid: item.driverid,
          user: item.driverid,
          lastMessage: item.lastmessage,
          pickupdate: item.pickupdate,
          pickuptime: item.pickuptime,
          profile_picture: item.profile_picture,
        }));

        setConversations(formatted);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchConversations();
  }, [user.rhodesid]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('PassengerChat', {
            user: { rhodesid: user.rhodesid },
            driver: { rhodesid: item.driverid },
            pickupdate: item.pickupdate,
            pickuptime: item.pickuptime,
          })
        }
      >
        <View style={styles.row}>
          <Image
            source={avatarImages[item.profile_picture?.trim()] || null}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{item.user}</Text>
            <Text style={styles.message}>{item.lastMessage}</Text>
            <Text style={styles.timestamp}>
              {item.pickupdate} at {item.pickuptime}
            </Text>
          </View>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerConversations', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/chat.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerAccount', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/setting.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#80A1C2',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  user: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  unreadBadge: {
    position: 'absolute',
    top: 15,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6683A9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 50,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: '#DDE6ED',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#C44B4B',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  message: {
    fontSize: 14,
    color: '#3E3E3E',
    marginVertical: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    alignSelf: 'center',
  },  
});

export default PassengerConversationsScreen;