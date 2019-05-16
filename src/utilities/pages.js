// Constants
import { LANG_DE } from '../constants';

/**
 * Get the lang in 'it-IT' format and return the url equivalent prefix
 * @param lang
 */
export const getUrlLang = (lang) => (lang === LANG_DE) ? '/de' : '';

/**
 * Get the array of all pages and the name of the page as identifier
 * Return the single page object
 * @param pages
 * @param name
 */
export const getPage = (pages, name) => pages ? pages.find(p => p.name === name) || {} : {};


