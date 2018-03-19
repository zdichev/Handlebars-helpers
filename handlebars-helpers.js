/*------------------------------- Handlebar Helpers ----------------------------------- */


Handlebars.registerHelper("debug", function (optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

Handlebars.registerHelper('even_odd', function (conditional, options) {
    if ((conditional % 2) === 0) {
        return 'even';
    } else {
        return 'odd';
    }
});

Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value=' + value + ']').attr({'selected': 'selected'});
    return $el.html();
});

Handlebars.registerHelper('checkboxes', function (value, chekboxes) {
    var $el = $('<div />').html(chekboxes.fn(this));
    $.each(value, function (index, value) {
        $el.find('input[value=' + value + ']').attr({'checked': true});
    });
    return $el.html();
});


Handlebars.registerHelper('checkboxes_name', function (value, chekboxes) {
    var $el = $('<div />').html(chekboxes.fn(this));
    if (typeof value !== 'undefined') {
        $.each(value, function (index, value) {
            $el.find('input[name$="' + value + '"]').attr({'checked': true});
        });
    }
    return $el.html();
});


Handlebars.registerHelper('rolSettings_checkboxes', function (value, chekboxes) {
    var $el = $('<div />').html(chekboxes.fn(this));
    if (typeof value !== 'undefined') {
        var checkedArr = [];

        $.each(value, function () {
            $.each(this, function () {
                $.each(this, function (key, value) {
                    checkedArr.push(key)
                });
            });
        });

        $.each(checkedArr, function (index, value) {
            $el.find('input[name$=' + value + ']').attr({'checked': true});
        });
    }

    return $el.html();
});

Handlebars.registerHelper('compare', function (lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '=='    : function (l, r) {
            return l === r;
        },
        '==='   : function (l, r) {
            return l === r;
        },
        '!='    : function (l, r) {
            return l !== r;
        },
        '<'     : function (l, r) {
            return l < r;
        },
        '>'     : function (l, r) {
            return l > r;
        },
        '<='    : function (l, r) {
            return l <= r;
        },
        '>='    : function (l, r) {
            return l >= r;
        },
        'typeof': function (l, r) {
            return typeof l === r;
        }
    };

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

    var result = operators[operator](lvalue, rvalue);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});


/**
 * Combine Handlebar tempalte with json data file and return commpiled HTML.
 * Requires jQuery
 * @param tmplUrl url of the template
 * @param tmplDataUrl url of the json file
 * @param objSel
 * @returns {*}
 */
function getAndComplieHBTmpl(tmplUrl, tmplDataUrl, objSel) {
    var dfd = new jQuery.Deferred();
    var tmpl;
    var tmplData;
    $.get(tmplUrl).done(function (data) {
        tmpl = data;
        $.getJSON(tmplDataUrl).done(function (tData) {
            tmplData = ((typeof objSel === 'undefined') ?  tData : Object.byString(tData,objSel));
            var template = Handlebars.compile(tmpl),
                html = template(tmplData);
            dfd.resolve(html);

        }).fail(function () {
            dfd.reject("Couldn't get tempalte data");
        });
    }).fail(function () {
        dfd.reject("Couldn't get tempalte");
    });

    // Return the Promise
    return dfd.promise();
}