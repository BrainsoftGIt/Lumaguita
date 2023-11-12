$('body').on("click", function (event) {
    $('.rt-menus .o-opts').removeClass('show');
});
$('body').on("click", '.x-mobdal .modal-frame', function (event) {
    $('.rt-menus .o-opts').removeClass('show');
});

$('body').on("click", '.rt-menus .xdropdown', function (event) {
    if (!$(this).closest('.rt-menus').find('.o-opts').hasClass('show')) {
        $('.rt-menus .o-opts').removeClass("show");
        $(this).closest('.rt-menus').find('.o-opts').addClass('show');
    } else {
        $(this).closest('.rt-menus').find('.o-opts').removeClass('show');
    }
    event.stopPropagation();
});
$('body').on("click", '.j-stp', function (event) {
    event.stopPropagation();
});
$('body').on("click", '.tgl', function (event) {
    $(this).addClass('active').siblings().removeClass('active');
});
$('body').on('click', '.stglr', function(event) {
    $(this).toggleClass('active').siblings().removeClass('active');
});

$('body').on("click", '.stgl', function (event) {
    $(this).toggleClass('active');
    event.stopPropagation();
});


$('body').on('click', '.showTarget', function (event) {
    showTarget($(this).attr('target'), $(this).attr('tTitle'), $(this).attr('tab'));
});
$('body').on('click', '.hideTarget', function (event) {
    $("#" + $(this).attr('target')).removeClass('show');
});
function showTarget(_id, _title = "", isTab) {
    $("#" + _id).find('[targetTitle]').text(_title !== "" ? _title : $("#" + _id).find('[targetTitle]'));
    $("#" + _id).addClass('show');
    if ($("#" + _id).hasClass('xLateralFrame')) {
        scrollEventListener($("#" + _id + ' .container'));
        $("#" + _id + ' .container').scrollTop(0);
    }
    if (isTab === "true") {
        $("#" + _id).siblings().removeClass('show');
    }
}

$('body').on('click', '.toggleTarget', function (event) {
    $("#" + $(this).attr('target')).toggleClass('show');
});

var xAlertTiming, xtm;
function xAlert(_title, _text, _type = "success", _time = 8) {
    clearTimeout(xAlertTiming);
    clearTimeout(xtm);
    $('.xAlertContainer .xAlert').addClass('fadeOut');
    let icon = _type === "success" ? `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>` :
        `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    let temp =
        `<div class="xAlert ${_type} flex v-ct animated fadeIn faster">
            <span class="icon">${icon}</span>
            
            <div class="content">
                <b>${_title}</b>
                <p>${_text}</p>
            </div>
        <i class="xClose"></i>
    </div>`
    setTimeout(() => {
        $('.xAlertContainer').empty().append(temp);
    }, 300);
    xAlertTiming = setTimeout(() => {
        $('.xAlertContainer .xAlert').addClass('fadeOut')
    }, (_time * 1000));
    xtm = setTimeout(() => {
        $('.xAlertContainer').empty();
    }, (_time * 1000 + 300));
}
$('body').on('click', '.xAlert .xClose', function (event) {
    clearTimeout(xAlertTiming);
    clearTimeout(xtm);
    $('.xAlertContainer .xAlert').addClass('fadeOut');
    setTimeout(() => {
        $('.xAlertContainer').empty();
    }, 300);
});
$('body').on('mouseenter', '.xAlert', function (event) {
    clearTimeout(xAlertTiming);
    clearTimeout(xtm);
});
$('body').on('mouseleave', '.xAlert', function (event) {
    xAlertTiming = setTimeout(() => {
        $('.xAlertContainer .xAlert').addClass('fadeOut')
    }, 3000);
    xtm = setTimeout(() => {
        $('.xAlertContainer').empty();
    }, 3300);
});


/*#####################  XTABLE   ###################*/
xTableGenerate();
$(window).resize(function () {
    xTableGenerate();
});

function xTableGenerate() {
    $('body .x-table').each(function (index) {
        let tblwth = $(this).width(), tblmax = parseInt($(this).attr('max'));
        let xTable = $(this);

        $(this).find('.xheader ul li').each(function (index) {
            let col = xTable.find('.xbody li:nth-child(' + (index + 1) + ')');
            col.add($(this))
                .attr('label', $(this).text())
                .css("width", ($(this).attr('grow') * 10) + "%");
        });
        var xcount = 1;
        numFixeds = xTable.find('xbody ul.is-row-fixed').length;
        xTable.find('xbody').css('padding-bottom', numFixeds * 58 + 'px');
        xTable.find('xbody ul.is-row-fixed').each(function () {
            $(this).css('bottom', ((numFixeds - xcount) * 45) + 'px');
            xcount++;
        });
    });
}

$('body').on('click', '.x-table .xbody ul', function (event) {
    $(this).toggleClass('active').siblings().removeClass('active');
});

$('body').on('click', '.x-pagination .ctrl', function (event) {
    $(this).hasClass('backward') ?
        $(this).siblings(".active").prev().click() :
        $(this).siblings(".active").next().click()
});

$('body').on('click', '.stepper h4', function (event) {
    $(this).parent().toggleClass('closed');
});

var filterXSelect = "";
function liPesquisaXSelect() {
    if (filterXSelect !== "") {
        $(this).parents(".xselect").find(`li`).each(function () {
            if ($(this).text().$$(filterXSelect)) {
                $(this).show();
                return;
            }
            $(this).hide();
        });
    } else {
        $(this).parents(".xselect").find(`li:contains(${filterXSelect})`).show()
    }
}

$("body").on("click",".xselect label, .xinput label, .xselect .fakearrow", function (){
    $(this).parents(".xselect, .xinput").find("input, textarea").select();
}).on("keypress",".xselect input", function (e){
    filterXSelect += String.fromCharCode(e.which);
    liPesquisaXSelect.call(this);
}).on("keyup",".xselect input", function (e){
    if(e.which === 8){
        filterXSelect = filterXSelect.substring(0, filterXSelect.length-1);
        liPesquisaXSelect.call(this);
    }
}).on("focus",".xselect input", function (){
    filterXSelect = "";
    $(this).parents(".xselect").find(`[list] li:contains(${filterXSelect})`).show()
});
