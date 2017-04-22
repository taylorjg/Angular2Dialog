0.0.13 (22nd April 2017)

* Updated Angular from 2.4.5 to 4.0.3
* Updated webpack from 1 to 2
* Updated typescript and tslint and fixed warnings
* Updated all other npm packages
* Removed gulpfile
* Added Circle CI

0.0.7 (19th November 2016)

* BUG FIX: all new items were being assign id 27!

0.0.6 (19th November 2016)

* Added a small loading spinner to each of the table column headers and got rid of the big progress bar

0.0.5 (19th November 2016)

* Set focus to the firstname input field whenever the form modal is popped up
    * (_my implementation uses `nativeElement`! I will revisit this some time_)
* Added a loading spinner

0.0.4 (19th November 2016)

* Removed simulated network delay
* Some internal changes

0.0.3 (18th November 2016)

* The modal form now does data binding to local properties. No need to clone the item any more.

0.0.2 (18th November 2016)

* Hypermedia links in the REST responses are now working properly on Heroku too
    * (now checking for the x-forwarded-proto header)
* Created change log 
