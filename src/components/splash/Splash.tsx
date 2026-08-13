import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";
import { Navigation } from "../../navigation/types";
import appTheme from "../../utils/appTheme";
import FastImage from 'react-native-fast-image'

const { height, width } = Dimensions.get("window");

type SplashProps = {
  navigation: Navigation;
};

export default function Splash(props: any) {
  useEffect(() => {
    if (Platform.OS == "android") {
      StatusBar.setBarStyle("light-content", true);
      StatusBar.setBackgroundColor(appTheme.APP_BACKGROUND_COLOR, true);
    } else {
      StatusBar.setBarStyle("light-content", true);
    }
  },[]);

  return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: height,
          width: width,
          backgroundColor: 'black',
        }}
      >
        <FastImage
          source={require("../../../assets/images/ggp.gif")}
          style={{
            height: 300,
            width: "100%"
            // height: height / 6,
            // width: height / 6,
            // borderRadius: height / 6,
            // // backgroundColor: 'red',
          }}
          // resizeMode="contain"
        />
      </View>
  );
}
