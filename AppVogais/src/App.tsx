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
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {BLEManagerBluetoothService} from './common/application/ble-manager-bluetooth.service';
import {ClassicBluetoothService} from './common/application/classic-bluetooth.service';
import {Device} from './common/domain/device';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const classicBluetoothService = new ClassicBluetoothService();
const bleManagerBluetoothService = new BLEManagerBluetoothService();

const App = () => {
  useEffect(() => {
    // bluetoothService.init();
    bleManagerBluetoothService.init();
  });

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [listDevices, setListDevices] = useState<Device[]>([]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}

        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Classic">
            <Button
              title="Carregar dispositivos"
              onPress={async () =>
                setListDevices(await classicBluetoothService.getDevices())
              }
            />

            <Button
              title="Carregar dispositivos conectados"
              onPress={async () =>
                setListDevices(
                  await classicBluetoothService.getConnectedDevices(),
                )
              }
            />
          </Section>

          <Section title="BLE">
            <Button
              title="Carregar dispositivos"
              color={'green'}
              onPress={async () =>
                setListDevices(await bleManagerBluetoothService.getDevices())
              }
            />

            <Button
              title="Carregar dispositivos conectados"
              color={'green'}
              onPress={async () =>
                setListDevices(
                  await bleManagerBluetoothService.getConnectedDevices(),
                )
              }
            />
          </Section>

          <Section title="Listar dispositivos">
            <ScrollView>
              {listDevices.map((device, index) => (
                <View style={styles.deviceItem} key={index}>
                  <Text>{`Nome: ${device.name}`}</Text>
                  <Text>{`ID: ${device.id}`}</Text>
                  <Text>{`Endereço: ${device.address}`}</Text>
                  <Text>{`Vinculado: ${
                    device.bonded ? 'TRUE' : 'FALSE'
                  }`}</Text>
                </View>
              ))}
            </ScrollView>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deviceItem: {
    marginHorizontal: 8,
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
