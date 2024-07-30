import {NavigationContainer} from '@react-navigation/native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Book,
  Home2,
  Note,
  Profile2User,
  ShoppingBag,
  User,
} from 'iconsax-react-native';

import Login from './src/page/Login';
import Wellcome from './src/page/Wellcome';
import Home from './src/page/Home';
import Books from './src/page/Books';
import {AuthContext, AuthContextProvider} from './src/contexts/AuthContext';
import Users from './src/page/Users';
import ShoppingCarts from './src/page/ShoppingCarts';

// Tạo Tab Navigator
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarActiveBackgroundColor: '#5e85ed',
        tabBarInactiveBackgroundColor: '#241f32',
      }}>
      <Tab.Screen
        name="Trang chủ"
        component={Home}
        options={{
          animation: 'slide_from_left',
          tabBarIcon: ({color, size}) => <Home2 size="32" color="#fff" />,
        }}
      />
      <Tab.Screen
        name="Thư Viện"
        component={Books}
        options={{
          animation: 'slide_from_left',
          tabBarIcon: ({color, size}) => <Book size="32" color="#ffffff" />,
        }}
      />

      <Tab.Screen
        name="Tôi"
        component={Users}
        options={{
          animation: 'slide_from_right',
          tabBarIcon: ({color, size}) => <User size="32" color="#fff" />,
        }}
      />
    </Tab.Navigator>
  );
}

// Tạo Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </AuthContextProvider>
  );
}

function MainStack() {
  const {userToken} = useContext(AuthContext); // Sử dụng useContext để lấy userToken
  // console.log(userToken);
  return (
    <Stack.Navigator>
      {userToken ? (
        <>
          {/* <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: true, animation: 'slide_from_right'}}
          /> */}
          <Stack.Screen
            name="MyTabs"
            component={MyTabs}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Giỏ Hàng"
            component={ShoppingCarts}
            options={{
              headerShown: true,
              animation: 'slide_from_right',
              headerStyle: {backgroundColor: '#5e85ed'},
              headerTintColor: '#fff', // Adjust text color if necessary
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Wellcome"
            component={Wellcome}
            options={{headerShown: false, animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false, animation: 'slide_from_right'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
