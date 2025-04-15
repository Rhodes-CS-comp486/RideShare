import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

const DriverAccountScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [bio, setBio] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const fields = [
    { label: 'Class Year', key: 'class_year' },
    { label: 'Car Make & Model', key: 'car_make_model' },
    { label: 'Car Color', key: 'car_color' },
    { label: 'License Plate', key: 'license_plate' },
    { label: 'Bio', key: 'bio' },
    { label: 'Pronouns', key: 'pronouns' },
    { label: 'Pet Friendly', key: 'pet_friendly' },
  ];

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/driver/${user.rhodesid}/bio`);
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
      await axios.put(`${API_URL}/api/auth/driver/${user.rhodesid}/bio`, updated);
    } catch (error) {
      console.error('Error saving field:', error);
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
          <Text style={styles.value}>{bio[key] || 'Not set'}</Text>
          <TouchableOpacity onPress={() => {
            setEditingField(key);
            setTempValue(bio[key] || '');
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
              source={{ uri: bio.profile_picture || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editPicButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.driverName}>{bio.name || 'Driver'}</Text>
          <Text style={styles.driverSub}>
            {bio.class_year || 'Class Year'} · {bio.car_make_model || 'Car Model'}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
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
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverAccountScreen;