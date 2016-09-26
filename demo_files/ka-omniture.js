if (typeof (s_time.prop2) != "undefined") {
  s_time.community_recipe_author_name = s_time.prop2;
}
if (s_time.community_recipe_author_name) {
  s_time.eVar42 = s_time.community_recipe_author_name;
}
if (typeof (s_time.pageName) != "undefined") {
  if (typeof (s_time.recipeName) != "undefined") {
    if (s_time.recipeName.match(/^displayrecipe:.*$/g)) {
      if (typeof (s_time.prop2) != "undefined") {
        s_time.eVar18 = s_time.prop2;
      }
      if (typeof (s_time.prop26) != "undefined"
          && typeof (s_time.recipeName) != "undefined") {
        recipeName = s_time.recipeName.replace('displayrecipe:', '');
        s_time.eVar19 = s_time.prop26 + "|" + recipeName.toLowerCase();
      }
    }
  }
}
var s_code = s_time.t();
if (s_code) {
  document.write(s_code);
}
