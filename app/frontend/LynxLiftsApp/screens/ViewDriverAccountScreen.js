import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const avatarImages = {
  'billy.png': require('../assets/avatars/billy.png'),
  'crosby.png': require('../assets/avatars/crosby.png'),
  'matthew.png': require('../assets/avatars/matthew.png'),
  'nalvi.png': require('../assets/avatars/nalvi.png'),
};

const ViewDriverAccountScreen = ({ route }) => {
  const { user } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getAvatarSource = (filename) => {
    return avatarImages[filename?.trim()] || avatarImages['nalvi.png'];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user/${user.rhodesid}/profile`);
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to load driver profile:', error);
        Alert.alert('Error', 'Could not load driver profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.rhodesid]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!profile) {
    return <View style={styles.center}><Text>No profile found.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 64 : 44, 
          left: 18,
          zIndex: 999,
          backgroundColor: '#FAF2E6',
          borderRadius: 16,
          padding: 6,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Image
          source={require('../assets/x.png')}
          style={{ width: 20, height: 20, tintColor: '#6683A9' }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.profileHeader}>
          <Image source={getAvatarSource(profile.profile_picture)} style={styles.profileImage} />
          <Text style={styles.name}>{profile.name || 'Driver'}</Text>
          <Text style={styles.sub}>{profile.class_year || 'Class Year'} · {profile.major || 'Major'}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Pronouns:</Text>
          <Text style={styles.value}>{profile.pronouns || 'Not set'}</Text></View>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Bio:</Text
          ><Text style={styles.value}>{profile.bio || 'Not set'}</Text></View>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Car:</Text>
          <Text style={styles.value}>{profile.car_make_model || 'Not set'} - {profile.car_color || 'Not set'}</Text></View>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>License Plate:</Text>
          <Text style={styles.value}>{profile.license_plate || 'Not set'}</Text></View>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Pet Friendly:</Text
          ><Text style={styles.value}>{profile.pet_friendly ? 'Yes' : 'No'}</Text></View>
          <View style={styles.fieldRow}><Text style={styles.fieldLabel}>Passengers:</Text>
          <Text style={styles.value}>{profile.num_passengers ?? 'Not set'}</Text></View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('Report', {
          reportedUser: user.rhodesid,
          currentUser: route.params.currentUserId, 
          postInfo: null, 
        })}
        style={{
          backgroundColor: '#A62C2C',
          padding: 12,
          borderRadius: 20,
          margin: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FAF2E6', fontSize: 16 }}>Report Profile</Text>
      </TouchableOpacity>
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewDriverAccountScreen;
