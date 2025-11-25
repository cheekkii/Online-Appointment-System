/*  
all_form_item [{'owner_id': 3, 'date': 'Feb 26 Wed', 'title': 'chen', 'score': 0, 'start_time': '2:00 PM', 'maxcap': 1000000007, 'end_time': '3:00 PM', 'id': 18}, 
{'owner_id': 3, 'date': 'Feb 26 Wed', 'title': 'chen', 'score': 0, 'start_time': '3:00 PM', 'maxcap': 1000000007, 'end_time': '4:00 PM', 'id': 19}, 
{'owner_id': 3, 'date': 'Feb 26 Wed', 'title': 'chen', 'score': 0, 'start_time': '5:00 PM', 'maxcap': 1000000007, 'end_time': '6:00 PM', 'id': 21}, 
{'owner_id': 3, 'date': 'Feb 27 Thu', 'title': 'chen', 'score': 0, 'start_time': '4:00 PM', 'maxcap': 1000000007, 'end_time': '5:00 PM', 'id': 22}, 
{'owner_id': 3, 'date': 'Feb 27 Thu', 'title': 'chen', 'score': 0, 'start_time': '5:00 PM', 'maxcap': 1000000007, 'end_time': '6:00 PM', 'id': 23}, 
{'owner_id': 3, 'date': 'Feb 26 Wed', 'title': 'chen', 'score': 1, 'start_time': '4:00 PM', 'maxcap': 1000000007, 'end_time': '5:00 PM', 'id': 20}]

form_info [{'owner_id': 1, 'location': 'bankkok', 'duration': '60', 'form_type': 'group-poll', 'title': 'chen', 'description': 'new type one on one', 'id': 3}]

form_owner [{'name': 'Gam', 'avatar_url': 'https://ui-avatars.com/api/?name=    GAM&background=83ee03&color=fff', 'email': 'gamsasivimon@gmail.com'}]
*/

var list_of_time = {}
for(var lis of form_item){
    list_of_time[lis['date']] = []
}
for(var lis of form_item){
    list_of_time[lis['date']].push([lis['start_time'], lis['end_time'], lis['owner_id'], lis['id']])
}
console.log(list_of_time)

//----------------------------------------------สร้าง ปฎิทิน-------------------------------------------//
let currentDate = new Date();
list_time_slot = list_of_time;
generateMonth();
$("#prev_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateMonth();
});

$("#next_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateMonth();
});

