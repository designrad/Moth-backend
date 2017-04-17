$('.delete-img').click((event) => {
  let filename = event.target.dataset.name;
  imageUpdate(filename, event);
});

$('button.identification').on('click', (event) => {
  let filename = event.target.dataset.name;

  changeIdentification(filename, event)
});

$('span.del').on('click', (event) => {

  $.post(`/image/purge-deleted`, {}, function(req, status){
    if (req.status != 'fail') {
      let ids = req.data.idsDeleted;
      if (ids.length) {
        ids.forEach((id) => {
          $('tr#' + id).remove();
        });
        console.log('purge-deleted');
      } else {
        console.log('No data to delete');
      }
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});