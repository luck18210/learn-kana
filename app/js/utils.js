"use strict";

/**
 * Look ups DOM tree for particular parent.
 *
 * @param {Object} tag Browser DOM element.
 * @param {String} tag_name Name of tag to look for. Optional.
 * @param {String} class_name Name of class to look for. Optional.
 *
 * @returns {Object} DOM element on success.
 *                   null otherwise.
 */
export function look_up_parent_until(tag, tag_name, class_name) {
    const tag_re = new RegExp(tag_name ? tag_name : '.*', 'i');
    const class_re = new RegExp(class_name ? class_name : '.*', 'i');

    for (let parent_tag = tag.parentElement; parent_tag !== null; parent_tag = parent_tag.parentElement) {
        if (tag_re.test(parent_tag.tagName) && class_re.test(parent_tag.className)) {
            return parent_tag;
        }
    }

    return null;
}
