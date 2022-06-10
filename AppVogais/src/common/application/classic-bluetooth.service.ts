import {Platform} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothDeviceEvent,
  BluetoothDeviceReadEvent,
} from 'react-native-bluetooth-classic';
import {log} from '../../lib/log';
import {BluetoothService} from '../domain/bluetooth.service';
import {Device} from '../domain/device';

//https://kenjdavidson.com/react-native-bluetooth-classic/
export class ClassicBluetoothService
  implements BluetoothService<BluetoothDevice>
{
  protected enabledSubscription: any;

  public async init() {
    try {
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      log.info('--RNBluetoothClassic: available');
      log.debug(available);
      log.info('--RNBluetoothClassic: enabled');
      log.debug(enabled);
    } catch (err) {
      log.info('--RNBluetoothClassic: OCORREU UM ERRO');
      log.error(err);
    }
  }

  public async getDevices(): Promise<Device<BluetoothDevice>[]> {
    log.info('--getDevices');
    log.info(this.toDomain(await RNBluetoothClassic.getBondedDevices()));
    return this.toDomain(await RNBluetoothClassic.getBondedDevices());
  }

  public async getConnectedDevices(): Promise<Device<BluetoothDevice>[]> {
    log.info('--getConnectedDevices');
    log.info(this.toDomain(await RNBluetoothClassic.getConnectedDevices()));
    return this.toDomain(await RNBluetoothClassic.getConnectedDevices());
  }

  public async onDeviceConnected(): Promise<void> {
    RNBluetoothClassic.onDeviceConnected((event: BluetoothDeviceEvent) => {
      log.info('--RNBluetoothClassic: onDeviceConnected');
      log.info(event);
    });
  }

  public async connect(device: Device<BluetoothDevice>): Promise<void> {
    log.info('--RNBluetoothClassic: connect');

    if (!device.origem.isConnected()) {
      const success = await device.origem.connect({
        connectorType: 'rfcomm',
        delimiter: '\n',
        charset: Platform.OS === 'ios' ? 1536 : 'utf-8',
      });

      log.debug(success);
    }

    await this.read(device);
  }

  private async read(device: Device<BluetoothDevice>): Promise<void> {
    log.info('--RNBluetoothClassic: read');
    device.origem.onDataReceived((event: BluetoothDeviceReadEvent) => {
      log.info('--RNBluetoothClassic: was read');
      log.info(event);
    });
  }

  private toDomain(list: BluetoothDevice[]): Device<BluetoothDevice>[] {
    return list.map(
      device =>
        new Device({
          address: device.address,
          bonded: device?.bonded?.valueOf() ?? false,
          id: device.id,
          name: device.name,
          origem: device,
        }),
    );
  }
}
