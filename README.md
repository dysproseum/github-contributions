This project can be used to track custom events and visualize them in a familiar GitHub-style contributions graph.

<p align="center">
  <img src="assets/github-contributions.png" />
</p>

### Overview

Data can be displayed in two ways:

* Gradient style: Stores integer values to represent the number of events on each day
* Boolean style: Stores one event value on each day

### Getting started

Include the CSS and script tag in the html header:

````
<link rel="stylesheet"
  href="https://raw.githubusercontent.com/dysproseum/github-contributions/refs/heads/main/contrib.css" />
<script type="text/javascript"
  src="https://raw.githubusercontent.com/dysproseum/github-contributions/refs/heads/main/contrib.js">
</script>
````

By default, the component will bind to an element with id `github-contrib`. Also add the `github-contrib` class to set the styling:

````
<div id="github-contrib" class="github-contrib">
````

By passing `options` you can set the graph style, customize colors, event series, and title.

When embedding more than one graph on a page, make sure to specify a unique `targetId` attribute in the options:

````
const options = {
  'targetId' => 'github-custom',
};
let contrib = new GithubContributions(); // Defaults for demonstration
let custom = new GithubContributions(options);
...
<div id="github-contrib" class="github-contrib">
<div id="github-custom" class="github-contrib">
````

### Data storage

The data is stored in the browser's localStorage, so it will be unique for each user. This can be used for tracking personal goals or tasks.

Make sure to specify a unique `localStoragePrefix` in the options for each graph embedded on a page:

````
localStoragePrefix: 'data-',
````

Future plans include pulling the data from a specified API endpoint, so the data can be shared on a public dashboard.


### Tracking events

For gradient graphs, events can be logged by calling the `track` method, which will increment the stored value:

````
contrib->track();
````

For boolean graphs, pass in `true` or `false` corresponding to the chosen event, or pass in null to reset:

````
contrib->track(true);
contrib->track(false);
contrib->track(null);
````

The label for each corresponding event can be set in `options.events`, along with an RGB or hex color code:

````
events: {
  'good': {
    label: 'Yes',
    color: 'lightsteelblue',
    value: true,
  },
  'bad': {
    label: 'No',
    color: '#60ff0a',
    value: false,
  },
}
````

The tracking call returns a promise you can use to refresh the display, or perform any additional follow-up tasks.

### Additional options

`eventType`

Possible values: `"boolean"` or `"gradient"`

`title`

Example: `"% events logged in the past year"`

The `%` character will be replaced with the total count of events.

`link`

Override the "Learn more" link with an object in the following format; the `target` parameter is optional: 

````
{
  url: "https://www.google.com/",
  title: "Google",
  target: "_blank",
}
````

`enablePastEntries` 

Possible values: `true` or `false`

By default, events can only be tracked to the current day. However, if the `enablePastEntries` option is set, previous dates can be selected to update.

## Demo

See a working demo here: [https://dysproseum.com/github-contributions](https://dysproseum.com/github-contributions)
