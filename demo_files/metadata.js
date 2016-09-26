/**
 * @file
 * Javascript API to set and get values in the metadata object and UDO.
 *
 * @author Neal Bailly
 */

(function(window, udo) {
  if (typeof define === 'function' && define.amd) {
      define('TiUdo', [], udo);
  }
  else if (typeof exports === 'object') {
      module.exports = udo();
  }
  window.Ti = window.Ti || {};
  window.Ti.udo = udo();
}(this, function() {

  'use strict';

  var udo = {
    set: function(key, value, overwrite) {
      overwrite = typeof overwrite !== 'undefined' ? overwrite : true;
      if (overwrite || !(key in window.Ti.udo_metadata)) {
        window.Ti.udo_metadata[key] = value;
        for (var udo_key in window.Ti.udo_map) {
          if (window.Ti.udo_map[udo_key] === key) {
            window.utag_data[udo_key] = value;
            return;
          }
        }
        if (window.Ti.udo_data_layer.indexOf(key) >= 0) {
          window.utag_data[key] = value;
        }
      }
    },
    setMulti: function(keyvals, overwrite) {
      for (var key in keyvals) {
        this.set(key, keyvals[key], overwrite);
      }
    },
    unset: function(key) {
      if (typeof key === 'undefined') {
        this.unsetMulti(window.Ti.udo_metadata);
      }
      else {
        if (key in window.Ti.udo_metadata) {
          delete window.Ti.udo_metadata[key];
          for (var udo_key in window.Ti.udo_map) {
            if (window.Ti.udo_map[udo_key] === key) {
              delete window.utag_data[udo_key];
              return;
            }
          }
          if (window.Ti.udo_data_layer.indexOf(key) >= 0) {
            delete window.utag_data[key];
          }
        }
      }
    },
    unsetMulti: function(keys) {
      for (var key in keys) {
        this.unset(key);
      }
    },
    get: function(key) {
      if (typeof key === 'undefined') {
        return window.Ti.udo_metadata;
      }
      else {
        return window.Ti.udo_metadata[key];
      }
    },
    view: function(data) {
      if (typeof(data) !== 'undefined') {
        this.setMulti(data);
      }
      window.utag.view();
    }
  }

  return udo;

}));
