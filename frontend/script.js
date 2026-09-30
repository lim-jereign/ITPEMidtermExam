const venues = [
	{ venueId: 1, venueName: "Engineering Innovation Hub", building: "Engineering Building", roomName: "Room 101", capacity: 80 },
	{ venueId: 2, venueName: "University Art Gallery", building: "Fine Arts Building", roomName: "Gallery A", capacity: 60 },
	{ venueId: 3, venueName: "North Campus Garden", building: "North Campus", roomName: "Open Grounds", capacity: 100 },
	{ venueId: 4, venueName: "Rizal Lecture Theatre", building: "Rizal Hall", roomName: "Main Hall", capacity: 120 }
];

const events = [
	{
		eventId: 1,
		venueId: 1,
		eventName: "Campus Innovation Week",
		startDateTime: "2026-10-14T09:00",
		endDateTime: "2026-10-14T12:00",
		capacity: 60,
		category: "Innovation",
		featured: true,
		image: "images/event-1.png",
		imageAlt: "Students collaborating around a prototype at an innovation workshop"
	},
	{
		eventId: 2,
		venueId: 2,
		eventName: "Arts After Hours",
		startDateTime: "2026-10-17T17:30",
		endDateTime: "2026-10-17T20:00",
		capacity: 40,
		category: "Arts & Culture",
		image: "images/event-2.png",
		imageAlt: "Colorful student paintings displayed in a campus art gallery"
	},
	{
		eventId: 3,
		venueId: 3,
		eventName: "Green Campus Day",
		startDateTime: "2026-10-21T08:00",
		endDateTime: "2026-10-21T12:00",
		capacity: 50,
		category: "Community",
		image: "images/event-3.png",
		imageAlt: "Volunteers planting young trees on a green university campus"
	},
	{
		eventId: 4,
		venueId: 4,
		eventName: "Founders Forum",
		startDateTime: "2026-10-24T13:00",
		endDateTime: "2026-10-24T16:00",
		capacity: 80,
		category: "Talks",
		image: "images/event-4.png",
		imageAlt: "Guest speaker sharing ideas with students in a lecture hall"
	}
];

const users = [
	{ userId: 1, role: "Student", firstName: "Maria", lastName: "Santos", email: "maria.santos@dlsud.edu.ph", isActive: true },
	{ userId: 2, role: "Student", firstName: "John", lastName: "Reyes", email: "john.reyes@dlsud.edu.ph", isActive: true },
	{ userId: 3, role: "Student", firstName: "Angela", lastName: "Cruz", email: "angela.cruz@dlsud.edu.ph", isActive: true },
	{ userId: 4, role: "Student", firstName: "Miguel", lastName: "Dela Cruz", email: "miguel.delacruz@dlsud.edu.ph", isActive: true }
];

const registrations = [
	{ registrationId: 1, userId: 1, eventId: 1, registeredAt: "2026-09-28T10:15:00", registrationStatus: "Registered" },
	{ registrationId: 2, userId: 2, eventId: 1, registeredAt: "2026-09-28T13:40:00", registrationStatus: "Registered" },
	{ registrationId: 3, userId: 3, eventId: 2, registeredAt: "2026-09-29T09:05:00", registrationStatus: "Registered" },
	{ registrationId: 4, userId: 1, eventId: 3, registeredAt: "2026-09-29T15:20:00", registrationStatus: "Registered" },
	{ registrationId: 5, userId: 4, eventId: 4, registeredAt: "2026-09-30T08:30:00", registrationStatus: "Registered" }
];

let nextUserId = users.length + 1;
let nextRegistrationId = registrations.length + 1;

const eventGrid = document.querySelector(".event-grid");
const registrationForm = document.querySelector("#registration-form");
const eventSelect = document.querySelector("#event-select");
const attendeeEventFilter = document.querySelector("#attendee-event-filter");
const attendeesList = document.querySelector("#attendees-list");
const formStatus = document.querySelector("#form-status");

const formFields = {
	firstName: document.querySelector("#first-name"),
	lastName: document.querySelector("#last-name"),
	email: document.querySelector("#university-email"),
	event: eventSelect
};

const dateFormat = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" });
const stampFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

function createElement(tagName, className, text) {
	const element = document.createElement(tagName);
	if (className) element.className = className;
	if (text !== undefined) element.textContent = text;
	return element;
}

function formatEventRange(startValue, endValue) {
	const start = new Date(startValue);
	const end = new Date(endValue);
	return `${dateFormat.format(start)} · ${timeFormat.format(start)} – ${timeFormat.format(end)}`;
}

