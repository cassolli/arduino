import {BluetoothService} from './bluetooth.service';
import {Device} from './device';

export abstract class BluetoothState<T> {
  public device!: Device<T>;
  public service!: BluetoothService<T>;
}
