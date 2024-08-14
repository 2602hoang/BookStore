import React, {useContext, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Button} from 'react-native-paper';
import {AuthContext} from '../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

import {Logout, Setting2, ShoppingCart} from 'iconsax-react-native';

function Users() {
  const {Logouts, user, cart, getUser, userToken} = useContext(AuthContext);
  const navigation = useNavigation();

  // const [user, setUser] = useState(null); // Khởi tạo user là null
  // console.log(userId, userToken);
  // useEffect(() => {
  //   getUser();
  // }, [userToken]);
  // console.log(user.avatar);
  if (!user) {
    return (
      <SafeAreaView className="w-full h-full flex-1 bg-[#ffffff] items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  // #241f32
  return (
    <SafeAreaView className="w-full h-full flex-1 bg-[#241f32] items-center">
      <View className="w-full h-full flex-none items-center justify-center">
        <View className="w-2/3 h-[10%] flex-none justify-center items-center  rounded-[30px]">
          <Text className="text-2xl font-bold text-[#ffffff] text-center uppercase">
            Thông tin người dùng
          </Text>
        </View>

        <View className="w-11/12 h-[60%] space-y-4 flex-col rounded-lg p-2 shadow-sm drop-shadow-xl shadow-[#ffffff]">
          <TouchableOpacity>
            <Setting2
              size="32"
              color="#ffffff"
              variant="Outline"
              className="self-end mr-2 mt-2"
            />
          </TouchableOpacity>
          <Avatar.Image
            // className="w-1/2 self-center mt-2 h-2/6 rounded-[50px]"
            // alt="AVATAR"
            size={120}
            className="self-center mt-6"
            source={{uri: user.avatar}} // Sử dụng object với uri
          />

          <View className="w-full h-4/6 space-y-4 flex-col">
            <Text className="text-lg ml-8 font-semibold text-[#ffffff]">
              Tên:{'\t\t'} {user.username}
            </Text>
            <Text className="text-lg ml-8 font-semibold text-[#ffffff]">
              Số Điện Thoại: {user.phone}
            </Text>
            <Text className="text-lg ml-8 font-semibold text-[#ffffff]">
              Chức Vụ:{' '}
              {user.id_role === 123
                ? 'Quản Lý'
                : user.id_role === 124
                ? 'Nhân Viên'
                : 'Khách Hàng'}
            </Text>
            <Text
              className={` text-lg ml-8 font-semibold ${
                user.status === false ? 'text-green-500' : 'text-red-500'
              }`}>
              Trạng thái:{' '}
              {user.status === false ? 'Đang Hoạt Động' : 'Đang Khóa'}
            </Text>
            <Button
              className="bg-red-500 w-1/2 justify-center items-center self-center "
              onPress={() => {
                Logouts();
                navigation.navigate('Wellcome');
              }}
              icon={() => <Logout size="32" color="#fff" />}
              mode="contained">
              {/* <LogoutCurve size="32" color="#555555"/> */}
              Đăng Xuất
            </Button>
          </View>
        </View>
        <View className="w-full h-[30%] flex-row flex-none m-4 items-start  ">
          <TouchableOpacity
            onPress={() => navigation.navigate('Giỏ Hàng')}
            className="flex-col w-1/3 flex items-center justify-center  shadow-black">
            <View className="flex-col ">
              <Badge className="bg-red-500 ml-10">{cart.length}</Badge>
              <ShoppingCart size="32" color="#fff"></ShoppingCart>
            </View>
            <Text className="mt-2 text-[#fff]">Giỏ Hàng </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col w-1/3 flex items-center justify-center  shadow-black">
            <View className="flex-col ">
              <Badge className="bg-red-500 ml-10">{cart.length}</Badge>
              <ShoppingCart size="32" color="#fff"></ShoppingCart>
            </View>
            <Text className="mt-2 text-[#fff]">Xác Nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col w-1/3 flex items-center justify-center  shadow-black">
            <View className="flex-col ">
              <Badge className="bg-red-500 ml-10">{cart.length}</Badge>
              <ShoppingCart size="32" color="#fff"></ShoppingCart>
            </View>
            <Text className="mt-2 text-[#fff]">Hoàn Thành</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Users;
