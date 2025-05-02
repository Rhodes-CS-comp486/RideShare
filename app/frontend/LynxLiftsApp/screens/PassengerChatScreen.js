import React, { useState, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Image, Alert, Text } from 'react-native';
import axios from 'axios';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@env';

const API_BASE_URL = `${API_URL}/api/messages`;


const PassengerChatScreen = ({ navigation, route }) => {
    const { user, driver, pickupdate, pickuptime, pickuplocation, dropofflocation } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(API_BASE_URL, {
            params: {
              passengerrhodesid: user.rhodesid,
              driverid: driver.rhodesid
            }
          });
          const formattedMessages = response.data.map(msg => ({
            _id: msg.id || uuid.v4(),
            text: msg.text,
            createdAt: new Date(msg.timesent),
            user: {
              _id: msg.senderid
            }
          }));
          setMessages(formattedMessages);
          setTimeout(fetchMessages, 5000);
        } 
        catch (error) {
          Alert.alert('Cannot fetch messages. Please try again.');
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }, [user.rhodesid, driver.rhodesid]);

    const onSend = useCallback(async (messages = []) => {
      const message = messages[0];
      setMessages(prevMessages => GiftedChat.append(prevMessages, [{
        ...message,
        user: { _id: user.rhodesid }
      }]));

      const payload = {
        passengerrhodesid: user.rhodesid,
        driverid: driver.rhodesid,
        pickupdate,
        pickuptime,
        text: message.text,
        senderid: user.rhodesid,
        pickuplocation,
        dropofflocation
      };

      // if (pickupdate && pickuptime) {
      //   payload.pickupdate = pickupdate;
      //   payload.pickuptime = pickuptime;
      // }
  
      try {
        await axios.post(API_BASE_URL, payload);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }, [user.rhodesid, driver.rhodesid, pickupdate, pickuptime, pickuplocation, dropofflocation]);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.scheduleRideButton}
            onPress={() =>
              navigation.navigate('ScheduleRide', {
                user: { rhodesid: user.rhodesid },
                driver: { rhodesid: driver.rhodesid },
                pickupdate,
                pickuptime,
              })
            }
          >
            <Text style={styles.scheduleButtonText}>Schedule Ride</Text>
          </TouchableOpacity>
        </View>
  
        <View style={{ flex: 1, paddingBottom: 60 }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <GiftedChat
              messages={messages}
              onSend={(messages) => onSend(messages)}
              user={{ _id: user.rhodesid }}
              minComposerHeight={40}
              maxComposerHeight={100}
              renderBubble={(props) => (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: { backgroundColor: '#A62C2C', marginBottom: 10, marginRight: 5},
                    left: { backgroundColor: '#DDE6ED', marginBottom: 10, marginLeft: -40 },
                  }}
                  textStyle={{
                    right: { color: '#FAF2E6' },
                    left: { color: '#1C1C1C' },
                  }}
                />
              )}
            />
          </KeyboardAvoidingView>
        </View>
  
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/driver.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PassengerConversations', { user: { rhodesid: user.rhodesid }, driver: { rhodesid: driver.rhodesid } })}>
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
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#80A1C2',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scheduleRideButton: {
    backgroundColor: '#A62C2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scheduleButtonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: 'bold',
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

export default PassengerChatScreen;
