import React from 'react';
import PureComponent from '../PureComponent.jsx';

class HomeSwitcher extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            winWidth: 0,
            winHeight: 0
        };
    }

    componentDidMount() {
        const { windowHeight, windowWidth } = this.props;

        this.setState({
            winWidth: windowWidth,
            winHeight: windowHeight
        });
    }

    render() {
        const {isMobile, categories, selection, onCategoryClick, onCategoryMouseEnter, onCategoryMouseLeave} = this.props;

        const bgOne = (global.pD || '') + categories[0].imageSrc || (global.pD || '') + '/public/gallery/items/48/Clara_col.jpg';
        const bgTwo = (global.pD || '') + categories[1].imageSrc || (global.pD || '') + '/public/gallery/items/48/Clara_col.jpg';

        const voiceY = isMobile
            ? [(this.state.winHeight / 2 - 30), (this.state.winHeight / 2 + 20)]
            : [(this.state.winHeight / 2 - 60), (this.state.winHeight / 2 + 30)];

        let modifier = '',
            picVisibility = '';

        switch (selection) {
        case 0:
            modifier = 'o-homeswitcher--selected';
            picVisibility = 'has-first-image';
            break;
        case 1:
            modifier = 'o-homeswitcher--selected';
            picVisibility = 'has-second-image';
            break;
        default:
            modifier = 'o-homeswitcher--unselected';
            picVisibility = '';
        }

        const imageTag = `<image
                class="image_1"
                xlink:href="${bgOne}"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice" />
            <image
                class="image_2"
                xlink:href="${bgTwo}"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice" />`;

        return (
            <div className={`o-homeswitcher ${modifier} ${picVisibility}`}>
                <svg className="o-homeswitcher__svg" viewBox={`0 0 ${this.state.winWidth} ${this.state.winHeight}`}>
                    <defs>
                        <pattern
                            id="space-1"
                            patternUnits="userSpaceOnUse"
                            width={this.state.winWidth}
                            height={this.state.winHeight}
                            dangerouslySetInnerHTML={{ __html: imageTag }}
                        />
                        <pattern
                            id="space-2"
                            patternUnits="userSpaceOnUse"
                            width={this.state.winWidth}
                            height={this.state.winHeight}
                            dangerouslySetInnerHTML={{ __html: imageTag }}
                        />
                    </defs>
                    {
                        categories.map((c, i) => (
                            <text className="o-homeswitcher__link"
                                textAnchor="start"
                                alignmentBaseline="middle"
                                x="15%"
                                y={voiceY[i] + 'px'}
                                fill={`url(#space-${i + 1})`}
                                key={c.idCategory}
                                onClick={onCategoryClick(c.slug)}
                                onMouseEnter={onCategoryMouseEnter(i)}
                                onMouseLeave={onCategoryMouseLeave}
                            >
                                {c.name}
                            </text>
                        ))
                    }
                </svg>

                <div className="o-homeswitcher__background o-homeswitcher__background--one" style={{
                    backgroundImage: `url(${bgOne})`
                }}></div>
                <div className="o-homeswitcher__background o-homeswitcher__background--two" style={{
                    backgroundImage: `url(${bgTwo})`
                }}></div>
            </div>
        );
    }
}

HomeSwitcher.propTypes = {
    categories: React.PropTypes.array.isRequired,
    selection: React.PropTypes.number.isRequired,
    onCategoryClick: React.PropTypes.func.isRequired,
    onCategoryMouseEnter: React.PropTypes.func.isRequired,
    onCategoryMouseLeave: React.PropTypes.func.isRequired
};

export default HomeSwitcher;


/** WEBPACK FOOTER **
 ** ./components/Home/HomeSwitcher.jsx
 **/