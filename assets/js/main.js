const identifications = {
  CORRECT: {name: 'correct', color: '#2ECC71'},
  UNCERTAIN: {name: 'uncertain', color: '#F39C12'},
  OTHER: {name: 'other', color: '#3498DB'},
  DELETE: {name: 'delete', color: '#E74C3C'}
}, filesName = {
  geolocations: 'geolocations.json',
  images: 'images.zip'
}

$( document ).ready(function() {});

function changeIdentification(filename, event) {
  const identification = event.target.name;

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
}

function loaderShow(element) {
  element.attr('disabled', true);
  element.html('');
  element.append('<div class="loader"></div>');
}

function loaderHide(element, text) {
  element.removeAttr("disabled");
  element.html(text);
  element.remove('.loader');
}

//#archive-images
$('button#archive-images').on('click', (event) => {
  loaderShow($(event.target))
  downloadFile('/image/archive', '/archive/download/');
});

//#geolocations
$('button#geolocations').on('click', (event) => {
  loaderShow($(event.target))
  downloadFile('/geolocations', '/geolocations/download/');
});

function downloadFile(urlPost, urlDownload) {
  $.post(urlPost, {}, function(req, status){
    if (req.status != 'fail') {
      const fileName = req.data.fileName;
      if (!fileName) return;

      checkFileForDownload(urlDownload, fileName);
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
}

function checkFileForDownload(urlDownload, filename) {
  let i = 0,
    interval;

  interval = setInterval(() => {
    $.post('/check-file', {filename}, function(req, status) {
      if (req.status != 'fail') {
        let completed = req.data.completed;
        if (completed) {
          clearInterval(interval);
          download(urlDownload, filename)
        }
      }
    });
    if (i > 10) clearInterval(interval);
    i++;
  }, 3000);


}

function download(urlDownload, fileName) {
  let link = document.createElement("a");
  link.download = fileName;
  link.href = `${urlDownload}` + fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (fileName == filesName.images) {
    loaderHide($('#archive-images'), 'Export images')
  } else if (fileName == filesName.geolocations) {
    loaderHide($('#geolocations'), 'Export geolocations')
  }
}