var Calendar = {
    typeEvent: "920eb08f-5f59-47bb-9d48-32da83bf83eb",
    listEvents: [],
    load : () => {

        let calendarEl = document.getElementById('calendar');
        let calendar = new FullCalendar.Calendar(calendarEl, {
            height: '94%',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            editable: true,
            navLinks: true, // can click day/week names to navigate views
            dayMaxEvents: true, // allow "more" link when too many events
            events: {
                url: '/api/clinica/calendar',
                failure: function() {
                    document.getElementById('script-warning').style.display = 'block'
                }
            },
            loading: function(bool) {
                document.getElementById('loading').style.display = bool ? 'block' : 'none';
                if(bool){
                   setTimeout(() => {
                       let {end, start} = calendar?.currentData?.dateProfile?.renderRange;
                       $.ajax({
                           url: `/api/clinica/calendar?end=${end.getDateEn()}&start=${start.getDateEn()}`,
                           method: "GET",
                           contentType: "application/json",
                           success: (events) => {
                               Calendar.listEvents = events;
                               $('[listEventCalendar]').empty()
                               events.forEach(({title, color}, index) => {
                                   $('[listEventCalendar]').append(`<li data-index="${index}" class="FlexCalendar">
                                      <div class="CalendarNome">
                                          <span style="border-color:${color}" class="fc fc-list-event-dot"></span>
                                          <small>${title}</small>
                                      </div>
                                        <div class="CalenSvg">
                                            <svg edit xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"> <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/> </svg>
                                            <svg delete xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"> <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/> </svg>
                                        </div>
                                    </li>`)
                               })
                           }
                       }, 100);
                   })
                }
            },
            locale: 'pt',
            timeZone: 'Africa/Sao_Tome',
        });

        calendar.render();
    },
    loadInit : () => {
        $.ajax({
            url: "/api/clinica/fixacao/loads",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                lods: [
                    {
                        parmName: "tschedule",
                        query: {item_type: DBK.clinic_item_type_tschedule},
                    }
                ]
            }),
            success: ({ tschedule }) => {
                tschedule.forEach(({item_desc, item_uid}) => {
                    $('[list="schedule_type"]').append(`<li data-value="${item_uid}">${item_desc}</li>`)
                })
            }
        });

        $.ajax({
            url: "/api/clinica/paciente/load",
            method: "POST",
            contentType: "application/json",
            success: ({ data }) => {
                let patient_client_ids = [];
                data.forEach(({patient_uid, patient_name, patient_responsible, patient_client_id}, index) => {
                    $('[list="schedule_patient"]').append(`<li data-noshow="true" data-client_id="${patient_client_id}" data-value="${patient_uid}">${patient_name}</li>`)
                    if(!patient_client_ids.includes(patient_client_id) && patient_responsible?.nome) {
                        $('[list="schedule_client"]').append(`<li data-value="${patient_client_id}">${(patient_responsible?.nome || "")}</li>`)
                        patient_client_ids.push(patient_client_id)
                    }
                })
            }
        });
    },
    set : () => {
        if(!validation1($("#xModalSetsAgenda .xform input"))){
            xAlert("", "Por favor preencha os campos obrigatórios", "error");
            return
        }

        let schedule_startdate = (($("#schedule_startdate").val().stringToDate() || "").getDateEn()+" "+$("#schedule_startdate_time").val()).trim() || null;
        let schedule_enddate = (($("#schedule_enddate").val().stringToDate() || "").getDateEn()+" "+$("#schedule_enddate_time").val()).trim() || null;
        if(!schedule_enddate && schedule_startdate > schedule_enddate){
            xAlert("", "Por favor defina um intervalo de data válido!", "error");
            return;
        }

        $("[setsAgenda]").addClass("loading");
        $.ajax({
            url: "/api/clinica/calendar/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                schedule_uuid: Calendar?.schedule_uuid,
                schedule_name: $("#schedule_name").val() || null,
                schedule_type: $("[list='schedule_type'] li.active").data("value") || null,
                schedule_patients: $("[list='schedule_patient'] li.active").map(function (){
                    return $(this).data("value")
                }).get(),
                schedule_startdate,
                schedule_enddate : schedule_enddate || schedule_startdate,
                schedule_dayadvance: $('[list="schedule_xdayadvance"] li.active').map(function (){
                    return $(this).data("value")
                }).get(),
                schedule_jsonb: {
                    client: $("[list='schedule_client'] li.active").data("value") || null,
                    hasTimeStart: !!$(" #schedule_startdate_time ").val(),
                    hasTimeEnd: !!$(" #schedule_enddate_time ").val(),
                    noHasEndDate: !schedule_enddate
                }
            }),
            success: ({response: {row: {result, message, data}}}) => {
                $("[setsAgenda]").removeClass("loading");
                if(result){
                    $("#xModalSetsAgenda").removeClass("show");
                    xAlert("", Calendar.schedule_uuid ? "Agenda editada com sucesso" : "Agenda registada com sucesso");
                    Calendar.clean()
                    Calendar.load();
                    return
                }
                xAlert("", Calendar.schedule_uuid ? "Erro a editar a agenda" : "Erro a registar a agenda", "error");
            }
        });
    },
    clean : () => {
        delete Calendar.schedule_uuid
        $("#schedule_startdate").val("")
        $("#schedule_startdate_time").val("").prop("disabled", true);
        $("#schedule_enddate").val("")
        $("#schedule_enddate_time").val("").prop("disabled", true);
        $("#schedule_name").val("")
        $("[schedule_type]").val("")
        $("[schedule_patient]").val("")
        $('[schedule_xdayadvance]').val("")
        $('[list="schedule_xdayadvance"] li').removeClass("active")
        $("[list='schedule_type'] li").removeClass("active")
        $("[list='schedule_patient'] li").removeClass("active")
    },
    preSets : ({schedule_name, schedule_type, schedule_patients, schedule_startdate, schedule_enddate, schedule_dayadvance, schedule_jsonb : {hasTimeStart, hasTimeEnd, noHasEndDate, client}, schedule_uuid}) => {
        Calendar.clean();

        Calendar.schedule_uuid = schedule_uuid
        $("#schedule_name").val(schedule_name);

        $("[list='schedule_type'] li").each(function (){
            if (schedule_type === $(this).data("value")) {
                $(this).trigger("mousedown")
            }
        })

        setTimeout(() => {
            $("[list='schedule_client'] li").each(function (){
                if (client === $(this).data("value")) {
                    console.log(client === $(this).data("value"))
                    $(this).trigger("mousedown")
                }
            })

            $("[list='schedule_xdayadvance'] li").each(function (){
                if (schedule_dayadvance.includes($(this).data("value"))) {
                    $(this).trigger("mousedown")
                }
            })

           setTimeout(() => {
               $("[list='schedule_patient'] li").each(function (){
                   if (schedule_patients.includes($(this).data("value"))) {
                       $(this).trigger("mousedown")
                   }
               })
           })
        })

        schedule_startdate = schedule_startdate.stringToDateEn()
        schedule_enddate = (schedule_enddate || "").stringToDateEn()
        $("#schedule_startdate").val(schedule_startdate.getDatePt())
        $("#schedule_startdate_time").val(hasTimeStart ? schedule_startdate.getTime2H(): "")
        $("#schedule_enddate").val((noHasEndDate) ? "" : schedule_enddate)
        $("#schedule_enddate_time").val((noHasEndDate) ? "" : (hasTimeEnd ? schedule_enddate.getTime2H(): ""))

        if(schedule_startdate){
            $(" #schedule_startdate ").addClass("complete")
            $(" #schedule_startdate_time ").prop("disabled", false)
        }
        if(!noHasEndDate && schedule_enddate){
            $(" #schedule_enddate ").addClass("complete")
            $(" #schedule_enddate_time ").prop("disabled", false)
        }

        $('[id="xModalSetsAgenda"]').addClass("show")
    },
    setsDelete : () => {
        $("[deleteSeletedAgenda]").addClass("loading");
        $.ajax({
            url: "/api/clinica/calendar/set",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                schedule_uuid: Calendar.schedule_uuid || null,
                schedule_estado: 0
            }),
            success: ({response: {row: {result, message, data}}}) => {
                $("[deleteSeletedAgenda]").removeClass("loading");
                if(result){
                    xAlert("","A agenda foi elimidada com sucesso!");
                    $("#xModalDeleteAgenda").removeClass("show")
                    return
                }
                xAlert("","Erro a eliminar a agenda", "error");
            }
        });
    }
};

