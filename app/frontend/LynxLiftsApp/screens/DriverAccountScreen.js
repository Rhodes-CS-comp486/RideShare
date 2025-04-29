import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env'

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};

const DriverAccountScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const [bio, setBio] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fields = [
    { label: 'Name', key: 'name' },
    { label: 'Class Year', key: 'class_year' },
    { label: 'Pronouns', key: 'pronouns' },
    { label: 'Major', key: 'major' },
    { label: 'Car Make & Model', key: 'car_make_model' },
    { label: 'Car Color', key: 'car_color' },
    { label: 'License Plate', key: 'license_plate' },
    { label: 'Number of Passengers', key: 'num_passengers' },
    { label: 'Pet Friendly', key: 'pet_friendly' },
    { label: 'Bio', key: 'bio' },
  ];

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user/${user.rhodesid}/profile`);
        setBio(response.data);
      } catch (error) {
        console.error('Error fetching bio:', error);
      }
    };

    fetchBio();
  }, []);

  const saveField = async () => {
    const updated = { ...bio, [editingField]: tempValue };
    setBio(updated);
    setEditingField(null);
  
    try {
      await axios.put(`${API_URL}/api/auth/user/${user.rhodesid}/profile`, {
        field: editingField, 
        value: tempValue       
      }); 
    } catch (error) {
      console.error('Error saving field:', error);
      Alert.alert("Error", "Failed to save. Try again.");
    }
  };  

  const renderField = ({ label, key }) => (
    <View style={styles.fieldRow} key={key}>
      <Text style={styles.fieldLabel}>{label}:</Text>
  
      {key === 'pet_friendly' ? (
        <>
          <Switch
            value={!!bio.pet_friendly}
            onValueChange={async (newValue) => {
              const updated = { ...bio, pet_friendly: newValue };
              setBio(updated);
              try {
                await axios.put(`${API_URL}/api/auth/user/${user.rhodesid}/profile`, {
                  field: 'pet_friendly',
                  value: newValue,
                });
              } catch (error) {
                console.error('Error saving pet_friendly:', error);
                Alert.alert("Error", "Failed to save. Try again.");
              }
            }}
          />
        </>
      ) : editingField === key ? (
        <>
          <TextInput
            value={tempValue}
            onChangeText={setTempValue}
            style={styles.input}
          />
          <TouchableOpacity onPress={saveField}>
            <Text style={styles.editText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.value}>{bio[key]?.toString() || 'Not set'}</Text>
          <TouchableOpacity onPress={() => {
            setEditingField(key);
            setTempValue(bio[key]?.toString() || '');
          }}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );  

  const renderAvatarPicker = () => {
    const avatars = ['billy.png', 'crosby.png', 'matthew.png', 'nalvi.png'];
  
    const fetchBio = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user/${user.rhodesid}/profile`);
        setBio(response.data);
      } catch (error) {
        console.error('Error refreshing bio after avatar change:', error);
      }
    };
  
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        {avatars.map((avatar) => (
          <TouchableOpacity
            key={avatar}
            onPress={async () => {
              try {
                await axios.put(`${API_URL}/api/auth/user/${user.rhodesid}/profile`, {
                  field: 'profile_picture',
                  value: avatar,
                });
                setBio(prev => ({ ...prev, profile_picture: avatar }));
              } catch (error) {
                console.error('Error saving profile picture:', error);
                Alert.alert('Error', 'Failed to save. Try again.');
              }
            }}
          >
            <Image
              source={avatarImages[avatar]}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderColor: bio.profile_picture === avatar ? '#FAF2E6' : '#ccc',
                borderWidth: 2,
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };  

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView>
      <View style={styles.profileHeader}>
        <View style={styles.profilePicContainer}>
        <Image
          source={bio.profile_picture ? avatarImages[bio.profile_picture] : null}
          style={styles.profileImage}
        />
        </View>
        <Text style={styles.driverName}>{bio.name || 'Driver'}</Text>
        <Text style={styles.driverSub}>
          {bio.class_year || 'Class Year'} · {bio.car_make_model || 'Car Model'}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        {renderAvatarPicker()}
        {fields.map(renderField)}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SetPreference', { user: { rhodesid: user.rhodesid } })}
      >
        <Text style={styles.buttonText}>Set Radius</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Feed', { user })}
      >
        <Text style={styles.buttonText}>Switch to Passenger</Text>
       </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('DriverFeed', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Driver')}>
          <Image source={require('../assets/payment.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverChat', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
          <Image source={require('../assets/chat.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DriverAccount', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
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
  profileHeader: {
    backgroundColor: '#A62C2C',
    paddingVertical: 30,
    alignItems: 'center',
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  editPicButton: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#6683A9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  driverName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  driverSub: {
    color: '#fff',
    fontSize: 16,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#fff',
    flex: 1.2,
  },
  value: {
    color: '#fff',
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 6,
    flex: 1,
    marginRight: 6,
  },
  editText: {
    color: '#fff',
    backgroundColor: '#A62C2C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#A62C2C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: '#A62C2C',
    borderRadius: 25,
    marginBottom: 100,
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
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

export default DriverAccountScreen;