let arrayMes = [];
arrayMes[0] = "Janeiro";
arrayMes[1] = "Fevereiro";
arrayMes[2] = "Março";
arrayMes[3] = "Abril";
arrayMes[4] = "Maio";
arrayMes[5] = "Junho";
arrayMes[6] = "Julho";
arrayMes[7] = "Agosto";
arrayMes[8] = "Setembro";
arrayMes[9] = "Outubro";
arrayMes[10] = "Novembro";
arrayMes[11] = "Dezembro";

function carregar_selectDataList(element, array, id, value) {
    for (var x=0; x < array.length; x++){
        var lista = array[x];
        element.append('<option  data-id="'+lista[id]+'">'+lista[value]+'</option>');
    }
}


function carregar_select(element, array) {
    for (var x=0; x < array.length; x++){
        element.append('<option value="'+ array[x] +'">'+array[x]+'</option>');
    }
}
function titleize(text) {
    var words = text.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        words[a] = w[0].toUpperCase() + w.slice(1);
    }
    return words.join(" ");
}

function carregar_select_i(element, array, value) {
    for (var x=0; x < array.length; x++){
        element.append('<option value="'+ x +'">'+array[x][value]+'</option>');
    }
}

function carregar_select_i2(element, array, concat, value1, value2) {
    for (var x=0; x < array.length; x++){
        element.append('<option value="'+ x +'">'+array[x][value1]+""+concat+""+array[x][value2]+'</option>');
    }
}

function carregar_selectIDandValue(element, array, id, value) {
    for (var x=0; x < array.length; x++){
        var lista = array[x];
        element.append('<option value="'+ lista[id] +'">'+lista[value]+'</option>');
    }
}

function carregar_selectIDandValue2(element, array, id, value1, value2) {
    for (var x=0; x < array.length; x++){
        var lista = array[x];
        element.append('<option value="'+ lista[id] +'">'+lista[value1]+" "+lista[value2]+'</option>');
    }
}

function carregar_selectIDandValue2_Separador(element, array, id, value1, value2, separador) {
    for (var x=0; x < array.length; x++){
        var lista = array[x];
        element.append('<option value="'+ lista[id] +'">'+lista[value1]+" "+separador+" "+lista[value2]+'</option>');
    }
}


function clearText( text ) {
    var replace = text.replace( '  ', ' ' ).trim();
    if( replace !== text ) return clearText( replace );
    else return replace;
}

if(!String.prototype.clear){
    String.prototype.clear = function () {
        return clearText(this);
    }
}

function compareDates(dateI, dateF, mightBeEqual = true) {
    var firstDate = dateI.stringToDate("YYYY-MM-DD", "-");
    var secondDate = dateF.stringToDate("YYYY-MM-DD", "-");
    if(mightBeEqual) return (firstDate < secondDate || (firstDate.getDatePt() === secondDate.getDatePt()));
    else return firstDate < secondDate;
}

function formattedString(nStr) {
    var num = nStr.replace(/(\s)/g, '');
    num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    return num.$$(".") ? num : num+",00";
}

$('*').on("keypress", ".integer", function (event) {
    if ((event.which !== 44 || $(this).val().indexOf('/') !== -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which !== 0 && event.which !== 8))) {
        event.preventDefault();
    }
}).on("keypress", ".double", function (event) {
    if ((event.which !== 44 || $(this).val().indexOf(',') !== -1) &&
        ((event.which < 48 || event.which > 57) &&
            (event.which !== 0 && event.which !== 8))) {
        event.preventDefault();
    }
}).on("keyup", ".formatNumber", function () {
    formatted($(this));
}).on("change", ".is-datepicker", function () {
    updateMaterializeFields();
});


