import { View, Text, StyleSheet, StatusBar, Image, ScrollView, Pressable, Alert, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontFamily from '../../constants/fontFamily';
import navigationStrings from '../../constants/navigationStrings';
import appTheme from '../../utils/appTheme';
import GearShape from '../comman/GearShape';

// Locator pages are served by the Railway-hosted landing site.
const LOCATOR_BASE_URL = 'https://gajragrolandingwebsite-production.up.railway.app';

const DARK = appTheme.DARK_BOTTOMTAB;

// Gear animation around the logo.
const BIG_GEAR = 172;
const BIG_TEETH = 24;
const SMALL_GEAR = 54;
const SMALL_TEETH = 10;
const GOLD = appTheme.NEW_PALLET;

const StartingScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // --- Animations ---------------------------------------------------------
  // Looping: a soft glow that breathes behind the logo and a dashed ring
  // that slowly turns around it like a gear. The logo itself stays upright.
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  // Entrance: hero, login card and explore tiles rise in one after another.
  const enter = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    spinLoop.start();
    pulseLoop.start();
    Animated.stagger(
      140,
      enter.map(v =>
        Animated.timing(v, { toValue: 1, duration: 550, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ),
    ).start();
    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spin, pulse, enter]);

  const ringRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // Meshing gears turn opposite ways, faster by the tooth ratio.
  const smallRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${-360 * (BIG_TEETH / SMALL_TEETH)}deg`],
  });
  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.12] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
  const rise = (v: Animated.Value, distance = 24) => ({
    opacity: v,
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
  });

  // These features are paused for now: tapping shows "Coming soon" instead of
  // opening the web view. To re-enable, swap `onPress` back to the commented
  // `open` handler on each item.
  const explore = [
    {
      key: 'catalogue',
      title: 'e-Catalogue',
      image: require('../../../assets/images/catalog.png'),
      tint: '#E8F0FF',
      // open: () =>
      //   navigation.navigate('CatalogueWebViewScreen', {
      //     url: 'https://gajra.greyninja.in',
      //     title: 'e-CATALOGUE',
      //   }),
    },
    {
      key: 'retailer',
      title: 'Retailer Locator',
      image: require('../../../assets/images/locator.png'),
      tint: '#FDECEA',
      // open: () =>
      //   navigation.navigate('CatalogueWebViewScreen', {
      //     url: `${LOCATOR_BASE_URL}/customer-details/Retailer?status=true`,
      //     title: 'Distributor/Retailer Locator',
      //   }),
    },
    {
      key: 'mechanic',
      title: 'Mechanic Locator',
      image: require('../../../assets/images/mechanic.png'),
      tint: '#E4F6EC',
      // open: () =>
      //   navigation.navigate('CatalogueWebViewScreen', {
      //     url: `${LOCATOR_BASE_URL}/customer-details/Mechanic?mechanicStatus=true`,
      //     title: 'Mechanic / Fleet / Owner Locator',
      //   }),
    },
  ];

  const showComingSoon = (title: string) => {
    Alert.alert('Coming Soon', `${title} will be available soon. Stay tuned!`);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'dark-content'} />
      {/* Router already pads for the status bar; a second safe area doubled the gap. */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
          showsVerticalScrollIndicator={false}>
          {/* Brand hero */}
          {/* Brand hero */}
          <Animated.View
            style={[
              styles.heroShadow,
              {
                opacity: enter[0],
                transform: [
                  { scale: enter[0].interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
                ],
              },
            ]}>
          <LinearGradient
            colors={['#FBF201', '#FDF98A', '#FFFFFF']}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroDecorLarge} />
            <View style={styles.heroDecorSmall} />
            <View style={styles.logoStage}>
              <Animated.View
                style={[styles.logoGlow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
              />
              {/* Big ring gear around the logo */}
              <Animated.View style={[styles.bigGear, { transform: [{ rotate: ringRotate }] }]}>
                <GearShape size={BIG_GEAR} teeth={BIG_TEETH} color="rgba(55,52,53,0.16)" holeRatio={0.84} toothDepth={0.09} />
              </Animated.View>
              {/* Small gear meshing at the bottom-right, turning the other way */}
              <Animated.View style={[styles.smallGear, { transform: [{ rotate: smallRotate }] }]}>
                <GearShape size={SMALL_GEAR} teeth={SMALL_TEETH} color="rgba(55,52,53,0.38)" holeRatio={0.34} toothDepth={0.22} />
              </Animated.View>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>GAJRA GEARS</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroTitle}>ENGINEERED FOR UPTIME</Text>
            <View style={styles.pillarsRow}>
              {['Reliability', 'Availability', 'Affordability'].map(word => (
                <View key={word} style={styles.pillar}>
                  <Text style={styles.pillarText}>{word}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
          </Animated.View>

          {/* Primary action */}
          <Animated.View style={rise(enter[1])}>
          <Pressable
            onPress={() => navigation.navigate(navigationStrings.LOGIN)}
            style={({ pressed }) => [styles.loginWrap, pressed && styles.pressed]}>
            <LinearGradient
              colors={['#F9DC9E', GOLD, '#F2BE55']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginCard}>
              <View style={styles.loginImageWrap}>
                <Image
                  source={require('../../../assets/images/login1.png')}
                  style={styles.loginImage}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.loginTitle}>LOGIN</Text>
                <Text style={styles.loginSubtitle}>
                  Scan coupons, earn points and redeem rewards
                </Text>
              </View>
              <View style={styles.loginArrow}>
                <Ionicons name="arrow-forward" size={20} color={GOLD} />
              </View>
            </LinearGradient>
          </Pressable>
          </Animated.View>

          {/* Explore (coming soon) */}
          <Animated.View style={rise(enter[2])}>
          <View style={styles.exploreHeader}>
            <Text style={styles.sectionLabel}>EXPLORE</Text>
            <View style={styles.soonPill}>
              <Ionicons name="time-outline" size={11} color="#B7791F" />
              <Text style={styles.soonPillText}>Coming Soon</Text>
            </View>
          </View>
          <View style={styles.exploreRow}>
            {explore.map(item => (
              <Pressable
                key={item.key}
                onPress={() => showComingSoon(item.title)}
                style={({ pressed }) => [styles.exploreTile, pressed && styles.pressed]}>
                <View style={[styles.exploreImageWrap, { backgroundColor: item.tint }]}>
                  <Image source={item.image} style={styles.exploreImage} resizeMode="contain" />
                </View>
                <Text style={styles.exploreTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.soonTag}>
                  <Text style={styles.soonTagText}>Soon</Text>
                </View>
              </Pressable>
            ))}
          </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerTagline}>Driving Motion with Excellence.</Text>
            <Text style={styles.footerCopy}>© 2026 Gajra Gear. All Rights Reserved.</Text>
          </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  heroShadow: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 26,
    shadowColor: '#C9B800',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  hero: {
    borderRadius: 26,
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroDecorLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    right: -80,
    top: -90,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  heroDecorSmall: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    left: -60,
    bottom: -80,
    backgroundColor: 'rgba(251,242,1,0.12)',
  },
  logoStage: {
    width: BIG_GEAR + 24,
    height: BIG_GEAR + 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.75)',
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
    // Sits on the big gear's rim at ~4:30 so the teeth look meshed.
    right: -6,
    bottom: -6,
  },
  logo: {
    // logo.png has built-in padding, so it's drawn a bit larger than the glow.
    width: 136,
    height: 136,
  },
  brandName: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 24,
    letterSpacing: 4,
    color: '#1C1C1C',
    textAlign: 'center',
    marginTop: 14,
  },
  heroDivider: {
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: DARK,
    marginTop: 14,
  },
  heroTitle: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 18,
    letterSpacing: 2,
    color: '#212529',
    textAlign: 'center',
    marginTop: 12,
  },
  pillarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
  },
  pillar: {
    backgroundColor: 'rgba(55,52,53,0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 4,
  },
  pillarText: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 12.5,
    color: '#373435',
  },
  loginWrap: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 22,
    shadowColor: '#C9962F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    padding: 16,
    overflow: 'hidden',
  },
  loginImageWrap: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginImage: {
    width: 56,
    height: 56,
  },
  loginTitle: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 20,
    letterSpacing: 1,
    color: DARK,
  },
  loginSubtitle: {
    fontFamily: FontFamily.INTER_REGULAR,
    fontSize: 12.5,
    color: '#4A3A14',
    marginTop: 4,
  },
  loginArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionLabel: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 12,
    letterSpacing: 1.2,
    color: '#9A9A9A',
  },
  exploreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 26,
    marginBottom: 10,
  },
  soonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1D2',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonPillText: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 11,
    color: '#B7791F',
    marginLeft: 4,
  },
  exploreRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },
  exploreTile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  exploreImageWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // Muted: these features aren't live yet.
    opacity: 0.85,
  },
  exploreImage: {
    width: 42,
    height: 42,
  },
  exploreTitle: {
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 12,
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 10,
    minHeight: 30,
  },
  soonTag: {
    marginTop: 6,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  soonTagText: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 10.5,
    color: '#8A8A8A',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerLine: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    marginBottom: 12,
  },
  footerTagline: {
    fontFamily: FontFamily.INTER_MEDIUM,
    fontSize: 12.5,
    color: '#1C1C1C',
  },
  footerCopy: {
    fontFamily: FontFamily.INTER_REGULAR,
    fontSize: 11.5,
    color: '#8A8A8A',
    marginTop: 4,
  },
});
export default StartingScreen
