import {
  ArrowCircleLeft,
  BackSquare,
  Pause,
  Play,
  Screenmirroring,
} from 'iconsax-react-native';
import React, {useRef, useState} from 'react';
import {Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Video from 'react-native-video';

function VideoWeb({hideModal}) {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [lastPress, setLastPress] = useState(0);
  const handlePauseToggle = () => {
    setPaused(!paused);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDoublePress = () => {
    handleToggleFullscreen();
  };

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // Double tap delay (ms)

    if (now - lastPress < DOUBLE_PRESS_DELAY) {
      handleDoublePress();
    } else {
      handlePauseToggle(); // Pause or play video on single press
    }
    setLastPress(now);
    handleShowControls(); // Show controls on press
  };

  const handleShowControls = () => {
    setShowControls(true);
    // Hide controls after 3 seconds of inactivity
    setTimeout(() => setShowControls(false), 3000);
  };
  return (
    <View
      className={`flex  ${
        isFullscreen ? 'w-full h-[100%]' : 'w-[100%] h-[100%]'
      }`}>
      <View className="flex h-[10%]">
        <TouchableOpacity className="flex flex-row items-center space-x-1" onPress={() => hideModal()}>
          <ArrowCircleLeft size="30" color="#fff" variant="Outline" />
          <Text className="text-white">Thoát</Text>
        </TouchableOpacity>
        
      </View>
      <TouchableWithoutFeedback
        className="flex h-70% w-full"
        onPress={handlePress}
        onTouchStart={handleShowControls}>
        <View
          className={`relative flex self-center border-2 border-white ${
            isFullscreen ? 'h-[100%] w-full' : 'h-[30%] w-[100%]'
          }`}>
          <Video
            ref={videoRef}
            source={{
              uri: 'https://res.cloudinary.com/dzldyflpv/video/upload/v1721538469/AD6AC114-004E-4FC2-890D-3C387647C9DE_online-video-cutter.com_z4q3gm.mp4',
            }}
            rate={1.0}
            volume={1.0}
            muted={false}
            resizeMode="cover"
            repeat={true}
            paused={paused}
            className="absolute w-full h-full"
          />
          {showControls && (
            <>
              <TouchableOpacity
                onPress={handlePauseToggle}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-3 rounded-full">
                {paused ? (
                  <Play size="20" color="#ffffff" />
                ) : (
                  <Pause size="20" color="#ffffff" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleToggleFullscreen}
                className="absolute bottom-0 right-0 p-3 rounded-full">
                <Screenmirroring size="32" color="#fff" variant="Bold" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View>
      <Text className="text-white font-bold text-center mt-5">
          Xoay Ngang màn hình để xem chất lượng tốt hơn
        </Text>
      </View>
      
    </View>
  );
}

export default VideoWeb;