if(!String.prototype.stringToDateEn) {
    /***
     * @param format
     * @param delimiter
     * @return {Date}
     */
    String.prototype.stringToDateEn = function (format = "YYYY-MM-DD", delimiter = "-") {
        if(!this.toString()){
            return null;
        }

        var dt;
        var st;
        if(format === undefined) {
            st = this.split("-");
            dt = new Date(st[2] + '-' + st[1] + '-' + st[0]);
        }
        else{
            st = this.split(delimiter);
            var fo = format.split(delimiter);
            dt = new Date(st[getPositionParam("YYYY", fo)]+'-'+st[getPositionParam("MM", fo)]+'-'+st[getPositionParam("DD", fo)]);
        }

        /**
         * @param str {String}
         * @param array {Array}
         */
        function getPositionParam( str, array ) {
            for ( var i = 0; i < array.length; i++ ) {
                if ( str === array[ i ].toUpperCase() ) {
                    return i;
                }
            }
        }
        return dt;
    };
}

if(!Date.prototype.getTime2H){
    Date.prototype.getTime2H= function () {
        return this.getHours().add0ToTimer()+"h:"+this.getMinutes().add0ToTimer();

    }
}

if(!String.prototype.getTime2H){
    String.prototype.getTime2H= function () {
        return "";

    }
}

function isMailValid(email) {
    var filtro = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var info = email.val();
    return filtro.test(info) || email.val() === "";
}

function advSearch(txt, ctnr, _items, specific){
    var txt_lw = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    var total_hidded = 0;
    _items.each(function() {
        if($(this).text().toLowerCase().indexOf(txt_lw) === -1){
            $(this).hide();
            total_hidded ++;
        } else{
            $(this).show();
            if(specific !== undefined){
                specific.each(function () {
                    if($(this).text().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(txt_lw)){
                        $(this).hide();
                    } else
                        $(this).show();
                })
            }
        }
    });
    if(total_hidded === _items.length)
        ctnr.addClass('empty');
    else
        ctnr.removeClass('empty');
}
function replaceComma(value) {
    return value.$$(",") ? value.replace(",", ".") : value;
}

var Mensage  = function () {};
Mensage.prototype.alert ="alert";
Mensage.prototype.success="success";
Mensage.prototype.error="error";
Mensage.prototype.notification="notification";

/**
 * @param data
 * @return {boolean}
 */
function valideData(data)
{
    console.info(typeof data);
    var rar = ((typeof data === 'string') ? data : data.val()).split('-');
    rar = $.makeArray(rar);
    if( rar.length===3 && rar[0].length===2 && rar[1].length===2 && rar[2].length===4 )
    {
        if( $.isNumeric(rar[0]) && $.isNumeric(rar[1]) && $.isNumeric(rar[2]) && Number(rar[0]) > 0 && Number(rar[1]) > 0  && Number(rar[1]) <= 12 )
        {
            switch (Number(rar[1]))
            {
                case 1:case 3:case 5:case 7:case 8:case 10:case 12:
                    return Number(rar[0]) <= 31;

                case 4:case 6:case 9:case 11:
                    return Number(rar[0]) <= 30;

                default:
                    if (!isBissexto(rar[2]) && (Number(rar[0]) <= 28)) { return true; }
                    else if (Number(rar[0]) <= 29) {  return true;  }
                    return false;
            }
        } else { return false; }
    } else { return false; }
}

function isBissexto(valor)
{ return (( Number(valor)%4 === 0 && Number(valor)%100 !== 0 ) || (Number(valor)%400 === 0) ); }

if (!String.prototype.$$) {
    /**
     * @param search
     * @param start
     * @return {boolean}
     */
    String.prototype.$$ = function(search, start = 0) {
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.toLowerCase().replaceAll(" ", "").unaccent().indexOf(search.toLowerCase().replaceAll(" ", "").unaccent(), start) !== -1;
        }
    };
}

