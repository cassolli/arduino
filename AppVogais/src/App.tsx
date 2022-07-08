/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BluetoothState} from './common/domain/bluetooth.state';
import {BluetoothContext} from './components/BluetoothContext';
import BluetoothManager from './components/BluetoothManager';
import Controller from './components/Controller';
import Screen from './components/Screen';
import {log} from './lib/log';

const App = () => {
  useEffect(() => {}, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [state, setState] = useState<BluetoothState<any> | undefined>(
    undefined,
  );

  const changeBluetoothState = (newState: BluetoothState<any>): void => {
    log.info('-- ATUALIAR ESTADO');
    log.debug(newState);

    setState(newState);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <BluetoothContext.Provider
        value={{state, setState: changeBluetoothState}}>
        <BluetoothManager />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View style={style.container}>
            <Screen style={style.screen} text="_E_O_" />

            <Controller style={style.controller} />
          </View>
        </ScrollView>
      </BluetoothContext.Provider>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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

export default App;
