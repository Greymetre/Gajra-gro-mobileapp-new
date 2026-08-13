import { View, Text, StyleSheet, StatusBar, Image, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontFamily from '../../constants/fontFamily';
import navigationStrings from '../../constants/navigationStrings';


const StartingScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'}
      
          />
      <LinearGradient style={[styles.container]} colors={['#FBF201', '#FFFFFF']} locations={[0, 0.25]}>
        <SafeAreaView style={styles.container} edges={['top']}>
          
          <ScrollView style={[styles.container, { paddingHorizontal: 20 }]} showsVerticalScrollIndicator={false}>
            <View style={styles.center}>
              <Image source={require('../../../assets/images/logo.png')} style={{ height: 121, width: 121 }} resizeMode='contain' />
              <Text style={[styles.mainHeading, {textTransform:"uppercase", fontFamily: FontFamily.INTER_SEMI_BOLD}]}>Engineered For Uptime</Text>
              <Text style={[styles.mainHeading, { fontFamily: FontFamily.INTER_MEDIUM, marginVertical: 10 }]}>Reliability.Availability.Affordability.</Text>
              {/* <Text style={[styles.mainHeading, { fontFamily: FontFamily.INTER_REGULAR, fontSize: 13, textTransform: 'capitalize' }]}>Please Click to access your CUSTOMER LOGIN, CUSTOMER LOCATER, and E - CATALOGUE</Text> */}
            </View>
            <View style={[styles.container, { marginTop: 50 }]}>
              <Pressable style={[styles.item, styles.row, { justifyContent: "flex-end" }]} onPress={() => navigation.navigate(navigationStrings.LOGIN)}>
                <View style={[{ width: '85%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', height: 90, alignSelf: 'flex-end', borderRadius: 30 }, styles.center]}>
                  <Text style={[styles.mainHeading, { color: '#0F172A' }]}>LOGIN</Text>
                </View>
                <Image source={require('../../../assets/images/login1.png')} style={{ height: 90, width: 90, position: 'absolute', left: 0 }} resizeMode='contain' />
              </Pressable>
              <Pressable style={[styles.item, styles.row, { justifyContent: "flex-end", marginTop: 29 }]} onPress={()=>{
                navigation.navigate('CatalogueWebViewScreen', {url: "https://gajra.greyninja.in", title: "e-CATALOGUE"})
              }}>
                <View style={[{ width: '85%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', height: 90, alignSelf: 'flex-end', borderRadius: 30 }, styles.center]}>
                  <Text style={[styles.mainHeading, { color: '#0F172A' }]}>e-CATALOGUE</Text>
                </View>
                <Image source={require('../../../assets/images/catalog.png')} style={{ height: 90, width: 90, position: 'absolute', left: 0 }} resizeMode='contain' />
              </Pressable>
              <Pressable style={[styles.item, styles.row, { justifyContent: "flex-end", marginTop: 29 }]} onPress={()=>{
                navigation.navigate('CatalogueWebViewScreen', {url: "https://gajragrolandingwebsite-production.up.railway.app/", title: "Distributor/Retailer Locator"})
              }}>
                <View style={[{ width: '85%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', height: 90, alignSelf: 'flex-end', borderRadius: 30 }, styles.center]}>
                  <Text style={[styles.mainHeading, { color: '#0F172A' }]}>Distributor/{'\n'}Retailer Locator</Text>
                </View>
                <Image source={require('../../../assets/images/locator.png')} style={{ height: 90, width: 90, position: 'absolute', left: 0 }} resizeMode='contain' />
              </Pressable>
              <Pressable style={[styles.item, styles.row, { justifyContent: "flex-end", marginTop: 29 }]} onPress={()=>{
                navigation.navigate('CatalogueWebViewScreen', {url: "https://gajra.greyninja.in/customer-details/Mechanic?mechanic=true", title: "Mechanic / Fleet / Owner Locator"})
              }}>
                <View style={[{ width: '85%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', height: 90, alignSelf: 'flex-end', borderRadius: 30 }, styles.center]}>
                  <Text style={[styles.mainHeading, { color: '#0F172A' }]}>Mechanic / Fleet /{'\n'}Owner Locator</Text>
                </View>
                <Image source={require('../../../assets/images/mechanic.png')} style={{ height: 90, width: 90, position: 'absolute', left: 0 }} resizeMode='contain' />
              </Pressable>
            </View>
            <View style={{ height: 1, width: '90%', alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: 40 }} />
            <Text style={[styles.mainHeading, { fontFamily: FontFamily.INTER_MEDIUM, fontSize: 12, color: 'black', marginTop: 12 }]}>
              Driving Motion with Excellence.</Text>
            <Text style={[styles.mainHeading, { fontFamily: FontFamily.INTER_MEDIUM, fontSize: 12, color: 'black', marginTop: 6 }]}>
              © 2026 Gajra Gear. All Rights Reserved.
            </Text>
            <View style={{ height: 80 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    justifyContent: "center",
    alignItems: 'center',
  },
  mainHeading: {
    color: "#212529",
    fontFamily: FontFamily.INTER_SEMI_BOLD,
    fontSize: 18,
    textAlign: 'center'
  },
  item: {
    // justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    alignItems: 'center',
  },
});
export default StartingScreen
