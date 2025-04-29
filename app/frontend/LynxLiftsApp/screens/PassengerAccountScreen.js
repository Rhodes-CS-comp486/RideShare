import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env'

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
      const response = await axios.get(`${API_URL}/api/auth/passenger/${user.rhodesid}/profile`);
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
      await axios.put(`${API_URL}/api/auth/passenger/${user.rhodesid}/profile`, updated);
    } catch (error) {
      console.error('Error saving field:', error);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profilePicContainer}>
          <Image
            source={ 'PLACEHOLDER' } // NEED TO UPDATE
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editPicButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile.name || 'Passenger'}</Text>
        <Text style={styles.sub}>
          {profile.class_year || 'Class Year'} · {profile.major || 'Major'}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
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
