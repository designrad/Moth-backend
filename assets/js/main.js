const identifications = {
  CORRECT: {name: 'correct', color: '#2ECC71'},
  UNCERTAIN: {name: 'uncertain', color: '#F39C12'},
  OTHER: {name: 'other', color: '#3498DB'},
  DELETE: {name: 'delete', color: '#E74C3C'}
};

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

//#archive-images
$('a#archive-images').on('click', (event) => {
  downloadFile('/image/archive', '/image/download/');
});

//#geolocations
$('a#geolocations').on('click', (event) => {
  downloadFile('/geolocations', '/geolocations/download/');
});

function downloadFile(urlPost, urlDownload) {
  $.post(urlPost, {}, function(req, status){
    if (req.status != 'fail') {
      const fileName = req.data.fileName;
      if (!fileName) return;

      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${urlDownload}` + fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });

}