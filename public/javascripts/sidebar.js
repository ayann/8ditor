$(document).ready(function() {
  $("#sidebar_button").click(function(event) {
    $(".sidebar").animate({"margin-right": '0'});
  });

  $("#close_sidebar").click(function(event) {
    $(".sidebar").animate({"margin-right": '-300'});
  });

  $.getJSON( "/javascripts/theme.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( "<option value='" + key + "'>" + val + "</option>" );
    });

    $('select#theme').html(items.join( "" ))
  });

  $.getJSON( "/javascripts/language.json", function( data ) {
    var items = [];
    $.each( data, function( key, val ) {
      items.push( "<option value='" + key + "'>" + val + "</option>" );
    });

    $('select#language').html(items.join( "" ))
    $('select').material_select();
  });

  $('select#language').change(function(event) {
    var language = $(this).val();
    editor.session.setMode("ace/mode/" + language);
  });

  $('select#theme').change(function(event) {
    var theme = $(this).val();
    editor.setTheme("ace/theme/" + theme);
  });

  $("input#police").on("input change", function(event) {
    $('#editor').css('fontSize', $(this).val() + 'px');
  })
});
