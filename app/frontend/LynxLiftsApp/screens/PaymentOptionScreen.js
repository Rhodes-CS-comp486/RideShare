import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const PaymentOptionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;

  const [paymentData, setPaymentData] = useState({
    venmo_handle: '',
    cashapp_handle: '',
    zelle_contact: '',
    paypal_handle: '',         
    cash_or_other_note: ''     
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/driver/${user.rhodesid}/payment`);
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
        Alert.alert('Error', 'Could not fetch payment information.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [user.rhodesid]);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/auth/driver/${user.rhodesid}/payment`, paymentData);
      Alert.alert('Success', 'Payment options saved!');
    } catch (error) {
      console.error('Error saving payment info:', error);
      Alert.alert('Error', 'Failed to save payment information.');
    }
  };

  const renderField = (label, key, placeholder) => (
    <View style={styles.fieldContainer} key={key}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={paymentData[key]}
        onChangeText={(text) => setPaymentData({ ...paymentData, [key]: text })}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        style={styles.input}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading payment options...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Your Payment Information</Text>

      {renderField('Venmo Handle', 'venmo_handle', '@yourVenmo')}
      {renderField('Cash App Handle', 'cashapp_handle', '$yourCashApp')}
      {renderField('Zelle Contact', 'zelle_contact', 'email or phone')}
      {renderField('PayPal Link', 'paypal_handle', 'paypal.me/yourlink')}
      {renderField('Cash / Other', 'cash_or_other_note', 'Instructions')}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Payment Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: '#6683A9', marginTop: 10 }]}
        onPress={() => {
          if (route?.params?.user) {
            navigation.navigate('DriverAccount', { user: route.params.user });
          } else {
            navigation.goBack();
          }
        }}
      >
        <Text style={styles.saveButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#80A1C2',
    padding: 20,
    flexGrow: 1
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAF2E6',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#FFCE67',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FAF2E6',
    padding: 10,
    borderRadius: 10,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#A62C2C',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FAF2E6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: '#FAF2E6',
    fontSize: 16,
  },
});

export default PaymentOptionScreen;