window.addEventListener('load', function() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  let currentDate;

  const bad = document.getElementById("bad");
  bad.addEventListener('click', function() {
   var target = document.getElementById(currentDate);
   target.style.backgroundColor = "#600";

   localStorage.setItem(currentDate, "bad");
  });

  const good = document.getElementById("good");
  good.addEventListener('click', function() {
   var target = document.getElementById(currentDate);
   target.style.backgroundColor = "#060";

   localStorage.setItem(currentDate, "good");
  });

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
  const elem = document.getElementById("github-contrib");
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
      month = new Date(grid[i][j]).getMonth();
    }
    if (curMonth != month) {
      if (curMonth != -1) {
        var th = document.createElement('th');
        th.colSpan = count;
        th.innerHTML = months[curMonth];
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
  th.innerHTML = months[curMonth];
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
      td.id = grid[j][i];
      td.className = "grid";
      let data = localStorage.getItem(grid[j][i]);
      if (data) {
        td.classList.add(data);
      }
      var a = document.createElement('a');
      a.title = grid[j][i];
      a.innerHTML = '&nbsp;';
      a.addEventListener('click', function() {
        let target = document.getElementById(currentDate);
        target.style.outline = "1px solid var(--color-calendar-graph-day-border)";
        currentDate = grid[j][i];
        console.log(currentDate);
        target = document.getElementById(currentDate);
        target.style.outline = "auto";
      });
      td.append(a);
      tr.append(td);
    }
    tbody.append(tr);
  }

  // Append to target element.
  tableElem.append(thead);
  tableElem.append(tbody);
  elem.append(tableElem);
  elem.style.display = 'block';

});
