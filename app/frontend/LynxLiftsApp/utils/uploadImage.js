// utils/uploadImage.js
import storage from '@react-native-firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';

/**
 * Uploads an image to Firebase Storage and returns the public URL.
 * @param {string} uri - The local URI of the image to upload.
 * @param {string} folder - The folder in Firebase Storage to upload the image into (e.g., 'driver_profiles' or 'passenger_profiles').
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
const uploadImage = async (uri, folder) => {
  if (!uri) return null;

  try {
    const filename = `${folder}/${uuidv4()}`;
    const reference = storage().ref(filename);

    let uploadUri = uri;

    // Fix for iOS file:// prefix
    if (Platform.OS === 'ios') {
      uploadUri = uploadUri.replace('file://', '');
    }

    await reference.putFile(uploadUri);

    const url = await reference.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Firebase upload error:', error);
    throw error;
  }
};

export default uploadImage;