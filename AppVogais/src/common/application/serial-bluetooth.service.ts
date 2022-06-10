import {EmitterSubscription} from 'react-native';
import BluetoothSerial, {
  AndroidBluetoothDevice,
} from 'react-native-bluetooth-serial-next';
import {log} from '../../lib/log';
import {BluetoothService} from '../domain/bluetooth.service';
import {Device} from '../domain/device';

//https://github.com/don/BluetoothSerial
export class SerialBluetoothService
  implements BluetoothService<AndroidBluetoothDevice>
{
  public async getDevices(): Promise<Device<AndroidBluetoothDevice>[]> {
    log.info('--SerialBluetoothService: getDevices');

    const devices = await BluetoothSerial.list();

    log.debug(devices);

    return this.toDomain(devices as AndroidBluetoothDevice[], false);
  }

  public async getConnectedDevices(): Promise<
    Device<AndroidBluetoothDevice>[]
  > {
    log.info('--SerialBluetoothService: getConnectedDevices');

    const devices = await BluetoothSerial.listUnpaired();

    log.debug(devices);

    return this.toDomain(devices as AndroidBluetoothDevice[], true);
  }

  // public async onDeviceConnected(): Promise<void> {
  //   SerialBluetoothService.onDeviceConnected((event: BluetoothDeviceEvent) => {
  //     log.info('--SerialBluetoothService: onDeviceConnected');
  //     log.info(event);
  //   });
  // }

  public async connect(device: Device<AndroidBluetoothDevice>): Promise<void> {
    log.info('--SerialBluetoothService: connect');

    if (!(await BluetoothSerial.isConnected(device.id))) {
      const connectedDevice = await BluetoothSerial.connect(device.id);

      log.debug(connectedDevice);
    }

    await this.read(device);
  }

  private async read(device: Device<AndroidBluetoothDevice>): Promise<void> {
    log.info('--SerialBluetoothService: read');

    BluetoothSerial.on(
      'read',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: onRead');

        log.debug(data);
        log.debug(subscription);
      },
    );

    BluetoothSerial.addListener(
      'read',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: listener read');

        log.debug(data);
        log.debug(subscription);
      },
    );

    BluetoothSerial.read(
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: read');

        log.debug(data);
        log.debug(subscription);
      },
      '',
      device.id,
    );
  }

  private toDomain(
    list: AndroidBluetoothDevice[],
    bonded: boolean,
  ): Device<AndroidBluetoothDevice>[] {
    return list.map(
      device =>
        new Device({
          address: device.address,
          bonded: bonded,
          id: device.id,
          name: device.name,
          origem: device,
        }),
    );
  }
}
