import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env'

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};

const PassengerAccountScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fields = [
    { label: 'Name', key: 'name' },
    { label: 'Class Year', key: 'class_year' },
    { label: 'Pronouns', key: 'pronouns' },
    { label: 'Major', key: 'major' },
    { label: 'Bio', key: 'bio' },
  ];

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/user/${user.rhodesid}/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching passenger profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveField = async () => {
    const updated = { ...profile, [editingField]: tempValue };
    setProfile(updated);
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

  const handleLogout = async () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const renderField = ({ label, key }) => (
    <View style={styles.fieldRow} key={key}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      {editingField === key ? (
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
          <Text style={styles.value}>{profile[key] || 'Not set'}</Text>
          <TouchableOpacity onPress={() => {
            setEditingField(key);
            setTempValue(profile[key] || '');
          }}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderAvatarPicker = () => {
    const avatars = ['billy.png', 'crosby.png', 'matthew.png', 'nalvi.png'];
  
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
                setProfile(prev => ({ ...prev, profile_picture: avatar }));
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
                borderColor: profile.profile_picture === avatar ? '#FAF2E6' : '#ccc',
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
            source={profile.profile_picture ? avatarImages[profile.profile_picture] : null}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{profile.name || 'Passenger'}</Text>
        <Text style={styles.sub}>
          {profile.class_year || 'Class Year'} · {profile.major || 'Major'}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        {renderAvatarPicker()}
        {fields.map(renderField)}
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Status', { user })}
        >
        <Text style={styles.buttonText}>Switch to Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      </ScrollView>
       <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Feed', { user: { rhodesid: user.rhodesid, profile_picture: user.profile_picture } })}>
            <Image source={require('../assets/home.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Browse', { user: { rhodesid: user.rhodesi, profile_picture: user.profile_pictured } })}>
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
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sub: {
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

export default PassengerAccountScreen;
