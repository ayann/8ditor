jQuery(document).ready(function($) {
  $('#hide_chat').click(function(event) {
    if ($(this).data('click') == 'show') {
      $(this).text('keyboard_arrow_up').data('click', 'hide');
      $(this).closest('.module').find('#messages_container').slideUp();
    } else {
      $(this).text('keyboard_arrow_up').data('click', 'show');
      $(this).closest('.module').find('#messages_container').slideDown();
    }
  })
})
