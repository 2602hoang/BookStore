import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  DrawerLayoutAndroid,
} from 'react-native';
import {URL} from '../contexts/Url';
import {AuthContext} from '../contexts/AuthContext';
import axios from 'axios';
import {
  Badge,
  Card,
  Modal,
  Provider,
  TextInput,
  Tooltip,
} from 'react-native-paper';
import {formatCurrency} from '../untils';
import FilterDrawer from '../component/FilterDrawer';
import {
  ArrowCircleRight,
  CloseCircle,
  FilterSearch,
  SearchNormal1,
  ShoppingCart,
} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';

function Books() {
  const navigation = useNavigation();
  const {userToken, addToCart, cart} = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    brand: null,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerRef = useRef(null);

  const showModal = async id_product => {
    try {
      const response = await axios.get(
        `${URL}api/v1/product/getone/${id_product}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      setSelectedProduct(response.data);
      setVisible(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const hideModal = () => {
    setVisible(false);
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${URL}api/v1/product/getall`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const showDrawer = () => {
    drawerRef.current.openDrawer();
  };

  useEffect(() => {
    getProducts();
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getProducts().then(() => setRefreshing(false));
  });

  const handleSearch = text => {
    setSearchQuery(text);
  };

  const handleFilterChange = (type, id) => {
    if (type === 'clear') {
      setSelectedFilters({
        category: null,
        brand: null,
      });
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        [type]: id,
      }));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      !selectedFilters.category ||
      product.category.id_category === selectedFilters.category;
    const matchesBrand =
      !selectedFilters.brand ||
      product.brand.id_brand === selectedFilters.brand;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const handleAddToCart = product => {
    if (product) {
      addToCart(product);
      Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng.');
      hideModal();
    }
  };

  const renderItem = ({item}) => (
    <View key={item.id_product} className="w-full">
      <View className="flex-row items-center border-2 rounded-xl p-4 border-gray-200 m-2">
        <View className="ml-4 flex-row">
          <View>
            <Card className="w-16 h-16">
              <Card.Cover
                className="w-16 h-16"
                source={{uri: item.images}}
                resizeMode="cover"
              />
            </Card>
          </View>
          <View className="ml-4 mr-4">
            <Text className="text-white max-w-[180px] flex-wrap">
              {item.name}
            </Text>
            <Text className="text-[#eab308]">
              Giá: {formatCurrency(item.price)}
            </Text>
            <Text className="text-white">SL: {item.stock}</Text>
          </View>
        </View>

        <View className="ml-auto space-y-4 justify-end items-end">
          <Tooltip title="Xem chi tiết">
            <TouchableOpacity
              className="flex-row items-center space-x-1"
              onPress={() => showModal(item.id_product)}>
              <Text className="text-white">Chi tiết</Text>
              <ArrowCircleRight size="20" color="#fff" variant="Outline" />
            </TouchableOpacity>
          </Tooltip>
          <Tooltip title="Thêm vào giỏ hàng">
            <TouchableOpacity
              className="bg-[#5e85ed] rounded-2xl p-2"
              onPress={() => handleAddToCart(item)}>
              <Text className="text-white">Thêm Giỏ Hàng</Text>
            </TouchableOpacity>
          </Tooltip>
        </View>
      </View>
    </View>
  );

  return (
    <Provider>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <DrawerLayoutAndroid
          drawerWidth={300}
          drawerPosition="left"
          ref={drawerRef}
          renderNavigationView={() => (
            <FilterDrawer
              onFilterChange={handleFilterChange}
              drawerRef={drawerRef}
              isDrawerOpen={isDrawerOpen}
            />
          )}
          onDrawerOpen={() => setIsDrawerOpen(true)}
          onDrawerClose={() => setIsDrawerOpen(false)}>
          <View className="w-full h-full flex-1 bg-[#241f32] items-center space-y-2">
            <View className="w-full flex-row h-[8%] bg-[#241f32] items-center px-2">
              <Tooltip title="Lọc">
                <TouchableOpacity
                  className="w-[10%]"
                  onPress={showDrawer}
                  disabled={visible}>
                  <FilterSearch size="40" color="#fff" variant="TwoTone" />
                </TouchableOpacity>
              </Tooltip>
              <View className="w-[80%] relative">
                <TextInput
                  mode="flat"
                  label="Tìm sách"
                  placeholder="Nhập tên sách cần tìm ..."
                  className="w-full bg-white rounded-3xl pl-2"
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
                <View className="absolute h-full right-0 pr-2 pt-3 self-center">
                  <SearchNormal1 size={30} color="#121212" />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Giỏ Hàng')}
                className="w-[10%] self-center flex-col">
                <Badge className="right-0">{cart.length} </Badge>
                <Tooltip title="Xem giỏ hàng">
                  <ShoppingCart size="35" color="#fff" variant="TwoTone" />
                </Tooltip>
              </TouchableOpacity>
            </View>
            {filteredProducts.length === 0 ? (
              <View className="w-full h-full flex-1 bg-[#241f32] items-center justify-center">
                <Text className="text-white font-black text-xl text-center">
                  (Không có dữ liệu)
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                numColumns={1}
                keyExtractor={item => item.id_product.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
            <Modal
              visible={visible}
              onDismiss={hideModal}
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 10,
                width: '90%',
                alignSelf: 'center',
                maxHeight: '80%',
              }}>
              {selectedProduct && (
                <ScrollView>
                  <View className="flex-1 justify-start items-start">
                    <View className="w-full flex-row justify-end mb-2 relative">
                      <TouchableOpacity
                        onPress={hideModal}
                        className="self-end">
                        <CloseCircle
                          size="32"
                          color="#121212"
                          variant="Outline"
                        />
                      </TouchableOpacity>
                    </View>
                    <Card className="w-full bg-white flex-col">
                      <Card.Cover
                        className="w-32 h-40 self-center mt-4"
                        source={{uri: selectedProduct.images}}
                        resizeMode="cover"
                      />
                      <Card.Title
                        title={selectedProduct.name}
                        subtitle={`Giá: ${formatCurrency(
                          selectedProduct.price,
                        )} giảm giá: ${selectedProduct.discoust} %`}
                        // eslint-disable-next-line react-native/no-inline-styles
                        titleStyle={{
                          color: '#121212',
                          fontSize: 24,
                          flexWrap: 'wrap',
                          width: '80%',
                          fontWeight: 'bold',
                        }}
                        // eslint-disable-next-line react-native/no-inline-styles
                        subtitleStyle={{
                          color: '#eab308',
                          fontSize: 16,
                          flexWrap: 'wrap',
                          fontStyle: 'italic',
                        }}
                        titleNumberOfLines={2}
                        subtitleNumberOfLines={2}
                      />
                      <Card.Content className="flex-col space-y-5 mt-6">
                        <Text className="text-[#121212] text-sm font-medium">
                          Thể Loại: {selectedProduct.category.name}
                        </Text>
                        <Text className="text-[#121212] text-sm font-medium">
                          Quốc Gia: {selectedProduct.brand.name}
                        </Text>
                        <Text className="text-[#121212] text-sm font-medium">
                          Mô tả: {selectedProduct.description}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleAddToCart(selectedProduct)}
                          className="w-auto self-center p-2 bg-[#5e85ed] mt-1 rounded-2xl">
                          <Text className="text-white">Thêm giỏ hàng</Text>
                        </TouchableOpacity>
                      </Card.Content>
                    </Card>
                  </View>
                </ScrollView>
              )}
            </Modal>
          </View>
        </DrawerLayoutAndroid>
      </KeyboardAvoidingView>
    </Provider>
  );
}

export default Books;
