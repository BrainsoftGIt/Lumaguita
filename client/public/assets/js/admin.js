// NOTIFICATIONS
// $('.top-menu').on('click', '.notification-user i', function(event) {
//     $(this).next().toggleClass('show');
//     event.stopPropagation();
// });
// $('.top-menu .panel-notifications').on('click', '*', function(event) {
//     event.stopPropagation();
// });
// $('body').on('click', function(event) {
//    $('.top-menu .panel-notifications').removeClass('show');
// });
let _scrollTop = $('.list-items-advanced').scrollTop();
// let cambio;
$('body').on("scroll",'.list-items-advanced', function(event) {
  if($(this).scrollTop() > _scrollTop)
    $('.master-page-include').find('.master-btn-add').hide(300);
  _scrollTop = $('.list-items-advanced').scrollTop();

});


$('body').on('click', '.i-close-it', function (event) {
    $(this).closest('.master-close-it').removeClass('show');
});

$('body').on('change', '.slt-wth-xmodal select', function(event) {
  let firstOption = 0;
  if(parseInt($(this).val()) === -1){
    $(this).closest('.slt-wth-xmodal').find('.open-modal').click();
    $(this).val($(this).find('option:eq("'+firstOption+'")').val());
    updateMaterializeFields();
    // $(this).val(0);
    // $(this).closest('.select-room-type').find('input[text]').val($(this).val());
  }
});


/*###########################################*/

$('.master-page').on('focusout', '.top-menu .search input', function(event) {
   if($(this).val().length > 0)
   	$(this).addClass('in-focus');
   else
   	$(this).removeClass('in-focus');
});

/*###########################################*/


$('body').on('click', '.master-page-include .selected-category', function(event) {
  $(this).closest('.filter-master').find('ul').toggleClass('show');
  event.stopPropagation();
});

$('body').on('click', '.master-page-include .filter-master li', function(event) {
  $(this).closest('.filter-master').find('.selected-category').text(" "+ $(this).text());
});

$('body').on('click', '.master-page-include', function(event) {
  $('.master-page-include.rooms .filter-artigos ul').removeClass('show');
});


$('body').on('click', '.master-page-include.rooms .extra-items .sspp', function(event) {
  $(this).closest('.extra-items').find('ul').toggleClass('show');
});


/*###########################################*/

// RESERVS

$('body').on('click', function(event) {
  if(!$('.reservs .admin-add-new').hasClass('show')){
    $('.total-reserv-price').removeClass('show');
  }
});

$('body').on('click', '.reservs .xm-rsv-more-info .sm-history-pmt', function(event) {
  $('.reservs .xm-rsv-more-info .panel-history-payment').toggleClass('show');
});
$('body').on('click', '.reservs .xm-rsv-more-info .body-modal', function(event) {
  $('.reservs .xm-rsv-more-info .panel-history-payment').removeClass('show');
  $('.reservs .xm-rsv-more-info .more-rsv-opts ul').removeClass('show');
});

$('body').on('click', '.reservs .xm-rsv-more-info .open-client-consums', function(event) {
  $('.reservs .xm-rsv-more-info .panel-history-consum').toggleClass('show');
});
$('body').on('click', '.reservs .xm-rsv-more-info .body-modal', function(event) {
  $('.reservs .xm-rsv-more-info .panel-history-consum').removeClass('show');
  $('.reservs .xm-rsv-more-info .more-rsv-opts ul').removeClass('show');
});

$('body').on('click', '.reservs .more-rsv-opts .mm', function(event) {
  $(this).next().toggleClass('show');
});


$('body').on('click','.reservs .admin-add-new .filter-room', function(event) {
  $(this).parent().find('.in-topopt').toggleClass('show');
});

$('body').on('click', function(event) {
  $(this).parent().find('.in-topopt').removeClass('show');
});

$('body').on('click', '.xm-detail-reserv-cart .viju b', function(event) {
  let sec = $(this).closest('section');
  sec.toggleClass('opened').siblings().removeClass('opened');
});
/*###########################################*/

// ARTIGOS

$('body').on('click', '.stock .xfr-cc-add-new .open-hide-extra', function(event) {
  $('.stock .xfr-cc-add-new .list-extra-items').toggleClass('show');
});


$('body').on('click', '.stock .xm-add-fornecedor .bback, .stock .xm-add-fornecedor .list-fornecedor li', function(event) {
  $('.stock .xm-add-fornecedor .about-fornec').toggleClass('show');
});

$('body').on('click', '.list-artigos .opts .add-stock', function(event) {
  $('.stock .admin-add-new-new').addClass('show');
});

$('body').on('click', '.xm-add-new-caterory .list-categories ul li div', function(event) {
  $(this).closest('.list-categories').find('div').removeClass('active');
  $(this).parent().children('ul').toggleClass('opened')
  $(this).addClass('active');
});
$('body').on('click', '.xm-add-new-caterory .list-categories ul li div a', function(event) {
  event.stopPropagation();
});

$('body').on('click', '.xm-add-new-caterory .add-new-cat, .xm-add-new-caterory .back-to', function(event) {
  $('.xm-add-new-caterory').toggleClass('eddiat-mode');
  $('.xm-add-new-caterory .add-category-frame b').text('Adicionar nova categoria')
  $('.xm-add-new-caterory .add-category-frame p').text('Esta é uma categoria raíz.')
});

$('body').on('click', '.xm-add-new-caterory .list-categories a i', function(event) {
  if($(this).hasClass('edit')){
    $('.xm-add-new-caterory .add-category-frame b').text('Editar categoria')
    $('.xm-add-new-caterory').addClass('eddiat-mode');
  }
  if($(this).hasClass('subcat')){
    $('.xm-add-new-caterory .add-category-frame b').text('Adicionar nova subcategoria')
    $('.xm-add-new-caterory').addClass('eddiat-mode');
  }
  
});