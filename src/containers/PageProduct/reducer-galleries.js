import { GALLERY_SET_CURRENT } from '../../constants';

const initialState = [];

const galleriesReducer = (state = initialState, action) => {
    switch (action.type) {

    case GALLERY_SET_CURRENT:
        const newGallery = g => {
            if (g.idGallery !== action.idGallery) {
                return g;
            }
            return Object.assign({}, g, { currentPic: action.idPic });
        };
        return state.map( gallery => newGallery(gallery) );

    default:
        return state;
    }
};

export default galleriesReducer;


/** WEBPACK FOOTER **
 ** ./containers/PageProduct/reducer-galleries.js
 **/