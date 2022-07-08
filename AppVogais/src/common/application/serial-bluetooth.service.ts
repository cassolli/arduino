import {EmitterSubscription} from 'react-native';
import BluetoothSerial, {
  AndroidBluetoothDevice,
} from 'react-native-bluetooth-serial-next';
import {log} from '../../lib/log';
import {BluetoothService} from '../domain/bluetooth.service';
import {Device} from '../domain/device';

type BluetoothSerialEventData = {
  message: string;
  device: AndroidBluetoothDevice;
};

//https://github.com/don/BluetoothSerial
export class SerialBluetoothService
  implements BluetoothService<AndroidBluetoothDevice>
{
  connected: boolean = false;

  public async init(): Promise<void> {
    try {
      const available = await BluetoothSerial.requestEnable();
      const enabled = await BluetoothSerial.isEnabled();

      log.info('--SerialBluetoothService: available');
      log.debug(available);
      log.info('--SerialBluetoothService: enabled');
      log.debug(enabled);

      BluetoothSerial.on(
        'connectionSuccess',
        (data: BluetoothSerialEventData) => {
          BluetoothSerial.clear();

          log.info('--SerialBluetoothService: onConnectionSuccess');

          log.debug(data);

          this.connected = true;

          BluetoothSerial.on('read', (message: {id: string; data: string}) => {
            log.info('--SerialBluetoothService: listener read from onSuccess');

            log.debug(message);
          });

          BluetoothSerial.on('data', (message: {id: string; data: string}) => {
            log.info('--SerialBluetoothService: listener data onSuccess');

            log.debug(message);
          });

          BluetoothSerial.readEvery(
            async (everyData: string, readEveryIntervalId: number) => {
              log.info('--SerialBluetoothService: READ_EVERY');

              log.debug(everyData);
              log.debug(await BluetoothSerial.readFromDevice());

              BluetoothSerial.on('connectionLost', () => {
                clearInterval(readEveryIntervalId);
              });
            },
            100,
            '',
          );
        },
      );

      await BluetoothSerial.on(
        'connectionFailed',
        (data: BluetoothSerialEventData) => {
          log.info('--SerialBluetoothService: connectionFailed');

          log.debug(data);

          this.connected = false;
        },
      );

      await BluetoothSerial.addListener(
        'connectionSuccess',
        (data: BluetoothSerialEventData) => {
          log.info('--SerialBluetoothService: addListenerConnectionSuccess');

          log.debug(data);

          BluetoothSerial.addListener(
            'read',
            (message: {id: string; data: string}) => {
              log.info('--SerialBluetoothService: listener read');

              log.debug(message);
            },
          );

          BluetoothSerial.addListener(
            'data',
            (message: {id: string; data: string}) => {
              log.info('--SerialBluetoothService: listener data');

              log.debug(message);
              log.debug(message);
            },
          );

          this.connected = true;
        },
      );

      await BluetoothSerial.on(
        'connectionLost',
        (data: BluetoothSerialEventData) => {
          log.info('--SerialBluetoothService: connectionLost');

          log.debug(data);

          BluetoothSerial.removeAllListeners();

          this.connected = false;
        },
      );

      await BluetoothSerial.on('error', (error: any) => {
        log.info('--SerialBluetoothService: connectionLost');

        log.debug(error);

        BluetoothSerial.removeAllListeners();

        this.connected = false;
      });
    } catch (err) {
      log.info('--SerialBluetoothService: OCORREU UM ERRO');
      log.error(err);
    }
  }

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

    this.connected = false;
  }

  public async write(
    device: Device<AndroidBluetoothDevice>,
    message: string,
  ): Promise<void> {
    log.info('--SerialBluetoothService: write');

    // await BluetoothSerial.writeToDevice(message, device.id);
    await BluetoothSerial.write(message, device.id);
  }

  public async send(
    command: string,
    device: Device<AndroidBluetoothDevice>,
  ): Promise<void> {
    log.info('--SerialBluetoothService: SEND');
    log.debug(command);

    await BluetoothSerial.write(command, device.id);
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
