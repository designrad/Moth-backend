//update image
$('button.identification').on('click', (event) => {
  let filename = event.target.dataset.name;

  changeIdentification(filename, event)
});

//purge deleted images
$('span.del').on('click', (event) => {

  $.post(`/image/purge-deleted`, {}, function(req, status){
    if (req.status != 'fail') {
      let image = req.data.images;
      if (image.length) {
        // ids.forEach((id) => {
        //   $('tr#' + id).remove();
        // });
        console.log('purge-deleted');
        window.location.href = "/";
      } else {
        console.log('No data to delete');
      }
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});