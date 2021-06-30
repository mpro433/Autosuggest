import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Easing, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { Text, Input } from './';
import DropdownRenderer from './DropdownRenderer';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import { DROPDOWN_OPEN_DURATION, DROPDOWN_CLOSE_DURATION } from './constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const OPTIONS_LIST_OFFSET = 47;

export default Autosuggest = ({ 
    value, suggestions, label, error,
    onInputEnd, renderItem, renderTrigger, filter, optionsListHeight,
    style, inputStyle, triggerStyle, optionsListStyle, ...other 
}) => {
  const [_value, _setValue] = useState(null);
  const [menuMeasure, setMenuMeasure] = useState(null);
  const [opened, setOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(suggestions);
  const anim = useRef(new Animated.Value(0)).current;
  

  useEffect(() => {
    Animated.timing(anim, {
      duration: opened ? DROPDOWN_OPEN_DURATION : DROPDOWN_CLOSE_DURATION,
      toValue: opened ? 1 : 0,
      easing: Easing.out(Easing.in),
      useNativeDriver: true,
    }).start();
  }, [opened])

  const onTextChanged = query => {
    const data = query ? suggestions.filter(item => filter(item, query)) : suggestions;
    setQuery(query);
    setData(data);
  }

  const clearText = () => {
    onTextChanged("");
  }

  const onSelect = item => {
    if(onInputEnd)
      onInputEnd(item);
    else
      _setValue(item);

    clearText();
  };

  const _renderItem = ({ item }) => (
    <MenuOption value={item}>
      {renderItem(item)}
    </MenuOption>
  );
  

  const arrowAngle = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0rad", `${Math.PI}rad`],
  });

  const onLayout = (event) => {
    setMenuMeasure(event.nativeEvent.layout);
  }

  return (
    <View onLayout={onLayout} collapsable={false}>
      <Menu style={[style, { borderColor: error ? "red" : 'transparent', borderWidth: 1, borderRadius: triggerStyle?.borderRadius }]}
        renderer={DropdownRenderer}
        rendererProps={{menuMeasure}}
        onSelect={onSelect}
        onOpen={() => { onTextChanged(query); setOpened(true); }}
        onClose={() => { setOpened(false); }}      
      >
        <MenuTrigger>
          <View style={triggerStyle}>
            <View style={{ flex: 1, marginLeft: 20 }}>
              {value || _value ? 
                (value ? renderTrigger(value) : renderTrigger(_value)) :
                (<Text h2 style={{ marginLeft: 15 }}>{label}</Text>)
              }
            </View>
            <Animated.View style={[{ transform: [{ rotateZ: arrowAngle }] }, { marginRight: 20 }]}>
              <Icon name="chevron-up" size={15} color="black" />
            </Animated.View>
          </View>
        </MenuTrigger>

        <MenuOptions
          customStyles={{
            optionsWrapper: { flex: 1, flexDirection: 'column' },
            optionsContainer: [{ height: optionsListHeight + OPTIONS_LIST_OFFSET }, styles.optionsContainer]
          }}
        >
          <View>
            <View style={[triggerStyle, { paddingHorizontal: 8, justifyContent: 'flex-start' }]}>
              <Icon name="search" size={15} color="black" />
              <Input style={inputStyle}
                placeholder={"Search..."}
                value={query}
                onChangeText={onTextChanged}
              />
              <TouchableOpacity onPress={clearText}>
                <Icon name="times-circle" size={15} color="black" />
              </TouchableOpacity>
            </View>
            {(data.length > 0) ?
              (<FlatList style={{ ...optionsListStyle, height: optionsListHeight }}
                keyboardShouldPersistTaps='always'
                persistentScrollbar
                keyExtractor={(item, i) => i.toString()}
                data={data}
                renderItem={_renderItem}
              />)
              : (<View style={{...optionsListStyle, height: optionsListHeight, justifyContent: 'center', alignItems: 'center'}}>
                  <Text h2>Nothing found</Text>
                </View>)
            }
          </View>
        </MenuOptions>
      </Menu>
    </View>
  );

}

Autosuggest.propTypes = {
  label: PropTypes.string.isRequired,
  optionsListHeight: PropTypes.number.isRequired,
  renderItem: PropTypes.func.isRequired, 
  renderTrigger: PropTypes.func.isRequired, 
  filter: PropTypes.func.isRequired,

  setRef: PropTypes.func,
  onInputEnd: PropTypes.func,
  value: PropTypes.object,
  suggestions: PropTypes.array,
  error: PropTypes.bool,
  
  style: PropTypes.any,
  inputStyle: PropTypes.any,
  triggerStyle: PropTypes.any,
  optionsListStyle: PropTypes.any
};

const styles = StyleSheet.create({
  optionsContainer: {
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingBottom: 20
  },
});