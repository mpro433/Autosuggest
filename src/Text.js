import React from 'react';
import { Text as DefaultText } from 'react-native';

export default Text = ({ h1, h2, h3, h4, h5, p, bold, 
                 italic, style, ...rest }) => {
    return (
        <DefaultText style={[
                h1 && { fontSize: 17 },
                h2 && { fontSize: 12 },
                h3 && { fontSize: 10 },
                h4 && { fontSize: 9 },
                h5 && { fontSize: 8 },
                //p && { fontSize: 12 },
                bold && { fontWeight: 'bold' },
                italic && { fontStyle: 'italic'},
                {fontFamily: 'Roboto'},
                style && style.color && {color: style.color},                
                style
            ]}
            {...rest}
        ></DefaultText>
    );
};