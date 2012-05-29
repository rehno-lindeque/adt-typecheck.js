/*
 * adt-typecheck.js - Typechecking for JavaScript through adt.js evaluators
 * adt-typecheck.js is free, public domain software (http://creativecommons.org/publicdomain/zero/1.0/)
 * Originally created by Rehno Lindeque of http://www.mischievousmeerkat.com
 * Use it in combination with https://github.com/rehno-lindeque/adt.js
 */
var adt = adt || {};
(function() {
"use strict";
  // TODO: put in an adt-json library
  adt.JSON = {};
  adt.JSON.tags = [
    'Number',
    'String',
    'Boolean',
    'Array',
    'Object',
    'Null'
  ];
  adt.JSON.constructors = adt.apply(null, adt.JSON.tags);

  // TODO: put in an adt-class library
  adt.Class = {};
  adt.Class.tags = [
    'Arguments',
    'Array',
    'Boolean',
    'Date',
    'Error',
    'Function',
    'JSON',
    'Math',
    'Number',
    'Object',
    'RegExp',
    'String',
    'Null',
    'Undefined'
  ];
  adt.Class.constructors = adt.apply(null, adt.Class.tags);

  // adt-typecheck.js
  var
    classCons = adt.Class.constructors,
    typeError = function(expected, received, key) {
      if (key)
        return { key: key, expected: expected, received: received };
      else
        return { expected: expected, received: received };
    },
    typeErrorF = function(expected, key) {
      return function(){ return [typeError(expected, this._tag, key)]; }
    },
    isClass = function(datatype) { 
      var evals = { _: false };
      evals[datatype] = function(a) { return this._datatype === datatype; };
      return adt(evals); 
    },
    isObject = isClass('Object');

  adt.typecheck = function(schemaF) {
    var schema = schemaF.call(adt.Class.constructors);
    if (schema == null)
      throw "Invalid type definition: " + schema;
    return adt({
      // Check an Object's keys
      Object: function(objectDef){
        if (!isObject(objectDef))
          return this._(classCons.Object.apply(null, arguments));
        return adt({
          Object: function(obj){
            var key, errors = [];
            for (key in objectDef) {
              if (typeof obj[key] === 'undefined')
                errors.push(typeError(adt.serialize(objectDef[key]), (void 0), key));
            }
            return errors;
          },
          _: typeErrorF('Object')
        });
      },
      // Check simple types simply
      _: function(){
        var
          expected = this._tag,
          evals = { _: typeErrorF(expected) };
        evals[expected] = [];
        return adt(evals);
      }
    })(schema);
  };
  // Export typecheck to a CommonJS module if exports is available
  if (typeof module !== "undefined" && module !== null)
    module.exports = adt.typecheck;
})();
