/* See license.txt for terms of usage */

var _ = require('underscore'),
    html = require('ore/html'),
    looks = require('looks'),
    colors = require('looks/lib/colors'),
    effects = require("looks/lib/effects"),
    types = require('looks/lib/types');

exports.LooksEditor = html.div('.looksEditor', {_rules: '$rules'}, [
    html.div('.previewBox', {}, []),
    html.div('.form', {}, []),
], {
    construct: function() {
       var rule = this.rules[0];
       
       rule.layer.render({name: 'looker1'});

       this.query('.form').replace(new LooksForm({rule: rule}));
    }   
});

var NumericProperty = html.input('.looksNumericInput', {oninput: '$onInput', onkeydown: '$onKeyPress'}, [], {
    set: function(value) {
        this.layer.set(this.property.name, value);
        this.layer.parent.render({name: 'looker1'});
    },

    onInput: function() {
        this.set(this.val().value);
    },
    
    onKeyPress: function(event) {
        if (event.keyCode == 38) {
            var newValue = this.val().value = parseInt(this.val().value)+1;
            this.set(newValue);
        } else if (event.keyCode == 40) {
            var newValue = this.val().value = parseInt(this.val().value)-1;
            this.set(newValue);
        }
    },
});

var LooksForm = html.div('.looksForm', {}, [
    html.FOR('layer', '$rule.layer.layers', [
        html.div('.looksFormHeader', {}, ['$layer.effect.id']),
        html.FOR('property', '$layer|propertiesForLayer', [
            html.div('.looksFormLine', {}, [
                html.span('.looksFormLabel', {}, ['$property.name|prettifyName']),
                // html.EMBED('$layer,$property|inputForProperty', {layer: '$layer', property: '$property'}),
                NumericProperty('.looksFormInput', {_layer: '$layer', _property: '$property',
                                                    value: '$layer,$property|getValue'}, [])
            ])
        ]),
    ]),
], {
    prettifyName: function(name) {
        return name.replace(/([A-Z])/g, function(n) { return ' ' + n; })
               .replace(/(^|\s)[a-z]/g, function(n) { return n.toUpperCase(); });
    },

    getValue: function(layer, property) {
        return layer.get(property.name);
    },

    propertiesForLayer: function(layer) {
        return _.values(layer.effect.allProperties());
    },

    inputForProperty: function(layer, property) {
        if (property.type == types.Angle) {
            return NumericProperty('.looksFormInput', {_layer: '$layer', _property: '$type'}, []);
        } else {
            return html.span('', {}, ['-']);
        }
    }
});
