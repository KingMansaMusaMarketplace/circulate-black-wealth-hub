-- Acupuncture Atlanta - correct address and phone per acuatlanta.com/contact
UPDATE public.businesses
SET address = '455 E. Paces Ferry Road, NE, Suite 222',
    city = 'Atlanta',
    state = 'GA',
    zip_code = '30305',
    phone = '(404) 233-5080',
    updated_at = now()
WHERE id = 'b932022c-be31-4325-89f0-64072939dd30';