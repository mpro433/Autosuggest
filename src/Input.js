import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput } from 'react-native';

export default Input = forwardRef(({ h1, h2, h3, h4, h5, p, bold, italic, 
    error, style, ...other }, ref) => {
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        focus: () => {
            //setTimeout(() => inputRef.current.focus(), 0);//хак если клавиатура не показывается при фокусе // не работает =/
            inputRef.current?.focus();
        },
        blur: () => {
            inputRef.current?.blur();
        },
        isFocused: () => inputRef.current?.isFocused()
    }));

    return (
        <TextInput ref={inputRef}
            style={[
                h1 && { fontSize: 17 },
                h2 && { fontSize: 12 },
                h3 && { fontSize: 10 },
                h4 && { fontSize: 9 },
                h5 && { fontSize: 8 },
                //p && { fontSize: 12 },
                bold && { fontWeight: 'bold' },
                italic && { fontStyle: 'italic' },
                { fontFamily: 'Roboto' },
                style && style.color && { color: style.color },
                italic && { fontStyle: 'italic' },
                { fontFamily: 'Roboto' },
                style,
                error && { borderColor: Colors.red }
            ]}
            {...other}
        />
    );
});