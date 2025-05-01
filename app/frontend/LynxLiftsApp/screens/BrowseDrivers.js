import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};


const BrowseDrivers = ({ navigation, route }) => {
  const { user } = route.params;
  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/browse-drivers`);
      const filteredDrivers = response.data.filter(driver => driver.driverid !== user.rhodesid);
      setDrivers(filteredDrivers);
    } catch (err) {
      console.error('Failed to load drivers:', err);
    }
  };

  const requestRide = (driverId) => {
    Alert.alert("Ride Request Sent", `You requested a ride from ${driverId}`);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchDrivers);
    return unsubscribe;
  }, [navigation]);

  const RenderDriver = ({ item }) => {
    const avatarKey = item.profile_picture;
    const avatarSource = avatarImages[avatarKey];
  
    return (
      <View style={styles.swipeablePost}>
        <View style={styles.post}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.postText}>Driver ID: {item.driverid}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ViewDriverAccount', {
                user: { rhodesid: item.driverid, profile_picture: item.profile_picture }, currentUserId: user.rhodesid
              })}
            >
              {avatarSource ? (
                <Image
                  source={avatarSource}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              ) : (
                <View style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: '#A62C2C'
                }} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.postText}>Status: Online</Text>
          <Text style={styles.postText}>Radius: {item.radius} miles</Text>
          <Text style={styles.postText}>Time: {item.time} minutes</Text>
  
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => requestRide(item.driverid)}
          >
            <Text style={styles.chatText}>Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <RenderDriver item={item} />}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/driver.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerChat', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/chat.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PassengerAccount', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
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
  post: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#6683A9',
    marginBottom: 10,
    backgroundColor: '#6683A9',
    borderRadius: 10,
  },
  postText: {
    color: '#FAF2E6',
    fontSize: 16,
  },
  chatButton: {
    backgroundColor: '#A62C2C',
    marginTop: 10,
    padding: 8,
    borderRadius: 25,
    alignItems: 'center'
  },
  chatText: {
    color: '#FAF2E6',
    fontSize: 15
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
  swipeablePost: {
    backgroundColor: '#6683A9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
});

export default BrowseDrivers;
