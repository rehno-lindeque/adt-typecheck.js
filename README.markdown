# adt-typecheck.js

Practical run-time type checking using [adt.js](https://github.com/rehno-lindeque/adt.js).

## Usage

**adt.typecheck.js** syntax is designed for [CoffeeScript](http://coffeescript.org/).
It is certainly possible to use the library with JavaScript proper, however as
an [EDSL](http://en.wikipedia.org/wiki/Embedded_domain-specific_language)
`adt.typecheck` is easiest to read using CoffeeScript shorthands. For this
reason all of the examples here use CoffeeScript notation.

Also, please note that **adt-typecheck.js** does not have an official release
yet. Parts of the API can and will change over time.

### Typecheck simple types

```coffeescript
# TODO
```

### Typecheck composite objects

```coffeescript
# TODO
```

### Typecheck arguments using function signatures

```coffeescript
# TODO
```

Note that **adt-typecheck.js** will add some overhead to all of your functions
signed in this way and is not appropriate for situations where high performance
is required. This style of typechecking is probably more appropriate for 
server-side code than browser-side code (especially in situations where old
and inefficient browsers need to be supported).

A proxy can be used in place of `adt.typecheck.signature.function` in production
mode if performance is a concern. E.g.

```coffeescript
if isDevelopmentMode
  fn = adt.typecheck.signature.function
else
  fn = (schema, f) -> f
```

### Typecheck arguments to Node.js style chained functions

```coffeescript
# TODO
```

The same proxy as the one for `adt.typecheck.signature.function` can be used in
place of `adt.typecheck.signature.chainFunction`.

```coffeescript
if isDevelopmentMode
  cfn = adt.typecheck.signature.chainFunction
else
  cfn = (schema, f) -> f
```

### Typecheck your REST API's with an express middleware

The following snippet of code can be used to create a middleware for 
[express](http://expressjs.com/) that typechecks your incoming request body.

```coffeescript
# TODO
```

Use it like this:

```coffeescript
# TODO
```
