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
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import BluetoothSerial, {
  AndroidBluetoothDevice,
} from 'react-native-bluetooth-serial-next';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BLEManagerBluetoothService} from './common/application/ble-manager-bluetooth.service';
import {ClassicBluetoothService} from './common/application/classic-bluetooth.service';
import {SerialBluetoothService} from './common/application/serial-bluetooth.service';
import {Device} from './common/domain/device';
import {log} from './lib/log';

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
const serialBluetoothService = new SerialBluetoothService();

enum LIBS {
  CLASSIC,
  BLE,
  SERIAL,
}

const App = () => {
  useEffect(() => {
    classicBluetoothService.init();
    bleManagerBluetoothService.init();

    classicBluetoothService.onDeviceConnected();
    bleManagerBluetoothService.onDeviceConnected();

    log.info('--BluetoothSerial');
    log.debug(BluetoothSerial);
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [currentLib, setCurrentLib] = useState(LIBS.CLASSIC);

  const [listDevices, setListDevices] = useState<
    Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>[]
  >([]);

  const onPress = (
    device: Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>,
  ) => {
    log.info('--onPress device');
    log.debug(device);

    switch (currentLib) {
      case LIBS.BLE:
        bleManagerBluetoothService.connect(device as Device<Peripheral>);
        break;
      case LIBS.SERIAL:
        serialBluetoothService.connect(
          device as Device<AndroidBluetoothDevice>,
        );
        break;
      default:
        classicBluetoothService.connect(device as Device<BluetoothDevice>);
        break;
    }
  };

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
              onPress={async () => {
                setCurrentLib(LIBS.CLASSIC);

                setListDevices(await classicBluetoothService.getDevices());
              }}
            />

            <Button
              title="Carregar dispositivos conectados"
              onPress={async () => {
                setCurrentLib(LIBS.CLASSIC);

                setListDevices(
                  await classicBluetoothService.getConnectedDevices(),
                );
              }}
            />
          </Section>

          <Section title="BLE">
            <Button
              title="Carregar dispositivos"
              color={'green'}
              onPress={async () => {
                setCurrentLib(LIBS.BLE);

                setListDevices(await bleManagerBluetoothService.getDevices());
              }}
            />

            <Button
              title="Carregar dispositivos conectados"
              color={'green'}
              onPress={async () => {
                setCurrentLib(LIBS.BLE);

                setListDevices(
                  await bleManagerBluetoothService.getConnectedDevices(),
                );
              }}
            />
          </Section>

          <Section title="Serial">
            <Button
              title="Carregar dispositivos"
              color={'green'}
              onPress={async () => {
                setCurrentLib(LIBS.SERIAL);

                setListDevices(await serialBluetoothService.getDevices());
              }}
            />

            <Button
              title="Carregar dispositivos conectados"
              color={'green'}
              onPress={async () => {
                setCurrentLib(LIBS.SERIAL);

                setListDevices(
                  await serialBluetoothService.getConnectedDevices(),
                );
              }}
            />
          </Section>

          <Section title="Listar dispositivos">
            <ScrollView>
              {listDevices.map((device, index) => (
                <TouchableOpacity key={index} onPress={() => onPress(device)}>
                  <View style={styles.deviceItem}>
                    <Text>{`Nome: ${device.name}`}</Text>
                    <Text>{`ID: ${device.id}`}</Text>
                    <Text>{`Endereço: ${device.address}`}</Text>
                    <Text>{`Vinculado: ${
                      device.bonded ? 'TRUE' : 'FALSE'
                    }`}</Text>
                  </View>
                </TouchableOpacity>
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
