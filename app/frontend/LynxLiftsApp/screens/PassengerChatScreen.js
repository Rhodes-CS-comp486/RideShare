import React, { useState, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import { API_URL } from '@env';

const API_BASE_URL = `${API_URL}/api/messages`;


const PassengerChatScreen = ({ navigation, route }) => {
    const { user } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(API_BASE_URL, {
            params: {
              passengerrhodesid: user.rhodesid,
              driverid: "driver123"
            }
          });
          const formattedMessages = response.data.map(msg => ({
            _id: msg.id || uuid.v4(),
            text: msg.text,
            createdAt: new Date(msg.timesent),
            user: {
              _id: msg.passengerrhodesid === user.rhodesid ? user.rhodesid : msg.driverid
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
    }, []);

    const onSend = useCallback(async (messages = []) => {
      setMessages(prevMessages => GiftedChat.append(prevMessages, messages));
      const { _id, createdAt, text, user } = messages[0];
  
      try {
        await axios.post(API_BASE_URL, {
          passengerrhodesid: user._id,
          driverid: "driver123",
          pickupdate: "2025-05-01", 
          pickuptime: "14:00:00",    
          text: text,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }, []);

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
              user={{
                _id: user.rhodesid // or any unique identifier
                // name: user.email
              }}
              messageIdGenerator={() => uuid.v4()}
              // messageIdGenerator={() => Math.random().toString(36).substring(7)}
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
          <TouchableOpacity onPress={() => navigation.navigate('PassengerChat', { user: { rhodesid: user.rhodesid } })}>
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
    // justifyContent: 'center',
    // alignItems: 'center',
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
