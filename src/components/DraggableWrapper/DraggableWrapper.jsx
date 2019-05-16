import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

import { bindFunctions, throttle } from '../../utilities/utils';

import { TweenMax } from 'gsap';
import Draggable from 'gsap/src/uncompressed/utils/Draggable';
import ThrowPropsPlugin from 'gsap/src/uncompressed/plugins/ThrowPropsPlugin';

class DraggableWrapper extends PureComponent {

    constructor(props) {
        super(props);

        this.draggable = undefined;
        this.state = {
            canScroll: true
        };

        bindFunctions.call(this, ['wheelHandler']);

    }

    componentDidMount() {
        const {snapArray} = this.props;
        this.el = findDOMNode(this);

        this.createDraggable(this.el, snapArray);
    }

    componentWillUnmount() {
        // Remove Draggable
        this.removeDraggable();
    }

    componentDidUpdate(prevProps) {
        if (this.props.snapArray !== prevProps.snapArray) {
            this.removeDraggable();
            this.draggable = this.createDraggable(this.el, this.props.snapArray);
        }
    }

    createDraggable(el, snapArray) {
        return Draggable.create(el, {
            type: 'x',
            dragClickables: true,
            zIndexBoost: false,
            throwProps: true,
            cursor: 'move',
            snap: snapArray,
            onDragStart: () => el.classList.add('is-grabbing'),
            onDragEnd: () => el.classList.remove('is-grabbing')
        });
    }

    removeDraggable() {
        if (this.draggable && this.draggable[0]) {
            this.draggable[0].kill();
            this.draggable = undefined;
        }
    }

    wheelHandler(e) {
        const { snapArray } = this.props;

        if (this.state.canScroll) {
            this.setState({
                canScroll: false
            });

            const currentX = this.el._gsTransform.x || 0;
            const rounded = snapArray.reduce((prev, curr) => Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev);
            const index = snapArray.indexOf(rounded);

            if (Math.round(e.deltaY) > 0 && index < snapArray.length - 1) {
                TweenMax.to(this.el, 0.5, { x: snapArray[index + 1] });
            } else if (Math.round(e.deltaY) < 0  && index > 0) {
                TweenMax.to(this.el, 0.5, { x: snapArray[index - 1] });
            }

            setTimeout(() => {
                this.setState({
                    canScroll: true
                });
            }, 200);
        }
    }

    render() {
        const { modifier, width, initialXPosition, children } = this.props;

        const style = {
            width: width,
            left: `${initialXPosition}px`
        };

        return (
            <div className={`c-draggable ${modifier}`} style={style} onWheel={this.wheelHandler}>
                {children}
            </div>
        );
    }
}

export default DraggableWrapper;


