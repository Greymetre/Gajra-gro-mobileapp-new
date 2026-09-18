import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  /** Pause between two sweeps, in ms. */
  interval?: number;
  /** How long one sweep across the card takes, in ms. */
  duration?: number;
}

const SHINE_WIDTH = 40;

/**
 * A soft diagonal light streak that sweeps across its parent now and then,
 * like light catching a card. Place it inside a container with
 * `overflow: 'hidden'`.
 */
const ShineOverlay = ({ interval = 1500, duration = 2600 }: Props) => {
  const [width, setWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!width) {
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(interval),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [width, progress, duration, interval]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHINE_WIDTH * 3, width + SHINE_WIDTH * 2],
  });

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View
        style={[styles.streak, { transform: [{ translateX }, { rotate: '18deg' }] }]}>
        {/* Soft edges fading into a gentle white highlight in the middle. */}
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.12)',
            'rgba(255,255,255,0.38)',
            'rgba(255,255,255,0.12)',
            'rgba(255,255,255,0)',
          ]}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export default ShineOverlay;

const styles = StyleSheet.create({
  streak: {
    position: 'absolute',
    top: '-50%',
    height: '200%',
    width: SHINE_WIDTH,
  },
});
