import React from 'react';
import {BluetoothState} from '../common/domain/bluetooth.state';

export const BluetoothContext = React.createContext<{
  state?: BluetoothState<any>;
  setState: <K>(state: BluetoothState<K>) => void;
}>({
  state: undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setState: <K>(state: BluetoothState<K>) => {},
});
