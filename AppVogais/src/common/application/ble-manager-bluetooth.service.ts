import BleManager, {Peripheral} from 'react-native-ble-manager';
import {log} from '../../lib/log';
import {BluetoothService} from '../domain/bluetooth.service';
import {Device} from '../domain/device';

//https://kenjdavidson.com/react-native-bluetooth-classic/
export class BLEManagerBluetoothService implements BluetoothService {
  protected enabledSubscription: any;

  public async init() {
    try {
      BleManager.start({showAlert: true});
      // BleManager.start({showAlert: false});

      log.info('--BleManager: START');
    } catch (err) {
      log.info('----BleManager: OCORREU UM ERRO');
      log.error(err);
    }
  }

  public async getDevices(): Promise<Device<Peripheral>[]> {
    log.info('--BLE: getDevices - getBondedPeripherals');
    log.info(await BleManager.getBondedPeripherals());

    const devices = this.toDomain(await BleManager.getBondedPeripherals());

    log.info('--BLE: getDEvices - devices');
    log.info(devices);

    return devices;
  }

  public async getConnectedDevices(): Promise<Device<Peripheral>[]> {
    log.info('--BLE: getConnectedDevices - getConnectedPeripherals');
    log.info(await BleManager.getConnectedPeripherals([]));

    const devices = this.toDomain(await BleManager.getConnectedPeripherals([]));

    log.info('--BLE: getConnectedDevices - devices');
    log.info(devices);

    return devices;
  }

  private toDomain(list: Peripheral[]): Device<Peripheral>[] {
    return list.map(
      peripheral =>
        new Device({
          name: peripheral.name ?? '',
          address: peripheral.rssi.toString(),
          id: peripheral.id,
          bonded: peripheral.advertising.isConnectable ?? false,
          origem: peripheral,
        }),
    );
  }
}
