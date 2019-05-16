import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

import DraggableWrapper from '../DraggableWrapper/DraggableWrapper.jsx';
// import AtelierHead from './AtelierHead.jsx';
import AtelierThumb from './../Atelier/AtelierThumb.jsx';
import InvitationsHead from '../../components/Invitations/InvitationsHead.jsx';

class InvitationsContainer extends PureComponent {

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    render() {
        const {isMoving, isMobile, isTablet, draggable, pics, itemWidth, labels, title, description, attachment} = this.props;
        const {initialXPosition, snapArray, draggableWidth} = draggable;

        return (
            <div className="o-invitations-container">
                <DraggableWrapper
                    modifier="o-invitations__draggable"
                    isMoving={isMoving}
                    width={draggableWidth}
                    snapArray={snapArray}
                    initialXPosition={initialXPosition}
                >
                    <InvitationsHead
                        itemWidth={itemWidth}
                        isMobile={isMobile}
                        labels={labels}
                        title={title}
                        description={description}
                        attachment={attachment}
                    />
                    {
                        pics.map(p =>
                            <AtelierThumb key={Math.random()} imageSrc={p.imageSrc} width={itemWidth * (p.width || 1)} />
                        )
                    }
                </DraggableWrapper>
            </div>
        );
    }
}

InvitationsContainer.propTypes = {
    pics: React.PropTypes.array.isRequired,
    itemWidth: React.PropTypes.number.isRequired
};

export default InvitationsContainer;


