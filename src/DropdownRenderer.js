import React, { Component } from 'react';
import memoize from "memoize-one";
import { Animated, Easing, LayoutAnimation, UIManager } from 'react-native';
import { withAnchorPoint } from 'react-native-anchor-point';
import { DROPDOWN_OPEN_DURATION, DROPDOWN_CLOSE_DURATION, TABBAR_HEIGHT } from './constants';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class DropdownRenderer extends Component {
  constructor(props) {
    super(props);

    const offset = props.menuMeasure ? props.layouts.triggerLayout.y - props.menuMeasure.y : 0;
    this.state = {
      offset,
      animValue: 0,
      anim: new Animated.Value(0)
    };
  }
  
  componentDidMount() {
    this.state.anim.addListener(({value}) => {
      if((value === 1) || (value === 0))
        this.setState({animValue: value});
    });
    Animated.timing(this.state.anim, {
      duration: DROPDOWN_OPEN_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.in),
      useNativeDriver: true,
    }).start();
  }

  componentWillUnmount() {
    this.state.anim.removeAllListeners();
  }

  close () {
    return new Promise(resolve => {      
      Animated.timing(this.state.anim, {
        duration: DROPDOWN_CLOSE_DURATION,
        toValue: 0,
        easing: Easing.out(Easing.in),
        useNativeDriver: true,
      }).start();
      return resolve();
    });
  }

  performLayoutAnimation = memoize( (menuMeasure) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  });

  computePosition(layouts) {
    const { triggerLayout, optionsLayout, windowLayout } = layouts;

    if (triggerLayout.y + optionsLayout.height > windowLayout.height - TABBAR_HEIGHT)
      return {
        viewPostiton: {
          "left": triggerLayout.x,
          "top": triggerLayout.y - optionsLayout.height,
          "width": triggerLayout.width
        },
        anchorPosition: { x: 0.5, y: 1 }
      };

    return {      
      viewPostiton: {
        "left": triggerLayout.x,        
        "top": triggerLayout.y + triggerLayout.height,
        "width": triggerLayout.width
      },
      anchorPosition: { x: 0.5, y: 0 }
    };
  }

  computePositionWithMeasure(layouts, menuMeasure) {
    if(this.state.animValue === 1) {
      this.performLayoutAnimation(menuMeasure);
    }

    const { triggerLayout, optionsLayout, windowLayout } = layouts;

    if (menuMeasure.y + this.state.offset + optionsLayout.height > windowLayout.height - TABBAR_HEIGHT)
      return {
        viewPostiton: {
          "left": triggerLayout.x,
          "top": menuMeasure.y + this.state.offset - optionsLayout.height,
          "width": triggerLayout.width
        },
        anchorPosition: { x: 0.5, y: 1 }
      };

    return {      
      viewPostiton: {
        "left": triggerLayout.x,        
        "top": menuMeasure.y + this.state.offset + triggerLayout.height,
        "width": triggerLayout.width
      },
      anchorPosition: { x: 0.5, y: 0 }
    };
  }

  render() {
    const {style, children, layouts, menuMeasure, ...other} = this.props;

    const { height: oHeight, width: oWidth } = layouts.optionsLayout;
    const transform = {
      transform: [
        { perspective: 300 },
        { scaleY: this.state.anim }
      ]
    };
    const {viewPostiton, anchorPosition} = menuMeasure ? this.computePositionWithMeasure(layouts, menuMeasure) : this.computePosition(layouts);
    const animation = withAnchorPoint(transform, anchorPosition, {width: oWidth, height: oHeight});

    return (
      <Animated.View {...other} style={[style, viewPostiton, animation, {marginTop: 2}]} >
        {children}
      </Animated.View>        
    );  
  }
}