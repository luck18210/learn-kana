"use strict";

import {look_up_parent_until} from './utils.js';

/**
 * @returns {Function} Callback for 'hashchange' event to initiate Start page.
 * @param {Object} question Object with references to Start form.
 * @param {Object} kana Object with references to kana tables.
 */
export function init_start(question, kana) {
    let question_kanas_back = []; //Backup kanas
    let question_kanas = [];

    /**
     * Add kanas from column to pool, if needed.
     *
     * It is expected to have empty kanas in UI, these are going to be skipped.
     * @param {Object} column DOM div with kanas.
     *                 First element is input that determines whether to add to pool or not.
     *
     * @returns {void}
     */
    const add_column_if = (column) => {
        if (!column.children[0].children[0].checked) return;

        for (let idx = 1; idx < column.children.length; idx += 1) {
            const element = column.children[idx];

            if (/\w+/.test(element.title)) {
                question_kanas.push({
                    kana: element.innerHTML,
                    romaji: element.title
                });
            }
        }
    };

    /**
     * Initializes list of kanas from UI tables.
     * @returns {void}
     */
    const init_kanas = () => {
        //Both supposed to have equal length
        const hiragana_columns = kana.hiragana.tables.simple.children;
        const katakana_columns = kana.katakana.tables.simple.children;

        for (let idx = 0; idx < hiragana_columns.length; idx += 1) {
            add_column_if(hiragana_columns[idx]);
            add_column_if(katakana_columns[idx]);
        }

        //Both supposed to have equal length
        const double_hiragana_columns = kana.hiragana.tables.double.children;
        const double_katakana_columns = kana.katakana.tables.double.children;

        for (let idx = 0; idx < double_hiragana_columns.length; idx += 1) {
            add_column_if(double_hiragana_columns[idx]);
            add_column_if(double_katakana_columns[idx]);
        }

        const extra_katakana_columns = kana.katakana.tables.extra.children;
        for (let idx = 0; idx < extra_katakana_columns.length; idx += 1) {
            add_column_if(extra_katakana_columns[idx]);
        }

        question_kanas_back = question_kanas.slice(0);
    };

    /**
     * Gets random kana from remaining ones.
     * If there is no more, then restore pool of kanas from backup.
     *
     * @returns {Object} Kana object or undefined if there is none.
     */
    const random_kana = () => {

        if (question_kanas.length === 0) {
            if (question_kanas_back.length === 0) return undefined;
            else question_kanas = question_kanas_back.slice(0);
        }

        const idx = Math.floor(Math.random() * question_kanas.length);
        return question_kanas.splice(idx, 1)[0];
    };

    /**
     * Switches to next kana question.
     *
     * @returns {Boolean} true if new kana is available.
     *                    false otherwise.
     */
    const next_kana = () => {
        let q_kana = random_kana();

        if (q_kana === undefined) return false;

        question.answer.style.visibility = 'hidden';
        question.answer.innerHTML = q_kana.romaji;

        //Change text with animation.
        question.question.className = question.question.className.replace(/ *animate_fade_in */, '');
        void question.question.offsetWidth;
        question.question.innerHTML = q_kana.kana;
        question.question.className += " animate_fade_in";

        return true;
    };

    /**
     * Handles input changes.
     *
     * It verifies answer as user types its:
     * 1. If expected and user input are the same, then move to next kana.
     * 2. If not, then check whether user input len is equal or more of expected to indicate error.
     * 3. Otherwise do nothing.
     *
     * @param {Object} event DOM event.
     * @returns {void}
     */
    const input_on_change = (event) => {
        const expected_text = question.answer.textContent.toLowerCase();
        const value = event.target.value.toLowerCase();

        if (value === expected_text) {
            event.target.value = '';
            event.target.className = event.target.className.replace(" wrong", "");
            next_kana();
        }
        else if (value.length >= expected_text.length) {
            if (!/wrong/.test(event.target.className)) {
                event.target.className += " wrong";
            }
        }
        else {
            event.target.className = event.target.className.replace(" wrong", "");
        }
    };

    /**
     * Event handler for hover to show answer.
     * @returns {void}
     */
    const question_hover = () => {
        question.answer.style.visibility = '';
    };

    return function() {
        if (location.hash === "#Start") {
            init_kanas();
            if (!next_kana()) {
                return;
            }

            question.input.disabled = false;
            question.input.addEventListener('input', input_on_change);
            question.question.addEventListener('mouseover', question_hover);
        }
        else {
            question_kanas.length = 0;
            question_kanas_back.length = 0;
            question.input.disabled = true;

            question.answer.innerHTML = '　';
            question.question.innerHTML = '　';
            question.answer.style.visibility = 'hidden';

            question.input.className = question.input.className.replace(" wrong", "");
            question.input.removeEventListener('input', input_on_change);
            question.question.removeEventListener('mouseover', question_hover);
        }
    };
}

