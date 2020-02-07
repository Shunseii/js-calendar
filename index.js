const EVENT_ITEM_WIDTH = 590;
const EVENT_ITEM_PADDING = 10;
const EVENT_ITEM_LEFT = EVENT_ITEM_PADDING;

class EventItem {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.height = this.end - this.start;
        this.width = EVENT_ITEM_WIDTH;
        this.left = EVENT_ITEM_LEFT;
    }

    isOverlapping = (event) => {
        if (event.start <= this.start && event.end >= this.end) {
            return true;
        } else if (event.start <= this.start && event.end > this.start) {
            return true;
        } else if (event.start >= this.start && event.start < this.end) {
            return true;
        }

        return false;
    }

    hasBeenResized = () => {
        return this.width < EVENT_ITEM_WIDTH;
    }

    hasBeenShifted = () => {
        return this.left > EVENT_ITEM_LEFT;
    }

    splitWidth = (ratio) => {
        this.width = this.width / ratio - EVENT_ITEM_PADDING / ratio;
    }

    shiftRight = (shiftAmnt) => {
        this.left += shiftAmnt + EVENT_ITEM_PADDING;
    }
}

function convertTimeTo12Hour(time) {
    const hour = Math.floor(time / 100);
    const minutes = ((time % 100) / 100) * 60;
    const period = (hour >= 12 ? "PM" : "AM");

    return {
        hour: (hour > 12 ? hour - 12 : hour),
        minutes,
        period
    };
}

function loadTimeContainer() {
    const timeContainer = document.getElementsByClassName("time-container")[0];

    for (let time = 900; time <= 2100; time += 50) {
        const timeTag = document.createElement("p");
        timeTag.className = "time-slot";

        const { hour, minutes, period } = convertTimeTo12Hour(time);

        if (minutes > 10) {
            timeTag.innerHTML = `
                <span class="time-aux secondary">${hour}:${minutes}</span>
            `;
        } else {
            timeTag.innerHTML = `
                <span class="time-main">${hour}:${minutes + "0"}</span>
                <span class="time-period secondary">${period}</span>
            `;
        }

        timeTag.innerHTML += `<span class="time-tick">–</span>`;
        timeContainer.appendChild(timeTag);
    }
}

function createEventItem(startTime, height,
    width = EVENT_ITEM_WIDTH, left = EVENT_ITEM_LEFT) {
    const eventTitle = document.createElement("h3");
    const eventLocation = document.createElement("p");
    const eventItem = document.createElement("div");

    eventTitle.className = "event-title";
    eventTitle.innerText = "Sample Item";

    eventLocation.className = "event-location";
    eventLocation.innerText = "Sample Location";

    eventItem.appendChild(eventTitle);
    eventItem.appendChild(eventLocation);

    eventItem.className = "event-box";
    eventItem.style.height = height + "px";
    eventItem.style.width = width + "px";
    eventItem.style.top = startTime + "px";
    eventItem.style.left = left + "px";

    document.getElementsByClassName("events-container")[0].appendChild(eventItem);
}

function resetLayout() {
    const eventContainer = document.getElementsByClassName("events-container")[0];
    let childCount = eventContainer.childElementCount;

    while (childCount > 0) {
        eventContainer.removeChild(eventContainer.lastChild);
        --childCount;
    }
}

function layOutEvents(events) {
    const eventItems = events
        .map(
            event => new EventItem(event.start, event.end)
        ).sort((eventA, eventB) => (
            eventB.height - eventA.height
        ));

    for (let i = 0; i < eventItems.length; ++i) {
        for (let j = i - 1; j >= 0; --j) {
            if (eventItems[i].isOverlapping(eventItems[j])) {
                if (!eventItems[j].hasBeenResized()) {
                    eventItems[j].splitWidth(2);
                }

                if (!eventItems[i].hasBeenShifted()) {
                    eventItems[i].splitWidth(2);

                    if (!eventItems[j].hasBeenShifted()) {
                        eventItems[i].shiftRight(eventItems[i].width);
                    }
                }
            }
        }
    }

    resetLayout();

    for (let i = 0; i < eventItems.length; ++i) {
        const { start, height, width, left } = eventItems[i];

        createEventItem(
            start,
            height,
            width,
            left
        );
    }
}

const test1 = [
    { start: 0, end: 300 },
    { start: 420, end: 720 },
    { start: 290, end: 450 }
];

const test2 = [
    { start: 0, end: 360 },
    { start: 0, end: 120 },
    { start: 300, end: 720 },
    { start: 600, end: 660 },
    { start: 420, end: 540 },
    { start: 180, end: 270}
];

const test3 = [
    { start: 30, end: 150 },
    { start: 540, end: 600 },
    { start: 560, end: 620 },
    { start: 610, end: 670 }
];

layOutEvents(test3);
loadTimeContainer();