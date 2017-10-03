import {Sortable} from '@shopify/draggable';

$(document).ready(() => {
    new Sortable([document.getElementById('one')], {draggable: 'div',})
        .on('sortable:start', () => console.log('sortable:start'))
        .on('sortable:sorted', () => console.log('sortable:sorted'))
        .on('sortable:stop', () => console.log('sortable:stop'));
});