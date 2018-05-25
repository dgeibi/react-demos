/* eslint-disable */
/*
copy from 
    https://github.com/paulmillr/es6-shim
    https://github.com/wesleytodd/setprototypeof
    https://github.com/zloirock/core-js
*/
;(function() {
  if (Object.setPrototypeOf) return
  var ObjectProto = Object.prototype
  var support__proto__ = !({ __proto__: null } instanceof Object)
  Object.setPrototypeOf = support__proto__
    ? (function() {
        if (!Object.getPrototypeOf) {
          Object.getPrototypeOf = function(O) {
            if (O == undefined)
              throw TypeError('Cannot convert undefined or null to object')
            O = Object(O)
            return O.__proto__
          }
        }
        return function setProtoOf(obj, proto) {
          obj.__proto__ = proto
          return obj
        }
      })()
    : (function() {
        var getOwnPropertyNames = Object.getOwnPropertyNames
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
        var defineProperty = Object.defineProperty
        var hasOwnProperty = Object.prototype.hasOwnProperty
        var has = function has(obj, k) {
          return hasOwnProperty.call(obj, k)
        }

        var copyDescriptors = function(target, source) {
          getOwnPropertyNames(source).forEach(function(key) {
            if (!has(target, key)) {
              defineProperty(target, key, getOwnPropertyDescriptor(source, key))
            }
          })
          return target
        }

        var getPrototypeOf = Object.getPrototypeOf

        Object.getPrototypeOf = function(O) {
          if (O == undefined)
            throw TypeError('Cannot convert undefined or null to object')
          O = Object(O)
          if (has(O, '__proto__')) return O.__proto__
          if (getPrototypeOf) {
            return getPrototypeOf(O)
          }
          if (typeof O.constructor === 'function' && O instanceof O.constructor) {
            return O.constructor.prototype
          }
          return O instanceof Object ? ObjectProto : null
        }
        return function mixinProperties(origin, proto) {
          Object.defineProperty(origin, '__proto__', {
            value: proto,
          })
          return copyDescriptors(origin, proto)
        }
      })()
})()
