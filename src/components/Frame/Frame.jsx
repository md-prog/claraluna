import React from 'react';
import PureComponent from '../PureComponent.jsx';

class Frame extends PureComponent {
    render() {
        const { modifier } = this.props;
        return <div className={`o-frame ${modifier}`} />;
    }
}

export default Frame;


