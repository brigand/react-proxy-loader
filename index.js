var loaderUtils = require("loader-utils");
var outdent = require('outdent');

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
	this.cacheable && this.cacheable();
	var query = loaderUtils.parseQuery(this.query);
	var moduleRequest = "!!" + remainingRequest;

  return outdent`
    var React = require('react');
    var RComponent = React.Component;
    var component;

    function C(props) {
      RComponent.call(this, props);
      this.isUnmounted = false;
      this.state = this._getInitialState();
    }
    Object.defineProperty(C, 'name', { value: 'ReactProxyComponent' });
    var mixin = require(${loaderUtils.stringifyRequest(this, require.resolve("./mixinReactProxy"))});

    C.prototype = Object.create(RComponent.prototype);
    C.prototype.constructor = RComponent;
    mixin(React, C.prototype);

    C.prototype.loadComponent = function(callback) {
      if (!component) {
        require.ensure([], function() {
          component = require(${loaderUtils.stringifyRequest(this, moduleRequest)});
          if (component && component.default) component = component.default;
          if (callback) callback(component);
        });
      } else if (callback) {
        callback(component);
      }
      return component;
    };

    C.requestPreload = function requestPreload() { C.prototype.loadComponent(function() {}) };
    console.log(C.prototype);
    module.exports = C;
  `;
};
