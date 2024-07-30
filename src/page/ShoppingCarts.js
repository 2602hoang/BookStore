import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {AuthContext} from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/AntDesign';
import {formatCurrency} from '../untils';
// import {useNavigation} from '@react-navigation/native';
import {URL} from '../contexts/Url';
import axios from 'axios';
import {Button} from 'react-native-paper';
import {AddCircle, MinusCirlce} from 'iconsax-react-native';

function ShoppingCarts() {
  const {cart, removeFromCart, addToCart, clearCart, userId} =
    useContext(AuthContext);
  const [notes, setNotes] = useState('');

  const createOrders = async () => {
    const orderItemsMap = new Map();

    cart.forEach(product => {
      const id_product = product.id_product;
      const qty = countItemsById(id_product);

      if (orderItemsMap.has(id_product)) {
        orderItemsMap.set(id_product, qty);
      } else {
        orderItemsMap.set(id_product, qty);
      }
    });

    const orderItems = Array.from(orderItemsMap, ([id_product, qty]) => ({
      id_product,
      qty,
    }));
    const id_pay = 7;
    const id_adress = 4;

    const orderData = {
      id_user: userId,
      id_pay: id_pay,
      id_adress: id_adress,
      notes: notes,
      status: 0,
      date_order: new Date().toISOString(),
      orderItems,
    };

    try {
      await axios.post(`${URL}api/v1/order/add`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      clearCart(userId);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.stock) {
        const {stock} = error.response.data;
        Alert.alert(
          'Đã xảy ra lỗi!',
          `Số lượng đặt vượt quá số lượng hiện có là ${stock}. Vui lòng điều chỉnh lại số lượng đặt`,
        );
      } else {
        Alert.alert(
          'Đã xảy ra lỗi!',
          'Có lỗi xảy ra khi thực hiện đặt hàng. Vui lòng thử lại sau.',
        );
      }
    }
  };

  const countItemsById = id_product => {
    let count = 0;
    cart.forEach(item => {
      if (item.id_product === id_product) {
        count++;
      }
    });
    return count;
  };

  return cart.length === 0 ? (
    <View className="flex-1 bg-[#241f32] justify-center items-center">
      <Text className="text-white font-black text-3xl text-center">Không có sách trong giỏ hàng</Text>
    </View>
  ) : (
    <ScrollView className="flex-1 bg-[#241f32]">
      {cart.map((product, index) => {
        const showName =
          index ===
          cart.findIndex(
            cartItem => cartItem.id_product === product.id_product,
          );

        if (!showName) {
          return null;
        }

        return (
          <View
            key={product.id_product}
            className="flex-row gap-2 m-2 bg-[#241f32] text-[#fff] rounded-3xl border border-[#fff] p-2">
            <View className="flex-row">
              <Image source={{uri: product.images}} className="w-28 h-32" />
              <View className="flex-col ml-4 space-y-2">
                <Text className="text-[#fff] font-bold max-w-[90px]">
                  {product.name}
                </Text>
                <View className="flex-row items-center space-x-1">
                  <TouchableOpacity
                    onPress={() => removeFromCart(product)}
                    title="Giảm">
                    <MinusCirlce size="32" color="#FF8A65" />
                  </TouchableOpacity>

                  <TextInput
                    value={`SL: ${countItemsById(product.id_product)}`}
                    editable={false}
                    className=" text-center w-16 text-white"
                  />

                  <TouchableOpacity
                    onPress={() => addToCart(product)}
                    title="Thêm">
                    <AddCircle size="32" color="#FF8A65" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex-col items-end justify-between ml-6">
              <Text className="text-[#fff]">
                ĐG: {formatCurrency(product.price)}
              </Text>
              {product.discoust !== 0 && <Text>{product.discoust} %</Text>}
              <Text className="text-[#fff]">
                TT:{' '}
                {formatCurrency(
                  countItemsById(product.id_product) * product.price -
                    (countItemsById(product.id_product) *
                      product.price *
                      product.discoust) /
                      100,
                )}
              </Text>
            </View>
          </View>
        );
      })}
      <View className="m-2 items-center space-y-3">
        {cart.reduce((total, item) => total + item.price, 0) > 0 ? (
          <Text className="self-end text-[#fff] font-bold text-end">
            {' '}
            Tổng tiền hóa đơn:{' '}
            {formatCurrency(
              cart.reduce((total, item) => total + item.price, 0),
            )}
          </Text>
        ) : (
          <Text></Text>
        )}
        <TextInput
          className="w-4/5 border  border-[#fff] p-3 text-[#fff] rounded-3xl h-24" // Tailwind classes
          placeholder="Ghi chú"
          multiline
          numberOfLines={4} // Adjust this number as needed
          value={notes}
          onChangeText={text => setNotes(text)}
          textAlignVertical="top" // Ensures the text starts at the top
        />

        <Button
          className="w-1/2 border-2 border-[#fff] "
          mode="contained"
          onPress={createOrders}>
          Đặt hàng
        </Button>
      </View>
    </ScrollView>
  );
}

export default ShoppingCarts;
