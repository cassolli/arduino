import React, {useCallback} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import {log} from './lib/log';

type ControllerProps = {
  style?: ViewStyle;
};

type ControllerButtonProps = {
  style?: ViewStyle;
  title?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

const ControllerButton: React.FC<ControllerButtonProps> = props => {
  const startVibration = (event: GestureResponderEvent) => {
    Vibration.vibrate([30, 30], true);
    log.debug('--startVibration');
    log.debug(event);
  };

  const cancelVibration = (event: GestureResponderEvent) => {
    Vibration.cancel();
    log.debug('--cancelVibration');
    log.debug(event);
  };

  const onPress = () => {
    if (props?.onPress) props.onPress();
  };

  const onLongPress = () => {
    if (props?.onLongPress) props.onLongPress();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={startVibration}
      onPressOut={cancelVibration}>
      <View
        style={{
          ...style.controllerButtonContainer,
          ...(props?.style ?? {}),
        }}></View>
    </TouchableOpacity>
  );
};
const Controller: React.FC<ControllerProps> = props => {
  return (
    <View style={{...style.container, ...(props?.style ?? {})}}>
      <View style={style.containerButtonsLeft}>
        <ControllerButton
          title="Button Left"
          style={style.controllerButtonLeft}
          onPress={() => log.info('- Left')}
          onLongPress={() => log.info('- Long Left')}
        />
        <ControllerButton
          title="Button Right"
          style={style.controllerButtonRight}
          onPress={() => log.info('- Right')}
          onLongPress={() => log.info('- Long Right')}
        />
      </View>

      <View style={style.containerButtonsRight}>
        <ControllerButton
          title="Button Top"
          style={style.controllerButtonTop}
          onPress={() => log.info('- Top')}
          onLongPress={() => log.info('- Long Top')}
        />
        <ControllerButton
          title="Button Bottom"
          style={style.controllerButtonBottom}
          onPress={() => log.info('- Bottom')}
          onLongPress={() => log.info('- Long Bottom')}
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
