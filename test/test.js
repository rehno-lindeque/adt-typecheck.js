console.log("-- Test 0 (Simple types) --");
(function(){
  var
    argumentsField = (function(){ return arguments; })(),
    arrayField = [],
    booleanField = false,
    dateField = new Date(),
    errorField = new Error(),
    functionField = function() {},
    jsonField = JSON,
    mathField = Math,
    numberField = 5.89,
    objectField = {},
    regexpField = /.*/,
    stringField = "This is a string",
    nullField = null,
    undefinedField = (void 0),

    argumentsCheck = adt.typecheck(function(){ return this.Arguments(); }),
    arrayCheck = adt.typecheck(function(){ return this.Array(); }),
    booleanCheck = adt.typecheck(function(){ return this.Boolean(); }),
    dateCheck = adt.typecheck(function(){ return this.Date(); }),
    errorCheck = adt.typecheck(function(){ return this.Error(); }),
    functionCheck = adt.typecheck(function(){ return this.Function(); }),
    jsonCheck = adt.typecheck(function(){ return this.JSON(); }),
    mathCheck = adt.typecheck(function(){ return this.Math(); }),
    numberCheck = adt.typecheck(function(){ return this.Number(); }),
    objectCheck = adt.typecheck(function(){ return this.Object(); }),
    regexpCheck = adt.typecheck(function(){ return this.RegExp(); }),
    stringCheck = adt.typecheck(function(){ return this.String(); }),
    nullCheck = adt.typecheck(function(){ return this.Null(); }),
    undefinedCheck = adt.typecheck(function(){ return this.Undefined(); });

  console.log('Check Arguments built-in: ', argumentsCheck(argumentsField));
  console.log('Check Array built-in: ', arrayCheck(arrayField));
  console.log('Check Boolean built-in: ', booleanCheck(booleanField));
  console.log('Check Date built-in: ', dateCheck(dateField));
  console.log('Check Error built-in: ', errorCheck(errorField));
  console.log('Check Function built-in: ', functionCheck(functionField));
  console.log('Check JSON built-in: ', jsonCheck(jsonField));
  console.log('Check Math built-in: ', mathCheck(mathField));
  console.log('Check Number built-in: ', numberCheck(numberField));
  console.log('Check Object built-in: ', objectCheck(objectField));
  console.log('Check RegExp built-in: ', regexpCheck(regexpField));
  console.log('Check String built-in: ', stringCheck(stringField));
  console.log('Check Null built-in: ', nullCheck(nullField));
  console.log('Check Undefined built-in: ', undefinedCheck(undefinedField));

  // Note that built-in types are not differentiated from ADT's
  var classCons = adt.Class.constructors;
  console.log('Check Arguments as ADT: ', argumentsCheck(classCons.Arguments(argumentsField)));
  console.log('Check Array as ADT: ', arrayCheck(classCons.Array(arrayField)));
  console.log('Check Boolean as ADT: ', booleanCheck(classCons.Boolean(booleanField)));
  console.log('Check Date as ADT: ', dateCheck(classCons.Date(dateField)));
  console.log('Check Error as ADT: ', errorCheck(classCons.Error(errorField)));
  console.log('Check Function as ADT: ', functionCheck(classCons.Function(functionField)));
  console.log('Check JSON as ADT: ', jsonCheck(classCons.JSON(jsonField)));
  console.log('Check Math as ADT: ', mathCheck(classCons.Math(mathField)));
  console.log('Check Number as ADT: ', numberCheck(classCons.Number(numberField)));
  console.log('Check Object as ADT: ', objectCheck(classCons.Object(objectField)));
  console.log('Check RegExp as ADT: ', regexpCheck(classCons.RegExp(regexpField)));
  console.log('Check String as ADT: ', stringCheck(classCons.String(stringField)));
  console.log('Check Null as ADT: ', nullCheck(classCons.Null(nullField)));
  console.log('Check Undefined as ADT: ', undefinedCheck(classCons.Undefined(undefinedField)));
})();


