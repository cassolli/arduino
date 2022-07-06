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

    if (await BluetoothSerial.isConnected(device.id)) {
      log.info('--SerialBluetoothService: JA ESTA CONECTADO');
      return;
    }

    log.info('--SerialBluetoothService: CONECTAR');

    const connectedDevice = await BluetoothSerial.connect(device.id);

    log.debug(connectedDevice);

    await this.read(device);
  }

  public async disconnect(
    device: Device<AndroidBluetoothDevice>,
  ): Promise<void> {
    log.info('--SerialBluetoothService: disconnect');

    await BluetoothSerial.disconnect(device.id);
  }

  public async write(
    device: Device<AndroidBluetoothDevice>,
    message: string,
  ): Promise<void> {
    log.info('--SerialBluetoothService: write');

    // await BluetoothSerial.writeToDevice(message, device.id);
    await BluetoothSerial.write(message, device.id);
  }

  private async read(device: Device<AndroidBluetoothDevice>): Promise<void> {
    log.info('--SerialBluetoothService: read');

    // const resWithDelimiter = await BluetoothSerial.withDelimiter(
    //   '\n',
    //   device.id,
    // );
    // log.info('--SerialBluetoothService: resWithDelimiter');
    // log.debug(resWithDelimiter);

    log.info('--SerialBluetoothService: readFromDevice');
    log.debug(await BluetoothSerial.readFromDevice());

    await BluetoothSerial.read(
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: READ');

        log.debug(data);
        log.debug(subscription);
      },
      '',
      device.id,
    );

    // await BluetoothSerial.readEvery(
    //   (data: string, readEveryIntervalId: number) => {
    //     log.info('--SerialBluetoothService: READ_EVERY');

    //     log.debug(data);

    //     BluetoothSerial.on(
    //       'connectionLost',
    //       (data: string, subscription: EmitterSubscription) => {
    //         clearInterval(readEveryIntervalId);
    //       },
    //     );
    //   },
    //   500,
    //   '',
    // );

    BluetoothSerial.on(
      'read',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: onRead');

        log.debug(data);
        log.debug(subscription);
        log.debug(BluetoothSerial.readFromDevice());
      },
    );

    BluetoothSerial.on(
      'connectionSuccess',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: onConnectionSuccess ');

        log.debug(data);
        log.debug(subscription);
      },
    );
    await BluetoothSerial.addListener(
      'connectionSuccess',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: addListenerConnectionSuccess ');

        log.debug(data);
        log.debug(subscription);

        BluetoothSerial.addListener(
          'read',
          (data: string, subscription: EmitterSubscription) => {
            log.info('--SerialBluetoothService: listener read');

            log.debug(data);
            log.debug(subscription);
          },
        );
      },
    );

    BluetoothSerial.on(
      'connectionLost',
      (data: string, subscription: EmitterSubscription) => {
        log.info('--SerialBluetoothService: connectionLost');

        log.debug(data);
        log.debug(subscription);

        BluetoothSerial.removeAllListeners();
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