function generateMonth(){
    const list_month = {
        "1": "January",
        "2": "February",
        "3": "March",
        "4": "April",
        "5": "May",
        "6": "June",
        "7": "July",
        "8": "August",
        "9": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 ต้อง +1
    let day = String(currentDate.getDate()).padStart(2, '0');
    let current = `${year}-${month}-${day}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); //วันแรกของเดือนยุวันอะไร
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); //วันสุดท้ายของเดือนคือวันที่เท่าไหร่
    console.log(current)
    console.log(firstDay, lastDate)

    const calender_day = $(".day");
    $(".monthandyear").text(`${list_month[String(currentDate.getMonth() + 1)]}  ${year}`)
    calender_day.empty();


    let check_today = new Date();
    //ถ้ายุในเดือนปัจจุบัน
    if((check_today.getFullYear() == year) && (String(check_today.getMonth() + 1).padStart(2, '0') == month)){
        let curr_day = check_today.getDate();
        for(let day = 0; day < firstDay; day++){
            let dayHTML = `<div></div>`;
            calender_day.append(dayHTML);
        }
        for(let day = 1; day < curr_day; day++){
            let dayHTML = `<div class='past_day'>${day}</div>`;   
            calender_day.append(dayHTML);
        }
        for (let day = curr_day; day <= lastDate; day++) {
            let dayHTML = "";
            let dateObj = new Date(year, currentDate.getMonth(), day);
            let dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // สัปดาห์แบบย่อ (Mon, Tue, Wed, ...)
            let monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }); // เดือนแบบย่อ (Jan, Feb, Mar, ...)
            let check_day = `${monthShort} ${String(day).padStart(2, '0')} ${dayOfWeek}`;
            //console.log(check_day);

            if (list_time_slot.hasOwnProperty(check_day)) {
                dayHTML = `<div><button type="button" class="btn_day selected" name="${check_day}">${day}</button></div>`;
            } else {
                dayHTML = `<div><button type="button" class="btn_day" name="${check_day}">${day}</button></div>`;
            }
    
            calender_day.append(dayHTML);
        }
    }else if ((check_today.getFullYear() > year) || (check_today.getMonth() > currentDate.getMonth())){
        for(let day = 0; day < firstDay; day++){
            let dayHTML = `<div></div>`;
            calender_day.append(dayHTML);
        }
        for (let day = 1; day <= lastDate; day++) {
            let dayHTML = `<div class='past_day'>${day}</div>`;
            calender_day.append(dayHTML);
        }
    }else{
        for(let day = 0; day < firstDay; day++){
            let dayHTML = `<div></div>`;
            calender_day.append(dayHTML);
        }
        for (let day = 1; day <= lastDate; day++) {
            let dayHTML = "";
            let dateObj = new Date(year, currentDate.getMonth(), day);
            let dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // สัปดาห์แบบย่อ (Mon, Tue, Wed, ...)
            let monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' }); // เดือนแบบย่อ (Jan, Feb, Mar, ...)
            let check_day = `${monthShort} ${String(day).padStart(2, '0')} ${dayOfWeek}`;
            //console.log(check_day);
            if (list_time_slot.hasOwnProperty(check_day)) {
                dayHTML = `<div><button type="button" class="btn_day selected" name="${check_day}">${day}</button></div>`;
            } else {
                dayHTML = `<div><button type="button" class="btn_day" name="${check_day}">${day}</button></div>`;
            }
            calender_day.append(dayHTML);
        }
    }
}

function formatDate(inputDate) {
    let [month, day, weekday] = inputDate.split(" ");
    let date = new Date(`${month} ${day}, ${new Date().getFullYear()}`); // สร้าง Date Object

    let formattedDate = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long', // ชื่อวันเต็มๆ
        day: '2-digit',   // วันที่เป็นเลขสองหลัก
        month: 'short'   // เดือนแบบย่อ (Jan, Feb, Mar)
    }).format(date);

    return formattedDate;
}






/*--------------------------------------------------group poll--------------------------------------------- */
if (form_info[0]['form_type'] == 'group-poll'){
    let date_selected;
    $(document).on('click', '.btn_day', function() {
        find_time_user_selected();
        var all_data = $('#all_data');
        var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก
        date_selected = date;
        //console.log(date_selected, date)
        $('#detail_form').removeClass();
        $('#detail_form').addClass('col-lg-4 detail_form');
        $('#calender').removeClass();
        $('#calender').addClass('col-lg-5 calender');
        $('.time_slot').remove();
        var new_time = `
            <div class='col-lg-3 time_slot'></div>
        `;
        var all_data = $('#all_data');
        all_data.append(new_time);

        var time_slot = $('.time_slot');
        time_slot.empty();
        var arr_time = list_of_time[date];

        var setupdate = formatDate(date);
        var day = `<div class='show_day'>${setupdate}</div>`;
        time_slot.append(day);
        for(var arr of arr_time){
            //console.log(arr);
            var time = `${arr[0]} - ${arr[1]}`;
            //console.log(list_user_select[date_selected], arr[3])
            if (list_user_select[date_selected] && list_user_select[date_selected].includes(arr[3].toString())){
                var new_text = `
                    <button class='time_slot_selected time_selected' name='form_data' value=${arr[2]}-${arr[3]}>
                        <p>${time}</p>
                        <div class="add_people">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=30 height=30>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                    </button>
                `;
            }else{
                var new_text = `
                    <button class='time_slot_selected' name='form_data' value=${arr[2]}-${arr[3]}>
                        <p>${time}</p>
                        <div class="add_people">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=30 height=30>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                    </button> 
                `;
            }
            time_slot.append(new_text);
        }
    });


    $(document).on('click', '.time_slot_selected', function() {
        $(this).toggleClass('time_selected'); // เพิ่ม/ลบคลาสจากปุ่มที่กด
        //console.log('show form_data',$(this).attr("name"), $(this).val())
    });


    var list_user_select = {};
    var list_user_time = {}
    function find_time_user_selected(){
        //console.log('dateeeeeeeeeeee', date_selected);
        var arr1 = []
        var arr2 = []
        $(".time_slot_selected.time_selected").each(function () {
            var timeText = $(this).find('p').text(); 
            console.log(timeText);
            var time = $(this).val().split('-') ;
            arr1.push(time[1]);
            arr2.push(timeText); 
        });
        list_user_select[date_selected] = arr1;
        list_user_time[date_selected] = arr2;
        console.log('chennnnnnnnnnn',list_user_time, list_user_select,list_of_time)
    }



    $('#setup_email').click(function (){
        find_time_user_selected();
        var info = $('.information_selected');
        info.empty();

        console.log(Object.keys(list_user_select).length);
        if (Object.keys(list_user_select).length === 1){
            for(var key in list_user_time){
                if (key === 'undefined' || list_user_time[key] === undefined) {
                    alert("you have yet to select anything!");
                    return;
                }
     
            }
        }

        for(var key in list_user_time){
            if (key === 'undefined' || list_user_time[key] === undefined) {
                continue;
            }
            var split_t  = list_user_time[key].join(' | ')
            var new_text = `
                <h5>${key}</h5>
                <p>${split_t}</p>
            `;
            info.append(new_text);
        }
        $("#popup_send_email").css("display", "flex");
    });



    $('#edit_prefer_t').click(function(){
        $("#popup_send_email").css("display", "none");
    });


    $('#btn_share_time').click(function () {
        //console.log(list_user_select);
        var form_data = {};
        form_data['email'] = $('.email').val();
        form_data['name'] = $('.name').val();
        form_data['form_info_id'] = parseInt(form_info[0]['id']); 
        for (var key in list_user_select) {
            for (var lis of list_user_select[key]) {
                form_data[`form_info_id_${lis}`] = lis; // ใช้ Template Literals ที่ถูกต้อง
            }
        }

        //NEWLY ADDED CODE FOR CSRF by tanya
        $(":input[type='hidden']").each(function () {
            var key = $(this).attr("name");
            var val = $(this).val();
        
            if (key === undefined) {
                return;
            }
            form_data[key] = val;
        });

        console.log(form_data);
        console.log(form_info[0]['id']);
        var id_form = form_info[0]['id'];
        var url = `/dodle/send-vote/${id_form}`;

        $.getJSON(`/hashing/${form_info[0]['title']}`, function(response){
            form_data['form_voting_password'] = response.hashed_title;
            $.post(url,form_data, function(response){
                console.log(response);
                //window.location.replace('/dodle/thankyou');
                console.log('list_time', list_user_time);
        
                // แปลง list_user_time เป็น JSON string
                const dataString = JSON.stringify(list_user_time);
                
                // ส่งข้อมูลผ่าน URL ด้วย query parameter
                window.location.replace(`/dodle/thankyou?data=${encodeURIComponent(dataString)}`);
            });
        });
        
    });


















/*-----------------------------------------------one-on-one-------------------------------------------- */   
}else if (form_info[0]['form_type'] == 'one-on-one'){
    //ดึงดาต้าว่าเวลาในใครลงแล้วบ้าง
    var data_form_selected;
    var url = `/dodle/get-all-form-items/${form_info[0]['id']}`;
    $.getJSON(url, function (response) {
        data_form_selected = response;
        console.log(response);
    });


    let date_selected;
    $(document).on('click', '.btn_day', function() {
        //find_time_user_selected();
        var all_data = $('#all_data');
        var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก
        date_selected = date;
        //console.log(date_selected, date)
        $('#detail_form').removeClass();
        $('#detail_form').addClass('col-lg-4 detail_form');
        $('#calender').removeClass();
        $('#calender').addClass('col-lg-5 calender');
        $('.time_slot').remove();
        var new_time = `
            <div class='col-lg-3 time_slot'></div>
        `;
        var all_data = $('#all_data');
        all_data.append(new_time);

        var time_slot = $('.time_slot');
        time_slot.empty();
        var arr_time = list_of_time[date];
        var setupdate = formatDate(date);
        var day = `<div class='show_day'>${setupdate}</div>`;
        time_slot.append(day);
        for(var arr of arr_time){
            //console.log(arr);
            var time = `${arr[0]} - ${arr[1]}`;
            var id_f = arr[3];
            for(var data of data_form_selected){
                //console.log(data['id'], id_f);
                if(data['id'] == id_f){
                    if(data['score'] == data['maxcap']){
                        var new_text = `
                            <button class='time_slot_selected time_selected_finish' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <div class="add_people">
                                    <p>1</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=30 height=30>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </div>
                            </button> 
                        `;
                    }else{
                        var new_text = `
                            <button class='time_slot_selected' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <div class="add_people">
                                    <p class='text_score'>0</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=30 height=30>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </div>
                            </button> 
                        `;
                    }
                }
            }
            time_slot.append(new_text);
        }
    });

    $(document).on('click', '.time_slot_selected', function() {
        $('.time_slot_selected').find('.text_score').text('0');
        $('.time_slot_selected').removeClass('time_selected'); // ลบคลาสออกจากปุ่มอื่นๆ
        $(this).addClass('time_selected'); // เพิ่มคลาสเฉพาะปุ่มที่ถูกคลิก
        $(this).find(".text_score").text("1");
    });

    function find_time_user_selected(){
        var list_user_select = {};
        var list_user_time = {};
        var arr1 = [];
        var arr2 = [];
        $(".time_slot_selected.time_selected").each(function () {
            var timeText = $(this).find('.text_time').text(); 
            console.log(timeText);
            var time = $(this).val().split('-') ;
            arr1.push(time[1]);
            arr2.push(timeText); 
        });
        list_user_select[date_selected] = arr1;
        list_user_time[date_selected] = arr2;
        //console.log('chennnnnnnnnnn',list_user_time, list_user_select,list_of_time)
        return { list_user_select, list_user_time };
    }

    
    var list_user_select = {};
    var list_user_time = {};
    $('#setup_email').click(function (){
        var result = find_time_user_selected();
        list_user_select = result.list_user_select;
        list_user_time = result.list_user_time;

        console.log(Object.keys(list_user_select).length);
        if (Object.keys(list_user_select).length === 1){
            for(var key in list_user_time){
                if (key === 'undefined' || list_user_time[key] === undefined) {
                    alert("you have yet to select anything!");
                    return;
                }
     
            }
        }
        var info = $('.information_selected');
        info.empty();
        for(var key in list_user_time){
            var split_t  = list_user_time[key].join(' | ')
            var new_text = `
                <h5>${key}</h5>
                <p>${split_t}</p>
            `;
            info.append(new_text);
        }
        $("#popup_send_email").css("display", "flex");
    });


    $('#edit_prefer_t').click(function(){
        $("#popup_send_email").css("display", "none");
    });


    $('#btn_share_time').click(function () {
        console.log(list_user_select);
        var form_data = {};
        var form_id_item ;
        for (var key in list_user_select) {
            for (var lis of list_user_select[key]) {
                form_data[`form_info_id_${lis}`] = lis; // ใช้ Template Literals ที่ถูกต้อง
                form_id_item = lis;
            }
        }

        form_data['email'] = $('.email').val();
        form_data['name'] = $('.name').val();
        form_data['form_info_id'] = parseInt(form_info[0]['id']); 
        
        var title;
        var message;
        var email = form_data['email'];
        for(var item of form_item){
            if (item['id'] == form_id_item){
                title = form_info[0]['title'];
                message = "you have appointment on " + item.date +" from "+ item.start_time + " to " + item.end_time + " at " + form_info[0]['location'] + " the duration is specify to be " + form_info[0]['duration'] + ", we hope you can make your attendance.";
            }
        }

        //NEWLY ADDED CODE FOR CSRF by tanya
        $(":input[type='hidden']").each(function () {
            var key = $(this).attr("name");
            var val = $(this).val();
        
            if (key === undefined) {
                return;
            }
            form_data[key] = val;
        });


        console.log('form_data', form_data);
        console.log('message', message);
        console.log(form_info[0]['id']);

        
        $.getJSON(`/hashing/${form_info[0]['title']}`, function(response){
            form_data['form_voting_password'] = response.hashed_title;
            var id_form = form_info[0]['id'];
            var url = `/dodle/send-vote/${id_form}`;
            $.post(url,form_data, function(response){
                console.log(response);
                if(response == "success"){
                    //send notify mail
                    $.post("/send-mail",{"title": title, "message": message, "email": email, 'csrf_token': form_data['csrf_token']},function(response){
                      console.log(response);
                      //window.location.replace('/dodle/thankyou');
                      console.log('list_time', list_user_time);

                      // แปลง list_user_time เป็น JSON string
                      const dataString = JSON.stringify(list_user_time);
        
                      // ส่งข้อมูลผ่าน URL ด้วย query parameter
                      window.location.replace(`/dodle/thankyou?data=${encodeURIComponent(dataString)}`);
                    });
                  } else {
                    alert("the room already full! please select another option")
                  }
            });
        });

    });
}















/*---------------------------------------------------booking page------------------------------------------- */
else if (form_info[0]['form_type'] == 'booking-page'){
    //ดึงดาต้าว่าเวลาในใครลงแล้วบ้าง
    var data_form_selected;
    var url = `/dodle/get-all-form-items/${form_info[0]['id']}`;
    $.getJSON(url, function (response) {
        data_form_selected = response;
        console.log(response);
    });


    let date_selected;
    $(document).on('click', '.btn_day', function() {
        //find_time_user_selected();
        var all_data = $('#all_data');
        var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก
        date_selected = date;
        //console.log(date_selected, date)
        $('#detail_form').removeClass();
        $('#detail_form').addClass('col-lg-4 detail_form');
        $('#calender').removeClass();
        $('#calender').addClass('col-lg-5 calender');
        $('.time_slot').remove();
        var new_time = `
            <div class='col-lg-3 time_slot'></div>
        `;
        var all_data = $('#all_data');
        all_data.append(new_time);

        var time_slot = $('.time_slot');
        time_slot.empty();
        var arr_time = list_of_time[date];

        var setupdate = formatDate(date);
        var day = `<div class='show_day'>${setupdate}</div>`;
        time_slot.append(day);
        for(var arr of arr_time){
            //console.log(arr);
            var time = `${arr[0]} - ${arr[1]}`;
            var id_f = arr[3];
            for(var data of data_form_selected){
                //console.log(data['id'], id_f);
                if(data['id'] == id_f){
                    if(data['score'] == data['maxcap']){
                        var new_text = `
                            <button class='time_slot_booking time_selected_finish' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <p>Already Booked</p> 
                            </button> 
                        `;
                    }else{
                        var new_text = `
                            <button class='time_slot_selected' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <div class="add_people">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" width=30 height=30>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </div>
                            </button> 
                        `;
                    }
                }
            }
            time_slot.append(new_text);
        }
    });



    $(document).on('click', '.time_slot_selected', function() {
        $('.time_slot_selected').find('.text_score').text('0');
        $('.time_slot_selected').removeClass('time_selected'); // ลบคลาสออกจากปุ่มอื่นๆ
        $(this).addClass('time_selected'); // เพิ่มคลาสเฉพาะปุ่มที่ถูกคลิก
        $(this).find(".text_score").text("1");
    });

    function find_time_user_selected(){
        var list_user_select = {};
        var list_user_time = {};
        var arr1 = [];
        var arr2 = [];
        $(".time_slot_selected.time_selected").each(function () {
            var timeText = $(this).find('.text_time').text(); 
            console.log(timeText);
            var time = $(this).val().split('-') ;
            arr1.push(time[1]);
            arr2.push(timeText); 
        });
        list_user_select[date_selected] = arr1;
        list_user_time[date_selected] = arr2;
        //console.log('chennnnnnnnnnn',list_user_time, list_user_select,list_of_time)
        return { list_user_select, list_user_time };
    }

    
    var list_user_select = {};
    var list_user_time = {};
    $('#setup_email').click(function (){
        var result = find_time_user_selected();
        list_user_select = result.list_user_select;
        list_user_time = result.list_user_time;

        console.log(Object.keys(list_user_select).length);
        if (Object.keys(list_user_select).length === 1){
            for(var key in list_user_time){
                if (key === 'undefined' || list_user_time[key] === undefined) {
                    alert("you have yet to select anything!");
                    return;
                }
            }
        }
        var info = $('.information_selected');
        info.empty();
        for(var key in list_user_time){
            var split_t  = list_user_time[key].join(' | ')
            var new_text = `
                <h5>${key}</h5>
                <p>${split_t}</p>
            `;
            info.append(new_text);
        }
        $("#popup_send_email").css("display", "flex");
    });


    $('#edit_prefer_t').click(function(){
        $("#popup_send_email").css("display", "none");
    });


    $('#btn_share_time').click(function () {
        console.log(list_user_select);
        var form_data = {};
        var form_id_item ;
        for (var key in list_user_select) {
            for (var lis of list_user_select[key]) {
                form_data[`form_info_id_${lis}`] = lis; // ใช้ Template Literals ที่ถูกต้อง
                form_id_item = lis;
            }
        }

        form_data['email'] = $('.email').val();
        form_data['name'] = $('.name').val();
        form_data['form_info_id'] = parseInt(form_info[0]['id']); 

        //NEWLY ADDED CODE FOR CSRF by tanya
        $(":input[type='hidden']").each(function () {
            var key = $(this).attr("name");
            var val = $(this).val();
        
            if (key === undefined) {
                return;
            }
            form_data[key] = val;
        });
        
        var title;
        var message;
        var email = form_data['email'];
        for(var item of form_item){
            if (item['id'] == form_id_item){
                title = form_info[0]['title'];
                message = "you have appointment on " + item.date +" from "+ item.start_time + " to " + item.end_time + " at " + form_info[0]['location'] + " the duration is specify to be " + form_info[0]['duration'] + ", we hope you can make your attendance.";
            }
        }


        console.log('form_data', form_data);
        console.log('message', message);
        console.log(form_info[0]['id']);

        
        $.getJSON(`/hashing/${form_info[0]['title']}`, function(response){
            form_data['form_voting_password'] = response.hashed_title;
            var id_form = form_info[0]['id'];
            var url = `/dodle/send-vote/${id_form}`;
            $.post(url,form_data, function(response){
                console.log(response);
                if(response == "success"){
                    //send notify mail
                    $.post("/send-mail",{"title": title, "message": message, "email": email, 'csrf_token': form_data['csrf_token']},function(response){
                      console.log(response);
                      //window.location.replace('/dodle/thankyou');
                      console.log('list_time', list_user_time);
              
                      // แปลง list_user_time เป็น JSON string
                      const dataString = JSON.stringify(list_user_time);
                      
                      // ส่งข้อมูลผ่าน URL ด้วย query parameter
                      window.location.replace(`/dodle/thankyou?data=${encodeURIComponent(dataString)}`);
                    });
                  } else {
                    alert("the room already full! please select another option")
                  }
            });
        });

    });
}













/*-----------------------------------------------sign up sheet------------------------------------------------------------ */
else{
    //ดึงดาต้าว่าเวลาในใครลงแล้วบ้าง
    var data_form_selected;
    var url = `/dodle/get-all-form-items/${form_info[0]['id']}`;
    $.getJSON(url, function (response) {
        data_form_selected = response;
        console.log(response);
    });


    let date_selected;
    var score;
    var maxcap;
    $(document).on('click', '.btn_day', function() {
        //find_time_user_selected();
        var all_data = $('#all_data');
        var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก
        date_selected = date;
        //console.log(date_selected, date)
        $('#detail_form').removeClass();
        $('#detail_form').addClass('col-lg-4 detail_form');
        $('#calender').removeClass();
        $('#calender').addClass('col-lg-5 calender');
        $('.time_slot').remove();
        var new_time = `
            <div class='col-lg-3 time_slot'></div>
        `;
        var all_data = $('#all_data');
        all_data.append(new_time);

        var time_slot = $('.time_slot');
        time_slot.empty();
        var arr_time = list_of_time[date];

        var setupdate = formatDate(date);
        var day = `<div class='show_day'>${setupdate}</div>`;
        time_slot.append(day);
        for(var arr of arr_time){
            //console.log(arr);
            var time = `${arr[0]} - ${arr[1]}`;
            var id_f = arr[3];
            for(var data of data_form_selected){
                //console.log(data['id'], id_f);
                if(data['id'] == id_f){
                    if(data['score'] == data['maxcap']){
                        var new_text = `
                            <button class='time_slot_booking time_selected_finish' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <p>Already Booked</p> 
                            </button> 
                        `;
                    }else{
                        score = data['score'];
                        maxcap = data['maxcap'];
                        console.log(score, maxcap);
                        var new_text = `
                            <button class='time_slot_booking' name='form_data' value=${arr[2]}-${arr[3]}>
                                <p class='text_time'>${time}</p>
                                <p class='text_score' id=${score}-${maxcap}-${arr[3]}>${score} / ${maxcap}</p>
                            </button> 
                        `;
                    }
                }
            }
            time_slot.append(new_text);
        }
    });

    var prev;
    var old_score;
    $(document).on('click', '.time_slot_booking', function() {
        console.log(prev, old_score);
        if (old_score) {
            $(`#${old_score.join('-')}`).text(`${old_score[0]} / ${old_score[1]}`);
        }
        $('.time_slot_booking').removeClass('time_selected'); // ลบคลาสออกจากปุ่มอื่นๆ
        $(this).addClass('time_selected'); // เพิ่มคลาสเฉพาะปุ่มที่ถูกคลิก
        prev = $(this).find(".text_score").attr("id");
        var val = prev.split('-');
        old_score = val;
        $(this).find(".text_score").text(`${parseInt(val[0])+1} / ${val[1]}`);
    });


    function find_time_user_selected(){
        var list_user_select = {};
        var list_user_time = {};
        var arr1 = [];
        var arr2 = [];
        $(".time_slot_booking.time_selected").each(function () {
            var timeText = $(this).find('.text_time').text(); 
            //console.log(timeText);
            var time = $(this).val().split('-') ;
            arr1.push(time[1]);
            arr2.push(timeText); 
        });
        list_user_select[date_selected] = arr1;
        list_user_time[date_selected] = arr2;
        //console.log('chennnnnnnnnnn',list_user_time, list_user_select,list_of_time)
        return { list_user_select, list_user_time };
    }

    
    var list_user_select = {};
    var list_user_time = {};
    $('#setup_email').click(function (){
        var result = find_time_user_selected();
        list_user_select = result.list_user_select;
        list_user_time = result.list_user_time;

        //console.log(Object.keys(list_user_select).length);
        if (Object.keys(list_user_select).length === 1){
            for(var key in list_user_time){
                if (key === 'undefined' || list_user_time[key] === undefined) {
                    alert("you have yet to select anything!");
                    return;
                }
     
            }
        }
        var info = $('.information_selected');
        info.empty();
        for(var key in list_user_time){
            var split_t  = list_user_time[key].join(' | ')
            var new_text = `
                <h5>${key}</h5>
                <p>${split_t}</p>
            `;
            info.append(new_text);
        }
        $("#popup_send_email").css("display", "flex");
    });


    $('#edit_prefer_t').click(function(){
        $("#popup_send_email").css("display", "none");
    });


    $('#btn_share_time').click(function () {
        console.log(list_user_select);
        var form_data = {};
        var form_id_item ;
        for (var key in list_user_select) {
            for (var lis of list_user_select[key]) {
                form_data[`form_info_id_${lis}`] = lis; // ใช้ Template Literals ที่ถูกต้อง
                form_id_item = lis;
            }
        }

        form_data['email'] = $('.email').val();
        form_data['name'] = $('.name').val();
        form_data['form_info_id'] = parseInt(form_info[0]['id']); 

        //NEWLY ADDED CODE FOR CSRF by tanya
        $(":input[type='hidden']").each(function () {
            var key = $(this).attr("name");
            var val = $(this).val();
        
            if (key === undefined) {
                return;
            }
            form_data[key] = val;
        });
        
        var title;
        var message;
        var email = form_data['email'];
        for(var item of form_item){
            if (item['id'] == form_id_item){
                title = form_info[0]['title'];
                message = "you have appointment on " + item.date +" from "+ item.start_time + " to " + item.end_time + " at " + form_info[0]['location'] + " the duration is specify to be " + form_info[0]['duration'] + ", we hope you can make your attendance.";
            }
        }


        console.log('form_data', form_data);
        console.log('message', message);
        console.log(form_info[0]['id']);

                
        $.getJSON(`/hashing/${form_info[0]['title']}`, function(response){
            form_data['form_voting_password'] = response.hashed_title;
            var id_form = form_info[0]['id'];
            var url = `/dodle/send-vote/${id_form}`;

            $.post(url,form_data, function(response){
                // console.log(response);
                if(response == "success"){
                    //send notify mail
                    $.post("/send-mail",{"title": title, "message": message, "email": email, 'csrf_token': form_data['csrf_token']},function(response){
                      console.log(response);
                      //window.location.replace('/dodle/thankyou');
                      console.log('list_time', list_user_time);
              
                      // แปลง list_user_time เป็น JSON string
                      const dataString = JSON.stringify(list_user_time);
                      
                      // ส่งข้อมูลผ่าน URL ด้วย query parameter
                      window.location.replace(`/dodle/thankyou?data=${encodeURIComponent(dataString)}`);
                    });
                  } else {
                    alert("the room already full! please select another option")
                  }
            });
        });

    });
}