console.log("-- Test 0.1 (Simple key in object test) --");
(function(){
  var 
    objWithArray = { arrayField: [] },
    objWithoutArray = { stringField: "foo" },
    objWithInvalidArray = { arrayField: "foo" },
    myTypecheck = adt.typecheck(function(){ return this.Object({ arrayField: this.Array() }); });

  console.log('Check object containing array: ', myTypecheck(objWithArray));
  console.log('Check object not containing array: ', myTypecheck(objWithoutArray));
  console.log('Check object containing invalid array field: ', myTypecheck(objWithInvalidArray));
})();

console.log("-- Test 1 (Built-in types only (Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String, Null, Undefined)) --");
(function(){
  var
    myObj = {
      argumentsField: (function(){ return arguments; })(),
      arrayField: [],
      booleanField: false,
      dateField: new Date(),
      errorField: new Error(),
      functionField: function() {},
      jsonField: JSON,
      mathField: Math,
      numberField: 5.89,
      objectField: {},
      regexpField: /.*/,
      stringField: "This is a string",
      nullField: null,
      undefinedField: (void 0)
    },
    myTypecheck = adt.typecheck(function(){
      return this.Object({
        argumentsField: this.Arguments(),
        arrayField: this.Array(),
        booleanField: this.Boolean(),
        dateField: this.Date(),
        errorField: this.Error(),
        functionField: this.Function(),
        jsonField: this.JSON(),
        mathField: this.Math(),
        numberField: this.Number(),
        objectField: this.Object(),
        regexpField: this.RegExp(),
        stringField: this.String(),
        nullField: this.Null(),
        undefinedField: this.Undefined()
      });
    }),
    errors = myTypecheck(myObj);
  console.log("Typecheck errors:", errors);
})();

console.log("-- Test 2 (Nested primitive types only) --");
(function(){
  var
    myObj = {
      nestedArgumentsNumbers: (function(){ return arguments; })(1, 2.2, 3.33),
      nestedArgumentsStringDate: (function(){ return arguments; })("a", new Date()),
      nestedArrayNumbers: [1, 2.2, 3.33],
      nestedArrayStringDate: ["a", new Date()],
      nestedObjectNumbers: {
        numberField: 1,
        anotherNumberField: 2.2,
        yetAnotherNumberField: 3.33
      },
      nestedObjectStringDate: {
        stringField: "a",
        dateField: new Date()
      }
    },
    myTypecheck = adt.typecheck(function(){
      return this.Object({
        nestedArgumentsNumbers: this.Arguments(this.Number()),
        nestedArgumentsStringDate: this.Arguments([this.String(), this.Date()]),
        nestedArrayNumbers: this.Array(this.Number()),
        nestedArrayStringDate: this.Array(this.String(), this.Date()),
        nestedObjectNumbers: this.Object(this.Number()),
        nestedObjectStringDate: this.Object({
          stringField: this.String(),
          dateField: this.Date()
        }),
      });
    }),
    errors = myTypecheck(myObj);
  console.log("Typecheck errors:", errors);
})();

console.log("-- Test 3 (Special types (Any, Optional, Nullable)) --");
(function(){
  console.warn("TODO");
})();

console.log("-- Test 4 (JavaScript primitive types with extras (Integer, JSONType)) --");
(function(){
  var myObj = {
    aNumber: 5.89,
    aString: "This is a string",
    aSubObject: {
      anInteger: 20,
      anArray: ["a", "b", "c"]
    },
    anyField: new Date()
  };
  console.warn("TODO");
})();

console.log("-- Test 5 (Algebraic data types) --");
(function(){
  console.warn("TODO");
})();

console.log("-- Test 6 (Additional predicates (lengthOf)) --");
(function(){
  console.warn("TODO");
})();
