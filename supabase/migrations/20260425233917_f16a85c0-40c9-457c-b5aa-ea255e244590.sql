UPDATE public.businesses
SET address = '111 N. 6th Street',
    city = 'Camden',
    state = 'NJ',
    zip_code = '08102',
    phone = '(856) 338-1958',
    email = 'launiquebooks@gmail.com',
    website = 'https://launiquebookstore.com',
    updated_at = now()
WHERE id = '582925e3-a2fb-445e-8af2-c92e5dc5bc2f';