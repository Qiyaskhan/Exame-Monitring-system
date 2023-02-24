import React, {useState} from 'react';
import {Chip} from 'react-native-paper';
import {View} from 'react-native';
const MyComponent = () => {
  const [isSelected, setisSelected] = useState(false);
  const [selectedColor, setselectedColor] = useState('grey');
  console.log(isSelected);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Chip
        mode="outlined"
        icon="star"
        closeIcon={'settings'}
        selected={true}
        selectedColor={selectedColor}
        style={{width: 35}}
        onPress={() =>
          selectedColor == 'red'
            ? setselectedColor('grey')
            : setselectedColor('red')
        }></Chip>
    </View>
  );
};

export default MyComponent;
