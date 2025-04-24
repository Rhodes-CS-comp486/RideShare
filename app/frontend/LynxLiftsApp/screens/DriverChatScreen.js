import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';

const DriverChatScreen = ({ navigation, route }) => {
    const { user } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driver Chat Screen</Text>
      <Text style={styles.message}>Matthew do your magic here!</Text>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('DriverFeed', { user: { rhodesid: user.rhodesid } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Driver')}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverChat', { user: { rhodesid: user.rhodesid } })}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default DriverChatScreen;
