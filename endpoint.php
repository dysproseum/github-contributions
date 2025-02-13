<?php 

// Create sample events with random values.

$time = time();
$start = $time - 86400 * 365;

$out = [];
$out['end_date'] = date($start);
$out['data'] = [];
while($time > $start) {
  $now = date('Y-m-d', $time);
  $out['data'][$now] = rand(0, 10);
  $time -= 86400;
}

header('Content-type: application/json');
print json_encode($out, JSON_PRETTY_PRINT);
