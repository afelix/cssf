var $cssf = {

    vendor: [
        '-moz-',    // Mozilla Foundation (Gecko-based browsers)
        '-khtml-',   // Konqueror browser
        '-webkit-', // Safari (and other WebKit-based browsers)
        '-o-',      // Opera Software
        '-atsc-',   // Advanced Television Standards Committee
        '-wap-',    // The WAP Forum
        '-ms-',     // Microsoft
        'mso-'     // Microsoft Office
    ],

    order: [
        [
            "font",
            "font-family",
            "font-size",
            "font-size-adjust",
            "font-weight",
            "font-style",
            "font-variant",
            "font-effect",
            "font-emphasize",
            "font-emphasize-position",
            "font-emphasize-style",
            "font-smooth",
            "font-stretch"
        ],
        [
            "position",
            "z-index",
            "top",
            "right",
            "bottom",
            "left"
        ],
        [
            "display",
            "visibility",
            "float",
            "clear",
            "overflow",
            "overflow-x",
            "overflow-y",
            "overflow-style",
            "clip",
            "zoom"
        ],
        [
            "box-sizing",
            "width",
            "min-width",
            "max-width",
            "height",
            "min-height",
            "max-height",
            "margin",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
            "padding",
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left"
        ],
        [
            "table-layout",
            "empty-cells",
            "caption-side",
            "border-spacing",
            "border-collapse",
            "list-style",
            "list-style-position",
            "list-style-type",
            "list-style-image"
        ],
        [
            "content",
            "quotes",
            "counter-reset",
            "counter-increment",
            "cursor",
            "text-align",
            "vertical-align",
            "line-height",
            "white-space",
            "white-space-collapse",
            "text-decoration",
            "text-indent",
            "text-transform",
            "text-align-last",
            "text-emphasis",
            "text-height",
            "text-justify",
            "text-outline",
            "text-replace",
            "text-wrap",
            "letter-spacing",
            "word-spacing",
            "word-break",
            "word-wrap"
        ],
        [
            "opacity",
            "color",
            "border",
            "border-radius",
            "border-break",
            "border-color",
            "border-image",
            "border-top-image",
            "border-right-image",
            "border-bottom-image",
            "border-left-image",
            "border-corner-image",
            "border-top-left-image",
            "border-top-right-image",
            "border-bottom-right-image",
            "border-bottom-left-image",
            "border-fit",
            "border-length",
            "border-style",
            "border-width",
            "border-top",
            "border-top-width",
            "border-top-style",
            "border-top-color",
            "border-right",
            "border-right-width",
            "border-right-style",
            "border-right-color",
            "border-bottom",
            "border-bottom-width",
            "border-bottom-style",
            "border-bottom-color",
            "border-left",
            "border-left-width",
            "border-left-style",
            "border-left-color",
            "border-top-right-radius",
            "border-top-left-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius",
            "outline",
            "outline-offset",
            "outline-width",
            "outline-style",
            "outline-color",
            "background",
            "background-color",
            "background-image",
            "background-repeat",
            "background-attachment",
            "background-position",
            "background-position-x",
            "background-position-y",
            "background-break",
            "background-clip",
            "background-origin",
            "background-size",
            "box-shadow",
            "text-shadow",
            "transitions",
            "resize",
            "filter"
        ],
        [
            "page-break-before",
            "page-break-inside",
            "page-break-after",
            "orphans",
            "widows"
        ]
    ],

    format: function(nodes, tab) {
        var section, _section, i, j, k, name;

        for (i = 0; i < $cssf.order.length; i++) {
            section = $cssf.order[i];
            _section = [];
            for (j = 0; j < section.length; j++) {
                name = section[j];
                _section.push(name);
                for (k = 0; k < $cssf.vendor.length; k++) {
                    _section.push($cssf.vendor[k] + name);
                }
            }
            $cssf.order[i] = _section;
        }

        return $cssf._format(nodes, tab);
    },

    _format: function(nodes, tab) {
        var s = '', t = [], content, d, node, nextNode;

        if (tab === null || tab === undefined) tab = '';

        for (var n = 0; n < nodes.length; n++) {
            node = nodes[n];
            t = [];

            if (typeof node !== 'string') {
                if (node.type === 'ruleset') {
                    node.value.forEach(function(value) {
                        t.push(value.join(''));
                    });
                    s += tab + t.join(', ' + tab + '\n');
                } else {
                    s += tab + node.value.join('');
                }

                if (node.nodes.length) {
                    s += ' {\n';
                    s += $cssf._format(node.nodes, tab + '    ', true);
                } else {
                    if (node.content.length) {
                        s += '\n'+tab + '{';
                        t = [];
                        content = $cssf.sort(node.content);
                        for (var i = 0; i < content.length; i++) {
                            s += '\n    ' + tab;
                            d = content[i];
                            s += d.name.join('') + ': ' + d.value.join('') + (d.important ? ' !important' : '') + ';';
                            if (content[i + 1] && content[i + 1].o !== d.o) s += '\n';
                        }
                    } else if (node.type === 'ruleset') s += '\n{';
                }
                if (node.type === 'ruleset' || node.content.length || node.nodes.length) s += '\n' + tab + '}\n\n';
                else s += ';\n';
            } else {
                nextNode = nodes[n+1];
                s += tab + node;
                
                if (typeof nextNode === 'string' && /^\/\*\s*\*\/$/.test(nextNode))
                {
                    s += ' ';
                } else {
                    s += '\n';
                }
                
            }
        }

        return s.slice(0, -1);
    },

    sort: function(content) {
        var r = [], d, t;

        content = content.slice();

        for (var i = 0; i < content.length; i++) {
            d = content[i];
            if (typeof d === 'string') content.splice(i, 1), i--;
            else {
                t = $cssf.knownProperty(d.name.join(''));
                if (t !== null) d.o = t.i, d.i = t.i * 1000 + t.j;
                else {
                    d.o = -1;
                    r.push(d);
                    content.splice(i, 1);
                    i--;
                }
            }
        }

        content.sort(function(a, b) {
            return a.i - b.i;
        });

        if (r.length) content = content.concat(r);

        return content;
    },

    knownProperty: function(name) {
        var j = -1;

        for (var i = 0; i < $cssf.order.length; i++) {
            if ((j = $cssf.order[i].indexOf(name)) !== -1) return { i: i, j: j };
        }

        return null;
    }
};

if (typeof window === 'undefined') {
    exports.format = $cssf.format;
}