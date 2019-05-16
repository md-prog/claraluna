import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

import SplitText from '../../vendor/gsap/utils/SplitText';
class PeopleThumb extends PureComponent {

    componentDidMount() {

        this.el = findDOMNode(this);
        this.name = this.el.querySelector('.c-thumb__title');
        this.nameSplitted = new SplitText(this.name, { type: 'words', wordsClass: 'c-thumb__name' });

    }

    render() {
        const { imageSrc, name, role, itemWidth, departmentName } = this.props;

        const thumbStyle = {
            width: itemWidth
        };

        const thumbCoverStyle = {
            backgroundImage: `url(${global.pD || ''}${imageSrc})`
        };

        return (
            <div className="c-thumb c-thumb--people" style={thumbStyle}>
                <div className="c-thumb__cover-container c-thumb__cover-container--people">
                    <div className="c-thumb__cover c-thumb__cover--people" style={thumbCoverStyle}></div>
                </div>
                <p className="c-thumb__category">{departmentName}</p>
                <h3 className="c-thumb__caption c-thumb__caption--people">
                    <span className="c-thumb__title">{name}</span>
                    <span className="c-thumb__subtitle">{role}</span></h3>
            </div>
        );
    }
}

export default PeopleThumb;


