import {Device} from './device';

export abstract class BluetoothService<T> {
  public abstract getDevices(): Promise<Device<T>[]>;
  public abstract getConnectedDevices(): Promise<Device<T>[]>;
}