function getVenue(event) {
	return venues.find((venue) => venue.venueId === event.venueId);
}

// Seats are calculated from Registrations, like a COUNT query in SQL.
function getSeatsRemaining(event) {
	const taken = registrations.filter((registration) =>
		registration.eventId === event.eventId && registration.registrationStatus === "Registered"
	).length;
	return Math.max(0, event.capacity - taken);
}

function populateEventSelects() {
	const eventPlaceholder = document.createElement("option");
	eventPlaceholder.value = "";
	eventPlaceholder.textContent = "Choose an event";
	eventSelect.replaceChildren(eventPlaceholder);

	const allEventsOption = document.createElement("option");
	allEventsOption.value = "all";
	allEventsOption.textContent = "All events";
	attendeeEventFilter.replaceChildren(allEventsOption);

	for (const event of events) {
		const registrationOption = document.createElement("option");
		registrationOption.value = String(event.eventId);
		registrationOption.textContent = event.eventName;
		eventSelect.append(registrationOption);

		const filterOption = document.createElement("option");
		filterOption.value = String(event.eventId);
		filterOption.textContent = event.eventName;
		attendeeEventFilter.append(filterOption);
	}
}

function createEventCard(event) {
	const remainingSeats = getSeatsRemaining(event);
	const isFullyBooked = remainingSeats === 0;
	const article = createElement("article", "event-card");
	article.dataset.eventId = String(event.eventId);

	const image = createElement("img");
	image.src = event.image;
	image.alt = event.imageAlt;
	article.append(image);
	if (event.featured) {
		article.append(createElement("p", "featured-badge", "Featured"));
	}

	article.append(createElement("p", "event-category", event.category));
	article.append(createElement("h3", "", event.eventName));

	const details = createElement("ul", "event-details");
	details.setAttribute("aria-label", "Event details");

	const dateItem = createElement("li");
	const time = createElement("time", "", formatEventRange(event.startDateTime, event.endDateTime));
	time.dateTime = event.startDateTime;
	dateItem.append(time);
	details.append(dateItem);
	details.append(createElement("li", "", getVenue(event).venueName));
	details.append(createElement("li", "seats-remaining", isFullyBooked ? "Fully Booked" : `${remainingSeats} seats remaining`));
	article.append(details);

	const registerButton = createElement("button", "button button-secondary", isFullyBooked ? "Fully Booked" : "Register");
	registerButton.type = "button";
	registerButton.dataset.registerEvent = String(event.eventId);
	registerButton.setAttribute("aria-label", `${isFullyBooked ? "Fully booked for" : "Register for"} ${event.eventName}`);
	registerButton.disabled = isFullyBooked;
	article.append(registerButton);

	return article;
}

function renderEvents() {
	eventGrid.replaceChildren(...events.map(createEventCard));
}

function updateFieldError(field, message) {
	const fieldContainer = field.closest(".form-field");
	const errorId = `${field.id}-error`;
	let errorMessage = document.getElementById(errorId);

	field.classList.remove("error", "success");
	fieldContainer.classList.remove("error", "success");
	fieldContainer.classList.remove("has-inline-message");

	if (!message) {
		field.removeAttribute("aria-invalid");
		if (errorMessage) errorMessage.remove();
		const describedBy = (field.getAttribute("aria-describedby") || "")
			.split(/\s+/)
			.filter((id) => id && id !== errorId);
		if (describedBy.length) {
			field.setAttribute("aria-describedby", describedBy.join(" "));
		} else {
			field.removeAttribute("aria-describedby");
		}
		return;
	}

	field.setAttribute("aria-invalid", "true");
	field.classList.add("error");
	fieldContainer.classList.add("error", "has-inline-message");
	if (!errorMessage) {
		errorMessage = createElement("small", "field-error");
		errorMessage.id = errorId;
		field.insertAdjacentElement("afterend", errorMessage);
	}
	errorMessage.textContent = `Error: ${message}`;

	const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
	describedBy.add(errorId);
	field.setAttribute("aria-describedby", [...describedBy].join(" "));
}

function clearAllFieldErrors() {
	for (const field of Object.values(formFields)) {
		updateFieldError(field, "");
	}
}