/**
 * @returns {Function} Callback for 'hashchange' event.
 * @param {Object} site_nav HTML element with links as its children.
 */
export function hash_change(site_nav) {
    return function() {
        const hash_re = new RegExp( `${(location.hash ? location.hash : '#')}$`);
        const nav_len = site_nav.children.length;
        const nav_children = site_nav.children;

        for (let idx = 0; idx < nav_len; idx += 1) {
            nav_children[idx].className = nav_children[idx].className.replace(' selected', '');
        }

        for (let idx = 0; idx < nav_len; idx += 1) {
            const link = nav_children[idx];

            if (hash_re.test(link.href)) {
                link.className += ' selected';
                break;
            }
        }
    };
}

/**
 * Click event handler for section.table.
 *
 * Section.table is supposed to consist of div.column
 * Once event is received div.column is being looked up.
 * Input element is first in div.column and it is being toggled.
 *
 * @param {Object} event Browser event.
 * @returns {void}
 */
function table_click(event) {
    if (/input/i.test(event.target.tagName)) return;
    else if (/table/.test(event.target.className)) return;

    const column = look_up_parent_until(event.target, 'div', 'column');
    const column_check = column.children[0].children[0];

    column_check.checked = !column_check.checked;
}

/**
 * Event handler to shift elements left inside container next to current element.
 *
 * If there is no more elements at left, then go from the end.
 *
 * @param {Object} event DOM event.
 *
 * @returns {void}
 */
function switch_left(event) {
    const current = event.target.nextElementSibling;
    const children_len = current.children.length;

    for (let idx = 0; idx < children_len; idx++) {
        const element = current.children[idx];

        if (element.style.display !== 'none') {
            const element_display = element.style.display;

            if (element.previousElementSibling) {
                element.style.display = 'none';
                element.previousElementSibling.style.display = element_display;
            }
            else {
                element.style.display = 'none';
                current.children[children_len-1].style.display = element_display;
            }

            return;
        }
    }
}

/**
 * Event handler to shift elements right inside container next to current element.
 *
 * If there is no more elements at right, then go from the beginning.
 *
 * @param {Object} event DOM event.
 *
 * @returns {void}
 */
function switch_right(event) {
    const current = event.target.previousElementSibling;
    const children_len = current.children.length;

    for (let idx = 0; idx < children_len; idx++) {
        const element = current.children[idx];

        if (element.style.display !== 'none') {
            const element_display = element.style.display;

            if (element.nextElementSibling) {
                element.style.display = 'none';
                element.nextElementSibling.style.display = element_display;
            }
            else {
                element.style.display = 'none';
                current.children[0].style.display = element_display;
            }

            return;
        }
    }
}

/**
 * Modify checked attribute of all checkboxes in current Kana table.
 * @param {Object} tables Container with Kana tables.
 * @param {Boolean} value Boolean to set checked attribute with.
 * @returns {void}
 */
function apply_to_table(tables, value) {
    const tables_keys = Object.keys(tables);
    const tables_len = tables_keys.length;
    return function() {
        for (let idx = 0; idx < tables_len; idx++) {
            const table = tables[tables_keys[idx]];

            if (table.style.display !== 'none') {
                const columns = table.children;
                const columns_len = columns.length;

                for (let column_idx = 0; column_idx < columns_len; column_idx += 1) {
                    columns[column_idx].children[0].children[0].checked = value;
                }

                break;
            }
        }
    };
}

/**
 * Initializes Kana tables UI.
 * @param {Object} kana Object that holds UI elements of Kana selection.
 * @returns {void}
 */
export function init_kana_tables(kana) {
    const keys = Object.keys(kana);
    const keys_len = keys.length;

    for (let idx = 0; idx < keys_len; idx++) {
        const element = kana[keys[idx]];

        element.tables.double.style.display = 'none';
        if ('extra' in element.tables) {
            element.tables.extra.style.display = 'none';
            element.tables.extra.addEventListener('click', table_click);
        }

        element.tables.simple.addEventListener('click', table_click);
        element.tables.double.addEventListener('click', table_click);

        element.left.addEventListener('click', switch_left);
        element.right.addEventListener('click', switch_right);

        element.select_all.addEventListener('click', apply_to_table(element.tables, true));
        element.reset_all.addEventListener('click', apply_to_table(element.tables, false));
    }
}
