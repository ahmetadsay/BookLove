import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
    return (
        <View style={styles.navbar}>
            <Ionicons name="person-outline" size={32} color="black" />
            <Ionicons name="search-outline" size={32} color="black" />
            <Ionicons name="add-circle-outline" size={48} color="black" />
            <Ionicons name="book-outline" size={32} color="black" />
            <Ionicons name="trophy-outline" size={32} color="black" />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingHorizontal: 20,
    },

});

export default Navbar;
