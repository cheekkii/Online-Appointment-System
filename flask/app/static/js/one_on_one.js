//----------------------------------------ปุ่ม create group poll-------------------------------------------//
var formId;
var hashed_title
$("#group-poll-form").submit(function (event){
    event.preventDefault();  // ยับยั้งการรีเฟรชของฟอร์ม
    console.log(list_time_slot);
    var all_data = {};
    all_data['title'] = $("#title").val();
    all_data['description'] = $("#description").val();
    all_data['location'] = $("#location").val();
    all_data['time_select'] = list_time_slot;
    all_data['form_type'] = 'one-on-one';
    all_data['duration'] = $('#duration').val();
    all_data['date'] = [];
    all_data['end_time'] = [];
    all_data['start_time'] = [];

    if (!$("#title").val() || !$("#description").val() || !$("#location").val() || !$('#duration').val() || list_time_slot.length === 0) {
      alert("Please fill in all the fields!");
      return; 
    }

    for (let key in list_time_slot) {
        for (let date_selected of list_time_slot[key]) {
            let split_date = date_selected.split('-');
            all_data['date'].push(key);
            all_data['end_time'].push(split_date[1]);
            all_data['start_time'].push(split_date[0]);
        }
    }

    //NEWLY ADDED CODE FOR CSRF by tanya
    $(":input[type='hidden']").each(function () {
      var key = $(this).attr("name");
      var val = $(this).val();
  
      if (key === undefined) {
          return;
      }
      all_data[key] = val;
    });

    console.log(all_data);
    var url = "/dodle/create-form";

    console.log(formId);
    if (formId) {
      all_data['id'] = formId;
      $.post(url, all_data, function (response_data) {
        // ดึง hashed_title จาก formId ที่มีอยู่แล้ว
        var block = $('.all_data');
        block.empty()
        var about_time = `
                <div class='duration_row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p>${response_data['duration']}</p>
                </div>
                <div class='block_link'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    <a href='/dodle/${formId}/${hashed_title}'>/dodle/${formId}/${hashed_title}</a>
                </div>
                <div class='time_row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                    </svg>
                    <p>${all_data['start_time'].length} times on ${Object.keys(list_time_slot).length} days</p>  
                </div>
        `;
        block.append(about_time);

        for(let key in list_time_slot){
          var date = key;
          var time = list_time_slot[key].join(' | ');
          console.log(date, time)
          var new_text = `
              <div class='all_day_se'>
                <p><b>${date}</b> : ${time}</p>
              </div>
          `;
          block.append(new_text);
        }
      });
    } else {
      $.post(url, all_data, function (response_data) {
        formId = response_data.id; // เก็บ ID ของฟอร์ม
        $.getJSON(`/hashing/${response_data.title}`, function (response) {
            hashed_title = response.hashed_title;
            var block = $('.all_data');
            block.empty()
            var about_time = `
                <div class='duration_row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <p>${response_data['duration']}</p>
                </div>
                <div class='block_link'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    <a href='/dodle/${formId}/${hashed_title}'>/dodle/${formId}/${hashed_title}</a>
                </div>
                <div class='time_row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                    </svg>
                    <p>${all_data['start_time'].length} times on ${Object.keys(list_time_slot).length} days</p>  
                </div>
            `;
            block.append(about_time);

            for(let key in list_time_slot){
              var date = key;
              var time = list_time_slot[key].join(' | ');
              console.log(date, time)
              var new_text = `
                  <div class='all_day_se'>
                    <p><b>${date}</b> : ${time}</p>
                  </div>
              `;
              block.append(new_text);
            }
        });
      });
    }  
    $("#popupoverlay_link").css("display", "flex");
});



//--------------------------------------------close pop up link ---------------------------------------------//
$('#btn_edit').click(function(event){
  event.preventDefault();
  console.log('formiddddd',formId)
  $("#popupoverlay_link").css("display", "none");
});


//----------------------------------------------btn back to home -------------------------------------------//
$('#back_to_home').click(function(){
  window.location.href = `/dodle/home`;
});



//---------------------------------------ตั้งเวลาที่จะเลือก available time slot-------------------------------//
function generateAvailableTime() {
    const available = $(".available"); // ตรวจสอบให้แน่ใจว่า `.available` เป็น `<select>`
    available.empty(); // ล้างข้อมูลเดิม

    for (let i = 0; i <= 24; i++) {
        let startTimeStr = `${String(i).padStart(2, "0")}:00`;
        let available_time = `<option value="${i}">${startTimeStr}</option>`;
        available.append(available_time);
    }
}


