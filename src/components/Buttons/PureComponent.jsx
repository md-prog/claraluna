import React, { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

class PureComponent extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

}
export default PureComponent;


