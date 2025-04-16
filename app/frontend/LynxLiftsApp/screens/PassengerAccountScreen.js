import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

const PassengerAccountScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [profile, setProfile] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fields = [
    { label: 'Name', key: 'passenger_name' },
    { label: 'Class Year', key: 'passenger_class_year' },
    { label: 'Major', key: 'passenger_major' },
    { label: 'Pronouns', key: 'passenger_pronouns' },
    { label: 'Bio', key: 'passenger_bio' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/passenger/${user.rhodesid}/bio`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching passenger profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const saveField = async () => {
    const updated = { ...profile, [editingField]: tempValue };
    setProfile(updated);
    setEditingField(null);

    try {
      await axios.put(`${API_URL}/api/auth/passenger/${user.rhodesid}/bio`, updated);
    } catch (error) {
      console.error('Error saving passenger field:', error);
    }
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImage = response.assets[0];
        const updated = { ...profile, passenger_profile_picture: selectedImage.uri };
        setProfile(updated);

        try {
          await axios.put(`${API_URL}/api/auth/passenger/${user.rhodesid}/bio`, updated);
        } catch (error) {
          console.error('Error uploading passenger profile picture:', error);
        }
      }
    });
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
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.profilePicContainer}>
            <Image
              source={{ uri: profile.passenger_profile_picture || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editPicButton} onPress={handleImagePicker}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile.passenger_name || 'Passenger'}</Text>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            {profile.passenger_class_year || 'Class Year'} · {profile.passenger_major || 'Major'}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          {fields.map(renderField)}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('DriverAccount', { user })}
        >
          <Text style={styles.buttonText}>Switch to Driver</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  subLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
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
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PassengerAccountScreen;