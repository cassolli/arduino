import {BlueToothService} from '../domain/bluetooth.service';

export class ClassicBluetoothService implements BlueToothService {
  public showDevices(): void {
    throw new Error('Method not implemented.');
  }
}
