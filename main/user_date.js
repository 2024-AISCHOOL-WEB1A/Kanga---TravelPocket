document.addEventListener('DOMContentLoaded', function () {
    function createCalendar(year, month) {
        var calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; 

        var firstDay = new Date(year, month).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();


        for (let i = 0; i < firstDay; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'day';
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            var dayCell = document.createElement('div');
            dayCell.className = 'day';
            dayCell.innerHTML = `<span>${day}</span>`;
            dayCell.setAttribute('data-date', `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
            calendar.appendChild(dayCell);
        }
    }

    function addEvent(eventData) {
        var startDate = new Date(eventData.start);
        var endDate = new Date(eventData.end);
        var calendarDays = document.querySelectorAll('.day');

        calendarDays.forEach(function (day) {
            var dayDate = new Date(day.getAttribute('data-date'));
            if (dayDate >= startDate && dayDate <= endDate) {
                var eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = eventData.title;
                day.appendChild(eventElement);
            }
        });
    }

    var today = new Date();
    createCalendar(today.getFullYear(), today.getMonth());

    document.getElementById('addEventButton').addEventListener('click', function () {
        $("#calendarModal").modal("show");

        $("#addCalendar").off('click').on("click", function () {
            var content = $("#calendar_content").val();
            var start_date = $("#calendar_start_date").val();
            var end_date = $("#calendar_end_date").val();

            if (content == null || content == "") {
                alert("내용을 입력하세요.");
            } else if (start_date == "" || end_date == "") {
                alert("날짜를 입력하세요.");
            } else if (new Date(end_date) - new Date(start_date) < 0) {
                alert("종료일이 시작일보다 먼저입니다.");
            } else {
                var eventData = {
                    title: content,
                    start: start_date,
                    end: end_date
                };
                addEvent(eventData);
                $("#calendarModal").modal("hide");
            }
        });
    });
});