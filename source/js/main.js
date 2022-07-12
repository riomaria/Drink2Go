/* Main-navigation */

(() => {

  const mainHeader = document.querySelector('.main-header');
  const mainNavigation = mainHeader.querySelector('.main-navigation');
  const mainMenuList = mainHeader.querySelector('.main-navigation__list');
  const menuDropdown = mainHeader.querySelector('.main-navigation__toggle');

  mainHeader.classList.remove('main-header--no-js');
  mainNavigation.classList.remove('main-navigation--nojs');
  mainMenuList.classList.remove('main-navigation__list--no-js');
  menuDropdown.classList.remove('main-navigation__toggle--no-js');

  menuDropdown.addEventListener('click', () => {
    const expanded = menuDropdown.getAttribute('aria-expanded') === 'true' || 'false';
    menuDropdown.setAttribute('aria-expanded', !expanded);
    menuDropdown.classList.toggle('main-navigation__toggle--close');
    mainNavigation.classList.toggle('main-navigation--close');
  });
})();

/* Promo slider */

(() => {
  const colorBg = ['--add__basic', '--primary__light', '--accent__second'];
  const mediaMobile = 767;
  const mediaDesktop = 1440;

  const promo = document.querySelector('.promo');
  const slideData = promo.querySelectorAll('.promo__item');
  const dotsData = promo.querySelectorAll('.dots-navigation__button');
  const buttonPrev = promo.querySelector('.control__button--prev');
  const buttonNext = promo.querySelector('.control__button--next');

  let currentCount = 0;
  const countSlide = slideData.length-1;

  const initPromo = () => {
    promo.style.background = `var(${colorBg[currentCount]})`;

    if (document.body.offsetWidth > mediaMobile && document.body.offsetWidth < mediaDesktop) {
      promo.style.background = `linear-gradient(to bottom, var(${colorBg[currentCount]}) 77.4%, var(--theme__basic) 77.4%)`;
    }
  };

  buttonNext.addEventListener('click', () => {
    currentCount++;

    if (currentCount > countSlide) {
      currentCount = 0;
    }

    if (currentCount <= countSlide) {
      slideData.forEach((item) => {
        item.classList.remove('promo__item--current');
      });

      slideData[currentCount].classList.add('promo__item--current');

      dotsData.forEach((item) => {
        item.classList.remove('dots-navigation__button--current');
      });
      dotsData[currentCount].classList.add('dots-navigation__button--current');

      initPromo();
    }
  });

  buttonPrev.addEventListener('click', () => {
    currentCount--;

    if (currentCount < 0) {
      currentCount = countSlide;
    }

    if (currentCount <= countSlide) {
      slideData.forEach((item) => {
        item.classList.remove('promo__item--current');
      });
      slideData[currentCount].classList.add('promo__item--current');

      dotsData.forEach((item) => {
        item.classList.remove('dots-navigation__button--current');
      });
      dotsData[currentCount].classList.add('dots-navigation__button--current');

      initPromo();
    }
  });

  window.addEventListener('resize', initPromo);
})();

/* Sort custom select */

(() => {
  const sortList = document.querySelector('.sort__list');
  const sortDropdown = document.querySelector('.sort__dropdown');
  const sortItems = sortList.querySelectorAll('.sort__item');
  const fontMin = 13;
  const fontDefault = 16;

  sortDropdown.addEventListener('click', () => {
    sortList.classList.toggle('sort__list--close');

    sortItems.forEach((item) => {

      item.addEventListener('click', ()=> {
        const itemLength = item.textContent.length;

        if (itemLength > fontMin) {
          sortDropdown.style.fontSize = `${fontMin}px`;
        }

        if (itemLength < fontMin) {
          sortDropdown.style.fontSize = `${fontDefault}px`;
        }
        sortDropdown.textContent =  item.textContent;

        sortList.classList.toggle('sort__list--close');
      });
    });
  });
})();

/* Map */

(() => {
  const mapOption = {
    DEFAULT_COORDS: {
      lat: 59.96829199158736,
      lng: 30.317497945106883,
    },
    TILE: {
      URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ATTR: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    ZOOM: {
      DEFAULT_ZOOM: 18,
    }
  };

  const mapCanvas = document.querySelector('#map-canvas');

  const map = L.map(mapCanvas);

  const initMap = () => {
    map.on('load', () => {
    })
      .setView(mapOption.DEFAULT_COORDS, mapOption.ZOOM.DEFAULT_ZOOM);

    L.tileLayer(
      mapOption.TILE.URL,
      {
        attribution: mapOption.TILE.ATTR,
      },
    ).addTo(map);
  };

  const mainPinIcon = L.icon({
    iconUrl: '../img/map/pin-marker.svg',
    iconSize: [38, 50],
    iconAnchor: [19, 50],
  });

  const mainPinMarker = L.marker(
    {
      lat: 59.96829199158736,
      lng: 30.317497945106883,
    },
    {
      icon: mainPinIcon,
    },
  );

  mainPinMarker.addTo(map);

  initMap();

})();
