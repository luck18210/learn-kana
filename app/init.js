"use strict";

import * as ui from './js/UI.js';

//File is auto-required
window.addEventListener("load", function() {
    const site_nav = document.body.children[0];

    const question_section = document.getElementById('Start').children[2];
    const question = {
        wrapper: question_section,
        question: question_section.children[0],
        answer: question_section.children[1],
        input: question_section.children[2]
    };

    const tabs = {
        hiragana: document.getElementById("Hiragana"),
        katakana: document.getElementById("Katakana"),
    };

    const kana = {
        hiragana: {
            tables: {
                simple: tabs.hiragana.children[1].children[1].children[0],
                double: tabs.hiragana.children[1].children[1].children[1]
            },
            left: tabs.hiragana.children[1].children[0],
            right: tabs.hiragana.children[1].children[2],
            select_all: tabs.hiragana.children[2].children[0],
            reset_all: tabs.hiragana.children[2].children[1],
        },
        katakana: {
            tables: {
                simple: tabs.katakana.children[1].children[1].children[0],
                double: tabs.katakana.children[1].children[1].children[1],
                extra: tabs.katakana.children[1].children[1].children[2]
            },
            left: tabs.katakana.children[1].children[0],
            right: tabs.katakana.children[1].children[2],
            select_all: tabs.katakana.children[2].children[0],
            reset_all: tabs.katakana.children[2].children[1],
        }
    };

    ui.init_kana_tables(kana);

    const on_hash_change = ui.hash_change(site_nav);
    const on_hash_start_page = ui.init_start(question, kana);

    on_hash_change();
    on_hash_start_page();
    window.addEventListener("hashchange", on_hash_change);
    window.addEventListener("hashchange", on_hash_start_page);
});
