import RNBluetoothClassic, {
  BluetoothDevice,
} from 'react-native-bluetooth-classic';
import {log} from '../../lib/log';
import {Device} from '../domain/device';
import {BluetoothService} from '../domain/bluetooth.service';

//https://kenjdavidson.com/react-native-bluetooth-classic/
export class ClassicBluetoothService implements BluetoothService {
  protected enabledSubscription: any;

  public async init() {
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      log.info('--available');
      log.debug(available);
      log.info('--enabled');
      log.debug(enabled);
    } catch (err) {
      log.info('--OCORREU UM ERRO');
      log.error(err);
    }
  }

  public async getDevices(): Promise<Device[]> {
    log.info('--getDevices');
    log.info(await RNBluetoothClassic.getBondedDevices());
    return this.toDomain(await RNBluetoothClassic.getBondedDevices());
  }

  public async getConnectedDevices(): Promise<Device[]> {
    log.info('--getConnectedDevices');
    log.info(await RNBluetoothClassic.getConnectedDevices());
    return this.toDomain(await RNBluetoothClassic.getConnectedDevices());
  }

  private toDomain(list: BluetoothDevice[]): Device[] {
    return list.map(
      device =>
        new Device({
          address: device.address,
          bonded: device?.bonded?.valueOf() ?? false,
          id: device.id,
          name: device.name,
        }),
    );
  }
}
