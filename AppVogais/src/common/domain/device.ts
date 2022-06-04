export interface DeviceAttributes<T> {
  readonly name: string;
  readonly address: string;
  readonly id: string;
  readonly bonded: boolean;
  readonly origem: T;
}

// export class BluetoothDevice extends BaseClass<BluetoothDeviceAttributes>() {
export class Device<T> implements DeviceAttributes<T> {
  readonly name!: string;
  readonly address!: string;
  readonly id!: string;
  readonly bonded!: boolean;
  readonly origem!: T;

  constructor(attr: DeviceAttributes<T>) {
    // super({...attr});

    Object.assign(this, {...attr});
  }
}
