# Technical guide
Administrator account:
- **user**: admin@fitnesscheck.test
- **password**: k4e0nf72030
## Database
### 4 collections:
- **categories** : contains 1 document by category which contains 
  - string _label_ of the category
  - boolean _highIsGood_ for the chart's calculation


- **form**: contains only 1 document which has an array of reference to questions, use to stock the actual form


- **questions** : contains 1 document by question which contains
  - reference _category_
  - string _label_ (the question)
  - boolean _uniqueAnswer_ (false for check boxes and true radio buttons)
  - collection _answers_. Each documents has
    - string _label_ (the answer)
    - int _point_
    
  
- **users**: contains 1 document by recorded use in Firebase Authentication. Each has
  - string _name_ of the user
  - boolean _admin_ to access or not to form management
  - collection _completedForms_ if the user already complete a form. Each document has:
    - timestamp _dateTime_ when form had been completed
    - array _answeredQuestions_ :
      - array _answers_ of answers' reference (in case of check boxes)
      - int _points_ addition of each answer checked
      - reference _question_ 
    - array _pointsByCategory:
      - reference _category_ to display in FormCompleted
      - string _categoryLabel_ to display in Chart
      - int _finalPoints_  addition of points in a category
      
### Delete and edit logic

The database has been designed to preserve user data. Therefore, once a questionnaire is completed, it is not possible to modify it.
If an administrator edits a question on the questionnaire, the user will always see the question they answered.
Technically speaking, changing a question is like this:
- Create a copy of the question with the changes made
- Removal of the reference question in the form collection
- Added question referencing created in the form collection
  Deletion only removes the question reference from the form collection

## Files structure
Our code is located mostly in the `src` folder. This folder contains some folders :
- [`components`](src/components) : folder containing all React components
- [`config`](src/config) : folder containing the main configuration files
### Components
This `components` folder contains all React components. It contains sub-folders :
- [`admin`](src/components/admin)
- [`form`](src/components/form)
- [`history`](src/components/history)

But also other components :
- [`App.js`](src/components/App.js)
  <br>Main component of the app
- [`AppWrapper.js`](src/components/AppWrapper.js)
  <br>Component enclosing the app component use for routes browsing
- [`Footer.js`](src/components/Footer.js)
  <br>Footer component
- [`Home.js`](src/components/Home.js)
  <br>Component to display the Home page
- [`Loading.js`](src/components/Loading.js)
  <br>Loading component use before displaying any data
- [`Login.js`](src/components/Login.js)
  <br>Login component
#### Form
This `form` folder contains all components concerning the form :
- [`AnswersContainer.js`](src/components/form/AnswersContainer.js)
  <br>Component to display all answers concerning a question
- [`CategoryContainer.js`](src/components/form/CategoryContainer.js)
  <br>Component to display a specific category
- [`FitnessForm.js`](src/components/form/FitnessForm.js)
  <br>Component to display the form sorted by categories
- [`FormError.js`](src/components/form/FormError.js)
  <br>Component to display a red message if the form hasn't all its questions answered
- [`QuestionContainer.js`](src/components/form/QuestionContainer.js)
  <br>Component to display a question with the answers
#### History
This `history` folder contains all components concerning the history :
- [`ChartContainer.js`](src/components/history/ChartContainer.js)
  <br>TODO
- [`FormCompletedContainer.js`](src/components/history/FormCompletedContainer.js)
  <br>TODO
- [`History.js`](src/components/history/History.js)
  <br>TODO
#### Form management
This `admin` folder contains all components concerning the form management :
- [`Admin.js`](src/components/admin/Admin.js)
  <br>Component to display the Admin page: Use to manage questions
- [`EditCategoryContainer.js`](src/components/admin/EditCategoryContainer.js)
  <br>Component to display all questions of a category in questions management
- [`EditQuestionContainer.js`](src/components/admin/EditQuestionContainer.js)
  <br>Component to display a question and answers (in questions management) with button to edit/delete
- [`MyModal.js`](src/components/admin/MyModal.js)
  <br>Popup use to add or edit a question
- [`NewQuestionContainer.js`](src/components/admin/NewQuestionContainer.js)
  <br>Button add question with modal call
### Configuration
This `config` folder contains all information used to the configuration :
- [`initFirebase.js`](src/config/initFirebase.js)
  <br>All methods to interact with our DB (Firestore from Firebase)

### Other files
- [`index.js`](src/index.js)
  <br>TODO
- [`reportWebVitals.js`](src/reportWebVitals.js)
  <br>TODO
- [`setupTests.js`](src/setupTests.js)
  <br>TODO

## External libraries

## Docker deployment
Docker allows the application to be deployed on a server. 

The container contains files belonging to the git master branch.

The application is deployed on : [https://grp11.p645.hevs.ch/](https://grp11.p645.hevs.ch/)

To deploy the last version of the master on the container, you have to follow those steps :
1. You need to have `.env` and `.env.local` files in the server side containing all the sensitive information to connect to the backend (Firestore) and configure Traefik parameters.
2. Connect in ssh with `ssh grp11@vlhprj645docker.hevs.ch`
3. Navigate to application folder with `cd 645-11-fitness-check`
4. Pull the master with `git pull`
5. Build the container with `docker-compose build`
6. Run the container with `docker-compose up -d`

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)