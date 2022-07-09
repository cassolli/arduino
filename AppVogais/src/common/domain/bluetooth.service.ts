import {Device} from './device';

export type BluetoothServiceEventNames =
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'read';

export type CallbackOnRead = (data: string) => void;

export abstract class BluetoothService<T> {
  connected!: boolean;

  public abstract getDevices(): Promise<Device<T>[]>;
  public abstract getConnectedDevices(): Promise<Device<T>[]>;
  public abstract send(command: string, device: Device<T>): Promise<void>;
  public abstract onRead(callback: CallbackOnRead): void;
}
