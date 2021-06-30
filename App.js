import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, StatusBar,
    Platform, LayoutAnimation, UIManager,
} from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';
import { MenuProvider } from 'react-native-popup-menu';

import { Text, Button, Input } from './src';
import Autosuggest from './src/Autosuggest';

const data = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    duration: "2h 22min",
    genre: ["Crime", "Drama"],
    rate: 9.3,
  },
  {
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    duration: "2h 55min",
    genre: ["Crime", "Drama"],
    rate: 9.2,
  },
  {
    title: "Mission Impossible",
    year: 1999,
    director: "zzz",
    duration: "2h 55min",
    genre: ["Action"],
    rate: 7.2,
  }
];

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const { keyboardShown } = useKeyboard();
  const [fitContent, setFitContent] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFitContent(keyboardShown);
  }, [keyboardShown]);

  const renderItem = (item) => (
    <View style={styles.itemStyle}>
      <Text h2 bold>{item.title}</Text>
      <Text h3>Year: {item.year}</Text>
      <Text h3>Director: {item.director}</Text>
      <Text h3>Duration: {item.duration}</Text>
      <Text h3 bold>Rate: {item.rate}</Text>
    </View>
  );

  const renderTrigger = (item) => (
    <Text h2 style={{ marginLeft: 15 }}>{item.title}</Text>
  )

  const filter = (item, query) => item.title.toLowerCase().includes(query.toLowerCase());

  return (
    <MenuProvider>
      <SafeAreaView style={{height: '100%', width: '100%'}}>
        <StatusBar hidden={false} />
            <View style={styles.container}>
              <Text h1 bold>Dropdown autosuggest example</Text>
              <View style={{flex: 1, justifyContent: fitContent ? "flex-start" : "center"}}>
                <Autosuggest style={{ marginTop: 10 }}
                  inputStyle={autosuggestStyles.input}
                  triggerStyle={autosuggestStyles.trigger}
                  optionsListStyle={autosuggestStyles.optionsList}
                  value={value}
                  label={'Choose movie'}
                  suggestions={data}
                  onInputEnd={(val) => {setValue(val);}}
                  renderItem={renderItem}
                  renderTrigger={renderTrigger}
                  filter={filter}
                  optionsListHeight={200}
                  //error={error}
                />
              </View>
            </View>
      </SafeAreaView>
    </MenuProvider>
  );
};

const autosuggestStyles = StyleSheet.create({
  trigger: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 5
  },
  input: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  optionsList: {
    marginTop: 3,
    borderRadius: 5,
    backgroundColor: 'white',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 22,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 8,
    backgroundColor: 'darkolivegreen', 
  },
  itemStyle: {
    flexDirection: 'column', 
    borderColor: 'grey', 
    padding: 10, 
    borderRadius: 8, 
  }
});

export default App;
