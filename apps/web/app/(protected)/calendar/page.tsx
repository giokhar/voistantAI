"use client";

import { useState, useCallback, useMemo } from "react";
import { Calendar as BigCalendar, Views, type View } from "react-big-calendar";
import { format, setHours, setMinutes, addDays } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { Card, CardContent, CardHeader } from "@packages/ui/components/card";
import { Button } from "@packages/ui/components/button";
import { Plus } from "lucide-react";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { type CalendarEvent, type EventType, type EventFormData } from "./types";
import {
  localizer,
  getUserTimezone,
  createSampleEvents,
  getDefaultEventForm,
  isBookableSlot,
  isWorkingHour,
  isWorkingDay,
} from "./utils";
import { CalendarToolbar, CalendarLegend, EventDialog, ViewEventDialog, CalendarStyles } from "@/components/calendar";

export default function CalendarPage() {
  // Calendar state
  const [events, setEvents] = useState<CalendarEvent[]>(createSampleEvents);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [userTimezone] = useState(getUserTimezone());
  const [eventIdCounter, setEventIdCounter] = useState(100);

  // Dialog states
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form state
  const [eventForm, setEventForm] = useState<EventFormData>(getDefaultEventForm());

  // Navigation handlers
  const onNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const onView = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const navigateBack = useCallback(() => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === Views.WEEK || view === Views.WORK_WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === Views.DAY) {
      newDate.setDate(newDate.getDate() - 1);
    }
    setDate(newDate);
  }, [date, view]);

  const navigateForward = useCallback(() => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === Views.WEEK || view === Views.WORK_WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === Views.DAY) {
      newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  }, [date, view]);

  const goToToday = useCallback(() => {
    setDate(new Date());
  }, []);

  // Event handlers
  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    const isInWorkingHours = isBookableSlot(start);
    const startHour = start.getHours();
    let endHour = end.getHours();

    if (endHour <= startHour) {
      endHour = Math.min(startHour + 1, 23);
    }

    setEventForm({
      title: "",
      description: "",
      date: start,
      endDate: undefined,
      startTime: `${startHour.toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`,
      endTime: `${endHour.toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`,
      allDay: false,
      showAs: isInWorkingHours ? "busy" : "out-of-office",
    });
    setIsEventDialogOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  }, []);

  const handleSaveEvent = useCallback(() => {
    if (!eventForm.title.trim()) return;

    const eventStartDate = eventForm.date;
    const eventEndDate = eventForm.allDay && eventForm.endDate ? eventForm.endDate : eventStartDate;

    let startDate: Date;
    let endDate: Date;

    if (eventForm.allDay) {
      startDate = setMinutes(setHours(eventStartDate, 0), 0);
      endDate = addDays(setMinutes(setHours(eventEndDate, 0), 0), 1);
    } else {
      const [startHour, startMinute] = eventForm.startTime.split(":").map(Number);
      const [endHour, endMinute] = eventForm.endTime.split(":").map(Number);
      startDate = setMinutes(setHours(eventStartDate, startHour), startMinute);
      endDate = setMinutes(setHours(eventStartDate, endHour), endMinute);
    }

    const startUTC = fromZonedTime(startDate, userTimezone);
    const endUTC = fromZonedTime(endDate, userTimezone);

    const eventType: EventType =
      eventForm.showAs === "out-of-office" ? "time-off" : eventForm.showAs === "free" ? "availability" : "appointment";

    const event: CalendarEvent = {
      id: editingEventId || String(eventIdCounter),
      title: eventForm.title.trim(),
      description: eventForm.description,
      start: toZonedTime(startUTC, userTimezone),
      end: toZonedTime(endUTC, userTimezone),
      allDay: eventForm.allDay,
      timezone: userTimezone,
      eventType,
      showAs: eventForm.showAs,
    };

    if (editingEventId) {
      setEvents((prev) => prev.map((e) => (e.id === editingEventId ? event : e)));
    } else {
      setEventIdCounter((prev) => prev + 1);
      setEvents((prev) => [...prev, event]);
    }

    setIsEventDialogOpen(false);
    resetEventForm();
  }, [eventForm, editingEventId, eventIdCounter, userTimezone]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setIsViewDialogOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setIsViewDialogOpen(false);
    setEditingEventId(event.id);

    const eventEndDate = event.allDay ? addDays(event.end, -1) : event.end;

    const isMultiDay = event.allDay && format(event.start, "yyyy-MM-dd") !== format(eventEndDate, "yyyy-MM-dd");

    setEventForm({
      title: event.title,
      description: event.description || "",
      date: event.start,
      endDate: isMultiDay ? eventEndDate : undefined,
      startTime: format(event.start, "HH:mm"),
      endTime: format(event.allDay ? event.start : event.end, "HH:mm"),
      allDay: event.allDay || false,
      showAs: event.showAs || "busy",
    });
    setIsEventDialogOpen(true);
  }, []);

  const resetEventForm = useCallback(() => {
    setEventForm(getDefaultEventForm());
    setEditingEventId(null);
  }, []);

  const handleEventDialogClose = useCallback(
    (open: boolean) => {
      setIsEventDialogOpen(open);
      if (!open) resetEventForm();
    },
    [resetEventForm],
  );

  const handleCancelEventDialog = useCallback(() => {
    setIsEventDialogOpen(false);
    resetEventForm();
  }, [resetEventForm]);

  // Calendar prop getters
  const { defaultDate } = useMemo(() => ({ defaultDate: new Date() }), []);

  const slotPropGetter = useCallback((date: Date) => {
    if (isWorkingHour(date)) {
      return { className: "rbc-working-hours" };
    }
    return { className: "rbc-non-working-hours" };
  }, []);

  const dayPropGetter = useCallback((date: Date) => {
    if (!isWorkingDay(date)) {
      return { className: "rbc-non-working-day" };
    }
    return {};
  }, []);

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    const showAs = event.showAs || "busy";
    return { className: `rbc-event-${showAs}` };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments</p>
        </div>
        <Button
          onClick={() => {
            resetEventForm();
            setIsEventDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader className="pb-4">
          <CalendarToolbar
            date={date}
            view={view}
            onViewChange={setView}
            onNavigateBack={navigateBack}
            onNavigateForward={navigateForward}
            onGoToToday={goToToday}
          />
        </CardHeader>
        <CardContent>
          <CalendarLegend />
          <div className="h-[600px] calendar-container">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultDate={defaultDate}
              date={date}
              view={view}
              views={[Views.DAY, Views.WORK_WEEK, Views.WEEK, Views.MONTH]}
              onNavigate={onNavigate}
              onView={onView}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              popup
              toolbar={false}
              style={{ height: "100%" }}
              slotPropGetter={slotPropGetter}
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventPropGetter}
              scrollToTime={setHours(setMinutes(new Date(), 0), 8)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Event Dialog */}
      <EventDialog
        open={isEventDialogOpen}
        onOpenChange={handleEventDialogClose}
        formData={eventForm}
        onFormChange={setEventForm}
        onSave={handleSaveEvent}
        onCancel={handleCancelEventDialog}
        isEditing={!!editingEventId}
      />

      {/* View Event Dialog */}
      <ViewEventDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        event={selectedEvent}
        userTimezone={userTimezone}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Calendar Styles */}
      <CalendarStyles />
    </div>
  );
}
