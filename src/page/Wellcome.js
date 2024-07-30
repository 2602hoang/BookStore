import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ImageBackground, SafeAreaView, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import background from '../asset/background.png'; // Ensure this path is correct
import {ArrowRight, Location} from 'iconsax-react-native';

export default function Wellcome() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="w-full h-full flex-1 bg-[#241f32]">
      <ImageBackground
        source={background}
        className="flex-1 justify-center items-center w-full h-full " // Adjusted height to fit half of the screen and added rounded bottom corners
        resizeMode="cover">
        {/* <Text className="text-3xl font-bold text-white">
          Chào Mừng Đến Nhà Sách
        </Text> */}
      </ImageBackground>
      <View className="flex-1 justify-start space-y-4 mt-7 items-center w-full h-1/2 ">
        <Text className="text-indigo-600 text-3xl font-extrabold text-center shadow-inner">
          Hãy để chúng tôi giúp bạn khám phá thế giới tri thức qua từng trang
          sách
        </Text>
        <Text className="flex flex-row items-center justify-between text-[#ffffff] text-[16px]">
          <Location size="22" color="#fff" />
          CN 1:xx đường Nguyễn huệ, quận 1, tp. Hồ Chí Minh
        </Text>
        <Text className="flex flex-row items-center justify-center text-[#ffffff] text-[16px]">
          <Location size="22" color="#fff" />
          CN 2:xx đường Hai Bà Trưng, quận Ba Đình, tp. Hà Nội
        </Text>
        <Text className="text-[#ffffff] text-[13px]">
          Liên hệ với chúng tôi +84 123 456 789
        </Text>

        <View className="flex-1 justify-end mb-14  items-center w-full h-1/3">
          <Button
            className="w-1/2 flex-row self-center text-[#ffffff]"
            mode="elevated"
            onPress={() => {
              navigation.navigate('Login');
            }}
            icon={() => <ArrowRight size="20" color="#121212" />}>
            <Text className="text-[#121212]"> Đến Trang đăng nhập</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
