'use strict';

// Smooth scroll to line Up
const btnScroll = document.querySelector('.btn--scroll-to');
const sectionToScroll = document.querySelector('#section--1');

btnScroll.addEventListener('click', function () {
  // Modern Approach of doing the same thing (works only on new browsers)
  sectionToScroll.scrollIntoView({ behavior: 'smooth' });
});

/* 





*/
// Smooth scroll while clicking nav bnts in nav

// This a first approach. However it is not efficient.
// Cuz it actually makes coppies of eventHandlers for each link
// Might cause bad performance if there will be a lot of ellemnts
/* 
document.querySelectorAll('.nav__link').forEach(function (elem) {
  elem.addEventListener('click', function (event) {
    // Removing default scrolling caused by anchors
    event.preventDefault();
    // We need the link form nav__link
    const id = this.getAttribute('href'); //#section--1,2,3
    console.log('Link');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); 
*/

// here is the second approach for smmoth nav buttons scrolling
// We will use an event delegation
// We will try to detect and catch the event we need in parent element.
// Yes I hope U know that event in child will also appear in
// parents ellements as well

// sooo, LETS TRY EVENT DELEGATION
// 1) Add event listener to parent element
// 2) Detect which element originated the event

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    //console.log(event.target); // <a class="nav__link" href="#section--1">Features</a>
    // Removing default scrolling caused by anchors
    event.preventDefault();

    if (event.target.classList.contains('nav__link')) {
      // We need the link form nav__link
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
/* 





*/
// Menu fade animation while hovering
const nav = document.querySelector('.nav');
const handleCoverNav = function (event, opacity, color) {
  if (event.target.classList.contains('nav__link')) {
    // link which is covered by mouse
    const link = event.target;

    // rest of the links which are not covered by mouse
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    // selecting logo
    const logo = link.closest('.nav').querySelector('img');

    const button = link.closest('.nav').querySelector('.nav__link--btn');

    const nav = document.querySelector('.nav');
    sibling.forEach(function (elem) {
      if (elem !== link) elem.style.opacity = opacity;
    });

    nav.style.backgroundColor = `#${color}`;
  }
};

nav.addEventListener('mouseover', function (event) {
  handleCoverNav(event, 0.5, 'FFF8B8');
});

nav.addEventListener('mouseout', function (event) {
  handleCoverNav(event, 1, 'FFFBD7');
});
/*




*/
// Making Slider Component
// Selecting all the sliders
const slides = document.querySelectorAll('.slide');
// And the parant element of sliders
const allSlides = document.querySelector('.slider');

// selecting slider btns
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

// flag for current slide
let currentSlide = 0;

// how many slides?
const slidesCount = slides.length;
// some transformation in order to make things visible.
// Not nessesary for slider functionality
//allSlides.style.transform = 'scale(0.8) translateX(-1000px)';
// overflow is hidden in css so lets make it visible
//allSlides.style.overflow = 'visible';

// transforming each slide by moving them to the right
slides.forEach(function (item, index) {
  item.style.transform = `translate(${100 * index}%)`;
});
// So at the begining all slides will will have the following properties
// 0%, 100%, 200%, etc

// Adding event on right/left btns
//
// Going to the next slide
// we want changes to be like this after clicking right btn
// -100%, 0%, 100%, 200% etc
const moveRight = function () {
  if (currentSlide == slidesCount - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  slides.forEach(function (item, index) {
    item.style.transform = `translate(${100 * (index - currentSlide)}%)`;
  });
  changeDotsColor(currentSlide);
};

// Going to the previous slide
// we want changes to be like this after clicking right btn
// 100%, 200%, 300%, 400% etc
const moveLeft = function () {
  if (currentSlide == 0) {
    currentSlide = slidesCount - 1;
  } else {
    currentSlide--;
  }
  slides.forEach(function (item, index) {
    item.style.transform = `translate(${100 * (index - currentSlide)}%)`;
  });
  changeDotsColor(currentSlide);
};

btnSliderLeft.addEventListener('click', moveLeft);
btnSliderRight.addEventListener('click', moveRight);

// Using arrow keys to move right/left
document.addEventListener('keydown', function (event) {
  event.preventDefault();
  if (event.key === 'ArrowLeft') {
    moveLeft();
  }
  if (event.key === 'ArrowRight') {
    moveRight();
  }
  changeDotsColor(currentSlide);
});

// Creating dots in html
const createDots = function () {
  // We will have dots as musch as slides. So lets loop over slides
  slides.forEach(function (_, index) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${index}" ></button>`
    );
  });
};
// Trigger fn to show dots from the start
createDots();

const changeDotsColor = function (currentSlide) {
  // remove active color from all the dots
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');
  });
  // finding active dot that has current slide
  document
    .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
    .classList.add('dots__dot--active');
};

// trigger this function from the start in order
// the current slide to be active from the begining
changeDotsColor(0);

dotsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    // checking on what slide we are
    const slideInd = event.target.dataset.slide;
    currentSlide = slideInd;
    // moving to appropriate slide
    slides.forEach(function (item, index) {
      item.style.transform = `translate(${100 * (index - slideInd)}%)`;
    });
    changeDotsColor(slideInd);
  }
});
/* 





*/
// Sticky Navigation but with using Intersection Observer API
// what we want to show
const stickyNav = document.querySelector('.nav');
// what section we want to observe
const navObserveSect = document.querySelector('.header');
// getting exat margin from where we want to show
const navHeight = stickyNav.getBoundingClientRect().height;

// conditions in which our function will trigger
const obsOptionsNav = {
  // dont really know why we use null here
  root: null,
  // we want nav to show up when generic nav is out of viewport
  threshold: 0,
  // we make nav bar appear a bit earlier before section
  // but its better to calculate it dynamicly in order to have a good
  // responsive design. (hardcoding 90px is not always a good idea)
  // rootMargin: '-90px',
  rootMargin: `-${navHeight}px`,
};

const obsCallbackNav = function (entries, observer) {
  const [entry] = entries;

  // if we do not see header section in viewport - we ADD class.
  if (!entry.isIntersecting) stickyNav.classList.add('sticky');
  // if We SEE header section we remove it
  else stickyNav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(obsCallbackNav, obsOptionsNav);

headerObserver.observe(navObserveSect);
/* 




*/
// Tabbed components in experience
const tabs = document.querySelectorAll('.experience__tab');
const tabsContainer = document.querySelector('.experience__tab-container');
const tabsContent = document.querySelectorAll('.experience__content');

tabsContainer.addEventListener('click', function (event) {
  // Choosing parent elem so every click will be on whole element
  // but not child elements inside.
  // To do that we use closest,
  // which will refer on next closest parent/child element
  const clickedElem = event.target.closest('.experience__tab');
  console.log(clickedElem);
  // <button class="btn operations__tab operations__tab--2 operations__tab--active" data-tab="2"> <span>02</span>Instant Loans</button>
  // And we also have to get rid of clicking on parent element
  // If we clicked on parent element - this event handler will return null.
  // and we stop the execution
  if (clickedElem === null) return;

  // removing class on all tabs
  tabs.forEach(function (elem) {
    elem.classList.remove('experience__tab--active');
  });
  // adding shift on active tab
  clickedElem.classList.add('experience__tab--active');

  // removing all content before showing appropriate
  tabsContent.forEach(function (elem) {
    elem.classList.remove('experience__content--active');
  });
  // adding appropriate content to tab number. Check out how we reach
  // to the appropriate elem with data-tab in html
  document
    .querySelector(`.experience__content--${clickedElem.dataset.tab}`)
    .classList.add('experience__content--active');
});
/* 





*/
// Smooth Revealing sections while scrolling down (only for offer in footer! otherwise it will look bad)
// To do that I use Intersection Observer API again

const allSections = document.querySelector('.section');
const sectionToPop = document.querySelector('.offer');

const obsOptionsSections = {
  root: null,
  threshold: 0.1,
};

const obsCallbackSections = function (entries, observer) {
  const [entry] = entries;

  // if section is not intersectin - do nothing
  if (!entry.isIntersecting) return;
  // if it does remove class
  else entry.target.classList.remove('section--hidden');
  // onse we observe the section - we removed the class from it
  // after that - we should stop observing it
  observer.unobserve(entry.target);
};

// the main observer trigger with options and function
const sectionObserver = new IntersectionObserver(
  obsCallbackSections,
  obsOptionsSections
);

sectionToPop.classList.add('section--hidden');
sectionObserver.observe(sectionToPop);
/* 



*/
// Lazy images loading
// To do that I use Intersection Observer API again

// where to reveal sections?
// selecting only these imgs that has data-src attribute
const imgLazy = document.querySelectorAll('img[data-src]');

const obsImgOpt = {
  root: null,
  threshold: 0,
  // lets load lazy img sooner
  /* rootMargin: '100px', */
};

const obsImgCallback = function (entries, observer) {
  const [img] = entries;

  // guard close. Means - do smt if only intersecting
  if (!img.isIntersecting) return;

  // replace src with data-src
  // src is low res img. And we need to change it with HiRes img
  // which is located in data-src="img/card.jpg" attribute in html
  img.target.src = img.target.dataset.src;

  // Now its time to remove blur filter.
  // However we do not want to remove it immideatly
  // because we do not want want to show blured image if it needs some time to load
  // thats why we have to listen to the 'load' event to be done when HiRes img loads completely
  img.target.addEventListener('load', function () {
    img.target.classList.remove('lazy-img');
  });
  observer.unobserve(img.target);
};

const imgObserver = new IntersectionObserver(obsImgCallback, obsImgOpt);

imgLazy.forEach(function (img) {
  imgObserver.observe(img);
});
/* 




*/
///////////////////////////////////////
// Modal window Script Start
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  event.preventDefault();
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// Modal window Script Ends here
