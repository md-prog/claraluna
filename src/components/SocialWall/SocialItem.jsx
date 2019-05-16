import React from 'react';
import PureComponent from '../PureComponent.jsx';
import TransitionGroup from 'react-addons-transition-group';
import { findDOMNode } from 'react-dom';

// Utilities
import { bindFunctions } from '../../utilities/utils';

// Components
import YouTube from 'react-youtube';

class SocialItem extends PureComponent {

    constructor(props) {
        super(props);

        bindFunctions.call(this, ['getContentMarkup']);
    }

    getContentMarkup() {
        const { type, mediaSrc, outerLink, content } = this.props;
        let markup = [];
        switch (type) {
        case 'instagram':
            markup = (
                <a href={outerLink} target="_blank"><div className="o-social__img" style={{ backgroundImage: `url(${mediaSrc})` }}></div></a>
            );
            break;
        case 'facebook':
        case 'twitter':
            markup = (
                <div className="o-social__text" dangerouslySetInnerHTML={ {__html: content} } />
            );
            break;
        case 'youtube':
            const opts = {
                height: '100%',
                width: '100%',
                playerVars: {// https://developers.google.com/youtube/player_parameters
                    color: 'white',
                    controls: 2,
                    showinfo: 0,
                    theme: 'light',
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    fs: 0
                }
            };
            markup = (
                <YouTube
                    videoId={mediaSrc}
                    className='c-youtube'
                    opts={opts}
                />
            );
            break;
        default:
        }

        return markup;
    }

    render() {
        const { modifier, author, icon, authorLink } = this.props;

        return (
            <div className={`o-social__item ${modifier}`}>
                <div className="o-social__inner">
                    <div className="o-social__body">
                        { this.getContentMarkup() }
                    </div>
                    <div className="o-social__footer">
                        <div className="o-social__author">
                            <a href={ authorLink } target="_blank">{ `@${author}` }</a>
                        </div>
                        <div className="o-social__icon">
                            <i className={`o-ico ${icon}`}></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


export default SocialItem;


