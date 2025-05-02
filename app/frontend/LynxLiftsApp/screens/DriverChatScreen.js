import React, { useState, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Image, Alert, Text } from 'react-native';
import axios from 'axios';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '@env';

const API_BASE_URL = `${API_URL}/api/messages`;


const DriverChatScreen = ({ navigation, route }) => {
    const { user, passenger, pickupdate, pickuptime } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(API_BASE_URL, {
            params: {
              passengerrhodesid: passenger.rhodesid,
              driverid: user.rhodesid
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
    }, [user.rhodesid, passenger.rhodesid]);

    const onSend = useCallback(async (messages = []) => {
      const message = messages[0];

      setMessages(prevMessages => GiftedChat.append(prevMessages, [{
        ...message,
        user: {
          _id: user.rhodesid,
        }
      }])
    );
      const payload = {
        passengerrhodesid: passenger.rhodesid,
        driverid: user.rhodesid,
        text: message.text,
        senderid: user.rhodesid
      };

      if (pickupdate && pickuptime) {
        payload.pickupdate = pickupdate;
        payload.pickuptime = pickuptime;
      }
  
      try {
        await axios.post(API_BASE_URL, payload);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }, [user.rhodesid, passenger.rhodesid, pickupdate, pickuptime]);

    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, paddingBottom: 60 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{ _id: user.rhodesid }}
              messageIdGenerator={() => uuid.v4()}
              renderBubble={(props) => (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: { backgroundColor: '#A62C2C', marginBottom: 10, marginRight: 5 },
                    left: { backgroundColor: '#DDE6ED', marginBottom: 10, marginLeft: -40 },
                  }}
                  textStyle={{
                    right: { color: '#FAF2E6' },
                    left: { color: '#1C1C1C' },
                  }}
                />
              )}
              minComposerHeight={40}
              maxComposerHeight={100}
            />
          </KeyboardAvoidingView>
        </View>
  
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('DriverFeed', { user: { rhodesid: user.rhodesid } })}>
            <Image source={require('../assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Driver')}>
            <Image source={require('../assets/driver.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DriverConversations', { user: { rhodesid: user.rhodesid }, passenger: { rhodesid: passenger.rhodesid } })}>
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

export default DriverChatScreen;