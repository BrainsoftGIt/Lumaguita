

/*########################   DROPDOWN   #########################*/
$('body').on('click', '.x-dropdown', function(event) {
  //
  $(this).toggleClass('showdrop');
  event.stopPropagation();
})
$('body').on('mouseup', '.x-dropdown', function(event) {
  $('.x-dropdown.showdrop').removeClass('showdrop');
})
$('body').on('click', function(event) {
  $(this).find('.x-dropdown').removeClass('showdrop');
})
$('body').on('click', '.x-dropdown ul li', function(event) {
  let mst = $(this).closest('.x-dropdown');
  mst.removeClass('showdrop');
  mst.find('span').text($(this).text());
  event.stopPropagation();
})

function initXDrop(){
  $('.x-dropdown').each(function() {
    $(this).find('span').text($(this).find('ul li.active').text());
  });
}


/*########################   ALERT   #########################*/

var xAlerTimer, xTimer;
function callXpertAlert(title, txt, type, time, functOnYesConfirmation) {
   xTimer = time *1000;
   var icon;

    if (type === 'notification')  icon ='info_outline';
    else if (type === 'success') icon = 'done';
    else if (type === 'warning')  icon = 'warning';
    else if (type === 'error')  icon = 'close';
    else icon = 'help';

    $('.xpert-alert').remove();
    $('body').append('<div class="xpert-alert">' +
        '<div class="header">' +
        '<i class="material-icons itype">'+icon+'</i>' +
        '<h1>'+title+'</h1>' +
        '</div>' +
        '<p>'+txt+'</p>' +
        '<span class="x-close material-icons"> close</span>' +
        '</div>');

    $('.xpert-alert').addClass(type);
  if (type === 'confirmation'){
    $('.xpert-alert').append('<div class="confirm">'+
			'<button>Não</button>'+
			'<button onclick="runFunc('+ functOnYesConfirmation +')">Sim</button>'+
		'</div>');
    $(".xpert-alert").addClass("show");
    clearInterval(xAlerTimer);
  } else{
      setTimeout( function(){
          $('.xpert-alert').addClass('show');
      }, 200);
      setTimeout( function(){
          $('.xpert-alert').removeClass('show');
      }, xTimer);
  }
}
function runFunc(fn){
  fn();
}

function hideAlert(){
  $('.xpert-alert').removeClass('show');
}
function showAlert(){
  $('.xpert-alert').addClass('show');
  xAlerTimer = setTimeout(hideAlert, xTimer);
}

$('body').on('mouseenter', '.xpert-alert', function(event) {
  clearInterval(xAlerTimer);
});

$('body').on('click', '.xpert-alert .x-close, button', function(event) {
  $('.xpert-alert').removeClass('show');
});



/*########################   SLIDER   ##########################*/

$('body').on('click', '.x-slider .bottom-controller span', function(event) {
  var idx = $(this).index();

  $(this).addClass('active').siblings().removeClass('active');
  $('.x-slider .slider-container .img-slider')
    .css('transform', 'translateX('+ (-idx * 100) +'%)');
  $('.x-slider .slider-content-ctrl section')
    .css('transform', 'translateY('+ (-idx * 100) +'%)');
    $('.x-slider .slider-content-ctrl section').eq(idx)
    .addClass('active')
    .siblings().removeClass('active');
  var span = $('.x-slider .bottom-controller span');
  var span_active = $('.x-slider .bottom-controller span.active');

  $('.x-slider .lateral-controller div').removeClass('hid-den');
  if(span_active.index() == (span.length - 1)){
    $('.x-slider .lateral-controller div.next').addClass('hid-den');
  }
  if(span_active.index() == 0){
    $('.x-slider .lateral-controller div.prev').addClass('hid-den');
  }

})

$('body').on('click', '.x-slider .lateral-controller div', function(event) {
  var span = $('.x-slider .bottom-controller span');
  var span_active = $('.x-slider .bottom-controller span.active');
  if($(this).index() == 1){
    if(span_active.index() !== (span.length - 1))
      span_active.next().click();
    }
  else{
      if(span_active.index !== 0)
        span_active.prev().click();
    }
})


var interval, isRunning = true;
function createXslider(){
  $('.x-slider .slider-container > div').each(function(index) {
    $(this).css('background-image', 'url("'+ $(this).attr('data-img') +'")');
  });

  $('.x-slider').append('<div class="bottom-controller"></div>')
  $('.x-slider').prepend('')
  for (var i = 0; i < $('.x-slider .slider-container > div').length; i++) {
    $('.x-slider .bottom-controller').append('<span></span>');
  }
  $('.x-slider .bottom-controller span').eq(0).click();
}

$('body').on('mouseenter', '.x-slider', function(event) {
  stopXslider()
})
$('body').on('mouseleave', '.x-slider', function(event) {
  startXslider()
})

