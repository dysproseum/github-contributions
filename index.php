<html>
<head>
<style type="text/css">
html {
 --color-calendar-graph-day-bg: #ebedf0;
 --color-calendar-graph-day-border: rgba(27, 31, 35, 0.06);
}

#github-contrib {
  display: none;
  line-height: 12px;
  margin: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}

#github-contrib table {
  padding: 10px;
  border-radius: 2px;
  outline: 1px solid var(--color-calendar-graph-day-border);
  outline-offset: -1px;
}


#github-contrib th {
  font-size: 12px;
  font-weight: normal;
}

#github-contrib tr {
  line-height: 10px;
}

#github-contrib td {
  width: 10px;
}

#github-contrib td.bad {
  background-color: red !important;
}

#github-contrib td.good {
  background-color: green !important;
}

#github-contrib td.label {
  padding: .125em .5em .125em 0;
  font-size: 12px;
  font-weight: var(--base-text-weight-normal, 400);
  color: var(--fgColor-default, var(--color-fg-default));
  text-align: left;
  fill: var(--fgColor-default, var(--color-fg-default));
}

#github-contrib td.grid {
  fill: var(--color-calendar-graph-day-bg);
  shape-rendering: geometricPrecision;
  background-color: var(--color-calendar-graph-day-bg);
  border-radius: 2px;
  outline: 1px solid var(--color-calendar-graph-day-border);
  outline-offset: -1px;
}

#github-contrib td a {
  display: block;
  width: 100%;
  cursor: pointer;
  font-size: 10px;
}
</style>
<script type="text/javascript">
let currentRow;
let currentElement;
let currentDate;

window.addEventListener('load', function() {
  const bad = document.getElementById("bad");
  const good = document.getElementById("good");
  const table = document.getElementById("contrib");

  bad.addEventListener('click', function() {
   currentElement.style.backgroundColor = "#600";
   var target = document.getElementById(currentDate);
   target.style.backgroundColor = "#600";

   localStorage.setItem(currentDate, "bad");
  });
  good.addEventListener('click', function() {
   currentElement.style.backgroundColor = "#060";
   var target = document.getElementById(currentDate);
   target.style.backgroundColor = "#060";

   localStorage.setItem(currentDate, "good");
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const previousMonth = (month) => {
    if (month == 0) {
      return 11;
    }
    else {
      return month - 1
    }
  };

  let grid = Array.from(Array(52), () => new Array(7));
  let today = new Date();
  const offset = today.getTimezoneOffset()
  today = new Date(today.getTime() - (offset*60*1000))

  // today is nth row and last column
  const n = today.getDay();
  console.log(n);
  currentRow = document.querySelectorAll("tr")[n];
  // console.log(currentRow);
  currentElement = currentRow.querySelectorAll("td")[51];
  // console.log(currentElement);

  currentDate = today.toISOString().split('T')[0];
  console.log(currentDate);
  console.log(grid);

  // get last day of week
  let curDate = today;
  curDate = new Date(curDate.getTime() + 86400 * 1000 * (6 - n));
  // grid[51][6] = curDate.toISOString().split('T')[0];
  curDate = new Date(curDate.getTime() + 86400 * 1000);

  // Fill columns and month labels
  let mLabels = [];
  for (let w = 51; w >= 0; w--) {
    for (let i = 6; i >= 0; i--) {
      curDate = new Date(curDate.getTime() - 86400 * 1000);
      grid[w][i] = curDate.toISOString().split('T')[0];
      mLabels[w] = months[curDate.getMonth()];
    }
  }
  let dLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Create html
  const elem = document.getElementById("github-contrib");
  var tableElem = document.createElement('table');
  var thead = document.createElement('thead');
  var tr = document.createElement('tr');
  var th = document.createElement('th');
  tr.append(th);

  // Calculate colspans.
  // let mCount = [];
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
console.log("appending " + months[curMonth] + " colspan " + count);
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
console.log("appending " + months[curMonth] + " colspan " + count);
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
</script>
</head>

<?php 

$days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
$months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

?>

<body>

<!-- action -->

<button id="bad">Feeling bad</button>
<button id="good">Feeling good</button>

<!-- grid: custom element? -->
<div id="github-contrib"></div>

<table id="contrib" border=1>
  <thead>
    <tr>
    <?php foreach ($months as $i => $month): ?>
    <td colspan="4"><?php print $month; ?></td>
    <?php endforeach; ?>
    </tr>
  </thead>
  <tbody>
    <?php for ($i=0; $i < 7; $i++): ?>
    <tr>
      <td><?php print $days[$i]; ?>
      <?php for ($j=0; $j < 52; $j++): ?>
      <td><?php print "$i, $j"; ?></td>
      <?php endfor; ?>
    </tr>
    <?php endfor; ?>
  </tbody>
</table>
        
      
