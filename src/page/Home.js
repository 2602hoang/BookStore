import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Modal, Portal, Provider, TextInput} from 'react-native-paper';
import axios from 'axios';
import {formatPhoneNumber, formattedTimestamp} from '../untils';
import {AuthContext} from '../contexts/AuthContext';
import {DirectRight, PenAdd, VideoPlay} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import VideoWeb from '../component/VideoWeb';

// Function to group comments by phone number and aggregate them
const groupAndAggregateComments = comments => {
  return comments.reduce((acc, comment) => {
    const phone = formatPhoneNumber(comment.phone); // Group by formatted phone number
    if (!acc[phone]) {
      acc[phone] = {
        username: comment.username,
        avatar: comment.avatar,
        role_id: comment.role_id,
        comments: [
          {
            text: comment.comments,
            time: comment.time,
          },
        ], // Initialize with the first comment
      };
    } else {
      // Append new comment to the existing array
      acc[phone].comments.push({
        text: comment.comments,
        time: comment.time,
      });
    }
    return acc;
  }, {});
};

function Home() {
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const {user} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const getComments = async () => {
    try {
      const response = await axios.get(
        'https://script.google.com/macros/s/AKfycbydSozckobcJ_OtKWPhPTb03p16TzhT4WgQRomL0dcA2aESErX4loOb0gmbIuvgBP7xPw/exec',
      );
      const data = response.data;
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const handleComment = async () => {
    const data = {
      username: user.username,
      avatar: user.avatar,
      phone: user.phone,
      role_id:
        user.id_role === 123
          ? 'Quản trị'
          : user.id_role === 124
          ? 'Nhân Viên'
          : 'Khách Hàng',
      comments: commentInput,
      time: new Date().toISOString(),
    };

    try {
      await axios.post(
        'https://script.google.com/macros/s/AKfycbydSozckobcJ_OtKWPhPTb03p16TzhT4WgQRomL0dcA2aESErX4loOb0gmbIuvgBP7xPw/exec',
        data,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );
      Alert.alert('Thành Công', 'Cảm ơn bạn đã góp ý!');
      setCommentInput('');
      getComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getComments().then(() => setRefreshing(false));
    }, 100);
  }, []);

  // Group and aggregate comments by phone number
  const groupedComments = groupAndAggregateComments(comments);
  // console.log(groupedComments);
  const renderCommentItem = (phone, userComment) => (
    <View key={phone} className="bg-[#121212] p-4 m-2 rounded-xl flex-col">
      <View className="flex flex-row space-x-2 items-center">
        <Avatar.Image size={30} source={{uri: userComment.avatar}} />
        <Text className="text-[#fff] font-bold text-lg">
          {userComment.username}
        </Text>
        <Text className="text-[#fff]">({userComment.role_id})</Text>
      </View>
      <Text className="text-[#fff]">XXXX-XXX-{phone}</Text>

      <View>
        {userComment.comments.map((comment, index) => (
          <View key={index} className="mb-2">
            <Text className="text-[#fff] text-sm">
              Bình luận {index + 1}: {'\t'} {comment.text}
            </Text>
            <Text className="text-[#fff] text-xs">
              {formattedTimestamp(comment.time)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Provider>
      <KeyboardAvoidingView
        className="flex-1 bg-[#241f32]"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust the offset as needed
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{flexGrow: 1}}>
          <View className="w-full h-[10%] bg-[#241f32] items-center px-2 mt-2">
            <TouchableOpacity
              onPress={() => showModal()}
              className="w-auto justify-center items-center p-2  mt-4 rounded-2xl">
              <VideoPlay size={40} color="#fff" />
              <Text className="text-[#fff] font-bold text-lg">
                Xem website shop
              </Text>
            </TouchableOpacity>
          </View>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              className="w-full h-full bg-black">
              <VideoWeb hideModal={hideModal} />
            </Modal>
          </Portal>
          <View className="flex-1">
            <View className="w-full relative mt-2 rounded-[30px] justify-center items-center p-4 space-y-5">
              <TouchableOpacity
                onPress={() => navigation.navigate('Thư Viện')}
                className="w-auto self-center p-2 bg-[#5e85ed] mt-4 rounded-2xl">
                <Text className="text-white font-bold text-xl text-center uppercase">
                  Hãy tìm kiếm sách phù hợp
                </Text>
              </TouchableOpacity>
              <TextInput
                label="Để lại nhận xét về Sách"
                multiline
                numberOfLines={4}
                placeholder="Nhập bình luận của bạn ở đây..."
                value={commentInput}
                onChangeText={setCommentInput}
                className="bg-[#fff] w-full rounded-3xl"
              />
              <TouchableOpacity
                onPress={() => handleComment()}
                className="w-auto self-center bg-[#cfe887] p-2 flex-row space-x-2 mt-4 rounded-2xl">
                <Text className="text-white text-center uppercase font-bold">
                  Bình luận
                </Text>
                <DirectRight size="20" color="#ffffff" />
              </TouchableOpacity>
            </View>
            {Object.entries(groupedComments).map(([phone, userComment]) =>
              renderCommentItem(phone, userComment),
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
}

export default Home;
