import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const API_BASE_URL = `${API_URL}/api/messages/conversations`;

const DriverConversationsScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(API_BASE_URL, {
          params: { driverid: user.rhodesid } 
        });

        const formatted = response.data.map((item) => ({
          id: item.passengerrhodesid,
          passengerrhodesid: item.passengerrhodesid,
          user: item.passengerrhodesid,
          lastMessage: item.lastmessage,
          pickupdate: item.pickupdate,
          pickuptime: item.pickuptime,
        }));

        setConversations(formatted);
      } catch (err) {
        console.error('Error fetching driver conversations:', err);
      }
    };

    fetchConversations();
  }, [user.rhodesid]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DriverChat', {
        user: { rhodesid: user.rhodesid },
        passenger: { rhodesid: item.passengerrhodesid },
        pickupdate: item.pickupdate,
        pickuptime: item.pickuptime
      })}
    >
      <Text style={styles.user}>{item.user}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('DriverFeed', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
           <TouchableOpacity onPress={() => console.log('Driver')}>
             <Image source={require('../assets/payment.png')} style={styles.icon} />
           </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DriverConversations', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/chat.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DriverAccount', { user: { rhodesid: user.rhodesid } })}>
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
});

export default DriverConversationsScreen;