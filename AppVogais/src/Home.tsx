import React from 'react';
import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import Controller from './Controller';
import Screen from './Screen';

const Home = () => {
  return (
    <View style={style.container}>
      <Screen style={style.screen} text="_E_I_U" />

      <Controller style={style.controller} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 32,
    zIndex: 1,
    alignItems: 'center',
  } as ViewStyle,

  screen: {} as ViewStyle,

  controller: {
    marginTop: 72,
  } as ViewStyle,
});

export default Home;