var timer;
var timerSpeed = 5000;
var totalSlide = $('.x-slider .slider-container > div').length;
var x_idx = 0;

function startXslider() {
   timer = setInterval(ctrlXslider,timerSpeed);
}
function stopXslider() {
  clearInterval(timer);
}
function ctrlXslider() {
  if(x_idx == totalSlide)
    x_idx = 0;
  $('.x-slider .bottom-controller span').eq(x_idx).click();
  x_idx++;
}

createXslider();
startXslider();


/*######################   MODAL FRAME   #########################*/
/*
open modal frame
*/
$('body').on('click', '.open-modal', function(event) {
  event.preventDefault();
  openModal($(this).attr('modal-target'));
});

/*
Close modal frame
*/
$('body').on('click', '.x-modal .x-close', function(event) {
  closeModal($(this).closest('.x-modal').attr('id'));
});


/*##################    RIGHT-SIDE-FRAME     ######################*/

$('body').on('click', '.open-right-frame', function(event) {
  let target = $(this).attr('frame-target');
  openXFrClCl(target);
});

$('body').on('click', '.xframe-close-click, .xframe-close-click .i-close-it', function(event) {
  if($(this).hasClass('i-close-it'))
    $(this).closest('.xframe-close-click').removeClass('show');
  else
    $(this).removeClass('show');
  });


$('body').on('click', '.xframe-close-click .c-c-container', function(event) {
  event.stopPropagation();
});

function openXFrClCl(_target){
  $('#'+ _target).addClass('show');
}
/*##################    PAGINATION     ######################*/

$('body').on('click', '.x-pagination li', function(event) {
  $(this).addClass('active').siblings().removeClass('active');
  if($(this).hasClass('more')){
    $(this).add($(this).parent()).removeClass('active');
    if($(this).hasClass('more-next')){
      $(this).parent().next()
      .addClass('active')
      .find('li:nth-child(2)').click();
    } else{
      $(this).parent().prev()
      .addClass('active')
      .find('li:last-child').prev().click();
    }
  }
  // if(!isNaN(parseInt($(this).text())))
  //   ctrlXPagination($(this), $('.x-pagination-content'));

  let min_active = $(this).closest('.x-pagination').find('ul:nth-child(2) li:first-child');
  let max_active = $(this).closest('.x-pagination').find('span:last-child').prev().find('li:last-child');

  if(min_active.hasClass('active'))
    $('.x-pagination span.ctrl-left').addClass('disabled')
  else
    $('.x-pagination span.ctrl-left').removeClass('disabled')
  if(max_active.hasClass('active'))
    $('.x-pagination span.ctrl-right').addClass('disabled')
  else
    $('.x-pagination span.ctrl-right').removeClass('disabled')

  // $('html, body').animate({
  //   scrollTop: 500
  // }, 400, function(){
  // });
})

$('body').on('click', '.x-pagination span', function(event) {
  let sp_active = $(this).parent().find('li.active');
  if(!$(this).hasClass('disabled')){
    if($(this).hasClass('ctrl-left'))
      sp_active.prev().click();
    else
      sp_active.next().click();
  }
});

// function ctrlXPagination(_el, _content) {
//   let idx = parseInt(_el.text());
//   let start_from = idx * parseInt(_el.attr('parse')) - parseInt(_el.attr('parse'));
//   let end_at = idx * parseInt(_el.attr('parse'));
//   _content.children().removeClass('show');
//   for (var i = start_from; i < end_at; i++) {
//     _content.children().eq(i).addClass('show');
//   }
// }



function initPagination(_total, _parse) {
  $('.x-pagination').html("");
  var _total = _total || $('.x-pagination-content').children().length;
  // quantidade de li's
  let steps = _total % _parse == 0 ? parseInt(_total/_parse) : parseInt(_total/_parse + 1);
  let temp = "", j;
  $('.x-pagination').append('<span class="material-icons ctrl-left">chevron_left</span>');
  temp += '<ul class="flex h-ct v-ct">';
  for (var i = 1; i <= steps; i++) {
    if(i % 10 == 0){

      temp += '</ul>';
      if(i <= steps){
        temp += '<ul class="flex h-ct v-ct">';
        temp += '<li class="more more-back">...</li>';
        temp += '<li parse="'+ _parse +'">'+ i +'</li>';
      }
    } else{
      j = (i + 1)
      temp += '<li parse="'+ _parse +'">'+ i +'</li>';
      if(j % 10 == 0 && j <= steps)
        temp += '<li class="more more-next">...</li>';
    }
    if(i == steps){
      temp += '</ul>'
    }
  }
  $('.x-pagination').append(temp);
  $('.x-pagination').append('<span class="material-icons ctrl-right">chevron_right</span>');
  $('.x-pagination .ctrl-left').next()
  .addClass('active')
  .find('li:first-child').click();
}




