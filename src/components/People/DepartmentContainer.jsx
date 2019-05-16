import React from 'react';
import PureComponent from '../PureComponent.jsx';

import DepartmentThumb from '../../components/People/DepartmentThumb.jsx';
import PeopleThumb from '../../components/People/PeopleThumb.jsx';

class DepartmentContainer extends PureComponent {

    render() {
        const { name, people, itemWidth, index, labels } = this.props;

        return (
            <div className="o-department">
                <DepartmentThumb name={name} itemWidth={itemWidth} index={index} labels={labels} />
                {
                    people.map(p => (<PeopleThumb
                        {...p}
                        departmentName={name}
                        itemWidth={itemWidth}
                        key={p.idPerson}
                    />))
                }
            </div>
        );
    }
}

export default DepartmentContainer;


/** WEBPACK FOOTER **
 ** ./components/People/DepartmentContainer.jsx
 **/