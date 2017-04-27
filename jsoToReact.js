'use strict';
var React = require('react');

var createElement = React.createElement;
var isArray = Array.isArray;

module.exports = jsoToReact;
jsoToReact.children = jsoChildren;
jsoToReact.mapReverse = jsoMapReverse;
jsoToReact.map = jsoMap;
jsoToReact.r = function(fn) {
    return function render() {
        return jsoToReact(fn.apply(this, arguments));
    };
};


function jsoToReact(jso) {
    var elem = jso[0];
    var key;

    if (typeof elem === 'string') {
        if (elem) {
            if (elem.charCodeAt(0) === 43) {
                var props = {};
                return create(tagCSS(elem, props), props, jso, 1);
            };
            return create('div', {className: elem}, jso, 1);
        };

        return create('div', null, jso, 1);
    };

    if (typeof elem === 'function') {
        return create(elem, null, jso, 1);
    };

    if (elem === 1) {
        return jso[1];
    };

    if (!elem) {
        return null;
    };

    return elemToReact(elem, jso);
};


function elemToReact(elem, jso) {
    var classType = elem.class;

    if (typeof classType === 'function') {
        var props = {};
        var type = classType;

        for (var prop in elem) {
            if (prop === 'class') {
                continue;
            };

            props[prop] = elem[prop];
        };

        return create(type, props, jso, 1);
    };


    if (typeof classType === 'string' && !!classType) {
        if (classType.charCodeAt(0) === 43) { // '+'
            var props = {className: ''};
            var type = tagCSS(classType, props);
        } else {
            var props = {className: classType};
            var type = elem.tag;
        };

    } else {
        var props = {};
        var type = elem.tag;
    };

    for (var prop in elem) {
        if (prop == 'class' || prop === 'tag') {
            continue;
        };

        props[prop] = elem[prop];
    };

    return create(type || 'div', props, jso, 1);
};

function create(type, props, jso, childIndex) {
    return (jso && jso.length > childIndex
        ? createElement.apply(null, pushChilds([type, props], jso, childIndex))
        : createElement(type, props)
    );
};

function pushChilds(list, jso, startIndex) {
    var length = jso.length;
    var i = startIndex || 1;

    while(i < length) {
        var x = jso[i++];

        if (x === 0 || x === '') {
            list.push(x);
        };

        if (!x || x === true) {
            list.push(null);
            continue;
        };

        if (isArray(x)) {
            if (!!x[0]) {
                list.push(jsoToReact(x));
            } else {
                list.push(pushChilds([], x, 1));
            };
            continue;
        };

        if (typeof x === 'object') {
            list.push(elemToReact(x));
            continue;
        };

        list.push('' + x);
    };

    return list;
};


function jsoMapReverse(list, fn) {
    var m = [].concat(list);
    m.reverse();

    return jsoMap(m, fn);
};

function jsoMap(list, fn) {
    if (!list) {
        return null;
    };

    var len = list.length >>> 0;
    if (!len) {
        return null;
    };

    var m = [null];
    var i = 0;

    function push(value) {
        return m.push(value);
    };

    for(; i < len; i++) {
        m.push(fn(list[i], i, push));
    };

    return m;
};

function jsoChildren(self) {
    return [1, self.props.children];
};


function tagName(str, props) {
    if (str === 'div' || str === 'span' || str === 'i' || str === 'b') {
        return str;
    };

    var j = str.indexOf('.');
    if (j !== -1) {
        props.className = str.substr(j + 1);
        return j ? str.substr(0, j) : '';
    };

    return str;
};

function tagCSS(str, props) {
    if (str === '+button') return 'button';
    if (str === '+span') return 'span';
    if (str === '+p') return 'p';
    if (str === '+b') return 'b';
    if (str === '+i') return 'i';

    var j = findIndexPoint(str);
    if (j !== -1) {
        props.className = str.substr(j + 1);
        return str.substring(1, j);
    };

    return str.substr(1);
};

function findIndexPoint(s) {
    var length = +s.length;

    for(var i = 2; i < length; i++) {
        if (s.charCodeAt(i) !== 46) { // '.'
            continue;
        };
        return i;
    };

    return -1;
};

