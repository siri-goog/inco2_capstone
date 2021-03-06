DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  user_id serial PRIMARY KEY UNIQUE,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255),
  resetPasswordToken VARCHAR(255),
  resetPasswordExpires TIMESTAMP
);