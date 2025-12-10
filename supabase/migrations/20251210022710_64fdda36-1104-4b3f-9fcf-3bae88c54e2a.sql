-- Insert sample rewards for the loyalty program
INSERT INTO rewards (title, description, points_cost, is_global, is_active, image_url) VALUES
('$5 Off Next Purchase', 'Get $5 off your next purchase at any participating business', 100, true, true, null),
('$10 Off Next Purchase', 'Get $10 off your next purchase at any participating business', 200, true, true, null),
('Free Coffee or Drink', 'Redeem for a free coffee or beverage at participating cafes', 75, true, true, null),
('15% Discount', 'Get 15% off your entire order at any participating business', 150, true, true, null),
('$25 Gift Card', 'Redeem for a $25 gift card to use at any coalition business', 500, true, true, null),
('VIP Early Access', 'Get early access to sales and new products', 300, true, true, null),
('Free Shipping', 'Get free shipping on your next online order', 50, true, true, null),
('$50 Shopping Spree', 'Redeem for $50 worth of products at any coalition business', 1000, true, true, null)
ON CONFLICT DO NOTHING;