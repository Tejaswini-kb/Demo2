//ingredient-chef version 1.2.0

/**
 *  Ajax Autocomplete for jQuery, version 1.1.3
 *  (c) 2010 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 *  Last Review: 04/19/2010
 */

(function(d) {
    function l(b, a, c) {
        a = "(" + c.replace(m, "\\$1") + ")";
        return b.replace(new RegExp(a, "gi"), "<strong>$1</strong>")
    }

    function i(b, a) {
        this.el = d(b);
        this.el.attr("autocomplete", "off");
        this.suggestions = [];
        this.data = [];
        this.badQueries = [];
        this.selectedIndex = -1;
        this.currentValue = this.el.val();
        this.intervalId = 0;
        this.cachedResponse = [];
        this.onChangeInterval = null;
        this.ignoreValueChange = false;
        this.serviceUrl = a.serviceUrl;
        this.isLocal = false;
        this.options = {
            autoSubmit: false,
            minChars: 1,
            maxHeight: 300,
            deferRequestBy: 0,
            width: 0,
            highlight: true,
            params: {},
            fnFormatResult: l,
            delimiter: null,
            zIndex: 9999
        };
        this.initialize();
        this.setOptions(a)
    }
    var m = new RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g");
    d.fn.autocomplete = function(b) {
        return new i(this.get(0) || d("<input />"), b)
    };
    i.prototype = {
        killerFn: null,
        initialize: function() {
            var b, a, c;
            b = this;
            a = Math.floor(Math.random() * 1048576).toString(16);
            c = "Autocomplete_" + a;
            this.killerFn = function(e) {
                if (d(e.target).parents(".autocomplete").size() === 0) {
                    b.killSuggestions();
                    b.disableKillerFn()
                }
            };
            if (!this.options.width) this.options.width = this.el.width();
            this.mainContainerId = "AutocompleteContainter_" + a;
            d('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + c + '" style="display:none; width:300px;"></div></div></div>').appendTo("body");
            this.container = d("#" + c);
            this.fixPosition();
            window.opera ? this.el.keypress(function(e) {
                b.onKeyPress(e)
            }) : this.el.keydown(function(e) {
                b.onKeyPress(e)
            });
            this.el.keyup(function(e) {
                b.onKeyUp(e)
            });
            this.el.blur(function() {
                b.enableKillerFn()
            });
            this.el.focus(function() {
                b.fixPosition()
            })
        },
        setOptions: function(b) {
            var a = this.options;
            d.extend(a, b);
            if (a.lookup) {
                this.isLocal = true;
                if (d.isArray(a.lookup)) a.lookup = {
                    suggestions: a.lookup,
                    data: []
                }
            }
            d("#" + this.mainContainerId).css({
                zIndex: a.zIndex
            });
            this.container.css({
                maxHeight: a.maxHeight + "px",
                width: a.width
            })
        },
        clearCache: function() {
            this.cachedResponse = [];
            this.badQueries = []
        },
        disable: function() {
            this.disabled = true
        },
        enable: function() {
            this.disabled = false
        },
        fixPosition: function() {
            var b = this.el.offset();
            d("#" + this.mainContainerId).css({
                top: b.top + this.el.innerHeight() + "px",
                left: b.left + "px"
            })
        },
        enableKillerFn: function() {
            d(document).bind("click", this.killerFn)
        },
        disableKillerFn: function() {
            d(document).unbind("click", this.killerFn)
        },
        killSuggestions: function() {
            var b = this;
            this.stopKillSuggestions();
            this.intervalId = window.setInterval(function() {
                b.hide();
                b.stopKillSuggestions()
            }, 300)
        },
        stopKillSuggestions: function() {
            window.clearInterval(this.intervalId)
        },
        onKeyPress: function(b) {
            if (!(this.disabled || !this.enabled)) {
                switch (b.keyCode) {
                    case 27:
                        this.el.val(this.currentValue);
                        this.hide();
                        break;
                    case 9:
                    case 13:
                        if (this.selectedIndex === -1) {
                            this.hide();
                            return
                        }
                        this.select(this.selectedIndex);
                        if (b.keyCode === 9) return;
                        break;
                    case 38:
                        this.moveUp();
                        break;
                    case 40:
                        this.moveDown();
                        break;
                    default:
                        return
                }
                b.stopImmediatePropagation();
                b.preventDefault()
            }
        },
        onKeyUp: function(b) {
            if (!this.disabled) {
                switch (b.keyCode) {
                    case 38:
                    case 40:
                        return
                }
                clearInterval(this.onChangeInterval);
                if (this.currentValue !== this.el.val())
                    if (this.options.deferRequestBy > 0) {
                        var a = this;
                        this.onChangeInterval = setInterval(function() {
                            a.onValueChange()
                        }, this.options.deferRequestBy)
                    } else this.onValueChange()
            }
        },
        onValueChange: function() {
            clearInterval(this.onChangeInterval);
            this.currentValue = this.el.val();
            var b = this.getQuery(this.currentValue);
            this.selectedIndex = -1;
            if (this.ignoreValueChange) this.ignoreValueChange = false;
            else b === "" || b.length < this.options.minChars ? this.hide() : this.getSuggestions(b)
        },
        getQuery: function(b) {
            var a;
            a = this.options.delimiter;
            if (!a) return d.trim(b);
            b = b.split(a);
            return d.trim(b[b.length - 1])
        },
        getSuggestionsLocal: function(b) {
            var a, c, e, g, f;
            c = this.options.lookup;
            e = c.suggestions.length;
            a = {
                suggestions: [],
                data: []
            };
            b = b.toLowerCase();
            for (f = 0; f < e; f++) {
                g = c.suggestions[f];
                if (g.toLowerCase().indexOf(b) === 0) {
                    a.suggestions.push(g);
                    a.data.push(c.data[f])
                }
            }
            return a
        },
        getSuggestions: function(b) {
            var a, c;
            if ((a = this.isLocal ? this.getSuggestionsLocal(b) : this.cachedResponse[b]) && d.isArray(a.suggestions)) {
                this.suggestions = a.suggestions;
                this.data = a.data;
                this.suggest()
            } else if (!this.isBadQuery(b)) {
                c = this;
                c.options.params.query = b;
                d.get(this.serviceUrl, c.options.params, function(e) {
                    c.processResponse(e)
                }, "text")
            }
        },
        isBadQuery: function(b) {
            for (var a = this.badQueries.length; a--;)
                if (b.indexOf(this.badQueries[a]) === 0) return true;
            return false
        },
        hide: function() {
            this.enabled = false;
            this.selectedIndex = -1;
            this.container.hide()
        },
        suggest: function() {
            if (this.suggestions.length === 0) this.hide();
            else {
                var b, a, c, e, g, f, j, k;
                b = this;
                a = this.suggestions.length;
                e = this.options.fnFormatResult;
                g = this.getQuery(this.currentValue);
                j = function(h) {
                    return function() {
                        b.activate(h)
                    }
                };
                k = function(h) {
                    return function() {
                        b.select(h)
                    }
                };
                this.container.hide().empty();
                for (f = 0; f < a; f++) {
                    c = this.suggestions[f];
                    c = d((b.selectedIndex === f ? '<div class="selected"' : "<div") + ' title="' + c + '">' + e(c, this.data[f], g) + "</div>");
                    c.mouseover(j(f));
                    c.click(k(f));
                    this.container.append(c)
                }
                this.enabled = true;
                this.container.show()
            }
        },
        processResponse: function(b) {
            var a;
            try {
                a = eval("(" + b + ")")
            } catch (c) {
                return
            }
            if (!d.isArray(a.data)) a.data = [];
            if (!this.options.noCache) {
                this.cachedResponse[a.query] = a;
                a.suggestions.length === 0 && this.badQueries.push(a.query)
            }
            if (a.query === this.getQuery(this.currentValue)) {
                this.suggestions = a.suggestions;
                this.data = a.data;
                this.suggest()
            }
        },
        activate: function(b) {
            var a, c;
            a = this.container.children();
            this.selectedIndex !== -1 && a.length > this.selectedIndex && d(a.get(this.selectedIndex)).removeClass();
            this.selectedIndex = b;
            if (this.selectedIndex !== -1 && a.length > this.selectedIndex) {
                c = a.get(this.selectedIndex);
                d(c).addClass("selected")
            }
            return c
        },
        deactivate: function(b, a) {
            b.className = "";
            if (this.selectedIndex === a) this.selectedIndex = -1
        },
        select: function(b) {
            var a;
            if (a = this.suggestions[b]) {
                this.el.val(a);
                if (this.options.autoSubmit) {
                    a = this.el.parents("form");
                    a.length > 0 && a.get(0).submit()
                }
                this.ignoreValueChange = true;
                this.hide();
                this.onSelect(b)
            }
        },
        moveUp: function() {
            if (this.selectedIndex !== -1)
                if (this.selectedIndex === 0) {
                    this.container.children().get(0).className = "";
                    this.selectedIndex = -1;
                    this.el.val(this.currentValue)
                } else this.adjustScroll(this.selectedIndex - 1)
        },
        moveDown: function() {
            this.selectedIndex !== this.suggestions.length - 1 && this.adjustScroll(this.selectedIndex + 1)
        },
        adjustScroll: function(b) {
            var a, c, e;
            a = this.activate(b).offsetTop;
            c = this.container.scrollTop();
            e = c + this.options.maxHeight - 25;
            if (a < c) this.container.scrollTop(a);
            else a > e && this.container.scrollTop(a - this.options.maxHeight + 25);
            this.el.val(this.getValue(this.suggestions[b]))
        },
        onSelect: function(b) {
            var a, c;
            a = this.options.onSelect;
            c = this.suggestions[b];
            b = this.data[b];
            this.el.val(this.getValue(c));
            d.isFunction(a) && a(c, b, this.el)
        },
        getValue: function(b) {
            var a, c;
            a = this.options.delimiter;
            if (!a) return b;
            c = this.currentValue;
            a = c.split(a);
            if (a.length === 1) return b;
            return c.substr(0, c.length - a[a.length - 1].length) + b
        }
    }
})(jQuery);


(function($, Drupal) {
  Drupal.behaviors.ingredientChef = {
    attach: function(context, settings) {
      if($('#ti-lsg-mr-ingredient-chef-form').length > 0) {
        $('#ti-lsg-mr-ingredient-chef-form')
         .ingredient_search(
           'ingredient_search_init',
           'edit-available-ingredient-0',
           ['', '', '' ],
           function() { omniCommunityTracker('ic-search-landing-button');}
         );
      }
      if($('#edit-add-more-ingredient').length > 0) {
        $('#edit-add-more-ingredient')
         .ingredient_search(
           'ingredient_search_init',
           'edit-more-ingredient-0',
           ['more ingredients'],
           function() { omniCommunityTracker('ic-search-more-button');}
         );
      }
      if($('#ti_lsg_mr_ingredient_chef_form_overlay').length > 0) {
        $('#ti_lsg_mr_ingredient_chef_form_overlay')
         .ingredient_search(
           'ingredient_search_init',
           'edit-available-ingredient-1',
           ['', '', '' ],
           function() { omniCommunityTracker('ic-search-overlay-button');}
         );
      }

    }
  };
})(jQuery, Drupal);

(function ($) {
    $(document).ready(function () {
        //Build a meal for submit when checkbox state change on more-ingredient form
        $('#add-more-ingredient-form .form-checkbox').change(function() {
          $(this).closest("form").submit();
        });

        $('#add-more-ingredient-form').submit(function (e) {
            var more_ingredient = $.trim($('#edit-more-ingredient-00').val());
            var additional_data = [];
            $('#add-more-ingredient-form input:checkbox:checked').each(function(i){
            additional_data.push($(this).val());
            });
            remove_unchecked_keys = [];
            $("#add-more-ingredient-form input:checkbox:not(:checked)").each(function () {
                remove_unchecked_keys.push(this.value);
            });

            var additional_join_data = additional_data.join("|");
            if(more_ingredient === 'more ingredients') {
                more_ingredient = '';
            }
            else {
                more_ingredient = encodeURI(more_ingredient) + '|';
            }
                var key_filter = getUrlVars()['qt'];
                var arr_key_filter = decodeURI(key_filter).split('|');
                var arr_removed_unchecked_key_filter = arr_key_filter.filter(function(val) {
                  return remove_unchecked_keys.indexOf(val) == -1;
                });
                var removed_unchecked_key_filter = arr_removed_unchecked_key_filter.join("|");

                var new_ingredient_keys = '';
                if (typeof removed_unchecked_key_filter !== 'undefined' && removed_unchecked_key_filter.length) {
                  var key_inputs = removed_unchecked_key_filter + '|' + more_ingredient + additional_join_data;

                  //remove duplicate key inputs on submit
                  var key_splitted = key_inputs.split('|');
                  var collector = {};
                  for (i = 0; i < key_splitted.length; i++) {
                    key = key_splitted[i].replace(/^\s*/, "").replace(/\s*$/, "");
                    collector[key] = true;
                  }
                  var out = [];
                  for (var key in collector) {
                    out.push(encodeURI(key));
                  }
                  new_ingredient_keys = out.join('|');
                }
                else {
                  new_ingredient_keys =  more_ingredient;
                }
                var query_string = 'qt=' + new_ingredient_keys;
                goToSearchPage(query_string);
            return false;
        });
    });
    var goToSearchPage = function (query_string) {
        var pathName = document.location.pathname;
        var path = '/search/ingredient-chef/';
        var isMobilePage = pathName.indexOf("/m/") === 0 ? true : false;
        if (isMobilePage) {
          path = '/m/search/ingredient-chef/';
        }
        var url = path + '?' + query_string;
        window.location.href = url;
        return false;
    }
    var getUrlVars = function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
})(jQuery);

 /* BEGIN My Recipes jQuery Plugins
  *
  * Implementations for:
  * - Ingredient Search
  */
(function ($, plugin_namespace) {
 /* There should be a text input for each hint.
  * Text inputs must end in sequential digits which are
  * appended to id_base name.
  */
  var ingredient_search_init = function (input_base, hints, omniture_onsubmit, is_page_endeca_served) {
    $ = jQuery;
    var ingredients = [
      "all-purpose flour", "almonds", "apples", "arborio rice",
      "avocado", "bacon", "baking potatoes", "baking powder",
      "baking soda", "balsamic vinegar", "banana", "barbecue sauce",
      "barley", "basil", "beef broth", "bell peppers",
      "black beans", "black forest ham", "black olives", "blue cheese",
      "bottled roasted red peppers", "bread dough", "broccoli", "brown rice",
      "brown sugar", "butter", "buttermilk", "cannellini beans",
      "canola oil", "capers", "carrots", "celery",
      "cheddar cheese", "chicken breasts", "chicken broth", "chicken thighs",
      "chocolate, semisweet", "cider vingar", "cilantro",
      "cocoa", "cooking spray", "corn tortillas", "cornmeal",
      "cornstarch", "couscous", "crackers", "cream cheese",
      "cucumber", "dark sesame oil", "diced tomatoes", "dijon mustard",
      "dried oregano", "dried rosemary", "dried rubbed sage", "dried thyme",
      "edam cheese", "egg substitute", "eggs", "evaporated milk",
      "feta cheese", "firm tofu", "fish fillets", "fish sauce",
      "flat-leaf parsley", "flour tortillas", "french bread", "fresh garlic",
      "fresh ginger", "garbanzo beans", "garlic powder", "goat cheese",
      "gouda cheese", "granulated sugar", "great northern beans", "greek yogurt",
      "green beans", "green chilies", "green olives", "green onions",
      "green peas", "ground allspice", "ground beef", "ground black pepper",
      "ground cinnamon", "ground cumin", "ground nutmeg", "ground red pepper",
      "ground turkey", "ground turmeric", "gruyere cheese", "half-and-half",
      "heavy cream", "hoisin sauce", "honey", "hot pepper sauce",
      "jalapeno peppers", "jasmine rice", "kalamata olives", "ketchup",
      "lemons", "lettuce", "limes", "loaf bread",
      "manchego cheese", "maple syrup", "mayonnaise", "milk",
      "molasses", "mozzarella cheese", "muenster cheese", "oats",
      "olive oil", "orange juice concentrate", "oranges", "pancetta",
      "paprika", "parmagiano reggiano", "parmesan cheese", "pasta sauce",
      "peanut butter", "peanut oil", "pears", "pecans",
      "penne pasta", "phyllo dough", "pine nuts", "pinto beans",
      "pizza dough", "plain yogurt", "pork chops", "pork tenderloin",
      "powdered sugar", "prepared horseradish", "prepared hummus", "proscuitto",
      "raisins", "ranch dressing", "ready-to-eat cereal", "red onions",
      "red wine", "red wine vinegar", "rice vinegar", "ricotta cheese",
      "roast beef", "romano cheese", "rotisserie chicken", "salami",
      "salmon", "salt", "self-rising flour", "serrano ham",
      "silken tofu", "sopressata", "sour cream", "soy sauce",
      "spaghetti", "spinach", "stone-ground mustard", "sweetend condensed milk",
      "tomato paste", "tomatoes", "tuna", "turbinado sugar",
      "vegetable broth", "walnuts", "whipping cream", "white or yellow onions",
      "white rice", "white vinegar", "white wine", "white wine vinegar",
      "worchestershire sauce"
    ],
            $form = this,
            hint_key = 'hint',
            hint_val = '',
            hint_class = 'hinted',
            i, $input;
    /* END var */

    /* Apply any run-time arguments */
    input_base = input_base || 'ingredient-';
    hints = hints || ['Enter a value'];
    is_page_endeca_served = is_page_endeca_served || false;
    omniture_onsubmit = typeof omniture_onsubmit === 'function' ? omniture_onsubmit : false;

    /* Walk over set of sequential text inputs,
     * adding hints and blur-event functionality.
     */
    for (i = 0; i < hints.length; i += 1) {
      hint_val = hints[i];
      $input = this.find('#' + input_base + i);
      $input.data(hint_key, hint_val)
              .val(hint_val)
              .addClass(hint_class)
              .focus(function () {
                /* Remove hint on focus event if present */
                var $this = $(this);
                if ($.trim($this.val()) === $this.data(hint_key)) {
                  $this.val('').removeClass(hint_class);
                }

              })
              .blur(function () {
                /* Redisplay hint if input is blank */
                var $this = $(this);
                if (!$.trim($this.val())) {
                  $this.val($this.data(hint_key)).addClass(hint_class);
                }
              })
              .autocomplete({
                lookup: ingredients,
                minChars: 1,
                width: 218,
                zIndex: 99999,
                deferRequestBy: 0,
                noCache: true
              });
    }

    /* Dependency on Endeca code */
    if (is_page_endeca_served) {
      var $sponsored_ingredients = $('#sponsored-ingredients input[type=checkbox]');
      $sponsored_ingredients.live('click', function () {
        var value = $(this).val(),
                action = $(this).is(':checked') ? '1' : '-1';
        updateNttValue(value, action);
      });
    }

    if (!is_page_endeca_served) {
      $form.submit(function (event) {
        var j, t, $input, value,
                field_values = [],
                sponsor_ingredient_names = [],
                tokens = [],
                token = '',
                piped_values = '',
                $newform = $('<form></form>'),
                search_params = {};

        var pathName = document.location.pathname;
        var form_action = '/search/ingredient-chef';
        var isMobilePage = pathName.indexOf("/m/") === 0 ? true : false;
        if(isMobilePage) {
          form_action = '/m/search/ingredient-chef';
        }
        event.preventDefault();

        /* Walk form elements and capture values */
        for (j = 0; j < hints.length; j += 1) {
          $input = $form.find('#' + input_base + j);

          value = $.trim($input.val());

          /* Skip if a hint or empty string */
          if (!value || value === $input.data(hint_key)) {
            continue;
          }

          /* Otherwise, replace commas with pipes */
          tokens = value.split(',');

          /* Handle whitespace */
          for (t = 0; t < tokens.length; t += 1) {
            token = tokens[t].replace(/\s+/, ' ');
            field_values.push(encodeURI($.trim(token)));
          }
        }

        /* Check if any sponsored ingredient values */
        $form.find(':checked').each(function () {
          field_values.push($.trim($(this).val()));
          sponsor_ingredient_names.push($(this).parent().find('label').text());
        })

        /* Concat values with pipe character for 'qt'*/
        search_params['qt'] = field_values.join('|');

        /* Concat values with pipe character for 'qt'*/
        search_params['spn'] = sponsor_ingredient_names.join('|');

        /* Wrap values in quotes and concat with space for 'Ntt' */
        for (t = 0; t < field_values.length; t += 1) {
          token = field_values[t];
          field_values[t] = '"' + token + '"';
        }
        /* Join values with space character */
        search_params['Ntt'] = field_values.join(' ');

        $newform.attr({action: form_action, method: 'get', enctype: 'application/x-www-form-urlencoded'});
        /* N.B.: value attribute must be use single quotes as the actual content has double quotes */
        $newform.append('<input type="hidden" name="qt" value="' + search_params['qt'] + '"/>');
        $newform.appendTo('body');
        if (omniture_onsubmit) {
          $newform.submit(function () {
            omniture_onsubmit();
            return true;
          });
        }
        $newform.submit();
        return false;
      });
    }
  },
  /* jQuery Plugin Methods Map
   *
   * Each property is a public method that points to an internal implemenation.
   * This permits custom or multiple namings for each plugin method.
   */
  plugin_methods = {
    ingredient_search_init: ingredient_search_init
  };
  /* END main var */

  /* jQuery plug-in invocation function adapted from http://docs.jquery.com/Plugins/Authoring*/
  $.fn[plugin_namespace] = function (method) {
    var slice = Array.prototype.slice;

    if (plugin_methods[method]) {
      return plugin_methods[method].apply(this, slice.call(arguments, 1));
    } else {
      $.error('Method ' + method + ' does not exist in the jQuery plugin namespace');
    }
  };
})(jQuery, 'ingredient_search');
