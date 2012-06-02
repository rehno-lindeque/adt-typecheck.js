/*
 * adt-typecheck.js - Typechecking for JavaScript through adt.js evaluators
 * adt-typecheck.js is free, public domain software (http://creativecommons.org/publicdomain/zero/1.0/)
 * Originally created by Rehno Lindeque of http://www.mischievousmeerkat.com
 * Use it in combination with https://github.com/rehno-lindeque/adt.js
 */
var adt = adt || (typeof require === 'function'? require('adt.js') : {});
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
    // Class constructors
    classCons = adt.Class.constructors,
    // Error handler
    typeError = function(expected, received, key) {
      if (key)
        return { key: key, expected: expected, received: received };
      else
        return { expected: expected, received: received };
    },
    typeErrorF = function(expected, key) {
      return function(){ return [typeError(expected, this._tag, key)]; }
    },
    // Class tests
    isClass = function(datatype) { 
      var evals = { _: false };
      evals[datatype] = function(a) { return this._datatype === datatype; };
      return adt(evals); 
    },
    isObject = isClass('Object'),
    // Main type checker
    typecheck = function(schema, parentKey) {
      if (schema == null)
        throw "Invalid type definition: " + schema;
      return adt({
        // Check an Object's keys
        Object: function(objectDef){
          if (!isObject(objectDef))
            return this._(classCons.Object.apply(null, arguments));
          return adt({
            Object: function(obj){
              var key, errors = [], fullKey;
              for (key in objectDef) {
                fullKey = key + (parentKey? '.' + parentKey : '');
                if (typeof obj[key] === 'undefined' && objectDef[key]._tag !== 'Undefined')
                  errors.push(typeError(adt.serialize(objectDef[key]), (void 0), fullKey));
                else
                  errors = errors.concat(typecheck(objectDef[key], fullKey)(obj[key]));
              }
              return errors;
            },
            _: typeErrorF('Object', parentKey)
          });
        },
        // Check simple types simply
        _: function(){
          var
            expected = this._tag,
            evals = { _: typeErrorF(expected, parentKey) };
          evals[expected] = [];
          return adt(evals);
        }
      })(schema);
    };

  adt.typecheck = function(schemaF) {
    return typecheck(schemaF.call(adt.Class.constructors));
  };

  adt.typecheck.show = function(error) {
    if (Array.isArray(error))
      return error.map(adt.typecheck.show);
    return "Expected " + (typeof error['key'] === 'string'? error['key'] + " of type " : "type ")  + "'" + error['expected'] + "', but received '" + error['received'] + "'";
  };
  var isFunctionADT = adt({
    Function: function() { return this.datatype === 'ADT'; },
    _: false
  });

  adt.typecheck.signature = {
    function: function(schemaF, f) {
      if (typeof schemaF !== 'function')
        throw "No type signature supplied to `adt.typecheck.signature.function`.";
      if (!f)
        throw "No function supplied to `adt.typecheck.signature.function`.";
      var check = adt.typecheck(function(){ return this.Arguments(schemaF()); });
      return function() {
        var errors = check(arguments);
        if (errors.length > 0)
          throw adt.typecheck.show(errors).join('\n');
        f.apply(null, arguments);
      };
    },
    chainFunction: function(schemaF, f) {
      if (typeof schemaF !== 'function')
        throw "No type signature supplied to `adt.typecheck.signature.chainFunction`.";
      if (typeof f !== 'function')
        throw "No node function supplied to `adt.typecheck.signature.chainFunction`.";
      var
        expectedNumArgs,
        check = adt.typecheck(function(){ 
          var s = schemaF(); 
          if (s.length < 1)
            throw "Too few arguments in chain function, a callback function is required.";
          if (!isFunctionADT(s[s.length - 1]))
            throw "The last argument in the chain function signature should be a Function.";
          expectedNumArgs = s.length;
          return this.Arguments(s); 
        });
      return function(){
        var 
          errors = check(arguments),
          callback;
        // It is not possible to pass along errors if no callback function is supplied
        if (arguments.length !== expectedNumArgs)
          throw "Incorrect number of arguments passed to the function." 
        callback = arguments[arguments.length - 1];
        if (typeof callback !== 'function')
          throw "No callback function supplied."
        if (errors.length > 0)
          callback(adt.typecheck.show(errors));
        else
          f.apply(null, [].slice.call(arguments).concat([callback]));
      };
    }
  };
  // Export typecheck to a CommonJS module if exports is available
  if (typeof module !== "undefined" && module !== null)
    module.exports = adt.typecheck;
})();
