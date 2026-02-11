-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  primary_technology VARCHAR(100) NOT NULL,
  experience_years INTEGER NOT NULL,
  skill_level VARCHAR(20) NOT NULL CHECK (skill_level IN ('Basics', 'Intermediate', 'Expert')),
  
  -- Customer Details
  customer_name VARCHAR(100) NOT NULL,
  customer_country VARCHAR(100) NOT NULL,
  customer_pic_name VARCHAR(100) NOT NULL,
  customer_pic_department VARCHAR(100) NOT NULL,
  current_work_description TEXT NOT NULL,
  
  -- AI Engagement
  ai_opportunity TEXT NOT NULL,
  customer_ai_adoption VARCHAR(20) NOT NULL CHECK (customer_ai_adoption IN ('Yes', 'No', 'Not Sure')),
  product_business_line TEXT NOT NULL,
  worked_on_ai VARCHAR(5) NOT NULL CHECK (worked_on_ai IN ('Yes', 'No')),
  
  -- AI Skills & Interest
  ai_skill_level VARCHAR(20) NOT NULL CHECK (ai_skill_level IN ('Basics', 'Intermediate', 'Advanced')),
  ai_upskill_interest VARCHAR(10) NOT NULL CHECK (ai_upskill_interest IN ('Low', 'Medium', 'High')),
  ai_certification TEXT,
  ai_forge_core_business_view TEXT NOT NULL,
  
  -- Account
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  
  -- Uploads
  idea_pdf_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
