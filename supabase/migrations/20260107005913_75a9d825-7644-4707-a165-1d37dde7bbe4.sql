-- Add test services to VECRA INC business
INSERT INTO public.business_services (business_id, name, description, price, duration_minutes, is_active, buffer_minutes)
VALUES 
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 'Business Consultation', 'One-on-one business strategy session', 150.00, 60, true, 15),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 'Quick Check-In', '30-minute follow-up session', 75.00, 30, true, 10),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 'Full Business Audit', 'Comprehensive 2-hour business review', 300.00, 120, true, 30);

-- Add availability for VECRA INC (Mon-Fri 9am-5pm)
INSERT INTO public.business_availability (business_id, day_of_week, start_time, end_time, is_available)
VALUES 
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 1, '09:00', '17:00', true),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 2, '09:00', '17:00', true),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 3, '09:00', '17:00', true),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 4, '09:00', '17:00', true),
  ('97f59bb4-dba9-48f0-87d8-d8ea35748e46', 5, '09:00', '17:00', true);