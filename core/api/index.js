module.exports = {
  archive: require('./archive'), //archive images
  photoUpdate: require('./photoUpdate'), //update identification foto
  image: require('./image'), //get image by id or filename
  geolocationsPost: require('./geolocationsPost'), //get geolocations json file for admin panel
  geolocationsGet: require('./geolocationsGet'), //get geolocations json for mobile map
  photos: require('./photos'), //get photos by device for user
  checkFile: require('./checkFile') //get state archive with images
};