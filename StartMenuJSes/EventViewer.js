// EventViewer.js
const eventSources = ['System', 'Application', 'Security', 'Setup'];
const eventTypes = ['Error', 'Warning', 'Information'];
let events = [];
let currentFilter = 'all';

function openEventViewer() {
    generateInitialEvents();
    const eventContent = `
        <div class="event-viewer">
            <div class="toolbar mb-3">
                <div class="btn-group">
                    <button class="btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" 
                        onclick="filterEvents('all')">All</button>
                    <button class="btn btn-sm ${currentFilter === 'error' ? 'btn-danger' : 'btn-secondary'}" 
                        onclick="filterEvents('error')">Errors</button>
                    <button class="btn btn-sm ${currentFilter === 'warning' ? 'btn-warning' : 'btn-secondary'}" 
                        onclick="filterEvents('warning')">Warnings</button>
                </div>
                <input type="text" class="search-box" placeholder="Search events..." oninput="searchEvents(this.value)">
            </div>
            
            <div class="event-list">
                <div class="event-list-header">
                    <div>Level</div>
                    <div>Date and Time</div>
                    <div>Source</div>
                    <div>Event ID</div>
                    <div>Message</div>
                </div>
                <div class="event-list-body" id="eventList">
                    ${renderEvents(events)}
                </div>
            </div>
            
            <div class="event-details mt-3">
                <h5>Event Details</h5>
                <div id="eventDetails" class="p-2"></div>
            </div>
        </div>
    `;

    createWindow('event-viewer', 'Event Viewer', eventContent);
    startEventGenerator();
}

function generateInitialEvents() {
    events = Array.from({length: 20}, (_, i) => generateEvent());
}

function generateEvent() {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    return {
        id: Date.now() + Math.random(),
        date: new Date().toLocaleString(),
        type: type,
        source: eventSources[Math.floor(Math.random() * eventSources.length)],
        eventId: Math.floor(1000 + Math.random() * 9000),
        message: generateEventMessage(type)
    };
}

function generateEventMessage(type) {
    const messages = {
        Error: [
            'The system has rebooted without cleanly shutting down first',
            'Disk write error at sector 0x${Math.floor(Math.random()*1000)}',
            'Service failed to start due to logon failure'
        ],
        Warning: [
            'DNS registration for network adapter failed',
            'Windows license will expire soon',
            'Printer driver installation incomplete'
        ],
        Information: [
            'Service started successfully',
            'System time synchronized with time server',
            'User login successful'
        ]
    };
    return messages[type][Math.floor(Math.random() * messages[type].length)];
}

function renderEvents(eventsToRender) {
    return eventsToRender.map(event => `
        <div class="event-item ${event.type.toLowerCase()}" onclick="showEventDetails(${event.id})">
            <div class="event-type">${event.type}</div>
            <div>${event.date}</div>
            <div>${event.source}</div>
            <div>${event.eventId}</div>
            <div class="event-message">${event.message}</div>
        </div>
    `).join('');
}

function filterEvents(type) {
    currentFilter = type;
    let filtered = events;
    if (type !== 'all') {
        filtered = events.filter(e => e.type.toLowerCase() === type);
    }
    document.getElementById('eventList').innerHTML = renderEvents(filtered);
    updateActiveFilterButtons();
}

function searchEvents(query) {
    const filtered = events.filter(e => 
        e.message.toLowerCase().includes(query.toLowerCase()) ||
        e.source.toLowerCase().includes(query.toLowerCase())
    );
    document.getElementById('eventList').innerHTML = renderEvents(filtered);
}

function updateActiveFilterButtons() {
    document.querySelectorAll('.toolbar button').forEach(btn => {
        btn.className = btn.className.replace('btn-primary', 'btn-secondary')
                                   .replace('btn-danger', 'btn-secondary')
                                   .replace('btn-warning', 'btn-secondary');
        if (btn.textContent.toLowerCase() === currentFilter) {
            btn.className += currentFilter === 'error' ? ' btn-danger' : 
                            currentFilter === 'warning' ? ' btn-warning' : ' btn-primary';
        }
    });
}

function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    document.getElementById('eventDetails').innerHTML = `
        <div><strong>Event ID:</strong> ${event.eventId}</div>
        <div><strong>Level:</strong> ${event.type}</div>
        <div><strong>Date:</strong> ${event.date}</div>
        <div><strong>Source:</strong> ${event.source}</div>
        <div><strong>Description:</strong> ${event.message}</div>
    `;
}

function startEventGenerator() {
    setInterval(() => {
        const newEvent = generateEvent();
        events.unshift(newEvent);
        if (currentFilter === 'all' || newEvent.type.toLowerCase() === currentFilter) {
            const eventList = document.getElementById('eventList');
            eventList.insertAdjacentHTML('afterbegin', `
                <div class="event-item ${newEvent.type.toLowerCase()}" 
                     onclick="showEventDetails(${newEvent.id})"
                     style="opacity: 0; transform: translateY(-20px);">
                    <div class="event-type">${newEvent.type}</div>
                    <div>${newEvent.date}</div>
                    <div>${newEvent.source}</div>
                    <div>${newEvent.eventId}</div>
                    <div class="event-message">${newEvent.message}</div>
                </div>
            `);
            setTimeout(() => {
                eventList.firstElementChild.style.opacity = '1';
                eventList.firstElementChild.style.transform = 'translateY(0)';
            }, 10);
        }
    }, 3000);
}

// Add Event Viewer styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .event-viewer {
            background: #c0c0c0;
            padding: 15px;
        }
        .toolbar {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        .search-box {
            border: 2px solid #808080;
            padding: 2px 5px;
        }
        .event-list {
            background: white;
            border: 2px solid #808080;
        }
        .event-list-header {
            display: grid;
            grid-template-columns: 100px 160px 120px 80px 1fr;
            padding: 5px;
            background: #000080;
            color: white;
            font-weight: bold;
        }
        .event-item {
            display: grid;
            grid-template-columns: 100px 160px 120px 80px 1fr;
            padding: 5px;
            border-bottom: 1px solid #808080;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .event-item:hover {
            background: #000080;
            color: white;
        }
        .event-type {
            font-weight: bold;
        }
        .error .event-type {
            color: #c00000;
        }
        .warning .event-type {
            color: #808000;
        }
        .information .event-type {
            color: #000080;
        }
        .event-details {
            background: white;
            border: 2px solid #808080;
            min-height: 100px;
        }
    `;
    document.head.appendChild(style);
});