// ############################################################

$('body').on("click", '.todaysale .cclos', function(event) {
    $(this).closest('.todaysale').removeClass('show');
});

$('body').on("click", function(event) {
    $('.hdd-1 .master-admin ul').removeClass('showmenu');
    $('article .searcher .keyboard').removeClass('show');
});
$('body').on("click",'.hdd-1 .master-admin', function(event) {
    $(this).find('ul').toggleClass('showmenu');
});

// $(window).on('hashchange', function(e) {
//     if(location.hash === "#fkpg--make-a-sale"){
//         account.checkSession();
//     }
// });

$('body').on("click",'.fk-aside .list-cats li', function(event) {
    
    $('.fk-aside').addClass('hidden');
});

$('body').on("click",'.XM-makePayment .break-account', function(event) {
    $('.XM-makePayment .list-consum').toggleClass('showit');
});

$('body').on("click",'.give-me-extras, .give-me-extras .i-close-it', function(event) {
    $('.give-me-extras').removeClass('show');
});

$('body').on("click",'article .searcher i, article .searcher label', function(event) {
    $(this).closest('header').toggleClass('searching');
});

$('body').on("click",'article .searcher label.search-keyb', function(event) {
    $('article .searcher .keyboard').toggleClass('show');

});

$('body').on("click",'article header .m-m', function(event) {
    $('.left-mob-menu').toggleClass('showit');
});

$('body').on("click",'article .left-mob-menu li', function(event) {
    $('.'+ $(this).siblings().attr("link")).removeClass('showit');
    $('.'+ $(this).attr("link")).addClass('showit');
    $('.left-mob-menu').removeClass('showit');
});

$('body').on("click",'article .left-mob-menu li', function(event) {
    $('.'+ $(this).attr("link")).addClass('showit');
    $('.left-mob-menu').removeClass('showit');
});

$('body').on("click",'.close-me-mob, .fk-aside ul li', function(event) {
    $(this).closest('.m-close-me-mob').removeClass('showit');
});

$('body').on("click",'.xm-create-account .list-servents li', function(event) {
    $(this).closest('.main').find('.user-selected').text($(this).find('span').text());
    $('.xm-create-account').addClass('step2');
    $('.xm-create-account #tableNumber').focus();
});

$('body').on("click",'.xm-create-account .back-user', function(event) {
    $('.xm-create-account').removeClass('step2');
});

$('body').on("click",'.hdd-1 .i-mmobmenu, .hdd-1 .right li', function(event) {
    if(!$(this).hasClass('master-admin'))
        $('.hdd-1 .right > ul').toggleClass('showme');
});
$('body').on("click", function(event) {
    if($('.hdd-1 .right > ul').hasClass('showme'))
        $('.hdd-1 .right > ul').removeClass('showme');
});


$("#retrocederCategoriasPos").on("click", function(){
    $('.fk-aside').toggleClass('hidden');
});


$('body').on("click",'.btRegClient', function(event) {
    $('.XM-makePayment').toggleClass('registerNewClient selectNewClient');
    $('.XM-makePayment .break-account').removeClass('active');
    $('.XM-makePayment .list-consum').removeClass('showit');
});

$('body').on("click",'.cancelRegClient', function(event) {
    $('.XM-makePayment').toggleClass('registerNewClient selectNewClient');
});
$('body').on("click",'.cancelSlctClient', function(event) {
    $('.XM-makePayment').removeClass('selectNewClient');
});

$('body').on("click",'[dvSelectClient]', function(event) {
    $('.XM-makePayment').addClass('selectNewClient');
});


$('body').on('click', '#iptCheckMode', function(event) {
    if($(this).is(":checked")){
          $("body").addClass('dark');
    } else{
      $("body").removeClass('dark');
   }
   account.changeModeView();
  });