// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// const ProfilePage = () => {
//   const [user, setUser] = useState({
//     name: 'John Doe',
//     currentlyReading: [
//       { title: 'Book 1', author: 'Author 1' },
//       { title: 'Book 2', author: 'Author 2' },
//     ],
//     toRead: [
//       { title: 'Book 3', author: 'Author 3' },
//       { title: 'Book 4', author: 'Author 4' },
//     ],
//     friends: [
//       { name: 'Friend 1' },
//       { name: 'Friend 2' },
//     ],
//   });

//   // Add trending profile functionality here (e.g., achievements, statistics, etc.)

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Text style={styles.profileName}>{user.name}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Currently Reading</Text>
//         {user.currentlyReading.map((book, index) => (
//           <View key={index} style={styles.bookItem}>
//             <Text style={styles.bookTitle}>{book.title}</Text>
//             <Text style={styles.bookAuthor}>{book.author}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>To Read</Text>
//         {user.toRead.map((book, index) => (
//           <View key={index} style={styles.bookItem}>
//             <Text style={styles.bookTitle}>{book.title}</Text>
//             <Text style={styles.bookAuthor}>{book.author}</Text>
//           </View>
//         ))}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Friends</Text>
//         {user.friends.map((friend, index) => (
//           <TouchableOpacity key={index} style={styles.friendItem}>
//             <Text style={styles.friendName}>{friend.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     padding: 20,
//   },
//   profileName: {
//     fontSize: 20,
//     marginTop: 10,
//   },
//   section: {
//     margin: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   bookItem: {
//     marginBottom: 10,
//   },
//   bookTitle: {
//     fontSize: 16,
//   },
//   bookAuthor: {
//     fontSize: 14,
//     color: '#888',
//   },
//   friendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   friendName: {
//     fontSize: 16,
//     marginLeft: 10,
//   },
// });

// export default ProfilePage;
