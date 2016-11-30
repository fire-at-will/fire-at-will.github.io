function onBodyLoad(){

  configureNavBarColorChanging();

  typeHelloWorld();
  fadeInInfo();

  // Configure scroll function
  selectors.get(window).on('scroll', scrollTasks);
  selectors.get(window).on('scroll resize', scrollTasks);

  // Trigger a scroll event as soon as DOM is ready, so any of the elements
  // that are visible get animated
  selectors.get(window).trigger('scroll');
}

function scrollTasks(){
 
  checkIfInView();
}

function checkIfInView(){
  var windowHeight          = selectors.get(window).height();
  var windowTopPosition     = selectors.get(window).scrollTop();
  var windowBottomPosition  = (windowTopPosition + windowHeight);

  $.each(selectors.get('.animate-from-left'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('bounceInLeft');
    } else {
      $element.removeClass('bounceInLeft');
    }
  });

  $.each(selectors.get('.animate-from-right'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('bounceInRight');
    } else {
      $element.removeClass('bounceInRight');
    }
  });

  $.each(selectors.get('.animate-fade-in-down'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('fadeInDown');
    } else {
      $element.removeClass('fadeInDown');
    }
  });

  $.each(selectors.get('.animate-fade-in-right'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('fadeInRight');
    } else {
      $element.removeClass('fadeInRight');
    }
  });

  $.each(selectors.get('.animate-fade-in'), function(){
    var $element = $(this);
    var elementHeight = $element.outerHeight();
    var elementTopPosition = $element.offset().top;
    var elementBottomPosition = (elementTopPosition + elementHeight);

    //check to see if this current container is within viewport
    if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
      $element.addClass('fadeIn');
    } else {
      $element.removeClass('fadeIn');
    }
  });
}

// ------------------- Scroll Functions ---------------------
function fadeInInfo(){
  setTimeout(function(){fadeIn("my-name");}, 2200);
  setTimeout(function(){fadeIn("my-info");}, 3500);
}

function scrollToHome(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#home-section').offset().top
    }, 2000);
}

function scrollToWork(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#job-section').offset().top
    }, 2000);

  setTimeout(function(){setNavBlack()}, 2200);
}

function scrollToWeb(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#web-section').offset().top
    }, 1800);

  setTimeout(function(){setNavWebColors()}, 2200);
}

function scrollToMobile(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#mobile-section').offset().top
    }, 1800);

  setTimeout(function(){setNavMobileColors()}, 2000);
}

function scrollToOtherProjects(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#other-projects-section').offset().top
    }, 1900);

  setTimeout(function(){setNavOtherProjects()}, 1900);
}

function scrollToEducation(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#education-section').offset().top
    }, 1900);

  setTimeout(function(){setNavEducationColors()}, 1900);
}

function scrollToActivities(){
  selectors.get('html, body').animate({
        scrollTop: selectors.get('#activities-section').offset().top
    }, 2000);
}

// Uses type it plugin to type "Hello, world.".
function typeHelloWorld(){
  // Make header visible
  document.getElementById("hello-world").style.visibility = "visible";

  selectors.get('#hello-world').typeIt({
    speed: 50,
  })
  .tiType('Hello,')
  .tiPause(250)
  .tiType(' world.');
}

function configureNavBarColorChanging(){
  // Nav bar color change

  let navHeight = selectors.get("#navbar").height();

  var scroll_start = 0;
  var startchange = selectors.get('#job-section');
  var jobOffset = startchange.offset();

  startchange = selectors.get('#web-section');
  var webOffset = startchange.offset();

  startchange = selectors.get('#mobile-section');
  var mobileOffset = startchange.offset();

  startchange = selectors.get('#other-projects-section');
  var otherOffset = startchange.offset();

  startchange = selectors.get('#education-section');
  var educationOffset = startchange.offset();

  startchange = selectors.get('#activities-section');
  var activitiesOffset = startchange.offset();

  selectors.get(document).scroll(function() { 
    scroll_start = $(this).scrollTop() + navHeight;
    if(scroll_start > jobOffset.top && scroll_start < webOffset.top) {
      setNavBlack();
    } else if(scroll_start > webOffset.top  && scroll_start < mobileOffset.top){
      setNavWebColors();
    } else if(scroll_start > mobileOffset.top && scroll_start < otherOffset.top){
      setNavMobileColors();
    } else if(scroll_start > otherOffset.top && scroll_start < educationOffset.top){
      setNavOtherProjects();
    } else if(scroll_start > educationOffset.top && scroll_start < activitiesOffset.top){
      setNavWebColors();
    }else if(scroll_start > activitiesOffset){
      setNavBlack();
    } else if(scroll_start < jobOffset.top){
      setNavTransparent();
    } else {
      setNavBlack();
    }

  });
}

function setNavTransparent() {
  selectors.get('#navbar').css('background-color', 'transparent');
  changeNavbarTextColors('#F2F5EA');
}

function setNavBlack(){
  selectors.get('#navbar').css('background-color', 'white');
  changeNavbarTextColors('#000000');
}

function setNavWebColors(){
  selectors.get('#navbar').css('background-color', '#3C3C3B');
  changeNavbarTextColors('#F2F5EA');
}

function setNavMobileColors(){
  selectors.get('#navbar').css('background-color', '#3581B8');
  changeNavbarTextColors('#F2F5EA');
}

function setNavOtherProjects(){
  
  selectors.get('#navbar').css('background-color', '#F2A359');
  changeNavbarTextColors('#F2F5EA');
}

function setNavEducationColors(){
  selectors.get('#navbar').css('background-color', '#3C3C3B');
  changeNavbarTextColors('#F2F5EA');
}

function changeNavbarTextColors(color){
  selectors.get('#name-nav').css('color', color);
  selectors.get('#home-nav').css('color', color);
  selectors.get('#work-nav').css('color', color);
  selectors.get('#web-nav').css('color', color);
  selectors.get('#mobile-nav').css('color', color);
  selectors.get('#other-nav').css('color', color);
  selectors.get('#education-nav').css('color', color);
  selectors.get('#activities-nav').css('color', color);
}

function changeDivColor(divName, color){
  selectors.get(divName).css('color', color);
}

function fadeIn(elementName) {
    // Get element
    var element = document.getElementById(elementName);

    // Ensure that element is invisible
    element.style.opacity = 0;

    var tick = function () {
        // Increment opacity
        element.style.opacity = +element.style.opacity + 0.01

        // Request screen repaint
        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }

    };

    tick();
}

// Selector caching. See 
// https://ttmm.io/tech/selector-caching-jquery/
// for more details
function Selector_Cache() {
    var collection = {};

    function get_from_cache( selector ) {
        if ( undefined === collection[ selector ] ) {
            collection[ selector ] = $( selector );
        }

        return collection[ selector ];
    };

    return { get: get_from_cache };
}

var selectors = new Selector_Cache();