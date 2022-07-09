import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import {Peripheral} from 'react-native-ble-manager';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {AndroidBluetoothDevice} from 'react-native-bluetooth-serial-next';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BLEManagerBluetoothService} from '../common/application/ble-manager-bluetooth.service';
import {ClassicBluetoothService} from '../common/application/classic-bluetooth.service';
import {SerialBluetoothService} from '../common/application/serial-bluetooth.service';
import {SerialBluetoothState} from '../common/application/serial-bluetooth.state';
import {Device} from '../common/domain/device';
import {log} from '../lib/log';
import {BluetoothContext} from './BluetoothContext';

const classicBluetoothService = new ClassicBluetoothService();
const bleManagerBluetoothService = new BLEManagerBluetoothService();
const serialBluetoothService = new SerialBluetoothService();

enum LIBS {
  CLASSIC,
  BLE,
  SERIAL,
}

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

const BluetoothManager = () => {
  const context = useContext(BluetoothContext);
  log.info('-- BluetoothManager');
  log.info(context);

  const bluetoothConnected = !!context?.state?.service.connected;

  const [isVisible, setVisible] = useState<boolean>(!bluetoothConnected);

  log.info('-- BluetoothManager: isVisible');
  log.debug(isVisible);
  log.debug(bluetoothConnected);
  log.debug(!bluetoothConnected);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    classicBluetoothService.init();
    bleManagerBluetoothService.init();
    serialBluetoothService.init();

    classicBluetoothService.onDeviceConnected();
    bleManagerBluetoothService.onDeviceConnected();
  }, [isVisible]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [currentLib, setCurrentLib] = useState(LIBS.CLASSIC);

  const [listDevices, setListDevices] = useState<
    Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>[]
  >([]);

  const [currentDevice, setCurrentDevice] =
    useState<Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>>();

  const onPress = async (
    device: Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>,
  ) => {
    log.info('--onPress device');
    log.debug(device);

    switch (currentLib) {
      case LIBS.BLE:
        await bleManagerBluetoothService.connect(device as Device<Peripheral>);
        break;
      case LIBS.SERIAL:
        await serialBluetoothService.connect(
          device as Device<AndroidBluetoothDevice>,
        );
        break;
      default:
        await classicBluetoothService.connect(
          device as Device<BluetoothDevice>,
        );
        break;
    }

    setCurrentDevice(device);

    context.setState(
      new SerialBluetoothState(
        device as Device<AndroidBluetoothDevice>,
        serialBluetoothService,
      ),
    );
    setVisible(false);

    ToastAndroid.show(`CONNECTED: ${device.id}`, ToastAndroid.SHORT);
  };

  const onLongPress = async (
    device: Device<BluetoothDevice | Peripheral | AndroidBluetoothDevice>,
  ) => {
    log.info('--onLongPress device');
    log.debug(device);

    switch (currentLib) {
      case LIBS.BLE:
        await bleManagerBluetoothService.disconnect(
          device as Device<Peripheral>,
        );
        break;
      case LIBS.SERIAL:
        await serialBluetoothService.disconnect(
          device as Device<AndroidBluetoothDevice>,
        );
        break;
      default:
        // await classicBluetoothService.disconnect(device as Device<BluetoothDevice>);
        break;
    }

    setCurrentDevice(undefined);

    ToastAndroid.show(`DISCONNECTED: ${device.id}`, ToastAndroid.SHORT);
  };

  const onPressSendMessage = async () => {
    log.info('--onPress onPressSendMessage');
    log.debug(currentDevice);

    switch (currentLib) {
      case LIBS.BLE:
        await bleManagerBluetoothService.connect(
          currentDevice as Device<Peripheral>,
        );
        break;
      case LIBS.SERIAL:
        await serialBluetoothService.write(
          currentDevice as Device<AndroidBluetoothDevice>,
          '6',
        );
        break;
      default:
        await classicBluetoothService.connect(
          currentDevice as Device<BluetoothDevice>,
        );
        break;
    }

    ToastAndroid.show(`SEND MESSAGE: ${currentDevice?.id}`, ToastAndroid.SHORT);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{...backgroundStyle, ...styles.container}}>
      {/* <Header /> */}

      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <Button title="Fechar" onPress={() => setVisible(false)} />

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

          <Button
            title="Enviar comando"
            color={'green'}
            onPress={onPressSendMessage}
          />
        </Section>

        <Section title="Listar dispositivos">
          <ScrollView>
            {listDevices.map((device, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onPress(device)}
                onLongPress={() => onLongPress(device)}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eaeaea',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 32,
    zIndex: 1,
  } as ViewStyle,

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

export default BluetoothManager;
