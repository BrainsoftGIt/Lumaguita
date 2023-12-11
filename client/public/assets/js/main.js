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


let Documents = {
    list: {},
    open : ({data, name}) => {
        let key = new Date().getTime();
        Documents.list[key] = data;
        $("[listDocuments]").append(`<li data-key="${key}" class="flex v-ct tgl">
            <svg width="24px" height="24px" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#ff402f;}</style> </defs> <title></title> <g id="xxx-word"> <path class="cls-1" d="M325,105H250a5,5,0,0,1-5-5V25a5,5,0,0,1,10,0V95h70a5,5,0,0,1,0,10Z"></path> <path class="cls-1" d="M325,154.83a5,5,0,0,1-5-5V102.07L247.93,30H100A20,20,0,0,0,80,50v98.17a5,5,0,0,1-10,0V50a30,30,0,0,1,30-30H250a5,5,0,0,1,3.54,1.46l75,75A5,5,0,0,1,330,100v49.83A5,5,0,0,1,325,154.83Z"></path> <path class="cls-1" d="M300,380H100a30,30,0,0,1-30-30V275a5,5,0,0,1,10,0v75a20,20,0,0,0,20,20H300a20,20,0,0,0,20-20V275a5,5,0,0,1,10,0v75A30,30,0,0,1,300,380Z"></path> <path class="cls-1" d="M275,280H125a5,5,0,0,1,0-10H275a5,5,0,0,1,0,10Z"></path> <path class="cls-1" d="M200,330H125a5,5,0,0,1,0-10h75a5,5,0,0,1,0,10Z"></path> <path class="cls-1" d="M325,280H75a30,30,0,0,1-30-30V173.17a30,30,0,0,1,30-30h.2l250,1.66a30.09,30.09,0,0,1,29.81,30V250A30,30,0,0,1,325,280ZM75,153.17a20,20,0,0,0-20,20V250a20,20,0,0,0,20,20H325a20,20,0,0,0,20-20V174.83a20.06,20.06,0,0,0-19.88-20l-250-1.66Z"></path> <path class="cls-1" d="M145,236h-9.61V182.68h21.84q9.34,0,13.85,4.71a16.37,16.37,0,0,1-.37,22.95,17.49,17.49,0,0,1-12.38,4.53H145Zm0-29.37h11.37q4.45,0,6.8-2.19a7.58,7.58,0,0,0,2.34-5.82,8,8,0,0,0-2.17-5.62q-2.17-2.34-7.83-2.34H145Z"></path> <path class="cls-1" d="M183,236V182.68H202.7q10.9,0,17.5,7.71t6.6,19q0,11.33-6.8,18.95T200.55,236Zm9.88-7.85h8a14.36,14.36,0,0,0,10.94-4.84q4.49-4.84,4.49-14.41a21.91,21.91,0,0,0-3.93-13.22,12.22,12.22,0,0,0-10.37-5.41h-9.14Z"></path> <path class="cls-1" d="M245.59,236H235.7V182.68h33.71v8.24H245.59v14.57h18.75v8H245.59Z"></path> </g> </g></svg>
            <span>${name}</span>
        </li>`);

        $("[listDocuments] li:last").trigger("click");
        $("#xModalOpenDocument").addClass("show");
    }
}

$("[listDocuments]").on("click", "li", function (){
    let {key} = $(this).data();
    let urlData = Documents.list[key];
    console.log({urlData})
    $("#iframe-pdf").attr("src", urlData);
})

$("[closeDocuments]").on("click", function (){
    let sDocument = $("[listDocuments] li.active")
    let {key} = sDocument.data() || {};
    sDocument.remove()

    delete Documents.list[key];
    if (!Object.keys(Documents.list).length){
        $("#xModalOpenDocument").removeClass("show")
        return
    }

    $("[listDocuments] li:first").trigger("click");
})
