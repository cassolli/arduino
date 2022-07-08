import React, {useContext, useState} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import {log} from '../lib/log';
import {BluetoothContext} from './BluetoothContext';

type ControllerProps = {
  style?: ViewStyle;
};

type ControllerButtonProps = {
  style?: ViewStyle;
  title?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressHold?: () => void;
};

const COMMAND_DELAY = 350;

const ControllerButton: React.FC<ControllerButtonProps> = props => {
  const [pressHoldInterval, setPressHoldInterval] = useState<
    NodeJS.Timer | undefined
  >(undefined);

  const onPressIn = (event: GestureResponderEvent) => {
    event.persist();

    log.debug('--startVibration');
    log.debug(event);
    log.debug(pressHoldInterval);

    Vibration.vibrate([30, 30], true);

    if (props?.onPressHold) {
      props.onPressHold();

      setPressHoldInterval(setInterval(props.onPressHold, COMMAND_DELAY));
    }
  };

  const onPressOut = (event: GestureResponderEvent) => {
    event.persist();

    log.debug('--cancelVibration');
    log.debug(event);

    Vibration.cancel();

    if (props?.onPressHold) {
      clearInterval(pressHoldInterval);
    }
  };

  return (
    <TouchableOpacity
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}>
      <View
        style={{
          ...style.controllerButtonContainer,
          ...(props?.style ?? {}),
        }}
      />
    </TouchableOpacity>
  );
};
const Controller: React.FC<ControllerProps> = props => {
  const context = useContext(BluetoothContext);

  const sendCommand = (command: string) =>
    context?.state?.service.send(command, context?.state.device);

  return (
    <View style={{...style.container, ...(props?.style ?? {})}}>
      <View style={style.containerButtonsLeft}>
        <ControllerButton
          title="Button Left"
          style={style.controllerButtonLeft}
          onPress={() => log.info('- Left')}
          onLongPress={() => log.info('- Long Left')}
          onPressHold={() => sendCommand('E')}
        />
        <ControllerButton
          title="Button Right"
          style={style.controllerButtonRight}
          onPress={() => log.info('- Right')}
          onLongPress={() => log.info('- Long Right')}
          onPressHold={() => sendCommand('D')}
        />
      </View>

      <View style={style.containerButtonsRight}>
        <ControllerButton
          title="Button Top"
          style={style.controllerButtonTop}
          onPress={() => log.info('- Top')}
          onLongPress={() => log.info('- Long Top')}
          onPressHold={() => sendCommand('F')}
        />
        <ControllerButton
          title="Button Bottom"
          style={style.controllerButtonBottom}
          onPress={() => log.info('- Bottom')}
          onLongPress={() => log.info('- Long Bottom')}
          onPressHold={() => sendCommand('T')}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  } as ViewStyle,

  containerButtonsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
  } as ViewStyle,

  containerButtonsRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 16,
  } as ViewStyle,

  controllerButtonContainer: {
    width: 78.4,
    height: 56,
    backgroundColor: '#64DD17',
    borderRadius: 16,
    borderWidth: 4,
  } as ViewStyle,
  controllerButtonLeft: {
    borderBottomLeftRadius: 48,
    borderTopLeftRadius: 48,
    marginRight: 10,
  } as ViewStyle,
  controllerButtonRight: {
    borderBottomRightRadius: 48,
    borderTopRightRadius: 48,
    marginLeft: 10,
  } as ViewStyle,
  controllerButtonTop: {
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    marginBottom: 10,
  } as ViewStyle,
  controllerButtonBottom: {
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginTop: 10,
  } as ViewStyle,
});

export default Controller;
