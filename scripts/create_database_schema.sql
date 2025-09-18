-- Tourist Safety System Database Schema
-- This script creates all necessary tables for the tourist safety management system

-- Create database (if needed)
-- CREATE DATABASE tourist_safety_system;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('tourist', 'police', 'airport', 'hotel', 'admin')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tourist profiles table
CREATE TABLE IF NOT EXISTS tourist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tourist_id VARCHAR(50) UNIQUE NOT NULL, -- TST-2024-XXXXXX format
    passport_number VARCHAR(50) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    purpose_of_visit VARCHAR(100) NOT NULL,
    accommodation_address TEXT,
    accommodation_type VARCHAR(50),
    visiting_states TEXT[], -- Array of states
    safety_score INTEGER DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    current_location JSONB, -- {lat, lng, address, timestamp}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Police stations table
CREATE TABLE IF NOT EXISTS police_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    jurisdiction_area TEXT NOT NULL,
    coordinates JSONB, -- {lat, lng}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    license_number VARCHAR(100),
    coordinates JSONB, -- {lat, lng}
    amenities TEXT[],
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel bookings table
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(20),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Airports table
CREATE TABLE IF NOT EXISTS airports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL, -- IATA code
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    coordinates JSONB, -- {lat, lng}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin_airport_id UUID REFERENCES airports(id),
    destination_airport_id UUID REFERENCES airports(id),
    scheduled_departure TIMESTAMP WITH TIME ZONE,
    scheduled_arrival TIMESTAMP WITH TIME ZONE,
    actual_departure TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    flight_status VARCHAR(50) DEFAULT 'scheduled' CHECK (flight_status IN ('scheduled', 'boarding', 'departed', 'arrived', 'delayed', 'cancelled')),
    aircraft_type VARCHAR(50),
    total_passengers INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tourist flight bookings table
CREATE TABLE IF NOT EXISTS tourist_flight_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    booking_reference VARCHAR(50) NOT NULL,
    seat_number VARCHAR(10),
    booking_type VARCHAR(20) DEFAULT 'arrival' CHECK (booking_type IN ('arrival', 'departure')),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'flagged', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id VARCHAR(50) UNIQUE NOT NULL, -- INC-2024-XXX format
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    incident_type VARCHAR(50) NOT NULL CHECK (incident_type IN ('sos_alert', 'geofence_violation', 'safety_score_drop', 'medical_emergency', 'security_threat', 'missing_person')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(50) DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'responding', 'resolved', 'closed')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location JSONB, -- {lat, lng, address}
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    response_time_minutes INTEGER,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- SOS alerts table
CREATE TABLE IF NOT EXISTS sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('panic_button', 'medical_emergency', 'security_threat', 'fire_emergency', 'general_help')),
    location JSONB NOT NULL, -- {lat, lng, address, accuracy}
    message TEXT,
    is_silent BOOLEAN DEFAULT false,
    audio_recording_url TEXT,
    video_recording_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'false_alarm')),
    response_time_seconds INTEGER,
    responders JSONB, -- Array of responder details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Location tracking table
CREATE TABLE IF NOT EXISTS location_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    location JSONB NOT NULL, -- {lat, lng, accuracy, speed, heading}
    address TEXT,
    activity_type VARCHAR(50), -- walking, driving, stationary, etc.
    battery_level INTEGER,
    signal_strength INTEGER,
    is_safe_zone BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Geofences table
CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    fence_type VARCHAR(50) NOT NULL CHECK (fence_type IN ('safe_zone', 'restricted_area', 'tourist_attraction', 'emergency_zone')),
    coordinates JSONB NOT NULL, -- Polygon coordinates
    radius_meters INTEGER, -- For circular geofences
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Geofence violations table
CREATE TABLE IF NOT EXISTS geofence_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_profile_id UUID REFERENCES tourist_profiles(id) ON DELETE CASCADE,
    geofence_id UUID REFERENCES geofences(id) ON DELETE CASCADE,
    violation_type VARCHAR(50) NOT NULL CHECK (violation_type IN ('entered_restricted', 'left_safe_zone', 'overstayed')),
    location JSONB NOT NULL,
    duration_minutes INTEGER,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('alert', 'info', 'warning', 'success')),
    is_read BOOLEAN DEFAULT false,
    metadata JSONB, -- Additional data like incident_id, tourist_id, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_tourist_id ON tourist_profiles(tourist_id);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_user_id ON tourist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_safety_score ON tourist_profiles(safety_score);
CREATE INDEX IF NOT EXISTS idx_incidents_tourist_profile_id ON incidents(tourist_profile_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_tourist_profile_id ON sos_alerts(tourist_profile_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_location_tracking_tourist_profile_id ON location_tracking(tourist_profile_id);
CREATE INDEX IF NOT EXISTS idx_location_tracking_created_at ON location_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourist_profiles_updated_at BEFORE UPDATE ON tourist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_bookings_updated_at BEFORE UPDATE ON hotel_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
