export interface DeviceAttributes {
  readonly name: string;
  readonly address: string;
  readonly id: string;
  readonly bonded: boolean;
}

// export class BluetoothDevice extends BaseClass<BluetoothDeviceAttributes>() {
export class Device implements DeviceAttributes {
  readonly name!: string;
  readonly address!: string;
  readonly id!: string;
  readonly bonded!: boolean;

  constructor(attr: DeviceAttributes) {
    // super({...attr});

    Object.assign(this, {...attr});
  }
}
