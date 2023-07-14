import * as React from 'react';
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('screen');


const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF'];
const DATA = [
  {
    "key": "3571572",
    "title": "Multi-lateral intermediate moratorium",
    "description": "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
    "image": require("./assets/boombox.png")
  },
  {
    "key": "3571747",
    "title": "Automated radical data-warehouse",
    "description": "Use the optical SAS system, then you can navigate the auxiliary alarm!",
    "image": require("./assets/earrings.png")
  },
  {
    "key": "3571680",
    "title": "Inverse attitude-oriented system engine",
    "description": "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
    "image": require("./assets/turntable.png")
  },
  {
    "key": "3571603",
    "title": "Monitored global data-warehouse",
    "description": "We need to program the open-source IB interface!",
    "image": require("./assets/video-game.png")
  }
]

const Indicator = ({ scrollX, onPress }) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 40 }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width]
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.7, 1.5, 0.7],
          extrapolate: 'clamp'
        })
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp'
        })
        return (
          <TouchableOpacity key={`index-${i}`} onPress={() => onPress(i)}>
          <Animated.View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#333",
              marginLeft: 3,
              transform: [{
                scale,
              }],
              opacity
            }}
          />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const BackDrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs,
  })
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor
        }
      ]}
    />
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const ref = React.useRef(null)
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <BackDrop scrollX={scrollX} />
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 70 }}
        data={DATA}
        keyExtractor={item => item.key}
        scrollEventThrottle={32}
        pagingEnabled
        ref={ref}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => {
          return (
            <View style={{ width, alignItems: 'center', padding: 20 }}>
              <View style={{ flex: 0.7, justifyContent: 'center' }}>
                <Image source={item.image} style={styles.images} />
              </View>
              <View>
                <Text style={{ fontSize: 27, color: '#FFF', fontWeight: 500 }}>{item.title}</Text>
                <Text>{item.description}</Text>
              </View>
            </View>
          )
        }}
      />
      <Indicator onPress={(idx) => ref.current.scrollToIndex({index: idx, animate: true})} scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    width: width / 2,
    height: height / 2,
    resizeMode: "contain",
  },
  wrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
});