if (!String.prototype.unaccent) {
    /***
     * @returns {string}
     */
    String.prototype.unaccent = function() {
        return this.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
}

if(!Number.prototype.dc){
    Number.prototype.dc = function () {
        return Number(this.toFixed(2));
    }
}

if(!String.prototype.dc){
    String.prototype.dc = function () {
        return Number(Number.parseFloat(this).toFixed(2));
    }
}

if(!Number.prototype.rp){
    Number.prototype.rp = function () {
        return this.toString().replace(".",",");
    }
}

if(!String.prototype.rp){
    String.prototype.rp = function () {
        return this.replace(".",",");
    }
}

if(!String.prototype.add0ToTimer) {
    String.prototype.add0ToTimer = function () {
        return ((this.length === 1) ? "0"+this : this);
    };
}

if(!Number.prototype.add0ToTimer) {
    Number.prototype.add0ToTimer = function () {
        return ((this.toString().length === 1) ? "0"+this : this);
    };
}

if(!Date.prototype.getDatePt){
    Date.prototype.getDatePt = function () {
        return this.getDate().add0ToTimer() +"-"+ (this.getMonth()+1).add0ToTimer() +"-"+this.getUTCFullYear();
    }
}

if(!String.prototype.getDatePt){
    String.prototype.getDatePt = function () {
            return ""
    }
}

if(!Date.prototype.getDateEn){
    Date.prototype.getDateEn = function () {
        return this.getUTCFullYear()+"-"+(this.getMonth()+1).add0ToTimer()+"-"+this.getDate().add0ToTimer();
    }
}

if(!String.prototype.getDateEn){
    String.prototype.getDateEn = function () {
        return ""
    }
}

if(!Date.prototype.getTimeStamp){
    Date.prototype.getTimeStamp = function () {
        return this.getUTCFullYear() +"-"+(this.getMonth()+1).add0ToTimer()+"-"+ this.getDate().add0ToTimer()+" "+
            this.getHours().add0ToTimer()+":"+this.getMinutes().add0ToTimer()+":"+this.getSeconds().add0ToTimer();

    }
}

if(!String.prototype.getTimeStamp){
    String.prototype.getTimeStamp = function () {
        return ""
    }
}

if(!Date.prototype.getTimeStampPt){
    Date.prototype.getTimeStampPt = function () {
        return  this.getDate().add0ToTimer()+"-"+(this.getMonth()+1).add0ToTimer()+"-"+this.getUTCFullYear()+" "+
            this.getHours().add0ToTimer()+":"+this.getMinutes().add0ToTimer()+":"+this.getSeconds().add0ToTimer();

    }
}

if(!String.prototype.getTimeStampPt){
    String.prototype.getTimeStampPt = function () {
        return ""
    }
}

if(!Date.prototype.getTime2){
    Date.prototype.getTime2= function () {
        return this.getHours().add0ToTimer()+":"+this.getMinutes().add0ToTimer();

    }
}

if(!String.prototype.getTime2){
    String.prototype.getTime2= function () {
        return ""
    }
}

function alterFormatDate(date)
{
    return date.split("-").reverse().join("-");
}

function clearFields(element) {
    element.each(function () {
        $(this).val("");
    });
}

function determine_difference_day_dates(startDate, endDate) {
    var date1 = new Date(startDate);
    var date2 = new Date(endDate);

    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    var diff = date2_ms-date1_ms;
    // get days
    return parseInt(diff/1000/60/60/24) + 1;
}


function getDateParameter(selectedDate = "today"){
    let date = new Date();
    let datesBeginEnd = [];
    if(selectedDate === "today"){
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        return datesBeginEnd;
    }
    else if(selectedDate === "yesterday"){
        date.setDate(date.getDate() - 1);
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        return datesBeginEnd;
    }
    else if(selectedDate === "one_week_ago"){
        let oneWeekAgoDate = date.getDate() - 7;
        date.setDate(oneWeekAgoDate);
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        date = new Date();
        datesBeginEnd.push(alterFormatDate(getFormattedDate(date)));
        return datesBeginEnd;
    }
}

function getFormattedDate(date) {
    return (date.getDate()>= 10 ? date.getDate() : "0"+date.getDate())+"-"+((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1)
        : "0"+(date.getMonth() + 1)) +"-"+date.getFullYear();
}
MensagemJson = function () {
    this.tipo = undefined;
    this.titulo = undefined;
    this.mensagem = undefined;
    this.tempo = undefined;
};

/** foi alterado o padrao de vazio da select**/
// ###################     VALIDATION      ##############
function isEmpty(element) {
    if (element.attr('type') === 'password')
        return (element.val().length < 1);
    else if (element.val() === null)
        return true;
    else
        return ((jQuery.type( element.val() ) === "array")
                ? (element.val().length === 0)
                :(element.val().replace(/\s/g, '') === '' || (element.val() === '' && element[0]["localName"] === "select") )
        );
}

function generateCode(length = 8){
    let random_string = "";
    let random_ascii;
    for(let i = 0; i < length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return getCurrentDate()+random_string;
}
function getCurrentDate() {
    let date = new Date();
    return (date.getDate()> 10 ? date.getDate() : "0"+date.getDate())+((date.getMonth() + 1) > 10 ? (date.getMonth() + 1)
        : "0"+(date.getMonth() + 1)) +date.getFullYear()+date.getHours()+(date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes());
}

function validation1(_element) {
    var validation;
    _element.each(function () {
        if (isEmpty($(this)) && !$(this).hasClass("_noObrigatory")) {
            $(this).focus();
            //$(this).closest('.input-field').addClass('force-focus');
            validation = false;
            return false;
        } else {
            validation = true;
        }
    });
    return validation;
}

/* Function to format numbers with "space" using as parameter a input*/
function formatted(nStr) {
    var num = nStr.val().replace(/(\s)/g, '');
    nStr.val(num.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 "));

}

function updateMaterializeFields() {
    $('select').formSelect();
    M.updateTextFields();
}
function generateAccessCode(length){
    let result = "";
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXY012';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var geralObj = {
    begin: [],
    end: [],
    page_selected : [],
    page_total : [],
    totaldata : [],
    step:[],
    file_mensagem: undefined,
    idAnual: 3,
    idS1 : 1,
    idS2 : 2,

    /**
     * @this MensagemJson
     */
    json_m: new MensagemJson(),
    load_mensagem: function (file, resource, cod) {
        $.ajax({
            url: ((resource !== undefined) ? resource : "./assets/json/") + file + ".json",
            type: "GET",
            dataType: "json",
            cache: false,
            async: false,
            success: function (json) {
                geralObj.json_m = json;
            }
        });
    },
    /***
     * @param local
     * @param codigo
     * @param resource
     * @param mensagem
     */
    callXpert: function (local, codigo, resource, mensagem) {
        this.load_mensagem(local, resource);
        /**
         * @type MensagemJson
         */
        var msg = geralObj.json_m[codigo];
        callXpertAlert(msg.titulo, ((mensagem !== undefined) ? mensagem : msg.mensagem), msg.tipo, msg.tempo);
    },
    /***
     * @param local
     * @param codigo
     * @param resource
     * @return {MensagemJson}
     */
    msg: function (local, codigo, resource) {
        this.load_mensagem(local, resource);
        /**
         * @type MensagemJson
         */
        return geralObj.json_m[codigo];
    },
    errorMessage:function(){

    },
    qr_setting : {
        // render method: 'canvas', 'image' or 'div'
        render: 'image',

        // version range somewhere in 1 .. 40
        minVersion: 1,
        maxVersion: 40,

        // error correction level: 'L', 'M', 'Q' or 'H'
        ecLevel: 'L',

        // offset in pixel if drawn onto existing canvas
        left: 0,
        top: 0,

        // size in pixel
        size: 200,

        // code color or image element
        fill: '#000000',

        // background color or image element, null for transparent background
        background: null,

        // content
        text: 'no text',

        // corner radius relative to module width: 0.0 .. 0.5
        radius: 0.5,

        // quiet zone in modules
        quiet: 3,

        // modes
        // 0: normal
        // 1: label strip
        // 2: label box
        // 3: image strip
        // 4: image box
        mode: 2,

        mSize: 0.05,
        mPosX: 0.88,
        mPosY: 0.98,

        label: 'by SIIE',
        fontname: 'sans',
        fontcolor: '#e60000',

        image: null
    },
    search_value: function (objecto, value_search) {
        var existe = false;
        $.each(objecto, function(index, value) {
            if( typeof value === "string"){
                value = value.replaceAll(" ", "").toLowerCase();
                value_search = value_search.replaceAll(" ", "").toLowerCase();
                if (value.$$(value_search)){
                    existe = true;
                }
            }else if(typeof value === "object"){
                geralObj.search_value(value, value_search)
            }
        });
        return existe;
    },
    create_pagination: function (key) {
        let total_no_arendodado = Math.trunc(this.totaldata[key] / this.step[key]);
        let total_arendodado = this.totaldata[key] / this.step[key];
        let total = ((total_arendodado !== total_no_arendodado) ? (total_no_arendodado + 1) : total_no_arendodado);

        if (this.totaldata[key] === 0) {
            geralObj.get_quantidade_item_por_pganiga[key].load(key);
        }

        let begin = 0;
        let end = this.step[key];
        this.page_total[key] = total;
        let div_pagination = $("[ref='"+key+"'].pagination_master");
        div_pagination.find(".page-k").remove();

        for (let i = 0; i < total; i++) {
            let is_end = i + 1 === total;
            let _start = ((i === 0) ? "-start" : "");
            let _end = ((is_end) ? "-end" : "");
            let page = `<li begin="$begin" end="$end" _i="$i" class="page-item ${((i === 0) ? "active" : "")}  page-k page$start$end"><a class="page-link" href="#">$i</a></li>`;
            page = page.replace("$begin", begin);
            page = page.replace("$end", ((!is_end) ? end : this.totaldata[key]));
            page = page.replace("$i", (i + 1));
            page = page.replace("$i", (i + 1));
            page = page.replace("$start", _start);
            page = page.replace("$end", _end);
            div_pagination.find(".pagination-add").before(page);
            begin = end;
            end += this.step[key];
        }
        div_pagination.find(".active").click();
    },
    alter_pages_vist : function (number, key) {
        let pages = $("[ref='"+key+"'].pagination_master");
        let totalpage = pages.find("li").length;
        let value_por_lado = geralObj.get_quantidade_item_por_pganiga[key].value_por_lado;
        let mais5Value = value_por_lado + number;
        let menos5Value = number - value_por_lado;
        let inicial_view_page = ((menos5Value < 1) ? 1 : menos5Value);
        let final_view_page = mais5Value;
        final_view_page += inicial_view_page - number + value_por_lado;

        if(final_view_page > totalpage){
            inicial_view_page -= (final_view_page-totalpage);
            final_view_page = totalpage;
        }

        pages.find("li.page").hide();
        for( let i = inicial_view_page ; i <= final_view_page ; i++){
            pages.find("li.page[_i='"+i+"']").show();
        }
    },
    test_pagination_status : function (key) {
        let pagination = $("[ref='"+key+"'].pagination_master");
        if (this.page_selected[key] === 1 && this.page_total[key] === 1) {
            pagination.find(".forward, .backward, .page-k").addClass("disabled");
            pagination.hide();
        } else if (this.page_selected[key] === this.page_total[key]) {
            pagination.find(".forward").addClass("disabled",);
            pagination.find(".backward").removeClass("disabled");
            pagination.show();
        } else if (this.page_selected[key] === 1) {
            pagination.find(".backward").addClass("disabled");
            pagination.find(".forward").removeClass("disabled");
            pagination.show();
        } else {
            pagination.find(".forward, .backward").removeClass("disabled");
            pagination.show();
        }
    },
    get_quantidade_item_por_pganiga : {}
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

if(!String.prototype.unFormatter) {
    String.prototype.unFormatter = function () {
        return unformatted(this);
    };
}

if(!String.prototype.formatter) {
    /**
     * @return {String} Dinheiro
     */
    String.prototype.formatter= function () {
        if(this !== "" && Number(this.replace(",", ".")).toString() !== NaN.toString())
            return formattedString(this);
        else{
            return "";
        }
    };
}

if(!Number.prototype.formatter) {
    /**
     * @return {String} Dinheiro
     */
    Number.prototype.formatter= function () {
        let value = this.toString();
        if(value !== "" && Number(value.replace(",", ".")).toString() !== NaN.toString())
            return formattedString(value);
        else{
            return "";
        }
    };
}

if(!String.prototype.format_with_zero){
    String.prototype.format_with_zero = function () {
        return this+",00";
    }
}

function unformatted(nStr) {
    if (nStr !== '')
        return parseFloat(nStr.replace(/\s/g, '').replace(/,/g, '.'));
    else
        return 0;
}

/**
 *  Created by Kazuki
 * @param hours
 * @param minutes
 * @returns {string}
 */
function formatAMPM(hours, minutes) {
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

function contactValid(contact) {
    var filtro = /^(?:\+[0-9]{1,3}\ )?([0-9]{1,12})$/;
    var info = contact.val();
    var rt = (filtro.test(info) || contact.val() === "");
    if(!rt){
        filtro = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
        return filtro.test(info) || contact.val() === "";
    }
    return rt;
}
/**
 * @return {boolean}
 */
function urlExists(url)
{
    let http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !==404;
}

function getCurrentDateExtensive() {
    var currentTime = new Date();
    var horas = currentTime.getHours();
    var minutos = currentTime.getMinutes();
    var segundos = currentTime.getSeconds();
    var dia = currentTime.getDate();
    var mes = currentTime.getMonth();
    var ano = currentTime.getFullYear();
    var Dia = currentTime.getDay();
    var Mes = currentTime.getUTCMonth();

    if (minutos < 10)
        minutos = "0" + minutos;
    if (segundos < 10)
        segundos = "0" + segundos;
    if (dia < 10)
        dia = "0" + dia;
    if (mes < 10)
        mes = "0" + mes;

    var arrayDia = [];
    arrayDia[0] = "Domingo";
    arrayDia[1] = "Segunda-Feira";
    arrayDia[2] = "Terça-Feira";
    arrayDia[3] = "Quarta-Feira";
    arrayDia[4] = "Quinta-Feira";
    arrayDia[5] = "Sexta-Feira";
    arrayDia[6] = "Sábado";

    var arrayMes = [];
    arrayMes[0] = "Janeiro";
    arrayMes[1] = "Fevereiro";
    arrayMes[2] = "Março";
    arrayMes[3] = "Abril";
    arrayMes[4] = "Maio";
    arrayMes[5] = "Junho";
    arrayMes[6] = "Julho";
    arrayMes[7] = "Agosto";
    arrayMes[8] = "Setembro";
    arrayMes[9] = "Outubro";
    arrayMes[10] = "Novembro";
    arrayMes[11] = "Dezembro";
    return arrayDia[Dia] + ", " + dia + " de " + arrayMes[Mes] + " de " + ano;
}

if(!String.prototype.stringToDate) {
    /***
     * @param format
     * @param delimiter
     * @return {Date}
     */
    String.prototype.stringToDate = function (format, delimiter) {
        if(!this.toString()){
            return null;
        }

        var dt;
        var st;
        if(format === undefined) {
            st = this.split("-");
            dt = new Date(st[2] + '-' + st[1] + '-' + st[0]);
        }
        else{
            st = this.split(delimiter);
            var fo = format.split(delimiter);
            dt = new Date(st[getPositionParam("YYYY", fo)]+'-'+st[getPositionParam("MM", fo)]+'-'+st[getPositionParam("DD", fo)]);
        }

        /**
         * @param str {String}
         * @param array {Array}
         */
        function getPositionParam( str, array ) {
            for ( var i = 0; i < array.length; i++ ) {
                if ( str === array[ i ].toUpperCase() ) {
                    return i;
                }
            }
        }
        return dt;
    };
}

if (!String.prototype.this_is_date){
    /***
     * @return {boolean}
     */
    String.prototype.this_is_date = function () {
        return valideData(this.toString());
    }
}

if (!String.prototype.data_BD_to_DDMMYYYY) {
    /**
     * @return {string}
     */
    String.prototype.data_BD_to_DDMMYYYY = function () {
        var data = this.split("-");
        return data[2]+"-"+data[1]+"-"+data[0];
    };
}

// ############################################################# AFROBLACK
function readBlackForm(id,array){
    var idObject;
    if (!validation1($(id))){
        return false
    }
    $(id).each(function (){
        idObject = $(this).attr('data-obj');
        array.push({[idObject]: $(this).val()});
    });
    console.log(array);
}
var aJSblack = (function (){
    var _show = function(_element){
        $(_element).removeClass("hidden")
            .addClass("animation")
            .removeClass("animation--reverse");
    };
    var _hide =function () {
        $('.c-modal,.parent').removeClass('animation').addClass('animation--reverse').addClass('hidden');;

    };
    var _autoHidden = function () {
        $('.o-layout-principal').click(function (event) {
            if($(event.target).closest('.open').hasClass('open') === false){
                $('.c-modal,.parent').removeClass('animation').addClass('animation--reverse');
                setTimeout(function(){
                    $('.c-modal,.parent').addClass('hidden');
                }, 0);
            }

        });
    };
    return{
        show:_show,
        hide:_hide,
        autoHidden:_autoHidden

    };
}());
// #############################################################   ANTUNES


$('body').on('click', function(event) {
  $('.force-focus').removeClass('force-focus');
});

function autoCoinField(){
  $('body .double').each(function(index) {
    let prt = $(this).parent();
    if(!prt.hasClass('is-money-field')){
      prt
      .attr('coin', "EUR")
      .append('<span></span>')
      .addClass('is-money-field');
    }
  });

}

function get_message_by_code_bd(code) {
    let messsage = code;
    if(code.split("")[0] === "@") {
        $.ajax({
            url: "assets/php/controller/settings.php",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                intent: "get_message_by_code_bd",
                code: code,
            },
            success: function (_messsage) {
                messsage = _messsage;
            }
        });
    }
    return messsage;
}


if (!Array.prototype.difference) {
    /**
     * @return {Array}
     */
    Array.prototype.difference = function (a2) {
        let a1 = this;
        let a = [], diff = [];

        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (let k in a) {
            if(k !== "difference") { diff.push(k);}
        }

        return diff;
    };
}


if (!String.prototype.difference) {
    /**
     * @return {Array}
     */
    String.prototype.difference = function (a2) {
        let a1 = this;
        let a = [], diff = [];

        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (let k in a) {
            if(k !== "difference") { diff.push(k);}
        }

        return diff;
    };
}

function testWhite(x) {
    let white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
}
function wordWrap(str, maxWidth) {
    let newLineStr = "\n";
    let res = "";
    let found;
    let i;
    while (str.length > maxWidth) {
        found = false;
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }
    }
    return res + str;
}
function addSpaces(text, textLength ) {
    if (text.length < textLength) {
        let spaces = textLength - text.length;
        for (let i = 1; i <= spaces; i++) {
            text = text+ ' ';
        }
    }
    return text;
}

function columnify(leftColumn, centerColumn, rightColum, leftMaxWidth, centerMaxWidth, rightMaxWidth) {
    leftColumn.trim();
    centerColumn.trim();
    rightColum.trim();
    let leftWrapped = wordWrap(leftColumn, leftMaxWidth);
    let rightWrapped = wordWrap(rightColum, rightMaxWidth);
    let centerWrapped = wordWrap(centerColumn, centerMaxWidth);

    let leftLines = leftWrapped.split("\n");
    let centerLines = centerWrapped.split("\n");
    let rightLines = rightWrapped.split("\n");
    let allLines = [];
    let leftPart = null;
    let centerPart = null;
    let rightPart = null;

    for (let i = 0; i < Math.max(leftLines.length, centerLines.length, rightLines.length); i++) {
        leftPart =  leftLines[i] ? addSpaces(leftLines[i], leftMaxWidth) : "";
        centerPart = centerLines[i] ? addSpaces(centerLines[i], centerMaxWidth) : "";
        rightPart = rightLines[i] ? addSpaces(rightLines[i],rightMaxWidth) :  "";
        allLines.push(leftPart+centerPart+rightPart);
    }
    return allLines.join("\n");
}

if(!Date.prototype.difference) {
    Date.prototype.difference = function (toDate = new Date()) {
        let diferenca = {};
        diferenca.diffMs = (toDate - this);
        diferenca.diffYear = Math.floor((diferenca.diffMs / (2628000000 * 12)));
        diferenca.diffMonth = Math.floor((diferenca.diffMs / 2628000000));
        diferenca.diffDay = Math.floor((diferenca.diffMs / 86400000));
        diferenca.diffHrs = Math.floor((diferenca.diffMs % 86400000) / 3600000);
        diferenca.diffMins = Math.floor(((diferenca.diffMs % 86400000) % 3600000) / 60000);
        diferenca.diffSegun = Math.floor((((diferenca.diffMs % 86400000) % 3600000 % 60000) / 1000));
        return diferenca;
    };
}
