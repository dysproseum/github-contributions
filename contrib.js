const GithubContributions = function(options) {

  const targetId = options && options.targetId ? options.targetId : 'github-contrib';
  const dataStore = options && options.localStoragePrefix ? options.localStoragePrefix : '';
  let title = options && options.title ? options.title : '% contributions in the past year';
  let link = {
    url: 'https://github.com/dysproseum/github-contributions',
    title: 'Learn how we count contributions',
  };
  link = options && options.link ? options.link : link;
  let enablePastEntries = options && options.enablePastEntries !== undefined ? options.enablePastEntries : true;

  const eventType = options && options.eventType !== undefined ? options.eventType : 'boolean';
  if (eventType == "boolean") {
    var events = {
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
  }
  else if (eventType == "gradient") {
    var colors = [null, '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    colors = options && options.colors ? options.colors : colors;
  }

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

  normalize = function(number, max) {

  };

  this.track = function(action) {
    return new Promise((resolve, reject) => {
      console.log("track " + dataStore + ", " + currentDate + ", " + action);
      let target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]');

      if (eventType == "gradient") {
        // 1 value gradient: check and increment counter
        let data = localStorage.getItem(dataStore + currentDate);
        if (data == null || isNaN(data)) {
          data = 1;
        }
        else {
          data++;
        }
        target.style.backgroundColor = colors[data];
        localStorage.setItem(dataStore + currentDate, data);
      }
      else {
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

        // good and bad: multiple values per day
      }
      resolve();
    });
  };

  const elem = document.getElementById(targetId);
  elem.innerHTML = '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  let eventCount = 0;
  console.log(eventType + " #" + targetId);
  options && console.log(options);

  // Create year array: 52 weeks by 7 days.
  let grid = Array.from(Array(52), () => new Array(7));

  // Today is nth row in last column.
  let today = new Date();
  const n = today.getDay();
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))
  console.log(n);
  let currentDate = today.toISOString().split('T')[0];
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

  // Create table html.
  let tableElem = document.createElement('table');
  let thead = document.createElement('thead');
  let tr = document.createElement('tr');
  let th = document.createElement('th');
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
        let th = document.createElement('th');
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
  th = document.createElement('th');
  th.colSpan = count;
  if (count > 1) {
    th.innerHTML = months[curMonth];
  }
  tr.append(th);
  thead.append(tr);

  // Compute max for gradient.
  let max = 0;
  let values = [];
  if (eventType == "gradient") {
    for (let i = 0; i < grid[0].length; i++) {
      for (let j = 0; j < grid.length; j++) {
        let data = parseInt(localStorage.getItem(dataStore + grid[j][i]));
        if (data) {
          if (data > max) {
            max = data;
          }
          values.push(data);
        }
      }
    }
    console.log({max});
    console.log(values);
  }

  // Transform grid.
  let tbody = document.createElement('tbody');
  for (let i = 0; i < grid[0].length; i++) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.innerHTML = dLabels[i];
    td.className = "label";
    tr.append(td);
    for (let j = 0; j < grid.length; j++) {
      let td = document.createElement('td');
      td.setAttribute('data-date', grid[j][i]);
      td.className = "grid";
      if (grid[j][i] > currentDate) {
        td.classList.add("future");
        continue;
      }

      if (enablePastEntries) {
        td.addEventListener('click', function() {
          let target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]');
          target.style.outline = "1px solid var(--color-calendar-graph-day-border)";
          currentDate = grid[j][i];
          console.log(currentDate);
          target = document.querySelector('#' + targetId + ' [data-date="' + currentDate + '"]')
          target.style.outline = "1px solid black";
        });
      }

      let a = document.createElement('a');
      a.title = grid[j][i];
      a.innerHTML = '&nbsp;';
      td.append(a);
      tr.append(td);

      // Retrieve data.
      let data = localStorage.getItem(dataStore + grid[j][i]);
      if (data) {
        if (eventType == 'gradient') {
          eventCount += parseInt(data);

          // Gradient events: distribution in 5 segments
          // 0 = no background
          // 1 = light green
          // 2 = less than 1/3 of max
          // 3 = within middle third of max
          // 4 = within 1/3 of max
          let segments = max / 3;

          switch (true) {
            case (data == 1):
              td.style.backgroundColor = colors[1];
              break;
            case (data == 2):
              td.style.backgroundColor = colors[2];
              break;
            case (data < max * 2/3):
              td.style.backgroundColor = colors[3];
              break;
            case (data <= max):
              td.style.backgroundColor = colors[4];
          }
        }
        else {
          // If boolean events
          if (data === String(events.good.value)) {
            td.style.backgroundColor = events.good.color;
            eventCount++;
          }
          else if (data == String(events.bad.value)) {
            td.style.backgroundColor = events.bad.color;
            eventCount++;
          }
        }
      }

      // Tooltip.
      td.addEventListener('mouseenter', function() {
        let div = document.createElement('div');
        div.id = "github-contrib-tooltip";
        let date = new Date(grid[j][i] + "T12:00:00");
        date = new Date(date.getTime() - (offset*60*1000));

        if (eventType == "gradient") {
          div.innerHTML = data ? data : "No";
        }
        else {
          div.innerHTML = data ? "1" : "No";
        }
        div.innerHTML += " events on " + date.toLocaleString('default', { month: 'long' }) + " " + nthNumber(date.getDate());
        this.append(div);
      });
      td.addEventListener('mouseleave', function() {
        let div = document.getElementById("github-contrib-tooltip");
        div.remove();
      });
    }
    tbody.append(tr);
  }
  let tfoot = document.createElement('tfoot');
  tr = document.createElement('tr');
  let td = document.createElement('td');
  tr.append(td);

  // Link.
  td = document.createElement('td');
  td.colSpan = 40;
  let a = document.createElement('a');
  a.className = "muted";
  a.href=link.url;
  a.innerHTML = link.title;
  a.target = link.target ? link.target : '';
  td.append(a);
  tr.append(td);

  // Legend.
  td = document.createElement('td');
  td.className = "legend";
  td.colSpan = 12;

  if (eventType == 'gradient') {
    // Gradient events
    // Less [] [] [] [] [] More
    let span = document.createElement('span');
    span.innerHTML = "Less";
    td.append(span);

    let div = document.createElement('div');
    div.className = "grid";
    div.style.backgroundColor = colors[0];
    td.append(div);
    div = document.createElement('div');
    div.className = "grid";
    div.style.backgroundColor = colors[1];
    td.append(div);
    div = document.createElement('div');
    div.className = "grid";
    div.style.backgroundColor = colors[2];
    td.append(div);
    div = document.createElement('div');
    div.className = "grid";
    div.style.backgroundColor = colors[3];
    td.append(div);
    div = document.createElement('div');
    div.className = "grid";
    div.style.backgroundColor = colors[4];
    td.append(div);

    span = document.createElement('span');
    span.innerHTML = "More";
    td.append(span);
  }
  else {
    // If boolean events
    for (event in events) {
      let span = document.createElement('span');
      span.innerHTML = events[event].label;
      td.append(span);
      let div = document.createElement('div');
      div.className = "grid";
      div.style.backgroundColor = events[event].color;
      td.append(div);
    };

    // Multiple value events
  }
  tr.append(td);
  tfoot.append(tr);

  // Header.
  let h2 = document.createElement('h2');
  title = title.replace('%', eventCount);
  h2.innerHTML = title;
  elem.append(h2);

  // Append to target element.
  tableElem.append(thead);
  tableElem.append(tbody);
  tableElem.append(tfoot);
  elem.append(tableElem);
  elem.style.display = 'block';
};
