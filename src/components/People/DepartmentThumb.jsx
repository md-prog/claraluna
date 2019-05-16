import React from 'react';
import PureComponent from '../PureComponent.jsx';

class DepartmentThumb extends PureComponent {

    render() {
        const { name, itemWidth, index, labels } = this.props;

        const thumbStyle = {
            width: itemWidth
        };

        return (
            <div className="c-thumb c-thumb--department" style={thumbStyle}>
                {index === 0 && <span className="c-thumb__cta u-text--geometric u-cursor-def">{labels['drag_or_scroll']}</span>}
                <h3 className="c-thumb__caption c-thumb__caption--department">
                    <span>{name}</span>
                </h3>
            </div>
        );
    }
}

export default DepartmentThumb;


/** WEBPACK FOOTER **
 ** ./components/People/DepartmentThumb.jsx
 **/