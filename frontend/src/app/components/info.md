### Structure of the components folder
- screens
- ui-elements
- views 

##### Screens
The screen components are the wrapper for the view components. The view components are showing the important informationen. The screens are more responsible to define which view componentn should show how and when. Typically the screen components are containing an 2nd router-outlet. Another responsibility of the screen components is to define the layout. In here the paddings are set.  

##### Ui-elements
These are basic elements, which have no access to the data. They are used to generate a common look and feel.

##### Views
Views are the core components which shows the data. There are tile-views which basically are dashboard widgets. These widgets are showing the information of the application. Detail-views are kind of screen components, but with the different, that they do not know in which layout they are shown. The screen components have no paddings. 


