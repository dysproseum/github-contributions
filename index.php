<html>
<head>
<link rel="stylesheet" href="contrib.css" />
<script type="text/javascript" src="contrib.js"></script>
<script type="text/javascript">
  const options = {
    targetId: 'github-custom',
    localStoragePrefix: 'data-',
    link: {
      title: "Customize your own event tracker",
      url: "https://github.com/dysproseum/github-contributions",
      target: "_blank",
    },
  };

  window.addEventListener('load', function() {
    const contrib = new GithubContributions;
    const custom = new GithubContributions(options);
  });
</script>
</head>
<body>

  <!-- actions -->
  <button id="bad">Feeling bad</button>
  <button id="good">Feeling good</button>

  <!-- default element -->
  <div class="github-contrib" id="github-contrib"></div>

  <!-- custom element -->
  <div class="github-contrib" id="github-custom"></div>

</body>
</html>
