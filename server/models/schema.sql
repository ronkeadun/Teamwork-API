CREATE TABLE admins(
	adminId SERIAL PRIMARY KEY,
	email VARCHAR(255),
	password VARCHAR(255) NOT NULL,
	userRole VARCHAR(255),
	UNIQUE(email)
);

CREATE TABLE users(
	userId SERIAL PRIMARY KEY,
	firstName VARCHAR(255) NOT NULL,
	lastName VARCHAR(255) NOT NULL,
	email VARCHAR(255),
	password VARCHAR(255) NOT NULL,
	userRole VARCHAR(255),
	gender VARCHAR(255),
	jobRole VARCHAR(255),
	department VARCHAR(255),
	address VARCHAR(255),
	UNIQUE(email)
);
 

CREATE TABLE gifs(
	gifId SERIAL PRIMARY KEY,
	title VARCHAR(255),
	imageUrl VARCHAR(255),
	createdOn TIMESTAMP,
	user_id INT REFERENCES users(userId)
);

CREATE TABLE articles(
	articleId SERIAL PRIMARY KEY,
	title VARCHAR(255),
	article VARCHAR(255),
	author VARCHAR(255) REFERENCES users(email),
	user_id INT REFERENCES users(userId),
	createdOn TIMESTAMP
);

CREATE TABLE comments(
	commentId SERIAL PRIMARY KEY,
	comment VARCHAR(255),
	articleTitle VARCHAR(255),
	gifTitle VARCHAR(255),
	author VARCHAR(255) REFERENCES users(email),
	user_id INT REFERENCES users(userId),
	article_id INT REFERENCES articles(articleId),
	gif_id INT REFERENCES gifs(gifId),
	createdOn TIMESTAMP
);
