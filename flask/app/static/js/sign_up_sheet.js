//----------------------------------------ปุ่ม create group poll-------------------------------------------//
var formId;
var hashed_title;
$("#submit_group_form").click(function (){
    var all_data = {};
    all_data['title'] = $("#title").val();
    all_data['description'] = $("#description").val();
    all_data['location'] = $("#location").val();
    all_data['form_type'] = 'sign-up-sheet';
    all_data['duration'] = $('#duration').val();
    all_data["date"] = [];
    all_data["start_time"] = [];
    all_data["end_time"] = [];
    all_data["seats"] = [];

    $('#form_session').find('input, button').each(function() {
      var key = $(this).attr('name'); // ดึง attribute name ของ element
      console.log(key);
      if (key == 'date'){
        all_data['date'].push($(this).text());
      }else if (key == 'time'){
        var time_split = $(this).text().split('-');
        console.log(time_split);
        all_data['start_time'].push(time_split[0]);
        all_data['end_time'].push(time_split[1]);
      }else if (key == 'seats'){
        all_data['seats'].push($(this).val().trim());
      }
    });

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

    let num_date = new Set();  // ใช้ Set เพื่อเก็บวันแบบไม่ซ้ำ

    for (var i = 0; i < all_data['date'].length; i++) {
      let date = all_data['date'][i];
      num_date.add(date);  // เพิ่มวันที่เข้าไปใน Set
    }
    
    console.log(formId, 'formmmmmmmmid');
    num_date = num_date.size;
    var url = "/dodle/create-form";
    var all_datas = all_data;
    if (formId) {
      all_data['id'] = formId;
      $.post(url, all_data, function (response_data) {
        console.log('respondata',response_data);
        $.getJSON(`/hashing/${all_data.title}`, function (response) {
          hashed_title = response.hashed_title;
          var block = $('.all_data');
          block.empty()
          var about_time = `
                  <div class='duration_row'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <p>${all_data['duration']}</p>
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
                      <p>${all_datas['start_time'].length} times on ${num_date} days</p>  
                  </div>
          `;
          block.append(about_time);
          for (var i = 0; i < all_datas['date'].length; i++) {
            let date = all_datas['date'][i];
            let start_t = all_datas['start_time'][i];
            let end_t = all_datas['end_time'][i];
            let seat = all_datas['seats'][i];
            var new_text = `
                <div class='all_day_se'>
                  <p><b>${date}</b> : ${start_t} - ${end_t}</p>
                  <p><b>Seat</b> : ${seat}</p>
                </div>
            `;
            block.append(new_text);
          }
        });
      });
    }else{
      $.post(url, all_data, function (response_data) {
        formId = response_data.id; // เก็บ ID ของฟอร์ม
        $.getJSON(`/hashing/${all_data.title}`, function (response) {
          hashed_title = response.hashed_title;
          var block = $('.all_data');
          block.empty()
          var about_time = `
                  <div class='duration_row'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width='20' height='20' class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <p>${all_data['duration']}</p>
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
                      <p>${all_datas['start_time'].length} times on ${num_date} days</p>  
                  </div>
          `;
          block.append(about_time);

          for (var i = 0; i < all_datas['date'].length; i++) {
            let date = all_datas['date'][i];
            let start_t = all_datas['start_time'][i];
            let end_t = all_datas['end_time'][i];
            let seat = all_datas['seats'][i];
            var new_text = `
                <div class='all_day_se'>
                  <p><b>${date}</b> : ${start_t} - ${end_t}</p>
                  <p><b>Seat</b> : ${seat}</p>
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
  //console.log('formiddddd',formId)
  $("#popupoverlay_link").css("display", "none");
});


//----------------------------------------------btn back to home -------------------------------------------//
$('#back_to_home').click(function(){
  window.location.href = `/dodle/home`;
});


//--------------------------------------- เพิ่ม session time เข้าไป-------------------------------//
$(document).ready(function() {
  $("#add_session").click(function() {
      // นับ session ภายใน container เท่านั้น
      let sessionCount = $("#session-container .session_time").length;
      console.log("Total Sessions:", sessionCount);
      let new_sess = sessionCount + 1;
      
      // สร้าง session ใหม่
      let newSession = $(`
        <div id="session-${new_sess}" data-session-id="${new_sess}" class="session_time">
          <!-- content ของ session ใหม่ -->
          <div class="row session_sign_up">
              <div class="col-md-4 select_calender">
                  <button type="button" class="open_calender" id="select-date-${new_sess}" name='date'>
                      Select Date
                  </button>
              </div>
              <div class="col-md-4">
                  <button class="open_timeslot" type="button" id="select-time-${new_sess}" name='time'>
                      Select Time
                  </button>
              </div>
              <div class="col-md-4">
                  <input type="text" value="5" name="seats" id="seats-${new_sess}">
              </div>
          </div>
        </div>
      `);      
      // Append session ใหม่เข้าไปใน container
      $("#session-container").append(newSession);
  });
});


//----------------------------------pop up   time slot-----------------------------------------------//
let curr_session_id;
$(document).on('click', '.open_timeslot', function(){
  let sessionDiv = $(this).closest("[data-session-id]");
  curr_session_id = sessionDiv.data("session-id");
  generatetimeslot(dateselect);
});

$('#btn_close_timeslot').click(function(){
  $("#popupoverlay").css("display", "none"); 
});


//--------------------------------------เลือกเวลาtimeslot กดปุ่มแล้วเพิ่มคลาส selected------------------------//
$(document).on('click', '.btn_timeslot', function() {
    var timeslot = $(this).data("value");
    $(`#select-time-${curr_session_id}`).text(timeslot);
    $("#popupoverlay").css("display", "none"); 
});



//----------------------------------เลือกวันที่ -----------------------------------------------//
var dateselect;
$(document).on('click', '.btn_day', function() {
    var date = $(this).attr("name"); // ดึงค่า 'name' ของปุ่มที่ถูกคลิก
    $(`#select-date-${curr_session_id}`).text(date);
    $("#popupoverlay_calender").css("display", "none"); 
    dateselect = date; // กำหนดค่าให้ตัวแปรก่อน
    console.log(dateselect);
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






$(document).on("click", ".open_calender", function () {
  let sessionDiv = $(this).closest("[data-session-id]");
  curr_session_id = sessionDiv.data("session-id");
  generateMonth();
  console.log('session_num',curr_session_id);
});

$("#prev_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateMonth();
});

$("#next_month").on("click", function(){
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateMonth();
});

$('#btn_close_calender').on('click', function(){
  $("#popupoverlay_calender").css("display", "none"); 
});

//----------------------------------------------สร้าง ปฎิทิน-------------------------------------------//
let currentDate = new Date();
let list_time_slot = {};
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

            dayHTML = `<div><button class="past_day">${day}</ิ></div>`;
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
    $("#popupoverlay_calender").css("display", "flex"); 
}




//------------------------------------------สร้างavailable timeslotขึ้นมา---------------------------------//
$(document).ready(function() {
  generateAvailableTime();
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


/*

// SIGN-UP-SHEET PAGE FUNCTION
$("#sign-up-sheet-add-a-session-button").click(function () {
  const timeSlot = `
  <div class="m-5 bg-gray-100 p-5 border-1">
  <label for="date" class="ml-7">Date</label>
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
  <label for="seats" class="ml-7">Seats</label>
  <div class="flex flex-col items-center justify-center mb-10">
    <input
      class="p-2 hover:border-blue-400 hover:border-2 border-1 border-gray-300 w-[93%]"
      type="number"
      name="seats"
      id="seats"
      required
    />
  </div>
</div>
  `;
  $(this).after(timeSlot);
});

$("#sign-up-sheet-form").submit(function (event) {
  //prevent default html form submission action
  event.preventDefault();

  //pack the inputs into a dictionary
  var formData = {};
  formData["date"] = [];
  formData["start_time"] = [];
  formData["end_time"] = [];
  formData["seats"] = [];

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
    } else if (key == "seats") {
      formData["seats"].push(val);
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