Calendar.load();
Calendar.loadInit();

$("[schedule_type]").on("change", function (){
    setTimeout(() => {
        let value = $("[list='schedule_type'] li.active").data("value");
        if(!!value && value !== Calendar.typeEvent){
            $("[schedule_patient], [schedule_client]").removeClass("_noObrigatory").attr("_noObrigatory", "false").parents(".xselect").removeClass("hide").find("li").removeClass("active");
            $("#schedule_enddate, #schedule_enddate_time").parents(".xinput").val("").addClass("hide");
            $("[schedule_xdayadvance]").parents(".xselect").removeClass("hide").find("li").removeClass("active");
            return
        }
        $(" [schedule_patient], [schedule_client] ").addClass("_noObrigatory").attr("_noObrigatory", "true").val("").parents(".xselect").addClass("hide").find("li").removeClass("active");
        $(" [schedule_xdayadvance] ").val("").parents(".xselect").addClass("hide").find("li").removeClass("active");
        $(" #schedule_enddate, #schedule_enddate_time ").parents(".xinput").removeClass("hide");
    })
})

$("#schedule_startdate, #schedule_enddate").on("complete", function (){
    $(this).addClass("complete")
    let id = $(this).attr("id");
    $(`#${id}_time`).prop("disabled", false)
}).on("incomplete", function (){
    $(this).removeClass("complete")
    let id = $(this).attr("id");
    $(`#${id}_time`).prop("disabled", true)
}).on("focusout", function (){
    let id = $(this).attr("id");
    if ($(this).hasClass("complete")) {
        $(`#${id}_time`).prop("disabled", false)
        return
    }
    $(` #${id}_time `).val("").prop("disabled", true)
});

