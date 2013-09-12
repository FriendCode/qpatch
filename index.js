// Requires
var Q = require('q');
var _ = require('underscore');
var inherits = require('util').inherits;


function qClass(cls, methodExceptions) {
    // Methods not to patch
    methodExceptions = methodExceptions || [];

    var newCls = function newCls() {
        newCls.super_.apply(this, arguments);
    };
    inherits(newCls, cls);

    // Set name
    newCls.name = cls.name;

    _.methods(cls.prototype).forEach(function(method) {
        // Build new function
        newCls.prototype[method] = qMethod(cls.prototype[method]);
    });

    return newCls;
}

function qMethod(method) {
    var f = function() {
        var d = Q.defer();
        var args = _.toArray(arguments);

        // Add callback
        args.push(d.makeNodeResolver());

        // Call function
        method.apply(this, args);

        // Return promise
        return d.promise;
    };
    f.name = method.name;
    return f;
}


// Exports
exports.qClass = qClass;
