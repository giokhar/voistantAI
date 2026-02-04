"use client";

export function CalendarStyles() {
  return (
    <style jsx global>{`
      /* Base calendar styles */
      .calendar-container .rbc-calendar {
        font-family: inherit;
        background: transparent;
      }

      /* Header row with day names */
      .calendar-container .rbc-header {
        padding: 12px 4px;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--muted-foreground);
        background: var(--muted);
        border-bottom: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-header + .rbc-header {
        border-left: 1px solid var(--border) !important;
      }

      /* Week/Day view header - show date number prominently */
      .calendar-container .rbc-time-view .rbc-row:first-child .rbc-header {
        padding: 10px 4px 12px;
        min-height: auto;
        overflow: visible;
      }
      .calendar-container .rbc-time-view .rbc-button-link {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--muted-foreground);
        font-weight: 600;
        white-space: nowrap;
        overflow: visible;
      }
      /* Today's header in time view */
      .calendar-container .rbc-time-view .rbc-header.rbc-today .rbc-button-link {
        color: var(--primary);
      }

      /* Main calendar views */
      .calendar-container .rbc-month-view {
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        overflow: hidden;
        background: var(--card);
      }
      .calendar-container .rbc-time-view {
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        overflow: hidden;
        background: var(--card);
      }

      /* Day backgrounds */
      .calendar-container .rbc-day-bg {
        background: var(--background);
        transition: background 0.15s ease;
      }
      .calendar-container .rbc-day-bg:hover {
        background: var(--accent);
      }
      .calendar-container .rbc-day-bg + .rbc-day-bg {
        border-left: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-off-range-bg {
        background: var(--muted);
      }
      .calendar-container .rbc-today {
        background: color-mix(in oklch, var(--primary) 4%, transparent) !important;
      }

      /* Today column highlight in week/day views - very subtle */
      .calendar-container .rbc-time-header .rbc-header.rbc-today {
        background: color-mix(in oklch, var(--primary) 6%, var(--muted)) !important;
        box-shadow: inset 0 -2px 0 var(--primary);
      }
      .calendar-container .rbc-day-slot.rbc-today .rbc-timeslot-group {
        background: color-mix(in oklch, var(--primary) 2%, transparent) !important;
      }
      .calendar-container .rbc-day-slot.rbc-today .rbc-working-hours {
        background: color-mix(in oklch, var(--primary) 3%, var(--background)) !important;
      }
      .calendar-container .rbc-day-slot.rbc-today .rbc-non-working-hours {
        background: color-mix(in oklch, var(--primary) 3%, oklch(0.92 0.005 265)) !important;
      }
      .dark .calendar-container .rbc-day-slot.rbc-today .rbc-non-working-hours {
        background: color-mix(in oklch, var(--primary) 3%, oklch(0.18 0.008 265)) !important;
      }

      /* Month rows */
      .calendar-container .rbc-month-row {
        border-top: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-month-row + .rbc-month-row {
        border-top: 1px solid var(--border) !important;
      }

      /* Date cells */
      .calendar-container .rbc-date-cell {
        padding: 6px 10px;
        text-align: right;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--foreground);
      }
      .calendar-container .rbc-date-cell.rbc-off-range {
        color: var(--muted-foreground);
      }
      .calendar-container .rbc-date-cell.rbc-now {
        font-weight: 700;
      }
      .calendar-container .rbc-date-cell.rbc-now > a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: var(--primary);
        color: var(--primary-foreground);
        border-radius: 50%;
      }

      /* Base event styling */
      .calendar-container .rbc-event {
        border: none !important;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.15s ease;
        border-left: 4px solid !important;
      }
      .calendar-container .rbc-event:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      .calendar-container .rbc-event:focus {
        outline: 2px solid var(--ring);
        outline-offset: 2px;
      }
      .calendar-container .rbc-event.rbc-selected {
        opacity: 0.9;
      }
      .calendar-container .rbc-event-content {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Busy - Slate Indigo (premium) */
      .calendar-container .rbc-event-busy {
        background: oklch(0.95 0.02 265) !important;
        border-left-color: oklch(0.52 0.14 265) !important;
        color: oklch(0.3 0.06 265) !important;
      }
      .calendar-container .rbc-event-busy:hover {
        background: oklch(0.9 0.03 265) !important;
      }
      .dark .calendar-container .rbc-event-busy {
        background: oklch(0.26 0.035 265) !important;
        color: oklch(0.9 0.02 265) !important;
      }
      .dark .calendar-container .rbc-event-busy:hover {
        background: oklch(0.3 0.04 265) !important;
      }

      /* Free - Teal (premium) */
      .calendar-container .rbc-event-free {
        background: oklch(0.95 0.025 175) !important;
        border-left-color: oklch(0.52 0.11 175) !important;
        color: oklch(0.3 0.05 175) !important;
      }
      .calendar-container .rbc-event-free:hover {
        background: oklch(0.9 0.035 175) !important;
      }
      .dark .calendar-container .rbc-event-free {
        background: oklch(0.26 0.035 175) !important;
        color: oklch(0.9 0.02 175) !important;
      }
      .dark .calendar-container .rbc-event-free:hover {
        background: oklch(0.3 0.04 175) !important;
      }

      /* Tentative - Amber stripes (premium) */
      .calendar-container .rbc-event-tentative {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.96 0.02 70),
          oklch(0.96 0.02 70) 4px,
          oklch(0.88 0.07 70) 4px,
          oklch(0.88 0.07 70) 8px
        ) !important;
        border-left-color: oklch(0.55 0.14 70) !important;
        color: oklch(0.3 0.06 70) !important;
      }
      .calendar-container .rbc-event-tentative:hover {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.93 0.025 70),
          oklch(0.93 0.025 70) 4px,
          oklch(0.84 0.09 70) 4px,
          oklch(0.84 0.09 70) 8px
        ) !important;
      }
      .dark .calendar-container .rbc-event-tentative {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.32 0.04 70),
          oklch(0.32 0.04 70) 4px,
          oklch(0.24 0.05 70) 4px,
          oklch(0.24 0.05 70) 8px
        ) !important;
        color: oklch(0.9 0.02 70) !important;
      }
      .dark .calendar-container .rbc-event-tentative:hover {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.36 0.05 70),
          oklch(0.36 0.05 70) 4px,
          oklch(0.28 0.06 70) 4px,
          oklch(0.28 0.06 70) 8px
        ) !important;
      }

      /* Out of Office - Plum (premium) */
      .calendar-container .rbc-event-out-of-office {
        background: oklch(0.95 0.025 320) !important;
        border-left-color: oklch(0.52 0.14 320) !important;
        color: oklch(0.3 0.05 320) !important;
      }
      .calendar-container .rbc-event-out-of-office:hover {
        background: oklch(0.9 0.035 320) !important;
      }
      .dark .calendar-container .rbc-event-out-of-office {
        background: oklch(0.26 0.035 320) !important;
        color: oklch(0.9 0.02 320) !important;
      }
      .dark .calendar-container .rbc-event-out-of-office:hover {
        background: oklch(0.3 0.04 320) !important;
      }

      /* Legend indicators */
      .legend-busy {
        background: oklch(0.95 0.02 265);
        border-left: 4px solid oklch(0.52 0.14 265);
      }
      .dark .legend-busy {
        background: oklch(0.26 0.035 265);
      }

      .legend-free {
        background: oklch(0.95 0.025 175);
        border-left: 4px solid oklch(0.52 0.11 175);
      }
      .dark .legend-free {
        background: oklch(0.26 0.035 175);
      }

      .legend-ooo {
        background: oklch(0.95 0.025 320);
        border-left: 4px solid oklch(0.52 0.14 320);
      }
      .dark .legend-ooo {
        background: oklch(0.26 0.035 320);
      }

      /* Show As dropdown indicators */
      .showas-busy {
        background: oklch(0.52 0.14 265) !important;
      }
      .showas-free {
        background: oklch(0.52 0.11 175) !important;
      }
      .showas-tentative {
        background: oklch(0.55 0.14 70) !important;
      }
      .showas-ooo {
        background: oklch(0.52 0.14 320) !important;
      }

      /* Tentative indicator for legend/UI */
      .tentative-indicator {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.96 0.02 70),
          oklch(0.96 0.02 70) 2px,
          oklch(0.8 0.1 70) 2px,
          oklch(0.8 0.1 70) 4px
        ) !important;
        border-left: 4px solid oklch(0.55 0.14 70);
      }
      .dark .tentative-indicator {
        background: repeating-linear-gradient(
          -45deg,
          oklch(0.32 0.04 70),
          oklch(0.32 0.04 70) 2px,
          oklch(0.24 0.06 70) 2px,
          oklch(0.24 0.06 70) 4px
        ) !important;
        border-left: 4px solid oklch(0.5 0.12 70);
      }

      /* Show more link */
      .calendar-container .rbc-show-more {
        color: var(--primary);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 2px 4px;
        margin-top: 2px;
      }
      .calendar-container .rbc-show-more:hover {
        opacity: 0.8;
        text-decoration: underline;
      }

      /* Row content / event segment */
      .calendar-container .rbc-row-content {
        z-index: 1;
      }
      .calendar-container .rbc-row-segment {
        padding: 0 2px 2px 2px;
      }

      /* Time view specific styles */
      .calendar-container .rbc-time-header {
        border-bottom: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-time-header-content {
        border-left: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-time-content {
        border-top: none !important;
      }
      .calendar-container .rbc-time-content > * + * > * {
        border-left: 1px solid var(--border) !important;
      }
      .calendar-container .rbc-timeslot-group {
        border-bottom: 1px solid var(--border) !important;
        min-height: 60px;
      }
      .calendar-container .rbc-time-slot {
        border-top: 1px solid color-mix(in oklch, var(--border) 50%, transparent) !important;
      }
      .calendar-container .rbc-day-slot .rbc-time-slot {
        border-top: 1px solid color-mix(in oklch, var(--border) 50%, transparent) !important;
      }
      .calendar-container .rbc-time-gutter {
        font-size: 0.7rem;
        color: var(--muted-foreground);
        font-weight: 500;
        background: var(--muted);
      }
      .calendar-container .rbc-time-gutter .rbc-timeslot-group {
        border-bottom: none !important;
      }
      .calendar-container .rbc-label {
        padding: 0 12px;
      }

      /* Working hours highlighting - neutral working, darker non-working */
      .calendar-container .rbc-working-hours {
        background: var(--background) !important;
      }
      .calendar-container .rbc-non-working-hours {
        background: oklch(0.92 0.005 265) !important;
      }
      .calendar-container .rbc-non-working-day {
        background: oklch(0.92 0.005 265) !important;
      }
      .dark .calendar-container .rbc-working-hours {
        background: var(--background) !important;
      }
      .dark .calendar-container .rbc-non-working-hours {
        background: oklch(0.18 0.008 265) !important;
      }
      .dark .calendar-container .rbc-non-working-day {
        background: oklch(0.18 0.008 265) !important;
      }

      /* Allday section - hide when no all-day events */
      .calendar-container .rbc-allday-cell {
        border-bottom: 1px solid var(--border) !important;
        background: var(--muted);
      }
      .calendar-container .rbc-time-header-content > .rbc-row.rbc-row-resource {
        display: none;
      }
      .calendar-container .rbc-time-header-content > .rbc-row:not(:first-child) {
        min-height: 0 !important;
        height: auto !important;
      }
      .calendar-container .rbc-time-header-content > .rbc-row:not(:first-child) .rbc-header {
        padding: 0 !important;
        min-height: 0 !important;
      }
      .calendar-container .rbc-time-header-content > .rbc-row:not(:first-child) .rbc-allday-cell {
        min-height: 0 !important;
        height: auto !important;
        padding: 2px 0;
      }
      /* Only show allday row if it has content */
      .calendar-container .rbc-time-header-content > .rbc-row:not(:first-child):has(.rbc-event) {
        min-height: 24px !important;
      }
      .calendar-container .rbc-time-header-content > .rbc-row:not(:first-child):has(.rbc-event) .rbc-allday-cell {
        padding: 4px 2px;
      }

      /* Current time indicator */
      .calendar-container .rbc-current-time-indicator {
        background-color: var(--destructive);
        height: 2px;
      }
      .calendar-container .rbc-current-time-indicator::before {
        content: "";
        position: absolute;
        left: -5px;
        top: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--destructive);
      }

      /* Remove default borders and add our own */
      .calendar-container .rbc-month-view,
      .calendar-container .rbc-time-view,
      .calendar-container .rbc-day-bg,
      .calendar-container .rbc-month-row,
      .calendar-container .rbc-header {
        border-color: var(--border) !important;
      }

      /* Overlay popup */
      .rbc-overlay {
        background: var(--popover) !important;
        border: 1px solid var(--border) !important;
        border-radius: 0.75rem !important;
        box-shadow: 0 10px 40px color-mix(in oklch, var(--foreground) 15%, transparent) !important;
        padding: 12px !important;
        z-index: 50 !important;
      }
      .rbc-overlay-header {
        border-bottom: 1px solid var(--border) !important;
        padding: 8px 12px !important;
        margin: -12px -12px 12px -12px !important;
        background: var(--muted) !important;
        border-radius: 0.75rem 0.75rem 0 0 !important;
        font-weight: 600 !important;
        font-size: 0.875rem !important;
      }
      .rbc-overlay > .rbc-event {
        margin: 4px 0 !important;
      }

      /* Selection */
      .calendar-container .rbc-slot-selection {
        background: color-mix(in oklch, var(--primary) 15%, transparent);
        border: 2px dashed var(--primary) !important;
        border-radius: 6px;
        z-index: 10;
        box-sizing: border-box;
      }
    `}</style>
  );
}
