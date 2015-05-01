
##Routes

| Method  | Route  | Action |
| ------------- | --------------- | ----- |
| GET | '/' OR '/index.html' | Loads index.html |
| GET | '/restaurants' | sends all restaurant data objects back in an array |
| POST | '/restaurants' | adds a new restaurant object to the database, sends back the new data object that's been created |
| GET | '/restaurants/:id' | sends one restaurant data object back that matches ':id' |
| PUT | '/restaurants/:id' | updates every property of the existing data object that matches ':id' |
| PATCH | '/restaurants/:id' | updates a single property of the existing data object that matches ':id' |
| DELETE | '/restaurants/:id' | deletes an existing data object in the database that matches ':id' |
