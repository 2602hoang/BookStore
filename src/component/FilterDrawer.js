import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {URL} from '../contexts/Url';
import axios from 'axios';
import {AuthContext} from '../contexts/AuthContext';

function FilterDrawer({onFilterChange, drawerRef}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const {userToken} = useContext(AuthContext);
  const getBrands = async () => {
    try {
      const response = await axios.get(`${URL}api/v1/brand/getall`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${URL}api/v1/category/getall`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  useEffect(() => {
    getBrands();
    getCategories();
  }, [userToken]);

  const categoryMap = new Map(
    categories.map(category => [category.id_category, category.name]),
  );
  const brandMap = new Map(brands.map(brand => [brand.id_brand, brand.name]));

  const handleFilterChange = (type, id) => {
    if (type === 'clear') {
      setSelectedCategory(null);
      setSelectedBrand(null);
      onFilterChange('clear');
    } else {
      if (type === 'category') {
        setSelectedCategory(id);
      } else if (type === 'brand') {
        setSelectedBrand(id);
      }
      onFilterChange(type, id);
    }

    let name;
    if (type === 'category') {
      name = categoryMap.get(id);
    } else if (type === 'brand') {
      name = brandMap.get(id);
    } else {
      name = 'tất cả thể loại và quốc gia';
    }

    if (drawerRef.current) {
      drawerRef.current.closeDrawer();
    }

    if (name) {
      Alert.alert('Đã Tìm Thấy', `Sách ${name}`);
    }
  };

  return (
    <ScrollView className="p-4 bg-gray-100">
      {/* "Show All" Button */}
      <TouchableOpacity
        className={`p-2 ${
          !selectedCategory && !selectedBrand ? 'bg-black' : 'bg-blue-500'
        } rounded-md mb-4`}
        onPress={() => handleFilterChange('clear')}>
        <Text className="text-white text-center text-lg font-semibold">
          Tất cả
        </Text>
      </TouchableOpacity>

      {/* Categories Section */}
      <View className="mb-4 space-y-2">
        <Text className="text-lg font-semibold mb-2 text-indigo-700">
          Thể Loại
        </Text>
        <TouchableOpacity
          className={`p-2 border-b rounded-xl border-gray-300 ${
            selectedCategory === null ? 'bg-black' : 'bg-white'
          }`}
          onPress={() => handleFilterChange('category', null)}>
          <Text
            className={`text-base text-center ${
              selectedCategory === null ? 'text-white' : 'text-black'
            }`}>
            Tất cả thể loại
          </Text>
        </TouchableOpacity>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id_category} // Ensure this ID is unique
            className={`p-2 border-b border-gray-300 rounded-3xl space-y-4 ${
              selectedCategory === category.id_category
                ? 'bg-black'
                : 'bg-white'
            }`}
            onPress={() =>
              handleFilterChange('category', category.id_category)
            }>
            <Text
              className={`text-base ml-2 ${
                selectedCategory === category.id_category
                  ? 'text-white'
                  : 'text-black'
              }`}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Brands Section */}
      <View className="mb-7 space-y-2">
        <Text className="text-lg font-semibold mb-2 text-indigo-700 ">
          Quốc Gia
        </Text>
        <TouchableOpacity
          className={`p-2 border-b border-gray-300  rounded-xl ${
            selectedBrand === null ? 'bg-black' : 'bg-white'
          }`}
          onPress={() => handleFilterChange('brand', null)}>
          <Text
            className={`text-base text-center  ${
              selectedBrand === null ? 'text-white' : 'text-black'
            }`}>
            Tất cả quốc gia
          </Text>
        </TouchableOpacity>
        {brands.map(brand => (
          <TouchableOpacity
            key={brand.id_brand} // Ensure this ID is unique
            className={`p-2 border-b border-gray-300 rounded-3xl  ${
              selectedBrand === brand.id_brand ? 'bg-black' : 'bg-white'
            }`}
            onPress={() => handleFilterChange('brand', brand.id_brand)}>
            <Text
              className={`text-base ml-2 ${
                selectedBrand === brand.id_brand ? 'text-white' : 'text-black'
              }`}>
              {brand.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default FilterDrawer;
