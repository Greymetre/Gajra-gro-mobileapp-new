import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import appTheme from '../utils/appTheme';

/**
 * Floating bottom navigation: a white rounded bar hovering above the screen.
 * The active tab's icon sits in a gold bubble raised above the bar, which
 * slides to the tapped tab. Icons/labels come from each screen's options.
 *
 * It floats over the content, so scrollable screens need ~TAB_BAR_SPACE of
 * bottom padding to keep their last item visible.
 */
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_SPACE = 110;

const BUBBLE_SIZE = 50;
// How far the bubble pokes out above the bar.
const BUBBLE_RAISE = 18;
const INACTIVE = '#9A9A9A';

const CustomTabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  // Replaces tabBarHideOnKeyboard, which a custom tab bar has to do itself.
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const [barWidth, setBarWidth] = useState(0);
  const itemWidth = barWidth / state.routes.length;

  // Slide the bubble to the active tab, with a small "pop" when it lands.
  const position = useRef(new Animated.Value(state.index)).current;
  const pop = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: state.index,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
      Animated.sequence([
        Animated.timing(pop, { toValue: 0.85, duration: 90, useNativeDriver: true }),
        Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }),
      ]),
    ]).start();
  }, [state.index, position, pop]);

  if (keyboardVisible && Platform.OS === 'android') {
    return null;
  }

  const activeOptions = descriptors[state.routes[state.index].key].options;

  return (
    // Sit just above the iPhone home indicator; phones without one get a small gap.
    <View
      style={[styles.wrapper, { bottom: insets.bottom > 0 ? insets.bottom - 6 : 12 }]}
      pointerEvents="box-none">
      <View
        style={styles.bar}
        onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}>
        {barWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bubble,
              {
                transform: [
                  {
                    translateX: position.interpolate({
                      inputRange: state.routes.map((_, i) => i),
                      outputRange: state.routes.map(
                        (_, i) => i * itemWidth + (itemWidth - BUBBLE_SIZE) / 2,
                      ),
                    }),
                  },
                  { scale: pop },
                ],
              },
            ]}>
            {activeOptions.tabBarIcon?.({
              focused: true,
              color: appTheme.DARK_BOTTOMTAB,
              size: 24,
            })}
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const label = typeof options.title === 'string' ? options.title : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              style={styles.item}>
              {/* The active icon is drawn in the bubble; keep the slot so labels line up. */}
              <View style={[styles.iconSlot, focused && styles.iconSlotHidden]}>
                {options.tabBarIcon?.({ focused, color: INACTIVE, size: 22 })}
              </View>
              <Text numberOfLines={1} style={[styles.label, focused && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  bar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 14,
  },
  bubble: {
    position: 'absolute',
    top: -BUBBLE_RAISE,
    left: 0,
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: appTheme.NEW_PALLET,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9962F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  iconSlot: {
    height: 26,
    justifyContent: 'center',
  },
  iconSlotHidden: {
    opacity: 0,
  },
  label: {
    marginTop: 4,
    fontSize: 10.5,
    color: INACTIVE,
    fontWeight: '500',
  },
  labelActive: {
    color: appTheme.DARK_BOTTOMTAB,
    fontWeight: '700',
  },
});
