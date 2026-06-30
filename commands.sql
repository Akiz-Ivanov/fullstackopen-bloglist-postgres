CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES
('Linus Torvalds', 'https://kernel.org', 'Linux'),
('Kent Beck', 'https://kentbeck.com', 'TDD');