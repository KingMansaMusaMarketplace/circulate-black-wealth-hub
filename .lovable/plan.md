# Make "Book an Appointment" actually work

## What I found

The booking system is already built end to end: a Book Appointment button on every business page, a booking page with service picker, calendar, time slots, customer details and payment, confirmation and cancellation emails, a customer "My Bookings" page and a business "Bookings" screen.

It is not broken — it is empty and it dead-ends:

- 47,202 businesses are listed. Only **1** has added any services. Only **1** has set opening hours.
- **0** appointments have ever been booked.
- If a business has no services, the page says "No Services Available" and the visitor leaves.
- If a business has services but no hours, the calendar shows no days and no times, so the visitor still cannot book.

So the fix is not rebuilding booking. It is removing the two dead ends and getting businesses set up.

## What I propose to build

**1. Never show an empty calendar again**
When a business has not set its hours, fall back to a standard schedule (Monday–Friday, 9:00am–5:00pm, plus Saturday 10:00am–2:00pm). The time is clearly labelled as a *requested* time that the business confirms, rather than a guaranteed slot.

**2. Never dead-end on "No Services Available"**
When a business has not listed services, show a "Request an Appointment" form instead: the visitor picks a preferred day and time, describes what they need, and leaves their contact details. The business receives it as a pending request and confirms or proposes another time. No payment is taken for these.

**3. Tell the business, immediately**
Every new booking or request emails and notifies the business owner, with an Accept / Propose new time / Decline action on their Bookings screen. Today a booking can land with the owner never knowing.

**4. Make setup take two minutes**
Add a "Turn on bookings" prompt to the business dashboard that walks the owner through adding their first service and their opening hours in one short flow, with sensible defaults pre-filled so they only have to confirm.

**5. Confirm the whole loop works**
Create a test business with a service and hours, book an appointment as a customer, check the emails go out, check it appears on both the customer and business screens, and check cancelling works.

## Decisions I need from you

- **Fallback hours** — is Mon–Fri 9–5 plus Sat 10–2 the right default, or would you rather the page say "This business hasn't set hours — request a time"?
- **Payment** — right now a business with Stripe connected takes payment at booking, and one without simply confirms and the customer pays in person. I would keep that. Appointment requests (item 2) would never take payment.

## Technical notes

- Fallback schedule added in `src/hooks/useBusinessAvailability.ts` when `business_availability` returns no rows; a flag marks slots as "requested" so the UI can label them.
- New request path in `src/pages/BookBusinessPage.tsx` / `src/components/booking/BookingForm.tsx`, writing a `bookings` row with a null `service_id`, status `pending` and a `notes` description. Needs a migration to allow a null `service_id` and to add a `is_request` flag.
- Owner notification via the existing `send-transactional-email` function plus a new template; accept/decline wired into `BookingsList.tsx` using the existing `updateBookingStatus`.
- Setup prompt reuses `BusinessServicesContent` and `BusinessAvailabilityContent` in a short guided flow.