//--------------------------------------เลือกเวลาtimeslot กดปุ่มแล้วเพิ่มคลาส selected------------------------//
$(document).on('click', '.btn_timeslot', function() {
    $(this).addClass("t_selected");
    var timeslot = $(this).data("value");
});



//---------------------------------------------กด เลือกเวลาที่จะเลือกtime slot------------------------------//
var list_time_slot = {};
$("#close_popup").click(function(){
    var timeslot_list = [];
    $('.btn_timeslot.t_selected').each(function() {
        timeslot_list.push($(this).data("value"));
    });
    //console.log(timeslot_list);
    $("#popupoverlay").css("display", "none");

    //เก็บข้อมูลเวลาที่เลือก
    if (timeslot_list.length == 0){
      btn_day.removeClass('selected');
      return;
    }

    list_time_slot[dateselect] = timeslot_list;
    console.log('list_time_slot', list_time_slot);

    
    var show_date = $(".show_date_select");
    show_date.empty();

    for (let date in list_time_slot) {
        var dateSection = `
            <div class="date_block">
                <h2 class="date_header">${date}</h2>
                <div class="time_container"></div>
            </div>
        `;
        show_date.append(dateSection);

        var timeContainer = show_date.find(".date_block:last .time_container");
        
        for (var tselected of list_time_slot[date]) {
            var timeselected = `<p class="block_time_selected">${tselected}</p>`;
            timeContainer.append(timeselected);
        }
    }
});



//------------------------------------------สร้างavailable timeslotขึ้นมา---------------------------------//
$(document).ready(function() {
    generateAvailableTime();
});



//----------------------------------เลือกวันที่ แล้วtime slot มี popup timeslotขึ้นมา------------------------//
var dateselect;
$(document).on('click', '.btn_day', function() {
    var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก

    dateselect = date; // กำหนดค่าก่อน
    
    if (!generatetimeslot(dateselect)) {  
        $(this).removeClass('selected'); // ถ้า alert() ทำงาน ให้ลบ selected ออก
        dateselect = null; // รีเซ็ตค่า
        return; 
    }

    $(this).addClass('selected'); // กดแล้วเลือก/ยกเลิก
});




//--------------------------------------------------สร้าง time slot------------------------------------//
function generatetimeslot(selectedDate) {
    let startHour, endHour;
    var today = new Date();
    let now_hours = today.getHours();
    var duration = parseInt($("#duration").val());
    
    startHour = parseInt($("#inputGroupSelect01").val());
    endHour = parseInt($("#inputGroupSelect02").val());

    if (isNaN(startHour) || isNaN(endHour)) {
        alert("Please enter a valid Available time slots.");
        return false; // คืนค่า false ให้ฟังก์ชันเรียกใช้รู้ว่าไม่สำเร็จ
    }

    if (isNaN(duration) || duration <= 0) {
        alert("Please enter a valid Duration.");
        return false;
    }

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');
    let currentDate = `${year}-${month}-${day}`;

    if (!selectedDate) {
        alert("Please select a date.");
        return false;
    }

    if (currentDate === selectedDate && startHour <= now_hours) {
        alert("The selected start time is in the current hour. It has been adjusted to the next available hour.");
        return false;
    }

    if (endHour <= startHour) {
        alert("Please choose an end time later than the start time.");
        return false;
    }

    const timeContainer = $(".select-time");
    timeContainer.empty();
    
    let starth = startHour;
    let startmin = 0;
    let endh = 0;
    let endmin = 0;

    while (starth < endHour) {
        endh = starth;
        endmin = startmin + duration;

        if (endmin >= 60) {
            endh += 1;
            endmin -= 60;
        }

        let startTimeStr = `${String(starth).padStart(2, "0")}:${String(startmin).padStart(2, "0")}`;
        let endTimeStr = `${String(endh).padStart(2, "0")}:${String(endmin).padStart(2, "0")}`;

        let slottime = `<div><button type="button" class="btn_timeslot" data-value="${startTimeStr}-${endTimeStr}">${startTimeStr}-${endTimeStr}</button></div>`;
        timeContainer.append(slottime);

        starth = endh;
        startmin = endmin;
    }

    $("#popupoverlay").css("display", "flex"); 
    return true; // คืนค่า true ถ้าทำงานสำเร็จ
}





