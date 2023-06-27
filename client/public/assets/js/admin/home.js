$('body').on('click', '.svg_menu', function (event) {
    $("#asideMST").toggleClass('shrinked');
});
$('body').on("click", function (event) {
    if (
        !$(event.target).closest("div").hasClass("datepicker--cell")
        && !$(event.target).closest("div").hasClass("datepicker--nav-title")
        && !$(event.target).closest("div").hasClass("datepicker--nav-action")
    ) {
        $('.filterIt').removeClass('show');
        $('.listAllCat').removeClass('show');
    }
});

$('body').on('xScroll', '.xLateralFrame .container', function (event) {
    if ($(this).scrollTop() > 5) {
        $(this).closest('.frame').find('.topHead').addClass('scrolled');
    } else {
        $(this).closest('.frame').find('.topHead').removeClass('scrolled');

    }
});

// XINPUT XSELECT ###################
$('body').on('click', '.xinput label', function (event) {
    $(this).parent().find('input').focus();
});
$('body').on('focusin', '.xselect input', function (event) {
    $(this).closest('.xselect').addClass('opened');
});
$('body').on('mousedown', '.xselect li', function (event) {
    const input = $(this).closest('.xselect').find('input');
    if($(this).closest('.xselect').hasClass("multiple")){
        $(this).toggleClass('active');
        let value = $(this).parent().find("li.active").map(function () {
            return $(this).text();
        }).get().join(", ")
        input.val(value).change();
    } else{
        $(this).closest('.xselect').find('input').val($(this).text()).change();
        $(this).addClass('active').siblings().removeClass('active');

    }
});
$('body').on('focusout', '.xselect input', function (event) {
    !$(this).closest('.xselect').hasClass('multiple') && $(this).closest('.xselect').removeClass('opened');
});
$('body').on('click', '.modal-frame', function (event) {
    $(this).find('.xselect').removeClass('opened');
});
$('body').on('click', '.xselect .fakearrow', function (event) {
    let ipt = $(this).closest('.xselect').find('input');
    ipt.val('').change();
    $(this).closest('.xselect').find('li').removeClass('active')
});
$('body').on('click', '.xselect', function (event) {
    event.stopPropagation();
});
// $('body').on('mousedown', '.xselect.multiple', function(event) {
//     if($(this).hasClass("multiple")) {
//         $(this).toggleClass('active');
//         let value = $(this).parents("ul").find("li.active").map(function () {
//             return $(this).text();
//         }).get().join(", ")
//         $(this).closest('.xselect').find('input').val(value);
//     }
// });
function scrollEventListener(el) {
    el.on("scroll", function () {
        el.trigger("xScroll");
    });
}

// Xchip ###################
$('body').on('keyup', '.xchip input', function (event) {
    let me = $(this).closest('.xchip'),
        list = me.find('ul');
        struct = `<li class="flex">
        <span>${$(this).val()}</span>
        <span class="rm"></span>
    </li>`;
    if (event.which == 13 && $(this).val() != "") {
        list.append(struct);
        $(this).val("");
    } else if(event.which == 8 && $(this).val() == ""){
        list.find('li:last-child').remove();
    }
    // alert(event.keyCode)
});
$('body').on('click', '.xchip .rm', function (event) {
   $(this).parent().remove();
    // alert(event.keyCode)
});
