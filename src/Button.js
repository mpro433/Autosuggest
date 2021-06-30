import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { TouchableHighlight } from 'react-native';
import Text from './Text';

export default Button = forwardRef(({ h1, h2, h3, h4, h5, bold,
        title, style, underlayColor, titleStyle, 
        pressedStyle, pressedTitleStyle, onPress, ...other }, ref) => {

    const buttonRef = useRef(null);
    const [pressed, setPressed] = useState(false);

    useImperativeHandle(ref, () => ({
        onPress: () => { buttonRef.current._onPress(); },
    }));

    const _onPress = onPress;
    
    return (
        <TouchableHighlight ref={buttonRef}
            style={[
                //{backgroundColor: Colors.primary}, 
                {alignItems: 'center', justifyContent: 'center'},
                style,
                pressed && pressedStyle
            ]}
            underlayColor={underlayColor}  
            onHideUnderlay={() => {setPressed(false);}}
            onShowUnderlay={() => {setPressed(true);}}
            onPress={onPress}
            {...other}
        >
            <Text h1={h1} h2={h2} h3={h3} h4={h4} h5={h5} bold={bold}
                style={[
                    {textAlign: 'center', textAlignVertical: 'center'}, 
                    titleStyle, pressed && pressedTitleStyle
                ]}
            >
                {title}
            </Text>
        </TouchableHighlight>
    );
});