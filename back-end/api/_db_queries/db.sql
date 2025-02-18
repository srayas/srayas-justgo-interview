-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0,
    locked BOOLEAN DEFAULT FALSE,
    role  VARCHAR(255) DEFAULT 'app_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tokens table (for JWT tokens)
CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);



INSERT INTO public.users (username, "password", failed_attempts, "locked", "role", created_at, updated_at) 
VALUES('test_user@123.com', '$2b$10$Uf06N9btedfCdCC2oulfdu.CAFqyOWZrfIYa345V0J6y6qv3dOmZK', 0, false, 'app_user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO public.users (username, "password", failed_attempts, "locked", "role", created_at, updated_at) 
VALUES('admin_test@123.com', '$2b$10$3iwU1UqHcBi2k3juFnDsc.UoQ7kAZYVNy2jZfra6c56yMTe5pRwYO', 0, false, 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);