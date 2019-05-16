import React from 'react';
import PureComponent from '../PureComponent.jsx';
import { findDOMNode } from 'react-dom';

// Utilities
import { bindFunctions } from '../../utilities/utils';

class Menu extends PureComponent {

    constructor(props) {
        super(props);

        const { categories, items } = props;

        bindFunctions.call(this, ['getMenuGroup', 'getMenuGroup']);

        this.spriteConfig = {
            frameRatio: 1.78,
            frames: 25
        };

        this.menuModifier = this.getMenuTriggerModifier(props.appState.isMenuOpen);

        const leftColumnData = categories[0] ? this.getMenuGroup(0, categories, items) : {};
        const centerColumnData = categories[1] ? this.getMenuGroup(1, categories, items) : {};
        const rightColumnData = categories[2] ? this.getMenuGroup(2, categories, items) : {};
        const bottomLeftData = categories[3] ? this.getMenuGroup(3, categories, items) : {};
        const bottomRightData = categories[4] ? this.getMenuGroup(4, categories, items) : {};

        this.leftColumn = this.renderMenuGroup(leftColumnData);
        this.centerColumn = this.renderMenuGroup(centerColumnData);
        this.rightColumn = this.renderMenuGroup(rightColumnData);
        this.bottomLeft = this.renderMenuGroup(bottomLeftData);
        this.bottomRight = this.renderMenuGroup(bottomRightData);
    }

    componentDidMount() {
        this.el = findDOMNode(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.appState.isMenuOpen !== this.props.appState.isMenuOpen) {
            this.menuModifier = this.getMenuTriggerModifier(nextProps.appState.isMenuOpen);
        }
    }

    getMenuTriggerModifier(isMenuOpen) {
        const modifier = {
            [2]: 'is-menu-closing',
            [3]: 'is-menu-open'
        };
        return modifier[isMenuOpen] ? modifier[isMenuOpen] : 'is-menu-close';
    }

    getMenuGroup(index, categories, items) {
        return {
            index: index,
            heading: categories[index] ? categories[index].name : '',
            items: items.filter(i => i.idMenuCategory === categories[index].idMenuCategory)
        };
    }

    renderMenuGroup(group) {
        const { onClickLink } = this.props;
        const item = (idItem, href, clickCallback, text) => (
            <li key={idItem} className="o-menu__item">
                <a href={href}
                   className="o-menu__link"
                   onClick={clickCallback}>{text}</a>
            </li>
        );
        if (typeof group.index === 'undefined' || typeof group.items === 'undefined') {
            return [];
        }
        return (group.index < 3) ? (
            <li>
                <span className="u-text--geometric">{group.heading}</span>
                <ul>
                    {
                        group.items.map(i => item(i.idMenuItem, i.href, onClickLink(i.href, i.name).bind(this), i.name))
                    }
                </ul>
            </li>
        ) : group.items.map(i => item(i.idMenuItem, i.href, onClickLink(i.href).bind(this), i.name));

    }

    render() {
        const { appState, onClickLink, labels } = this.props;
        const { windowWidth, windowHeight } = appState;

        let layerWidth, layerHeight;

        if (windowWidth / windowHeight > this.spriteConfig.frameRatio) {
            layerWidth = windowWidth;
            layerHeight = layerWidth / this.spriteConfig.frameRatio;
        } else {
            layerHeight = windowHeight;
            layerWidth = layerHeight * this.spriteConfig.frameRatio;
        }

        const spriteStyle = {
            width: layerWidth * this.spriteConfig.frames + 'px',
            height: layerHeight + 'px'
        };

        const hdBgStyle = {
            width: layerWidth + 'px',
            height: layerHeight + 'px'
        };

        return (
            <nav className={`o-menu ${this.menuModifier}`}>
                <div className="o-menu__container">
                    <div className="o-menu__head">
                        <ul className="o-menu__inner o-menu__inner--head">
                            <li className="o-menu__item o-menu__item--head">
                                <a href="/"
                                   className="o-menu__link"
                                   onClick={onClickLink('/').bind(this)}>{labels['italian']}</a>
                            </li>
                            <li className="o-menu__item o-menu__item--head">
                                <a href="/de"
                                   className="o-menu__link"
                                   onClick={onClickLink('/de').bind(this)}>{labels['german']}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="o-menu__top">
                        <ul className="o-menu__inner">
                            { this.leftColumn }
                        </ul>
                        <ul className="o-menu__inner">
                            { this.centerColumn }
                        </ul>
                        <ul className="o-menu__inner">
                            { this.rightColumn }
                        </ul>
                    </div>
                    <div className="o-menu__bottom">
                        <ul className="o-menu__inner o-menu__inner--bottom">
                            { this.bottomLeft }
                        </ul>
                        <ul className="o-menu__inner o-menu__inner--bottom">
                            { this.bottomRight }
                        </ul>
                    </div>
                </div>

                <div className="o-menu__transition">
                    <div className="o-menu__background" style={spriteStyle}></div>
                    <div className="o-menu__hd" style={hdBgStyle}></div>
                </div>
            </nav>
        );
    }
}

Menu.propTypes = {
    items: React.PropTypes.array.isRequired,
    categories: React.PropTypes.array.isRequired,
    appState: React.PropTypes.object.isRequired,
    onClickLink: React.PropTypes.func
};

export default Menu;


/** WEBPACK FOOTER **
 ** ./components/Menu/Menu.jsx
 **/