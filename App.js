import React from 'react';
import LogIn from './views/LogIn';
import SignUp from './views/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PagosNavigator from './views/PagosNavigator';
import Reservaciones from './views/Reservaciones';
import RestaurantsNavigator from './views/RestaurantsNavigator';
import ProfileNavigator from './views/ProfileNavigator';
import Loading from './views/Loading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './context';
import axios from 'axios';
import Orders from './views/Orders';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  const initialLoginState = {
    isLoading: true,
    token: null
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          token: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    logIn: async (token) => {
      try {
        await AsyncStorage.setItem('token', token);
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', token);
      dispatch({ type: 'LOGIN',  token: token });
    },
    logOut: async () => {
      try {
        await AsyncStorage.removeItem('token');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    

  }), []);

  React.useEffect(() => {
    setTimeout(async () => {
      let token
      token = null
      try {
        token = await AsyncStorage.getItem('token');
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: token });
    },0)
  }, []);
  if (loginState.isLoading) {
    return (
      <Loading />
    )
  }


  return (
    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        {loginState.token !== null ? (
          <Tab.Navigator
          screenOptions={{
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#fc6c27",
            tabBarInactiveTintColor: "black"
          }}>
            <Tab.Screen name="RestaurantsNavigator" component={RestaurantsNavigator} options={{
              title: "Restaurantes",
              tabBarShowLabel: false,
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="store" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="Reservations" component={Reservaciones} options={{
              title: "Reservaciones",
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="calendar" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="Ordenes" component={Orders} options={{
              title: "Ordenes",
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="restaurant" color={color} size={size} />
              ),
            }} />
            
            <Tab.Screen name="PagosNavigator" component={PagosNavigator} options={{
              title: "Pagos New",
              tabBarShowLabel: false,
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="money" color={color} size={size} />
              ),
            }} />
            <Tab.Screen name="ProfileNavigator" component={ProfileNavigator} options={{
              title: "Perfil",
              tabBarShowLabel: false,
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" color={color} size={size} />
              ),
            }} />
          </Tab.Navigator>
        )
          :
          <Stack.Navigator initialRouteName="LogIn">
            <Stack.Screen name="LogIn" component={LogIn}
              initialParams={{ setLoggedIn: 42 }}
              options={{ title: 'Press2Eat' }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Crear cuenta' }} />
          </Stack.Navigator>
        }

      </NavigationContainer>
    </AuthContext.Provider>
  )


}

