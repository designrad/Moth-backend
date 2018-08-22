//update image
$('button.identification').on('click', (event) => {
  let filename = event.target.dataset.name;

  changeIdentification(filename, event)
});

var postTimer;

function postReview(filename, review) {
  $.post(`/image/review`, { filename, review }, function(req, status){
    if (req.status != 'fail') {
      console.log('review ok', req, status);
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
}

function delayedPost(name, text) {
  if (postTimer) clearTimeout(postTimer);
  console.log('set');
  postTimer = setTimeout(function() { postReview(name, text) }, 1000);
}

// on every key up delay post with 600ms
$('textarea.review').on('keyup', (event) => {
  const target = (event && event.target) || null;
  if (!target) return;
  const name = target.dataset.name;
  if (!name) return;

  delayedPost(name, $(target).val());
});

// on leaving textarea save data
$('textarea.review').on('blur', (event) => {
  const target = (event && event.target) || null;
  if (!target) return;
  const name = target.dataset.name;
  if (!name) return;

  postReview(name, $(target).val());
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
