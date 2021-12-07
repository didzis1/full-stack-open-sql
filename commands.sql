# Create a new blogs table
CREATE TABLE blogs(
	id SERIAL PRIMARY KEY,
	author TEXT,
	url TEXT NOT NULL,
	title TEXT NOT NULL,
	likes INTEGER DEFAULT 0
);

# See all blogs
SELECT * FROM blogs;

# Creating two blogs
INSERT INTO blogs (author, url, title) values ('Didzis Zvaigzne', 'randomUrl.com', 'My first blog');
INSERT INTO blogs (author, url, title) values ('John Doe', 'goodreads.com', 'A tale about programming');