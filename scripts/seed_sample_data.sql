-- Sample data for Tourist Safety System
-- This script populates the database with sample data for testing and demonstration

-- Insert sample users
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@email.com', '$2b$10$hash1', 'tourist', 'John', 'Doe', '+91-9876543210'),
('550e8400-e29b-41d4-a716-446655440002', 'officer.smith@police.gov.in', '$2b$10$hash2', 'police', 'Officer', 'Smith', '+91-9876543211'),
('550e8400-e29b-41d4-a716-446655440003', 'airport.manager@mumbai.airport.in', '$2b$10$hash3', 'airport', 'Airport', 'Manager', '+91-9876543212'),
('550e8400-e29b-41d4-a716-446655440004', 'hotel.manager@grandplaza.com', '$2b$10$hash4', 'hotel', 'Hotel', 'Manager', '+91-9876543213'),
('550e8400-e29b-41d4-a716-446655440005', 'maria.garcia@email.com', '$2b$10$hash5', 'tourist', 'Maria', 'Garcia', '+34-600-123456'),
('550e8400-e29b-41d4-a716-446655440006', 'ahmed.hassan@email.com', '$2b$10$hash6', 'tourist', 'Ahmed', 'Hassan', '+20-100-1234567');

-- Insert sample airports
INSERT INTO airports (id, code, name, city, country, coordinates) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'BOM', 'Chhatrapati Shivaji Maharaj International Airport', 'Mumbai', 'India', '{"lat": 19.0896, "lng": 72.8656}'),
('660e8400-e29b-41d4-a716-446655440002', 'DEL', 'Indira Gandhi International Airport', 'Delhi', 'India', '{"lat": 28.5562, "lng": 77.1000}'),
('660e8400-e29b-41d4-a716-446655440003', 'GOI', 'Goa International Airport', 'Goa', 'India', '{"lat": 15.3808, "lng": 73.8314}');

-- Insert sample police stations
INSERT INTO police_stations (id, name, address, phone, email, jurisdiction_area, coordinates) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Colaba Police Station', 'Colaba, Mumbai, Maharashtra 400001', '+91-22-22020111', 'colaba.ps@mumbaipolice.gov.in', 'South Mumbai', '{"lat": 18.9067, "lng": 72.8147}'),
('770e8400-e29b-41d4-a716-446655440002', 'Baga Police Station', 'Baga Beach Road, Baga, Goa 403516', '+91-832-2276136', 'baga.ps@goapolice.gov.in', 'North Goa', '{"lat": 15.5557, "lng": 73.7516}'),
('770e8400-e29b-41d4-a716-446655440003', 'Mysore City Police Station', 'Sayyaji Rao Road, Mysore, Karnataka 570001', '+91-821-2421339', 'mysore.ps@karnatakapolice.gov.in', 'Mysore City', '{"lat": 12.2958, "lng": 76.6394}');

-- Insert sample hotels
INSERT INTO hotels (id, name, address, phone, email, license_number, coordinates, amenities, is_verified) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Hotel Grand Plaza', 'Marine Drive, Mumbai, Maharashtra 400020', '+91-22-66651234', 'reservations@grandplaza.com', 'MH-HTL-2024-001', '{"lat": 18.9441, "lng": 72.8262}', ARRAY['WiFi', 'Restaurant', 'Spa', 'Pool', 'Gym'], true),
('880e8400-e29b-41d4-a716-446655440002', 'Goa Beach Resort', 'Baga Beach, Baga, Goa 403516', '+91-832-2271234', 'info@goabeachresort.com', 'GA-HTL-2024-002', '{"lat": 15.5557, "lng": 73.7516}', ARRAY['Beach Access', 'Restaurant', 'Bar', 'Pool'], true),
('880e8400-e29b-41d4-a716-446655440003', 'Mysore Palace Hotel', 'Sayyaji Rao Road, Mysore, Karnataka 570001', '+91-821-2421234', 'bookings@mysorepalace.com', 'KA-HTL-2024-003', '{"lat": 12.3051, "lng": 76.6551}', ARRAY['Heritage Property', 'Restaurant', 'Garden'], true);

-- Insert sample tourist profiles
INSERT INTO tourist_profiles (id, user_id, tourist_id, passport_number, nationality, date_of_birth, gender, arrival_date, departure_date, purpose_of_visit, accommodation_address, accommodation_type, visiting_states, safety_score, current_location) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'TST-2024-A7B9C2D1', 'US123456789', 'American', '1985-06-15', 'Male', '2024-01-15', '2024-01-25', 'Tourism', 'Hotel Grand Plaza, Marine Drive, Mumbai', 'Hotel', ARRAY['Maharashtra', 'Goa', 'Karnataka'], 85, '{"lat": 18.9220, "lng": 72.8347, "address": "Gateway of India, Mumbai", "timestamp": "2024-01-16T14:30:00Z"}'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'TST-2024-B8C3D4E2', 'ES987654321', 'Spanish', '1990-03-22', 'Female', '2024-01-14', '2024-01-28', 'Tourism', 'Goa Beach Resort, Baga Beach, Goa', 'Resort', ARRAY['Goa', 'Maharashtra'], 92, '{"lat": 15.5557, "lng": 73.7516, "address": "Baga Beach, Goa", "timestamp": "2024-01-16T14:25:00Z"}'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'TST-2024-C9D4E5F3', 'EG456789123', 'Egyptian', '1988-11-08', 'Male', '2024-01-16', '2024-01-22', 'Tourism', 'Mysore Palace Hotel, Mysore, Karnataka', 'Hotel', ARRAY['Karnataka'], 45, '{"lat": 12.3051, "lng": 76.6551, "address": "Mysore Palace, Karnataka", "timestamp": "2024-01-16T10:15:00Z"}');

