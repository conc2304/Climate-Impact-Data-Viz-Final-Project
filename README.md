# The Three Planeteers present Climate Change : Is Earth Fighting Back?

<br>

## Planet Habitability

Team Name:   The Three Planeteers

Title:   Planet Habitability

Team Members:

- Jose Conchello-Bueyes - <jose.conchello@gmail.com>
- Ben Fulroth - <fulrothb@me.com>
- Patrick Niebrzydowski - <pan212@g.harvard.edu> (team leader)
  
Application URL: <https://conc2304.github.io/vis-final/>

Source code:   <https://github.com/conc2304/Climate-Impact-Data-Viz-Final-Project>
Screencast:  <https://www.youtube.com/watch?v=29FGDYg1OEY>

Process Book PDF: <https://github.com/conc2304/vis-final/blob/final_docs/Process%20Book%20-%20CS%20171%20-%20Planet%20Habitability%20.pdf>
<br>
<br>

## Project Overview

As part of this project we wanted to find out how rising temperatures are affecting severe weather patterns in the US.
Are there trends and correlations?
How is severe weather impacting us and who stands to be the most impacted by rising temperatures?

### Home Page

On our home page we travel through time to show our users how rising temperatures and the increasing frequency of severe weather events in each state over the years are correlated.

For this exploration will be using the Global Temperature Anomaly scale. To find out more about why we use this scale there is an 'info' button on the Home page and the Explorations page to explain what it is, what it means, and why it is used.

### Explorations Page

On the exploration page, users are encouraged to explore and interact with this data to gain meaningful insights.
The heatmap of the US is the focal point of this page.  Here users can quickly visualize what states are the most impacted. Throughout this page we highlight the top 3 most impacted states based on the metrics selected. Clicking on any state updates all of the auxiliary charts to show different insights into the data with the addition of the selected state.

The Global Temperature graph is the secondary point of interaction.  
Here users can zoom and scrub through the data and watch the data change.
This allows users to filter by years as well as play through it by dragging the selection.

We divided our data into 2 primary segments:
by metrics and by storm event types.

Selecting different combinations will update all of the charts to reveal who is most impacted by these  segmentations.
Our primary metrics for impact are:
 Total Storms, Deaths and Injuries, and Total Property Damages.

Our auxiliary graphs allow our users to gain more insight into what this data looks like in different ways.
The line charts on the right allow user to compare different US states and storm events against each other over time
User can click on the different lines to bring them into focus and get more granularity

The radar graphs on the left allow users to get a snapshot comparison of the different states.
Users can hover over an area or a data point to get more granularity into these metrics.

### Final Page

We have reached the end of our data exploration journey. But what does this all mean for the rest of civilization's journey through an increasingly warming world.

We now encourage our users to take an even deeper look into the data if they want to with the resources that we used.

<br>
<br>

## Getting Started

Do you have node installed on your computer? No?
Follow these instructions:
Mac Terminal: [How to install NodeJS and NPM on Mac using Homebrew](https://medium.com/@hayasnc/how-to-install-nodejs-and-npm-on-mac-using-homebrew-b33780287d8f)
or
Download the the os specific NodeJs [installer](https://nodejs.org/en/download/)

Once you have NodeJs installed on your computer you will be able to run this React Application locally.

In a terminal window go to the root folder of the project (aka the project directory)
Run this command once:

- `npm install` - installs the project dependencies

Run everytime you want to relaunch the application locally on your computer:

- `npm start` - starts the application and launches it in the browser
- If it doesnt open it in your browser : Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all of the project dependencies from the package.json file.
You only have to run this once before running `npm start` to launch the application.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Project Directory Structure

- src/App.tsx - the entry file of the project, think of it like index.html
- src/components/pages/\*.tsx - the React Components comprising the various pages of the application
- src/components/ui/\*.tsx - UI components shared between pages such as navigation and layout
- src/components/visualizers/\*.tsx - the d3 charts written as React Components ie HeatMap.tsx
- src/fonts/ - files for custom UI fonts
- src/router/ - configuration of the React router
- public/ - the public directory that serves any non web specific assets (images, csv files, json files, etc...)
- public/data/ - public directory that is serving the locally hosted data that is driving the application

## Packages/ Dependencies

*Take note: The list below only includes the main packages used in this application.  For a complete list of dependencies refer to `package.json`*.
In this project, libraries and their features are `imported` on an a-la cart basis as top-level imports in individual files rather than made globally available like in vanilla javascript development. These libraries are imported as packages from the node_modules folder which gets dynamically built when running npm install.

- [Bootstrap](https://getbootstrap.com/) - Bootstrap provides a collection of syntax for template designs.
- [D3](https://d3js.org/) - JavaScript library for visualizing data using web standards
- [D3-geo](https://github.com/d3/d3-geo) - D3 sub-libarary for mapping projections to represent geographic features in JavaScript.
- [Material UI](https://mui.com/material-ui/getting-started/overview/) - an open-source React component library that implements Google's Material Design.
- [React](https://reactjs.org/) - open-source JavaScript framework and library. It’s used for building interactive user interfaces and web applications quickly and efficiently with significantly less code than you would with vanilla JavaScript.
- [React Bootstrap](https://react-bootstrap.github.io/) - a component-based library that provides native Bootstrap components as pure React components
- [Typescript](https://www.typescriptlang.org/) - TypeScript extends JavaScript and improves the developer experience. It enables developers to add type safety to their projects
- [React Spring](https://react-spring.dev/) - a spring-physics based animation library
- [Lodash](https://lodash.com/) a JavaScript library that provides utility functions for common programming tasks
- [TopoJSON Client](https://github.com/topojson/topojson-client) - provides tools for manipulating TopoJSON

## Data Description

*Please refer to the link below for a complete description of the data used in this project*

[Data Description](DataDiscription.md)
