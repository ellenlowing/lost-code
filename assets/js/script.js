var infobarOpened = false;
var imgSelected = false;
var imgSelectId = -1;
var prevMouseX = -1;
var prevMouseY = -1;
var path;

paper.install(window);
window.onload = function() {

  // Load images
  var img = $('.img');
  img.each(function(index) {
    $(this).show();
  });

  // Set up event listeners for pseudo-img class elements
  var pseudoimg = $('.pseudo-img');
  pseudoimg.each(function(index) {
    $(this).bind( {
      mousedown: function (e) {
        imgSelected = true;
        imgSelectId = index;
        prevMouseX = e.clientX - this.offsetLeft;
        prevMouseY = e.clientY - this.offsetTop;

        // Sort depth of images
        var pseudoSelectZ = $(this).css('z-index');
        var selectZ = $('#img-' + (imgSelectId+1).toString()).css('z-index');
        $('.pseudo-img').each( function(index) {
          if(index === imgSelectId) {
            $(this).css('z-index', '98');
          } else if ( $(this).css('z-index') > pseudoSelectZ ) {
            var z = $(this).css('z-index')-1;
            $(this).css('z-index', z.toString());
          }
        });
        $('.img').each( function(index) {
          if(index === imgSelectId) {
            $(this).css('z-index', '8');
          } else if ( $(this).css('z-index') > selectZ ) {
            var z = $(this).css('z-index')-1;
            $(this).css('z-index', z.toString());
          }
        });
      },
      mousemove: function(e) {
        if(imgSelected && imgSelectId === index) {
          var currMouseX = e.clientX;
          var currMouseY = e.clientY;
          var transformX = currMouseX - prevMouseX;
          var transformY = currMouseY - prevMouseY;
          $(this).css({
            'left': transformX,
            'top' : transformY
          });
          $('#img-' + (imgSelectId+1).toString()).css({
            'left': transformX,
            'top' : transformY
          })
        }
      },
      mouseup: function(e) {
        imgSelected = false;
        imgSelectId = -1;
      },
      mouseleave: function(e) {
        imgSelected = false;
        imgSelectId = -1;
      }
    });
  });

  // Initialize slidebars
  ( function ( $ ) {
    var controller = new slidebars();
    controller.init();
    $('.info-btn').on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      controller.open('id-info');
      $('.info-btn').css('display', 'none');
      $('.info-escape').css('display', 'block');
      $('.info-scroll').css('display', 'block');
      $('.pseudo-img').css('display', 'none');
      infobarOpened = true;
    });

    $('.info-escape').on('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if(infobarOpened) {
        controller.close('id-info');
        $('.info-btn').css('display', 'block');
        $('.info-escape').css('display', 'none');
        $('.info-scroll').css('display', 'none');
        $('.pseudo-img').css('display', 'block');
        infobarOpened = false;
      }
    });

    $('.info-bar').on('scroll', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if(infobarOpened) {
        $('.info-bar').scrollTop(200);
        console.log('scroll');
      }
    });
  } ) ( jQuery );

  // Set up drawing canvas
  $('#canvas').css({
    height: screen.height * 2,
    width:  screen.width * 2
  });
  paper.setup('canvas');
	var tool = new Tool();
	path = new Path();
	path.strokeColor = '#0E00FF';
  path.strokeWidth = 4;
  path.strokeCap = 'smooth';
	tool.onMouseMove = function(event) {
    var p = event.point;
		path.add(p);
	}
  $( 'body' ).bind('mouseenter', (e) => {
    path = new Path();
    path.strokeColor = '#0E00FF';
    path.strokeWidth = 4;
    path.strokeCap = 'smooth';
  });
  /* SPLIT CANVAS WHEN infobarOpened --- blue stroke is above info-bar but below info-p */

  // Resize and set up resize handler
  $('.info-escape').css('width', $( window ).width() - $('.info-bar').innerWidth());
  $( window ).resize( () => {
    $('.info-escape').css('width', $( window ).width() - $('.info-bar').innerWidth());
  });
}