//----------------------------------------------สร้าง ปฎิทิน-------------------------------------------//
let currentDate = new Date();
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
    
    const list_day = {
        "days": {
          "0": "Sunday",
          "1": "Monday",
          "2": "Tuesday",
          "3": "Wednesday",
          "4": "Thursday",
          "5": "Friday",
          "6": "Saturday"
        }
      }
      
    let year = currentDate.getFullYear();
    let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0 ต้อง +1
    let day = String(currentDate.getDate()).padStart(2, '0');
    let current = `${year}-${month}-${day}`;


    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); //วันแรกของเดือนยุวันอะไร
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); //วันสุดท้ายของเดือนคือวันที่เท่าไหร่
    console.log(current)
    console.log(firstDay, lastDate)

    const calender_day = $(".calender-day");
    $("#monthYear").text(`${list_month[String(currentDate.getMonth() + 1)]}  ${year}`)
    calender_day.empty();

    
    let check_today = new Date();
    if((check_today.getFullYear() == year) && (String(check_today.getMonth() + 1).padStart(2, '0') == month)){
        let curr_day = check_today.getDate();
        let dayHTML = "";
        for(let day = 0; day < firstDay; day++){
            let dayHTML = `<div></div>`;
            calender_day.append(dayHTML);
        }
        for(let day = 1; day < curr_day; day++){
            let dayHTML = `<div><button class="past_day">${day}</button></div>`;   
            calender_day.append(dayHTML);
        }
        for (let day = curr_day; day <= lastDate; day++) {
            let check_day = `${year}-${month}-${String(day).padStart(2, '0')}`;
            let dayHTML = "";
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
            let check_day = `${year}-${month}-${String(day).padStart(2, '0')}`;

            dayHTML = `<div><button class="past_day">${day}</button></div>`;
            calender_day.append(dayHTML);
        }
    }else{
        for(let day = 0; day < firstDay; day++){
            let dayHTML = `<div></div>`;
            calender_day.append(dayHTML);
        }
        for (let day = 1; day <= lastDate; day++) {
            let check_day = `${year}-${month}-${String(day).padStart(2, '0')}`;
            let dayHTML = "";
    
            if (list_time_slot.hasOwnProperty(check_day)) {
                dayHTML = `<div><button type="button" class="btn_day selected" name="${check_day}">${day}</button></div>`;
            } else {
                dayHTML = `<div><button type="button" class="btn_day" name="${check_day}">${day}</button></div>`;
            }
    
            calender_day.append(dayHTML);
        }
    }
}

generateMonth();
$("#prev_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateMonth();
});

$("#next_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateMonth();
});


/*
  //ONE ON ONE && BOOKING PAGE FUNCTION
  $("#one-on-one-add-time-slot-button").click(function () {
    const timeSlot = `
    <div class="m-5 bg-gray-100 p-5 border-1">
    <label for="date" class="ml-7">Select Datetime</label>
    <div class="flex flex-col items-center justify-center mb-4">
      <input
        class="p-2 hover:border-blue-400 hover:border-2 border-1 border-gray-300 w-[93%]"
        type="date"
        name="date"
        id="date"
        required
      />
    </div>
    <label for="start-time" class="ml-7">Start Time</label>
    <div class="flex flex-col items-center justify-center mb-4">
      <input
        class="p-2 hover:border-blue-400 hover:border-2 border-1 border-gray-300 w-[93%]"
        type="time"
        name="start_time"
        id="start-time"
        required
      />
    </div>
    <label for="end-time" class="ml-7">End Time</label>
    <div class="flex flex-col items-center justify-center mb-10">
      <input
        class="p-2 hover:border-blue-400 hover:border-2 border-1 border-gray-300 w-[93%]"
        type="time"
        name="end_time"
        id="end-time"
        required
      />
    </div>
  </div>
    `;
    $(this).after(timeSlot);
  });

  $("#one-on-one-form").submit(function (event) {
    //prevent default html form submission action
    event.preventDefault();

    //pack the inputs into a dictionary
    var formData = {};
    formData["date"] = [];
    formData["start_time"] = [];
    formData["end_time"] = [];

    $(":input, textarea").each(function () {
      var key = $(this).attr("name");
      var val = $(this).val();
      if (key === undefined) {
        return;
      }
      if (key == "date") {
        formData["date"].push(val);
      } else if (key == "start_time") {
        formData["start_time"].push(val);
      } else if (key == "end_time") {
        formData["end_time"].push(val);
      } else {
        formData[key] = val;
      }
    });
    console.log(formData);

    var $form = $(this);
    var url = "/dodle/create-form";

    $.post(url, formData, function (form_data) {
      $.getJSON(`/hashing/${form_data.title}`, function (response) {
        var hashed_title = response.hashed_title;
        console.log(hashed_title);
        window.location.href = `/dodle/${form_data.id}/${hashed_title}`; //redirect to another page while utilizing flask dynamic route feature
      });
    });
  }); */