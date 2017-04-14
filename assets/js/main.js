const identifications = {
  CORRECT: {name: 'correct', color: '#2ECC71'},
  UNCERTAIN: {name: 'uncertain', color: '#F39C12'},
  OTHER: {name: 'other', color: '#3498DB'}
};

$('.delete-img').click((event) => {
  let filename = event.target.dataset.name;

  $.post(`/image/update`, {
    filename,
    isDelete: true
  }, function(req, status){
      if (req.status != 'fail') {
        let image = req.data.image;
        let el = $(event.target);
        el.removeClass("btn-delete");

        if (image.isDelete) { el.addClass('btn-delete') }
      } else if (req.data.msg == "Unauthorized") {
        window.location.href = "/login";
      }
    });
});

$('button.identification').on('click', (event) => {
  let filename = event.target.dataset.name,
    identification = event.target.name,
    id = event.target.id;

  $.post(`/image/update`, {
    identification,
    filename
  }, function(req, status){
    if (req.status != 'fail') {
      $("button[data-name='" + filename + "']").css("background-color", "");
      $(event.target).css("background-color", identifications[identification.toUpperCase()].color);
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});

//#archive-images
$('a#archive-images').on('click', (event) => {

  $.post(`/image/archive`, {}, function(req, status){
    if (req.status != 'fail') {
      console.log('files archive');
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});