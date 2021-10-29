import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Restaurants from './Restaurants';
import Reservations from './Reservations';
import RestaurantDetails from './RestaurantDetails';

export default function RestaurantsNavigator({ navigation, user }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Restaurantes" >
            <Stack.Screen name="Restaurantes" options={{ title: "Restaurantes" }}  >
                {(props)=><Restaurants {...props} user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="Reservar" options={{ title: "Reservar" }} >
            {(props)=><Reservations {...props}user={user}/>}
            </Stack.Screen>
            <Stack.Screen name="Detalles" options={{ title: "Detalles" }} >
            {(props)=><RestaurantDetails {...props} user={user}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
}