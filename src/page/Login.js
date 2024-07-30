import React, {useState, useEffect, useContext} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  Switch,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

import hinh from '../asset/hinh1.png';
import {Eye, EyeSlash} from 'iconsax-react-native';
import {AuthContext} from '../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

export default function Login() {
  const [check, setCheck] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {Login} = useContext(AuthContext);
  const navigation = useNavigation();
  useEffect(() => {
    // Reset form fields and errors when `check` changes
    setPhone('');
    setPassword('');
    setUsername('');
    setPhoneError('');
    setPasswordError('');
    setUsernameError('');
  }, [check]);

  const handleLogin = () => {
    let isValid = true;

    // Validate phone number
    if (!phone) {
      setPhoneError('Số điện thoại không được bỏ trống.');
      isValid = false;
    } else if (!/^[0][0-9]{9}$/.test(phone)) {
      setPhoneError('Số điện thoại phải bắt đầu từ 0 và có 10 số.');
      isValid = false;
    } else {
      setPhoneError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Mật khẩu không được bỏ trống.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate username if check is true
    if (check && !username) {
      setUsernameError('Tên người dùng không được bỏ trống.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (isValid) {
      // Proceed with form submission
      // Example: console.log('Form Submitted', { phone, password, username });
    }
  };

  return (
    <ImageBackground
      source={hinh}
      className="flex-1 justify-center items-center"
      resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full h-full">
        <SafeAreaView className="flex-1 justify-center items-center ">
          <View className="w-4/5 p-6 bg-white bg-opacity-80 rounded-lg">
            <Text className="text-2xl uppercase font-semibold text-center mb-4 text-cyan-400">
              {check === false
                ? 'Đăng Nhập Bằng Tài Khoản Của Bạn'
                : 'Đăng Ký để đăng nhập'}
            </Text>
            <View className="flex-col justify-between items-center mb-4">
              <Switch value={check} onValueChange={value => setCheck(value)} />
              <Text
                className={`text-lg ${
                  check === false ? 'text-blue-500' : 'text-green-500'
                }`}>
                {check === true ? 'Đăng Ký' : 'Đăng Nhập'}
              </Text>
            </View>
            {check === false ? (
              <View>
                <TextInput
                  label="Số Điện Thoại"
                  value={phone}
                  onChangeText={text => setPhone(text)}
                  className="bg-white  border border-gray-300 w-full"
                  error={!!phoneError}
                />
                <Text className="text-red-500">{phoneError}</Text>
                <View className="flex-row items-center my-2">
                  <TextInput
                    label="Mật Khẩu"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    className="bg-white border border-gray-300 w-full"
                    error={!!passwordError}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-0 mt-2 mr-2">
                    {showPassword ? (
                      <EyeSlash size={28} color="#121212" />
                    ) : (
                      <Eye size={28} color="#121212" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text className="text-red-500">{passwordError}</Text>
                <Button
                  onPress={() => {
                    Login(phone, password);
                    navigation.navigate('Trang chủ');
                  }}
                  mode="elevated"
                  className=" p-2 my-4 mx-11 ">
                  <Text className="text-[#121212] text-center">Đăng Nhập</Text>
                </Button>
              </View>
            ) : (
              <View>
                <TextInput
                  label="Nhập tên người dùng"
                  value={username}
                  onChangeText={text => setUsername(text)}
                  className="bg-white border border-gray-300 w-full"
                  error={!!usernameError}
                />
                <Text className="text-red-500">{usernameError}</Text>
                <TextInput
                  label="Số Điện Thoại"
                  value={phone}
                  onChangeText={text => setPhone(text)}
                  className="bg-white border border-gray-300 w-full"
                  error={!!phoneError}
                />
                <Text className="text-red-500">{phoneError}</Text>
                <View className="flex-row items-center my-2">
                  <TextInput
                    label="Mật Khẩu"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    className="bg-white border border-gray-300 w-full "
                    error={!!passwordError}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-0 mt-2 mr-2">
                    {showPassword ? (
                      <EyeSlash size={28} color="#121212" />
                    ) : (
                      <Eye size={28} color="#121212" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text className="text-red-500">{passwordError} </Text>

                <Button
                  mode="elevated"
                  className=" p-2 mx-11 my-4 "
                  onPress={handleLogin}>
                  <Text className="text-[#121212] text-center">Đăng Ký</Text>
                </Button>
              </View>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
