var GithubContributions = function(options) {

  console.log({options});
  const targetId = options && options.targetId ? options.targetId : 'github-contrib';
  const dataStore = options && options.localStoragePrefix ? options.localStoragePrefix : '';
  let link = {
    url: 'https://github.com/dysproseum/github-contributions',
    title: 'Learn how we count contributions',
  };
  link = options && options.link ? options.link : link;
  let enablePastEntries = options && options.enablePastEntries !== undefined ? options.enablePastEntries : true;
  let events = {
    good: {
      label: 'Good',
      color: '#9be9a8',
      value: true,
    },
    bad: {
      label: 'Bad',
      color: 'palevioletred',
      value: false,
    },
  };
  events = options && options.events ? options.events : events;

  nthNumber = function(number) {
    if (number > 3 && number < 21) return number + "th";
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  };

  this.track = function(action) {
    console.log("track " + dataStore + ", " + currentDate + ", " + action);
    var target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]');

    // @todo account for event types
    // 1 value gradient: check and increment counter

    // good or bad: true/false/undefined replaces value
    if (events.good.value == action) {
      target.style.backgroundColor = events.good.color;
    }
    else if (events.bad.value == action) {
      target.style.backgroundColor = events.bad.color;
    }
    else {
      target.style.backgroundColor = null;
    }
    localStorage.setItem(dataStore + currentDate, action);
    return;

    // good and bad: multiple values per day

  };

  const elem = document.getElementById(targetId);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  let currentDate;

  // Create year array: 52 weeks by 7 days.
  let grid = Array.from(Array(52), () => new Array(7));
  let today = new Date();
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))

  // Today is nth row in last column.
  const n = today.getDay();
  console.log(n);
  currentDate = today.toISOString().split('T')[0];
  console.log(currentDate);

  // Get last day of week.
  let curDate = today;
  curDate = new Date(curDate.getTime() + 86400 * 1000 * (6 - n));

  // Add 1 day to prepare for decrementing loop.
  curDate = new Date(curDate.getTime() + 86400 * 1000);

  // Fill columns and month labels.
  let mLabels = [];
  for (let w = 51; w >= 0; w--) {
    for (let i = 6; i >= 0; i--) {
      curDate = new Date(curDate.getTime() - 86400 * 1000);
      grid[w][i] = curDate.toISOString().split('T')[0];
      mLabels[w] = months[curDate.getMonth()];
    }
  }

  // Create html.
  var tableElem = document.createElement('table');
  var thead = document.createElement('thead');
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  tr.append(th);

  // Calculate colspans.
  let count = 0;
  let curMonth = -1;
  for (let i = 0; i < grid.length; i++) {
    let month;
    for (let j = 0; j < grid[0].length; j++) {
      let mDate = new Date(grid[i][j]);
      mDate = new Date(mDate.getTime() - (offset * 60 * 1000));
      month = mDate.getMonth();
    }
    if (curMonth != month) {
      if (curMonth != -1) {
        var th = document.createElement('th');
        th.colSpan = count;
        if (count > 1) {
          th.innerHTML = months[curMonth];
        }
        tr.append(th);
      }
      count = 1;
      curMonth = month;
    }
    else {
      count++;
    }
  }
  var th = document.createElement('th');
  th.colSpan = count;
  if (count > 1) {
    th.innerHTML = months[curMonth];
  }
  tr.append(th);
  thead.append(tr);

  // Transform grid.
  var tbody = document.createElement('tbody');
  for (let i = 0; i < grid[0].length; i++) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = dLabels[i];
    td.className = "label";
    tr.append(td);
    for (let j = 0; j < grid.length; j++) {
      var td = document.createElement('td');
      td.setAttribute('data-date', grid[j][i]);
      td.className = "grid";
      if (grid[j][i] > currentDate) {
        td.classList.add("future");
        continue;
      }

      if (enablePastEntries) {
        td.addEventListener('click', function() {
          var target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]');
          target.style.outline = "1px solid var(--color-calendar-graph-day-border)";
          currentDate = grid[j][i];
          console.log(currentDate);
          var target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]');
          target.style.outline = "1px solid black";
        });
      }

      var a = document.createElement('a');
      a.title = grid[j][i];
      a.innerHTML = '&nbsp;';
      td.append(a);
      tr.append(td);

      // Retrieve data.
      let data = localStorage.getItem(dataStore + grid[j][i]);
      if (data) {
        // If boolean events
        if (data === String(events.good.value)) {
          td.style.backgroundColor = events.good.color;
        }
        else if (data == String(events.bad.value)) {
          td.style.backgroundColor = events.bad.color;
        }
      }

      // Tooltip.
      td.addEventListener('mouseenter', function() {
        var div = document.createElement('div');
        div.id = "github-contrib-tooltip";
        var date = new Date(grid[j][i] + "T12:00:00");
        date = new Date(date.getTime() - (offset*60*1000));
        div.innerHTML = data ? "1" : "No";
        div.innerHTML += " events on " + date.toLocaleString('default', { month: 'long' }) + " " + nthNumber(date.getDate());
        this.append(div);
      });
      td.addEventListener('mouseleave', function() {
        var div = document.getElementById("github-contrib-tooltip");
        div.remove();
      });
    }
    tbody.append(tr);
  }
  let tfoot = document.createElement('tfoot');
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  tr.append(td);

  // Link.
  var td = document.createElement('td');
  td.colSpan = 42;
  var a = document.createElement('a');
  a.className = "muted";
  a.href=link.url;
  a.innerHTML = link.title;
  a.target = link.target ? link.target : '';
  td.append(a);
  tr.append(td);

  // Legend.
  var td = document.createElement('td');
  td.className = "legend";
  td.colSpan = 11;

  // Single gradient event

  // If boolean events
  for (event in events) {
    console.log(events[event]);
    var span = document.createElement('span');
    span.innerHTML = events[event].label;
    td.append(span);
    var div = document.createElement('div');
    // div.className = "grid " + events[event].value;
    div.className = "grid";
    div.style.backgroundColor = events[event].color;
    td.append(div);
  };

  // Multiple value events

  tr.append(td);
  tfoot.append(tr);

  // Append to target element.
  tableElem.append(thead);
  tableElem.append(tbody);
  tableElem.append(tfoot);
  elem.append(tableElem);
  elem.style.display = 'block';
};
