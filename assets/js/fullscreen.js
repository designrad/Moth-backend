let images = [],
    activeIndex = 0, //active index for swiper
    slides = [], //slides swiper
    galleryTop, //swiper top
    galleryThumbs, //swiper bottom
    frizeIdentification = false;

$(document).ready(function () {
    //init swiper
    initSwiper();
    //install global value
    initSwiperValue();
    //get name image by active image
    let name = getNameByActiveIndex();
    if (name) {
        //get image by ajax request
        getImage(name);
    }
});

$(document).keypress(function (e) {
    let key = e.keyCode || e.charCode;
    if (key >= 48 && key <= 57) {
        switch (key) {
            case 49: {
                identificationChange('correct');
            } break;
            case 50: {
                identificationChange('uncertain');
            } break;
            case 51: {
                identificationChange('other');
            } break;
            case 52: {
                identificationChange('delete');
            } break;
        }
    }
});

function initSwiperValue() {
    activeIndex = galleryTop.activeIndex;
    slides = galleryTop.slides;
    let name = getNameByActiveIndex();
    if (name) {
        getImage(name);
    }
}

function initSwiper() {
    //install properties got swiper top
    galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-btn-next',
        prevButton: '.swiper-btn-prev',
        spaceBetween: 10,
        keyboardControl: true,
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

    //install properties got swiper bottom
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

//get name images
function getNameByActiveIndex() {
    if (slides.length) {
        let slide = slides[activeIndex];
        if (slide) return slide.dataset.name;
    }
    return null;
}

//get object image
function getImageByFilename(filename) {
    return images[filename];
}

//set description
function renderDescription(filename, image) {
    $('#date-create-image').html(moment(image.date).format("DD.MM.YYYY HH:mm:ss"));
    $('#name-image').html(`${image.author} ${image.email} ${image.team}`);
    $('#coordinates').html(`<a href="https://maps.google.com/maps?q=${image.latitude},${image.longitude}" target="_blank">${image.latitude} ${image.longitude}</a>`);
    $('#radius').html(image.accuracy + ' meters');
    $('#url').attr('href', '/image/' + image.name).html(/*location.hostname + */'/image/' + image.name);
    $('#comments-image').html(image.comments);
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

    $.post(`/image`, {filename}, function (req, status) {

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

//update image
$('button.identification').on('click', (event) => {
    identificationChange(event.target.name);
});

function identificationChange(identification) {
    if (frizeIdentification) return;
    let filename = getNameByActiveIndex();

    frizeIdentification = true;
    $.post(`/image/update`, {
        identification,
        filename
    }, function (req, status) {
        if (req.status != 'fail') {
            frizeIdentification = false;
            let image = req.data.image;
            images[filename] = image;
            selectIdentification(filename, image);
        } else if (req.data.msg == "Unauthorized") {
            frizeIdentification = false;
            window.location.href = "/login";
        }
    });
}

function getRemoveIndex(imgs) {
    let ids = [];
    for (let i = 0; i < imgs.length; i++) {
        let image = imgs[i];
        for (let j = 0; j < slides.length; j++) {
            let slide = slides[j];
            if (slide.id == image.id) {
                images[image.name] = null;
                ids.push(j);
                break;
            }
        }
    }
    return ids;
}

//purge deleted images
$('span.del').on('click', (event) => {
    $.post(`/image/purge-deleted`, {}, function (req, status) {
        if (req.status != 'fail') {
            let imgs = req.data.images;
            if (imgs.length) {
                const deletedIds = getRemoveIndex(imgs);
                galleryTop.removeSlide(deletedIds);
                galleryThumbs.removeSlide(deletedIds);
                initSwiperValue();
                console.log('purge-deleted');
            } else {
                console.log('No data to delete');
            }
        } else if (req.data.msg == "Unauthorized") {
            window.location.href = "/login";
        }
    });
});