-- Insert emergency contacts
INSERT INTO emergency_contacts (tourist_profile_id, name, relationship, phone, email, is_primary) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Jane Doe', 'Spouse', '+1-555-0123', 'jane.doe@email.com', true),
('990e8400-e29b-41d4-a716-446655440001', 'Robert Doe', 'Father', '+1-555-0124', 'robert.doe@email.com', false),
('990e8400-e29b-41d4-a716-446655440002', 'Carlos Garcia', 'Brother', '+34-600-123457', 'carlos.garcia@email.com', true),
('990e8400-e29b-41d4-a716-446655440003', 'Fatima Hassan', 'Wife', '+20-100-1234568', 'fatima.hassan@email.com', true);

-- Insert sample flights
INSERT INTO flights (id, flight_number, airline, origin_airport_id, destination_airport_id, scheduled_departure, scheduled_arrival, flight_status, total_passengers) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'AI-101', 'Air India', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '2024-01-16 12:00:00+00', '2024-01-16 14:30:00+00', 'arrived', 245),
('aa0e8400-e29b-41d4-a716-446655440002', 'EK-507', 'Emirates', '660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '2024-01-16 13:15:00+00', '2024-01-16 15:45:00+00', 'boarding', 380);

-- Insert hotel bookings
INSERT INTO hotel_bookings (tourist_profile_id, hotel_id, room_number, check_in_date, check_out_date, booking_status) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '205', '2024-01-15', '2024-01-25', 'checked_in'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '312', '2024-01-14', '2024-01-28', 'checked_in'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '108', '2024-01-16', '2024-01-22', 'checked_in');

-- Insert sample incidents
INSERT INTO incidents (id, incident_id, tourist_profile_id, incident_type, priority, status, title, description, location, reported_by) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'INC-2024-001', '990e8400-e29b-41d4-a716-446655440001', 'sos_alert', 'high', 'resolved', 'Emergency SOS Alert', 'Tourist activated emergency SOS button. Location shared with emergency contacts.', '{"lat": 18.9067, "lng": 72.8147, "address": "Colaba Fort, Mumbai"}', '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440002', 'INC-2024-002', '990e8400-e29b-41d4-a716-446655440003', 'geofence_violation', 'medium', 'investigating', 'Geo-fence Violation', 'Tourist entered restricted military area. Automatic alert generated.', '{"lat": 12.2958, "lng": 76.6394, "address": "Restricted Area, Mysore"}', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample SOS alerts
INSERT INTO sos_alerts (id, tourist_profile_id, alert_type, location, message, status, response_time_seconds) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'panic_button', '{"lat": 18.9067, "lng": 72.8147, "address": "Colaba Fort, Mumbai", "accuracy": 5}', 'Emergency help needed immediately!', 'resolved', 138),
('cc0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'medical_emergency', '{"lat": 15.5557, "lng": 73.7516, "address": "Baga Beach, Goa", "accuracy": 8}', 'Chest pain, need medical assistance', 'resolved', 246);

-- Insert sample geofences
INSERT INTO geofences (id, name, description, fence_type, coordinates, radius_meters, created_by) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'Gateway of India Safe Zone', 'Tourist safe zone around Gateway of India', 'safe_zone', '{"type": "Point", "coordinates": [72.8347, 18.9220]}', 500, '550e8400-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-446655440002', 'Military Restricted Area', 'Restricted military installation area', 'restricted_area', '{"type": "Point", "coordinates": [76.6394, 12.2958]}', 1000, '550e8400-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-446655440003', 'Baga Beach Tourist Zone', 'Popular tourist beach area', 'tourist_attraction', '{"type": "Point", "coordinates": [73.7516, 15.5557]}', 800, '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample location tracking data
INSERT INTO location_tracking (tourist_profile_id, location, address, activity_type, battery_level, signal_strength, is_safe_zone) VALUES
('990e8400-e29b-41d4-a716-446655440001', '{"lat": 18.9220, "lng": 72.8347, "accuracy": 5, "speed": 0}', 'Gateway of India, Mumbai', 'stationary', 85, 4, true),
('990e8400-e29b-41d4-a716-446655440002', '{"lat": 15.5557, "lng": 73.7516, "accuracy": 8, "speed": 2}', 'Baga Beach, Goa', 'walking', 72, 3, true),
('990e8400-e29b-41d4-a716-446655440003', '{"lat": 12.3051, "lng": 76.6551, "accuracy": 12, "speed": 0}', 'Mysore Palace, Karnataka', 'stationary', 45, 2, true);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, notification_type, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Welcome to SafeTour', 'Your tourist registration has been completed successfully. Your digital ID is ready.', 'success', '{"tourist_id": "TST-2024-A7B9C2D1"}'),
('550e8400-e29b-41d4-a716-446655440002', 'High Priority Incident', 'Emergency SOS alert from tourist John Doe at Colaba Fort, Mumbai.', 'alert', '{"incident_id": "INC-2024-001", "priority": "high"}'),
('550e8400-e29b-41d4-a716-446655440005', 'Safety Score Update', 'Your safety score has increased to 92. Keep up the good travel practices!', 'info', '{"safety_score": 92}');