$("#schedule_startdate_time, #schedule_enddate_time").on("incomplete", function (){
    $(this).val("")
})

$("[setsAgenda]").on("click", function (){
    Calendar.set()
})


$("[listEventCalendar]").on("click", "[edit]", function (){
    let index = $(this).parents("li.FlexCalendar").data("index");
    let event = Calendar.listEvents[index];
    Calendar.preSets(event);
}).on("click", "[delete]", function (){
    let index = $(this).parents("li.FlexCalendar").data("index");
    let event = Calendar.listEvents[index];
    Calendar.schedule_uuid = event.schedule_uuid
    $("#xModalDeleteAgenda").addClass("show")
})

$("[deleteSeletedAgenda]").on("click", function (){
    Calendar.setsDelete()
})

$('[target="xModalSetsAgenda"].showTarget').on("click", () => {
    Calendar.clean();
})

$("[schedule_client]").on("change", function (){
    setTimeout(() => {
        let client = $(this).parents(".xselect").find("li.active").data("value")
        console.log(client)
        $("[list='schedule_patient'] li").each(function (){
            console.log(client, $(this).data("client_id"))
            if (client === $(this).data("client_id")) {
                $(this).attr("data-noshow", false)
                return
            }
            $(this).attr("data-noshow", true)
        })
    }, 10)
})