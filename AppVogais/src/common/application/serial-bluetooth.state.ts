import {AndroidBluetoothDevice} from 'react-native-bluetooth-serial-next';
import {BluetoothService} from '../domain/bluetooth.service';
import {BluetoothState} from '../domain/bluetooth.state';
import {Device} from '../domain/device';

export class SerialBluetoothState extends BluetoothState<AndroidBluetoothDevice> {
  constructor(
    public device: Device<AndroidBluetoothDevice>,
    public service: BluetoothService<AndroidBluetoothDevice>,
  ) {
    super();
  }
}
