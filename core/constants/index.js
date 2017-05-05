module.exports = {
  identificationPhoto: { //properties for identification photo
    CORRECT: {name: 'correct', color: '#2ECC71'},
    UNCERTAIN: {name: 'uncertain', color: '#F39C12'},
    OTHER: {name: 'other', color: '#3498DB'},
    DELETE: {name: 'delete', color: '#E74C3C'}
  }, filesName: {
    geolocations: 'geolocations.geojson', //name geolocations json file
    images: 'images.zip' //name images archive
  }, limits: {
      records: 10 //limit records for table page
  }
};
