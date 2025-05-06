# Lynx Lifts

## 1. Project Description

Lynx Lifts is a mobile application developed to address transportation challenges faced by students at Rhodes College. Many students on campus do not have access to personal vehicles, which makes it difficult to travel to grocery stores, internships, off-campus jobs, or other locations. Traditional ride-sharing services like Uber and Lyft can be costly and are not always accessible with student schedules. Lynx Lifts offers a student-centered solution by connecting student drivers with student passengers, creating a safe, convenient, and cost-effective transportation option within the Rhodes community.

The app allows students who need rides to submit requests for specific times and destinations. Student drivers can then view and accept these requests, providing rides in exchange for a small payment. This helps passengers get where they need to go while also allowing drivers to earn money on their own schedules. By keeping the service within the Rhodes College network, there is a sense of community among students.

During development, we worked closely with the Lynx Lifts organization on campus. They gave us valuable input on what they envisioned for the app, providing feedback on features such as ride safety (report system) and ease of use. Their insights helped us focus more on the basic needs of students that we may have overlooked.

Based on this collaboration, we prioritized safety features such as a report system, limited access to rides within the Rhodes community (checking email conditions), and transparent communication between drivers and passengers. With that, the user interface was designed to be clean and intuitive, allowing students to quickly find rides or offer them with minimal difficulty.

## Features

### Authentication

- Secure login using @rhodes.edu Outlook accounts

### Dual User Interfaces

#### Driver Mode

- Toggle online/offline availability
- Set ride preferences (distance, time)
- View, accept, or decline ride requests

#### Passenger Mode

- Post ride requests (time, date, pickup/dropoff, ETA, distance)
- Use an interactive map to select pickup and destination points
- Browse available drivers

### Communication & Notifications

- In-app chat between drivers and passengers
- Push notifications for upcoming ride reminders
- User bios to encourage safe and informed interactions

### Payment System

- Third-party for secure transactions (e.g., PayPal, Venmo)

### Safety Features

- In-app report system to maintain respectful, safe use of the app

### System Diagram

<img src="https://github.com/user-attachments/assets/457cbb69-347b-44ea-aa6b-357632402b64" alt="Lynx Lifts System Diagram" width="600/>


### Frontend Clips

<p align="center">
  <img src="https://github.com/user-attachments/assets/d4154a43-5e70-41bb-b768-6355c3738209" alt="Clip 1" width="150"/>
  <img src="https://github.com/user-attachments/assets/829111c8-f679-42f5-8a0e-5eb7a5cdb5dd" alt="Clip 2" width="150"/>
  <img src="https://github.com/user-attachments/assets/9c8a9286-4dec-4e56-b6dc-73b64522ad67" alt="Clip 3" width="150"/>
</p>

## 2. Project Dependencies

### Frontend Software Libraries

- react-native – Framework for building mobile apps
- react – Core React library
- @react-navigation/native – Navigation between screens
- @react-navigation/stack – Stack navigation for navigating between pages
- react-native-maps – Map integration for location-based services
- react-native-gesture-handler – Gesture handler for smooth interactions
- react-native-reanimated – Animated library for complex animations
- react-native-vector-icons – Custom icons for UI
- react-native-gifted-chat – Chat UI components
- react-native-image-picker – Image picker for profile picture uploads
- react-native-config – For environment variables management
- @react-native-async-storage/async-storage – Local storage
- react-native-dotenv – Environment variables
- axios – For API calls
- date-fns – Date handling library
- react-native-date-picker – Date picker for selecting dates
- react-native-calendars – Calendar component for date selection
- react-native-keyboard-controller – For managing the keyboard in forms

### Backend Software Libraries

- express – Web framework for building the backend API
- pg – database interaction
- bcrypt – for password hashing
- jsonwebtoken – for generating JWT tokens
- firebase-admin – Firebase Admin SDK for notifications
- nodemailer – for sending email notifications
- dotenv – for managing environment variables

### Runtime Environments

- Node.js – for running the backend API server
- React Native - for running the frontend

### Backend Products and Services

- PostgreSQL – main relational database
- Firebase Cloud Messaging – push notifications
- Google Maps API – for interactive map
- Google Geocoding API - for the conversion of coordinates to readable addresses
- Google Distance Matrix API - calculating distance and time between locations

## 3. Quick Start Guide

### Installation Instructions

- Clone repository to have the shortest path length possible (I have mine on C:)
- Remove the node_module files in both the Rideshare/app/frontend/LynxLiftsApp and Rideshare/app/backend
- Remove the package-lock.json files in both the Rideshare/app/frontend/LynxLiftsApp and Rideshare/app/backend (DO NOT DELETE THE package.json)
- (Android Only) Under Rideshare/app/frontend/LynxLiftsApp/android/app, delete the .cxx and build files
- (iOS Only) Under Rideshare/app/frontend/LynxLiftsApp/ios, remove the Pods directory and Podfile.lock file
- Now, in both the Rideshare/app/frontend/LynxLiftsApp and Rideshare/app/backend, run the command
  - npm install
- (iOS Only) Under Rideshare/app/frontend/LynxLiftsApp/ios, run the command
  - pod install
- (Android Only) Under Rideshare/app/frontend/LynxLiftsApp/android, run the command
  - ./gradlew clean

### Run Instructions

Once everything is installed, while in Rideshare/app/frontend/LynxLiftsApp directory, run the command (in Terminal)

- Android: npx react-native run-android
- iOS:
  - npx react-native start (or 'npm start --reset-cache' if you want to clean the cache simultaneously)
  - npx react-native run-ios

While this is loading, in the Rideshare/app/backend run the command (in a separate terminal)

- Android and iOS: node index.js

### API Documentation

- [PostgreSQL npm Documentation](https://www.npmjs.com/package/pg)
- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/?hl=en&_gl=1*osynl6*_ga*MTgxODI3OTkyNC4xNzQ2NDc4NjU1*_ga_NRWSTWS78N*MTc0NjQ3ODY1NS4xLjEuMTc0NjQ3ODcxNi4wLjAuMA..)

- [Google Maps API](https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1)

- [Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/overview)

- [Firebase Cloud Messaging API](https://firebase.google.com/docs/cloud-messaging)