function renderAttendees() {
	const selectedEventId = attendeeEventFilter.value;
	const visibleRegistrations = registrations.filter((registration) =>
		selectedEventId === "all" || String(registration.eventId) === selectedEventId
	);
	const rows = [];

	for (const registration of visibleRegistrations) {
		const user = users.find((item) => item.userId === registration.userId);
		const event = events.find((item) => item.eventId === registration.eventId);
		const row = document.createElement("tr");
		const values = [
			`${user.firstName} ${user.lastName}`,
			user.email,
			event.eventName,
			getVenue(event).venueName,
			stampFormat.format(new Date(registration.registeredAt)),
			registration.registrationStatus
		];

		for (const value of values) {
			row.append(createElement("td", "", value));
		}
		rows.push(row);
	}

	if (rows.length === 0) {
		const emptyRow = createElement("tr", "empty-attendees");
		const emptyCell = createElement("td", "", registrations.length ? "No registrations for this event." : "No registrations yet.");
		emptyCell.colSpan = 6;
		emptyRow.append(emptyCell);
		rows.push(emptyRow);
	}

	attendeesList.replaceChildren(...rows);
}

function validateName(value, requiredMessage) {
	if (!value) return requiredMessage;
	if (value.length > 100) return "Use 100 characters or fewer.";
	if (!/^[\p{L}][\p{L} '.-]*$/u.test(value)) return "Use letters, spaces, hyphens, or apostrophes only.";
	return "";
}

function handleRegistrationSubmit(submitEvent) {
	submitEvent.preventDefault();
	formStatus.textContent = "";
	clearAllFieldErrors();

	const firstName = formFields.firstName.value.trim();
	const lastName = formFields.lastName.value.trim();
	const email = formFields.email.value.trim();
	const selectedEvent = events.find((event) => String(event.eventId) === formFields.event.value);
	const errors = [];

	const firstNameError = validateName(firstName, "Enter your first name.");
	if (firstNameError) errors.push([formFields.firstName, firstNameError]);

	const lastNameError = validateName(lastName, "Enter your last name.");
	if (lastNameError) errors.push([formFields.lastName, lastNameError]);

	// Mirrors CK_Users_Email (no spaces, one @) plus the school domain rule.
	if (!email) {
		errors.push([formFields.email, "Enter your university email."]);
	} else if (email.length > 255) {
		errors.push([formFields.email, "Use 255 characters or fewer."]);
	} else if (!/^[^\s@]+@dlsud\.edu\.ph$/i.test(email)) {
		errors.push([formFields.email, "Use an email address ending in @dlsud.edu.ph."]);
	}

	// Mirrors UQ_Users_Email and UQ_Registrations_User_Event.
	const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
	const existingRegistration = existingUser && selectedEvent
		? registrations.find((item) => item.userId === existingUser.userId && item.eventId === selectedEvent.eventId)
		: undefined;

	if (!selectedEvent) {
		errors.push([formFields.event, "Choose an event."]);
	} else if (existingRegistration && existingRegistration.registrationStatus === "Registered") {
		errors.push([formFields.event, "You are already registered for this event."]);
	} else if (getSeatsRemaining(selectedEvent) === 0) {
		errors.push([formFields.event, "This event is fully booked. Choose another event."]);
	}

	for (const [field, message] of errors) {
		updateFieldError(field, message);
	}

	if (errors.length > 0) {
		formStatus.textContent = `Please correct ${errors.length === 1 ? "the highlighted field" : "the highlighted fields"} and try again.`;
		errors[0][0].focus();
		return;
	}

	let user = existingUser;
	if (!user) {
		user = { userId: nextUserId++, role: "Student", firstName, lastName, email, isActive: true };
		users.push(user);
	}

	if (existingRegistration) {
		// A cancelled registration is reactivated instead of duplicated.
		existingRegistration.registrationStatus = "Registered";
		existingRegistration.registeredAt = new Date().toISOString();
	} else {
		registrations.push({
			registrationId: nextRegistrationId++,
			userId: user.userId,
			eventId: selectedEvent.eventId,
			registeredAt: new Date().toISOString(),
			registrationStatus: "Registered"
		});
	}

	renderEvents();
	renderAttendees();
	formStatus.textContent = `Registration complete for ${selectedEvent.eventName}.`;
	registrationForm.reset();
	clearAllFieldErrors();
}

eventGrid.addEventListener("click", (clickEvent) => {
	const registerButton = clickEvent.target.closest("button[data-register-event]");
	if (!registerButton || registerButton.disabled) return;

	eventSelect.value = registerButton.dataset.registerEvent;
	updateFieldError(formFields.event, "");
	formStatus.textContent = "";
	document.querySelector("#register").scrollIntoView({
		behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
	});
});

registrationForm.noValidate = true;
registrationForm.addEventListener("submit", handleRegistrationSubmit);
attendeeEventFilter.addEventListener("change", renderAttendees);

populateEventSelects();
renderEvents();
renderAttendees();