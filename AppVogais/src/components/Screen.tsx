import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type ScreenProps = {
  style?: ViewStyle;
  text?: string;
  childrenContainer?: ViewStyle;
};

const Screen: React.FC<ScreenProps> = props => {
  return (
    <View style={{...style.container, ...(props?.style ?? {})}}>
      <View
        style={{
          ...style.childrenContainer,
          ...(props?.childrenContainer ?? {}),
        }}>
        <ScrollView>{props.children}</ScrollView>
      </View>

      <Text style={style.text}>{props.text ?? ''}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 435,
    backgroundColor: '#d3d3d3',
    borderRadius: 16,
    borderColor: '#000',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 32,
  } as ViewStyle,

  childrenContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: '#e0e',
    opacity: 0.1,
  } as ViewStyle,

  text: {
    width: '100%',
    fontSize: 48,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    marginTop: 32,
  } as TextStyle,
});

export default Screen;