/*
Personalized filter
*/
$('body').on('click', '.filter-bar .filter', function(event) {

  $(this).siblings().find('ul').removeClass('show');
  $(this).find('ul').toggleClass('show');
  event.stopPropagation();
})
$('body').on('click', '.filter-bar .filter li', function(event) {
  $(this).addClass('item-selected').siblings().removeClass('item-selected');
  $(this).closest('.filter').find('.selected span').text($(this).text());
})
$('body').on('click', function(event) {
  $(this).find('ul').removeClass('show');
})

function refreshFilter(){
  $('.filter-bar .filter').each(function() {
    $(this).find('.selected span').text($(this).find('li.item-selected').text());
  });
}
/*#####################  XTABLE   ###################*/
$(window).resize(function(){
  xTableGenerate();
});

function xTableGenerate(){
  $('body .x-table').each(function(index) {
    let tblwth = $(this).width(), tblmax = parseInt($(this).attr('max'));
    let xTable = $(this);

    $(this).find('.xheader ul li').each(function(index) {
      let col = xTable.find('.xbody li:nth-child('+ (index + 1) +')');
      col.add($(this))
      .attr('label', $(this).text())
      .css("width", ($(this).attr('grow') * 10) +"%");
    });
    var xcount = 1;
    numFixeds = xTable.find('xbody ul.is-row-fixed').length;
    xTable.find('xbody').css('padding-bottom', numFixeds * 58 + 'px');
    xTable.find('xbody ul.is-row-fixed').each(function() {
      $(this).css('bottom', ((numFixeds - xcount) * 45) +'px');
      xcount++;
    });
  });
}

$('body').on('click', '.x-table .xbody ul', function(event) {
	$(this).toggleClass('active').siblings().removeClass('active');
});


/*#####################  BAR FILL   ###################*/

function xFillBar() {
  $('.xbarfill').each(function(index) {
    let sp = $(this).find('span');
    let left = parseInt(sp.attr('left'));
    sp.css('width', (left*100/30)+ "%");
  });
}

/*########################################*/

$('body').on('click', '.j-stp', function(event) {
	event.stopPropagation();
});

$('body').on('click', '.stgl', function(event) {
	$(this).toggleClass('active');
});
$('body').on('click', '.tgl', function(event) {
	$(this).addClass('active').siblings().removeClass('active');
});


function openModal(_modalTarget) {
  let modal = $('#'+ _modalTarget), cont = modal.find('.x-container');
  modal.fadeIn(200);
  cont.addClass('scale');
  if(_modalTarget === "xmPOSAccess")
    modal.find('.main').removeClass('step2');
}

function closeModal(_modalTarget) {
  let modal = $('#'+ _modalTarget), cont = modal.find('.x-container');
  modal.closest('.x-modal').fadeOut(300);
  cont.removeClass('scale');
}


/*########################   PREVNEXT   #########################*/

function ctrlPrevNext(_el){
  let me = _el,
      meIdx = me.index(),
      increment = meIdx === 0 ? -1 : 1,
      nextIdx = parseInt(me.parent().attr('idx')) + increment;

    if(!reachStart() && meIdx === 0){
      $('.carlist .group').css('transform', 'translateX('+ -nextIdx * 330 +'px)');
      me.parent().attr('idx', nextIdx);
    }
    if(meIdx === 1 && !reachEnd()){
      $('.carlist .group').css('transform', 'translateX('+ -nextIdx * 330 +'px)');
      me.parent().attr('idx', nextIdx);
      if(nextIdx < -5)
        me.parent().attr('idx', 0);
    }
}
function reachStart(){
  return $("#listCarsIndex section") ? $("#listCarsIndex section:first-child").offset().left > 0 : true;
}
function reachEnd(){
  let lastSection = $("#listCarsIndex section:last-child").offset().left + 330;
  return lastSection > 0 && lastSection < $(".offers").width();
}

let xInterval;
let wotogo = 0;
function startXPrevNext() {
  clearInterval(xInterval)
  xInterval = setInterval(autoPrevNext, 3000);
}
function stopXPrevNext(){
  clearInterval(xInterval)
}
function autoPrevNext(){
  if(reachStart()) wotogo = 0;
  if(reachEnd()) wotogo = 1;
  wo = wotogo === 0 ?
  $('.x-prevnext span:last-child') :
  $('.x-prevnext span:first-child')
  wo.click();
}

$('body').on('mouseup', '.x-prevnext span', function(event) {
  stopXPrevNext();
  wotogo = $(this).index() === 0 ? 1 : 0;
  startXPrevNext();
});
$('body').on('click', '.x-prevnext span', function(event) {
  ctrlPrevNext($(this));
});
$('body').on('mouseenter', '.carlist .group', function(event) {
  stopXPrevNext();
});
$('body').on('mouseleave', '.carlist .group', function(event) {
  startXPrevNext();
});
