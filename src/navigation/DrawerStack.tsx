// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import navigationStrings from '../constants/navigationStrings';
// import BottomTab from './BottomTab';
// import CustomDrawer from '../components/customdrawer/CustomerDrawer';
// import ReferEarn from '../components/refer/ReferEarn';
// import { useNavigation } from '@react-navigation/native';
// import { Icon as IconRNE } from '@rneui/base';
// import Home from '../components/bottomtabs/home/Home';
// import { NavigationInterFace } from '../interfaces/navigationType.interface';

// const Drawer = createDrawerNavigator();
// const DrawerStack = (props: any) => {
//   const navigation = useNavigation<NavigationInterFace>();
//     return (
//         <Drawer.Navigator
//             // useLegacyImplementation
//             // screenOptions={{headerShown:true}}
//             // screenOptions={(navigation) => (headerLeft: props => <IconRNE name='menu' onPress={navigation.navigate('CustomDrawer')}/>}}
//             drawerContent={props => <CustomDrawer {...props}
//             header />}>
//             <Drawer.Screen name={navigationStrings.HOME} component={Home} />
//         </Drawer.Navigator>
//     );
// };

// export default DrawerStack;
