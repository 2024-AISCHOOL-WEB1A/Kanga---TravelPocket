$(document).ready(function() {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let selectedPeople = [];
    let startDate = null;

    function parselocalstorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
    }

    $('#calendar').fullCalendar({
        header: {
            left: 'title',
            right: 'prev,next today'
        },
        timezone: 'local',
        defaultView: 'month',
        allDayDefault: false,
        allDaySlot: false,
        slotEventOverlap: true,
        slotDuration: "01:00:00",
        slotLabelInterval: "01:00:00",
        snapDuration: "00:15:00",
        contentHeight: 700,
        scrollTime: "08:00:00",
        selectable: true,
        events: function(start, end, timezone, callback) {
            let arr = parselocalstorage('events');
            callback(arr);
        },
        eventColor: '#3572EF',
        eventClick: function(calEvent, jsEvent) {
            if (confirm(`정말 이 일정을 삭제하시겠습니까 ?`)) {
                $('#calendar').fullCalendar('removeEvents', calEvent._id);
                events = events.filter(event => event.id !== calEvent.id);
                saveEvents();
            }
        },
        select: function(start, end, jsEvent) {
            if (!startDate) {
                // 시작날짜 선택
                startDate = start;
                $('#calendar').fullCalendar('unselect');
            } else {
                // 종료날짜 선택 시
                let title = prompt('일정을 입력해주세요');
                if (title) {
                    let eventData = {
                        title: title,
                        start: startDate,
                        end: end
                    };
                    $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                    events.push({
                        id: '_' + Math.random().toString(36).substr(2, 9),
                        title: title,
                        start: startDate.format(),
                        end: end.format()
                    });
                    saveEvents();
                }
                startDate = null;
                $('#calendar').fullCalendar('unselect');
            }
        },
        eventRender: function(event, element) {
            element.find('.fc-time').remove(); // 시간을 제거합니다.
        }
    });

    // 검색창을 클릭했을 때 드롭다운 메뉴 표시
    $('#search-input').on('focus', function() {
        $('#dropdown-menu').addClass('open');
    });

    // 드롭다운 메뉴의 항목을 클릭했을 때 해당 값을 검색창에 넣기
    $('#dropdown-menu .dropdown-item').on('click', function() {
        $('#search-input').val($(this).text());
        $('#dropdown-menu').removeClass('open');
    });

    // 검색창 외부를 클릭했을 때 드롭다운 메뉴 숨기기
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.autocomplete').length) {
            $('#dropdown-menu').removeClass('open');
        }
    });

    // 사람 범주 검색창을 클릭했을 때 드롭다운 메뉴 표시
    $('#people-search-input').on('focus', function() {
        $('#people-dropdown-menu').addClass('open');
    });

    // 드롭다운 메뉴의 항목을 클릭했을 때 해당 값을 검색창에 추가
    $('#people-dropdown-menu .dropdown-item').on('click', function() {
        const value = $(this).data('value');
        selectedPeople.push(value);
        $('#people-search-input').val(selectedPeople.join(', '));
        $('#people-dropdown-menu').removeClass('open');
    });

    // 검색창 외부를 클릭했을 때 드롭다운 메뉴 숨기기
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.autocomplete').length) {
            $('#people-dropdown-menu').removeClass('open');
        }
    });
});
