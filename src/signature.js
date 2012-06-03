  var isFunctionADT = adt({
    Function: function() { return this._datatype === 'ADT'; },
    _: false
  });

  adt.typecheck.signature = {
    function: function(schemaF, f) {
      if (typeof schemaF !== 'function')
        throw "No type signature supplied to `adt.typecheck.signature.function`.";
      if (!f)
        throw "No function supplied to `adt.typecheck.signature.function`.";
      var check = adt.typecheck(function(){ return this.Arguments(schemaF.call(this)); });
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
          var s = schemaF.call(this);
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
