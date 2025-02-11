<html>
<head>
<link rel="stylesheet" href="contrib.css" />
<script type="text/javascript" src="contrib.js"></script>
<script type="text/javascript">
  const options = {
    eventType: 'boolean',
    targetId: 'github-custom',
    title: '% events in the past year',
    link: {
      title: "Customize your own event tracker",
      url: "https://github.com/dysproseum/github-contributions",
      target: "_blank",
    },
    enablePastEntries: true,
    localStoragePrefix: 'data-',
    events: {
      'good': {
        label: 'Yes',
        color: 'lightsteelblue',
        value: true,
      },
      'bad': {
        label: 'No',
        color: 'orange',
        value: false,
      },
    },
  };

  const gradientOptions = {
    eventType: 'gradient',
    targetId: 'github-gradient',
    title: '% workouts logged in the past year',
    link: {
      title: "Customize your own event tracker",
      url: "https://github.com/dysproseum/github-contributions",
      target: "_blank",
    },
    enablePastEntries: true,
    localStoragePrefix: 'gradient-',
  };

  window.addEventListener('load', function() {
    const contrib = new GithubContributions;
    const custom = new GithubContributions(options);
    let gradient = new GithubContributions(gradientOptions);

    // Default event listeners.
    document.getElementById('good').addEventListener('click', function() {
      contrib.track(true);
    });

    document.getElementById('bad').addEventListener('click', function() {
      contrib.track(false);
    });

    // Custom event listeners.
    document.getElementById('custom-good').addEventListener('click', function() {
      custom.track(options.events.good.value);
    });

    document.getElementById('custom-bad').addEventListener('click', function() {
      custom.track(options.events.bad.value);
    });

    document.getElementById('custom-null').addEventListener('click', function() {
      custom.track(null);
    });

    // Gradient event listeners.
    document.getElementById('gradient-log').addEventListener('click', function() {
      gradient.track()
        .then(function() {
          gradient = new GithubContributions(gradientOptions);
        });
    });
  });
</script>
</head>
<body>

  <!-- default element -->
  <div class="github-contrib" id="github-contrib"></div>

  <!-- actions -->
  <button id="bad">Feeling bad</button>
  <button id="good">Feeling good</button>

  <!-- custom element -->
  <div class="github-contrib" id="github-custom"></div>

  <!-- actions -->
  <button id="custom-bad">Disagree</button>
  <button id="custom-good">Agree</button>
  <button id="custom-null">Reset</button>

  <!-- gradient element -->
  <div class="github-contrib" id="github-gradient"></div>

  <!-- actions -->
  <button id="gradient-log">Log workout</button>

</body>
</html>
