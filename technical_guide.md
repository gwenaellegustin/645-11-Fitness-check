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
      - string _category_ is category's id **-----------------------> WHY ?**
      - int _points_ addition of each answer checked
      - reference _question_ 
    - array _pointsByCategory:
      - reference _category_ **-----------------------> WHY ?**
      - string _categoryLabel_
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
### Components
#### Form
#### History
#### Form management
#### Login

### Configuration

## External libraries

## Docker deployment
