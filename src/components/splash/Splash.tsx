import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import appTheme from '../../utils/appTheme';
import FontFamily from '../../constants/fontFamily';
import GearShape from '../comman/GearShape';

// App.tsx shows this screen for 3 seconds; the intro below fits in that time.
const INTRO_MS = 2600;

const BIG_GEAR = 220;
const BIG_TEETH = 28;
const SMALL_GEAR = 70;
const SMALL_TEETH = 11;
const DARK = appTheme.DARK_BOTTOMTAB;

export default function Splash(props: any) {
  const logo = useRef(new Animated.Value(0)).current;
  const gears = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(appTheme.APP_BACKGROUND_COLOR, true);
    }

    const spinLoop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    spinLoop.start();
    pulseLoop.start();

    Animated.parallel([
      // Logo pops in with a small bounce.
      Animated.spring(logo, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      // Gears fade in around it.
      Animated.timing(gears, { toValue: 1, duration: 700, delay: 250, useNativeDriver: true }),
      // Brand name, then the tagline, rise into place.
      Animated.timing(title, { toValue: 1, duration: 550, delay: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(tagline, { toValue: 1, duration: 550, delay: 950, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      // Loading bar fills over the whole intro (layout prop, so JS driver).
      Animated.timing(progress, { toValue: 1, duration: INTRO_MS, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
    ]).start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [logo, gears, spin, pulse, title, tagline, progress]);

  const bigRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // Meshing gears turn opposite ways, faster by the tooth ratio.
  const smallRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${-360 * (BIG_TEETH / SMALL_TEETH)}deg`],
  });
  const rise = (v: Animated.Value) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  });

  return (
    <LinearGradient
      colors={['#FBF201', '#FDF98A', '#FFFFFF']}
      locations={[0, 0.45, 1]}
      style={styles.screen}>
      <View style={styles.decorTop} />
      <View style={styles.decorBottom} />

      <View style={styles.center}>
        <View style={styles.stage}>
          <Animated.View
            style={[
              styles.glow,
              {
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] }),
                transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.1] }) }],
              },
            ]}
          />
          <Animated.View style={[styles.bigGear, { opacity: gears, transform: [{ rotate: bigRotate }] }]}>
            <GearShape size={BIG_GEAR} teeth={BIG_TEETH} color="rgba(55,52,53,0.16)" holeRatio={0.85} toothDepth={0.08} />
          </Animated.View>
          <Animated.View style={[styles.smallGear, { opacity: gears, transform: [{ rotate: smallRotate }] }]}>
            <GearShape size={SMALL_GEAR} teeth={SMALL_TEETH} color="rgba(55,52,53,0.4)" holeRatio={0.34} toothDepth={0.22} />
          </Animated.View>
          <Animated.Image
            source={require('../../../assets/images/logo.png')}
            resizeMode="contain"
            style={[
              styles.logo,
              {
                opacity: logo,
                transform: [{ scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
              },
            ]}
          />
        </View>

        <Animated.Text style={[styles.brand, rise(title)]}>GAJRA GEARS</Animated.Text>
        <Animated.View style={[styles.taglineWrap, rise(tagline)]}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>ENGINEERED FOR UPTIME</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <Text style={styles.footerText}>Driving Motion with Excellence.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  decorTop: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -120,
    top: -110,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  decorBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    left: -110,
    bottom: -90,
    backgroundColor: 'rgba(251,242,1,0.14)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    width: BIG_GEAR + 30,
    height: BIG_GEAR + 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  bigGear: {
    position: 'absolute',
    width: BIG_GEAR,
    height: BIG_GEAR,
  },
  smallGear: {
    position: 'absolute',
    width: SMALL_GEAR,
    height: SMALL_GEAR,
    right: -4,
    bottom: -8,
  },
  logo: {
    // logo.png has built-in padding, so it's drawn larger than the glow.
    width: 176,
    height: 176,
  },
  brand: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 30,
    letterSpacing: 5,
    color: '#1C1C1C',
    marginTop: 22,
  },
  taglineWrap: {
    alignItems: 'center',
  },
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: DARK,
    marginTop: 14,
  },
  tagline: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 14,
    letterSpacing: 2.5,
    color: '#373435',
    marginTop: 12,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 56,
  },
  track: {
    width: 160,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(55,52,53,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: DARK,
  },
  footerText: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 12,
  },
});
