import React from 'react';
import PureComponent from '../PureComponent.jsx';

class InvitationsHead extends PureComponent {

    render() {
        const {isMoving, isMobile, isTablet, attachment, itemWidth, title, description, labels} = this.props;

        const headStyle = {
            width: `${itemWidth}px`
        };

        return (
            <div className="o-invitations-container__head" style={headStyle}>
                <div className="o-invitations-container__inner">
                    <h1 className="o-invitations__title">{title}</h1>
                    {
                        attachment &&
                            (<a
                                href={attachment}
                                target="__blank"
                                className="o-invitations__attachment u-link--primary"
                            >
                                {labels['download_pdf']}
                            </a>)
                    }
                    <div className="o-invitations__desc" dangerouslySetInnerHTML={{
                        __html: description
                    }} />

                    {
                        (isMobile || isTablet) && (<span className="o-invitations__cta">{labels['drag_or_scroll']}</span>)
                    }
                </div>
            </div>
        );
    }
}

InvitationsHead.propTypes = {
    isMobile: React.PropTypes.number.isRequired,
    isTablet: React.PropTypes.number.isRequired,
    itemWidth: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    attachment: React.PropTypes.string,
    description: React.PropTypes.string.isRequired,
    labels: React.PropTypes.object
};

export default InvitationsHead;


