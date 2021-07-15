### Structure of the components folder
- screens
- views 
- ui-elements

#### Screens
The screen components are the wrapper for the view components. The view components are showing the important informationen. The screens are more responsible to define the layout and are pretty dumb. There is almost no logic in there. But they are important for the router. Typically the screen components are containing an 2nd router-outlet. So this components are defining the first router stage /dashboard, /detail, /onboarding and /settings. The content comes from the views which are containing the logic.

#### Views
Views are the core components which shows the data. There are basically two kind of views:
1. Tile-views which basically are dashboard widgets. These widgets are showing the information of the application. The main purpose of these views is to define how the data should be display. This views are aware of the structure of the data models.

2. Detail-views or screen-views, which are kind of screen components, but with the different, that they do not know in which layout they are shown. They connect to the services to load the data.


#### Ui-elements
These are basic elements, which have no access to the data. They are used to generate a common look and feel.



