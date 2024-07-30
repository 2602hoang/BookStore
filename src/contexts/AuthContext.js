import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URL} from './Url';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const addToken = token => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const getUser = async () => {
    if (!userId || !userToken) return;
    try {
      const response = await axios.get(`${URL}api/v1/user/getone/${userId}`, {
        headers: {Authorization: `Bearer ${userToken}`},
      });
      setUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 401) Logouts();
      else console.error('Error fetching user:', error);
    }
  };

  const loadUserVerified = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userId');
      if (token) {
        setUserToken(token);
        setUserId(id ? parseInt(id, 10) : null);
        addToken(token);
      }
    } catch (error) {
      console.error('Error loading user verification:', error);
    }
  };

  const loadCart = async () => {
    if (!userId) return;
    try {
      const storedCart = await AsyncStorage.getItem(`cart_${userId}`);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToStorage = async () => {
    if (!userId || cart.length === 0) return;
    try {
      await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const addToCart = item => {
    setCart(prevCart => {
      const newCart = [...prevCart, item];
      if (userId)
        AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartQuantity = (productId, qty) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id_product === productId
          ? {...item, qty: Math.min(qty, item.stock)}
          : item,
      );
      if (userId)
        AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = item => {
    setCart(prevCart => {
      const newCart = prevCart.filter(
        cartItem => cartItem.id_product !== item.id_product,
      );
      if (userId)
        AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    if (userId) AsyncStorage.removeItem(`cart_${userId}`);
    setCart([]);
  };

  const Logouts = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userId']);
      setUserToken(null);
      setUserId(null);
      addToken(null);
      clearCart();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const Login = async (phone, password) => {
    try {
      const response = await axios.post(`${URL}api/v1/auth/login`, {
        phone,
        password,
      });
      if (response.data.mes === 'Đăng nhập thành công') {
        const {access_token: token, id_user: id} = response.data;
        await AsyncStorage.multiSet([
          ['userToken', token],
          ['userId', id.toString()],
        ]);
        setUserToken(token);
        setUserId(id);
        addToken(token);
      } else {
        console.error('Login failed:', response.data.mes);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    loadUserVerified();
  }, []);
  useEffect(() => {
    getUser();
  }, [userId, userToken]);
  useEffect(() => {
    loadCart();
  }, [userId]);
  useEffect(() => {
    saveCartToStorage();
  }, [cart, userId]);

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userId,
        Login,
        Logouts,
        user,
        getUser,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
