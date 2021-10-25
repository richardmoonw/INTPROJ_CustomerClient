import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Template({navigation}) {
     return (

        <View style={styles.container}>
           
            <Text>No puedes ver el menu porque no has hecho Check In</Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    }

});
