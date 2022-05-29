import {Device} from './device';

export abstract class BluetoothService {
  public abstract getDevices(): Promise<Device[]>;
  public abstract getConnectedDevices(): Promise<Device[]>;
}
