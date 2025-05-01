import React, { useState, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import { API_URL } from '@env';

const API_BASE_URL = `${API_URL}/api/messages`;


const PassengerChatScreen = ({ navigation, route }) => {
    const { user, driver, pickupdate, pickuptime } = route.params;
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
    }, [user.rhodesid, driver.rhodesid, pickupdate, pickuptime]);

    return (
      <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70} // adjust depending on header or bottom bar
          >
            <GiftedChat
              messages={messages}
              onSend={messages => onSend(messages)}
              user={{ _id: user.rhodesid }}
              messageIdGenerator={() => uuid.v4()}
              renderActions={() => null}
              minComposerHeight={90}
              maxComposerHeight={50}
            />
          </KeyboardAvoidingView>
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
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FAF2E6',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#FAF2E6',
    textAlign: 'center',
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
