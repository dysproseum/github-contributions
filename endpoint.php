<?php 

// Create sample events with random values.

$event_type = "boolean";
if (isset($_REQUEST['eventType']) && $_REQUEST['eventType'] == "gradient") {
  $event_type = "gradient";
}

$time = time();
$start = $time - 86400 * 365;

$out = [];
$out['end_date'] = date('Y-m-d', $start);
$out['data'] = [];
while($time > $start) {
  $time -= 86400;
  if (rand(0, 1) == 1) {
    continue;
  }
  $now = date('Y-m-d', $time);
  if ($event_type == "gradient") {
    $out['data'][$now] = rand(0, 10);
  }
  else {
    $out['data'][$now] = (rand(0, 1) == 1);
  }
}

header('Content-type: application/json');
print json_encode($out, JSON_PRETTY_PRINT);
