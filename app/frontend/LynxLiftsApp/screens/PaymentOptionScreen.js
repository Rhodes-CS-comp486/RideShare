import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const PaymentOptionScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [venmo, setVenmo] = useState('');
  const [cashapp, setCashapp] = useState('');
  const [zelle, setZelle] = useState('');

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/driver/${user.rhodesid}/payment`);
        if (res.data) {
          setVenmo(res.data.venmo_handle || '');
          setCashapp(res.data.cashapp_handle || '');
          setZelle(res.data.zelle_contact || '');
        }
      } catch (error) {
        console.error('Failed to load payment info:', error);
      }
    };

    fetchPaymentInfo();
  }, []);

  const savePaymentInfo = async () => {
    try {
      await axios.put(`${API_URL}/api/auth/driver/${user.rhodesid}/payment`, {
        venmo_handle: venmo,
        cashapp_handle: cashapp,
        zelle_contact: zelle
      });
      Alert.alert("Success", "Payment info updated.");
      navigation.goBack();
    } catch (error) {
      console.error('Error updating payment info:', error);
      Alert.alert("Error", "Failed to save payment info.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Edit Payment Options</Text>

      <TextInput
        placeholder="Venmo Handle"
        style={styles.input}
        value={venmo}
        onChangeText={setVenmo}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Cash App Handle"
        style={styles.input}
        value={cashapp}
        onChangeText={setCashapp}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Zelle Contact (Email or Phone)"
        style={styles.input}
        value={zelle}
        onChangeText={setZelle}
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity style={styles.button} onPress={savePaymentInfo}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#80A1C2',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#FAF2E6',
    alignSelf: 'center'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#A62C2C',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center'
  },
  cancelText: {
    color: '#FAF2E6',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});

export default PaymentOptionScreen;