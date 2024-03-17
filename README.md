# Angular Project - Cards app

This is the README file for the Angular project Cards app.

# General information

The cards app is an Angular based application that can be used to create flash cards 
for a wide range of learning scenarios. Here are some key use cases:

- Academic studies.
- Language learning.
- Professional training.
- General knowledge enhacement.

# Project Architecture.

## Home page
It contains information about the project along with a list of the latest cards being
added with public status and the option to review them with no registration using the cards section.

## Collections page
It contains collections which have at least 1 publicly available card. When organising
collections registered users can have cards with different statuses within the same collection.

This page also leads to individual collections/:id pages where all cards available can be seen.

If the viewer is not the owner (logged in or not) they can only see the ones with public status.
If the viewer is the owner all cards will be available.

## Cards page
This opens an individual card from where it has the option to open the containing collection.
It can be used for sharing and it is where the SHARE button available for every card is pointing to.

## Account page
This is a private only page available only to registered users who are logged in to their accounts.
From this page they can perform full CRUD operations involving their cards/collections, as well as
allowing users to migrate from a different provider. Detailed analytics are available as well.

## Login & Register pages.
Two separate pages one linking to the other which have a different template than the rest of the
application and allows users to respectively login or create an account.

# Important files and folders.
### src/api
Contains the index.js file responsible for all available endpoints that will be used 
within the application. It contains the package.json and package-lock.json files that contain
all necessary frameworks/libraries that must be installed in order to run it.

### cards-app/db-structure.sql 
The structure of the database used to run the application.

### src/app
Contains all files responsible for running the angular project.

# Installation
### Setting up the database
Use the cards-app/db-structure.sql file to import the necessary tables and columns to your MySQL server.

### Setting up the API endpoints
Open the cards-app/src/api folder and run the following command which will install all dependencies

`npm install`

After the installation is completed, start the server by using this command

`node index.js`

### Setting up the Angular project
Open the cards-app directory and run the following command to build the project

`npm install`

Upon successful installation run the command below to start the project.

`ng serve`
