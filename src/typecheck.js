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
