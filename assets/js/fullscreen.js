let images = [],
  activeIndex = 0,
  slides = [],
  galleryTop,
  galleryThumbs;

$( document ).ready(function() {
  initSwiper();
  activeIndex = galleryTop.activeIndex;
  slides = galleryTop.slides;
  let name = getNameByActiveIndex();
  if (name) {
    getImage(name);
  }
});

function initSwiper() {
  galleryTop = new Swiper('.gallery-top', {
    nextButton: '.swiper-btn-next',
    prevButton: '.swiper-btn-prev',
    spaceBetween: 10,
    onSlideNextStart: (swiper) => {
      activeIndex = swiper.activeIndex;
      let name = getNameByActiveIndex();
      if (name) {
        getImage(name);
      }
    },
    onSlidePrevStart: (swiper) => {
      activeIndex = swiper.activeIndex;
      let name = getNameByActiveIndex();
      if (name) {
        getImage(name);
      }
    }
  });

  galleryThumbs = new Swiper('.gallery-thumbs', {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 'auto',
    touchRatio: 0.2,
    slideToClickedSlide: true
  });

  galleryTop.params.control = galleryThumbs;
  galleryThumbs.params.control = galleryTop;
}

function getNameByActiveIndex () {
  if (slides.length) {
    let slide = slides[activeIndex];
    if (slide) return slide.dataset.name;
  }
  return null;
}

function getImageByFilename(filename) {
  return images[filename];
}

function format(value) {
  if (value < 10) return '0' + value;
  return value;
}

function renderDescription(filename, image) {
  $('#date-create-image').html(moment(image.date).format("DD.MM.YYYYY HH:mm:ss"));
  $('#name-image').html(image.name);
  $('#coordinates').html(image.coordinates);
  $('#radius').html('250 meters');
  $('#url').attr('href', '/image/' + image.name).html(location.hostname + '/image/' + image.name);
  $('#comments-image').html(image.comments);

  $('button.delete-img').removeClass('btn-delete');
  if (image.isDelete) {
    $('button.delete-img').addClass('btn-delete');
  }
  selectIdentification(filename, image);
}

function selectIdentification(filename, image) {
  $("button.identification").css("background-color", "");
  if (image) {
    $("button.identification[name='" + image.identification + "']").css("background-color", identifications[image.identification.toUpperCase()].color);
    images[filename] = image;
  }
}

//ajax requests
//get image
function getImage(filename) {
  let img = getImageByFilename(filename);
  if (img) {
    renderDescription(filename, img);
    return;
  }
  $.post(`/image`, {filename}, function(req, status){

    if (req.status != 'fail') {
      let image = req.data.image;
      if (image) {
        images[filename] = image;
        renderDescription(filename, image);
      }
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
}

$('.delete-img').click((event) => {
  let filename = getNameByActiveIndex();

  $.post(`/image/update`, {
    filename,
    isDelete: true
  }, function(req, status){
    if (req.status != 'fail') {
      let image = req.data.image;
      let el = $(event.target);
      el.removeClass("btn-delete");

      if (image.isDelete) { el.addClass('btn-delete') }
      images[filename] = image;
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});

$('button.identification').on('click', (event) => {
  let filename = getNameByActiveIndex(),
    identification = event.target.name;

  $.post(`/image/update`, {
    identification,
    filename
  }, function(req, status){
    if (req.status != 'fail') {
      let image = req.data.image;
      selectIdentification(filename, image);
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});

function getRemoveIndex (idsDeleted) {
  let ids = [];
  for (let i = 0; i < idsDeleted.length; i++) {
    let idDel = idsDeleted[i];
    for (let j = 0; j < slides.length; j++) {
      let slide = slides[j];
      if (slide.id == idDel) {
        ids.push(j);
        break;
      }
    }
  }
  return ids;
}

$('span.del').on('click', (event) => {
  $.post(`/image/purge-deleted`, {}, function(req, status){
    if (req.status != 'fail') {
      let ids = req.data.idsDeleted;
      if (ids.length) {
        const deletedIds = getRemoveIndex(ids);
        galleryTop.removeSlide(deletedIds);
        galleryThumbs.removeSlide(deletedIds);
        console.log('purge-deleted');
      } else {
        console.log('No data to delete');
      }
    } else if (req.data.msg == "Unauthorized") {
      window.location.href = "/login";
    }
  });
});