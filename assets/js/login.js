$(function() {

  $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });
  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

});

$( "#register-form" ).submit(function( event ) {

  // Stop form from submitting normally
  // event.preventDefault();

  // Get some values from elements on the page:
  // var form = $( this )
  // console.log(form);
  //   term = $form.find( "input[name='s']" ).val(),
  //   url = $form.attr( "action" );
  //
  // // Send the data using post
  // var posting = $.post( url, { s: term } );
  //
  // // Put the results in a div
  // posting.done(function( data ) {
  //   var content = $( data ).find( "#content" );
  //   $( "#result" ).empty().append( content );
  // });
});