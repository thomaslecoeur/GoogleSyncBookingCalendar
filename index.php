<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="lib/jquery-1.10.2.js"></script>
	<script src="lib/jquery-ui.js"></script>
	<script src="main.js"></script>
	<script src="js/GoogleSyncBookingCalendar.jquery.js"></script>

	<link rel="stylesheet" href="stylesheets/style.css">
	<link rel="stylesheet" href="lib/font-awesome-4.2.0/css/font-awesome.min.css">

</head>
<body>

<header id="header">
	<h1>Google Sync Booking Calendar</h1>
	<h2>A simple JQuery Plugin to improve your UI</h2>
	<nav>
		<ul>
			<li><a href="#"><i class="fa fa-github"></i></a></li>
			<li><a href="#"><i class="fa fa-twitter"></i></a></li>
			<li><a href="#"><i class="fa fa-globe"></i></a></li>
		</ul>
	</nav>
</header>

<section>
	<div id="calendar"></div>
</section>

<section id="output">
	<header>
		<h2>Output</h2>
	</header>
	<p>
		<input id="start-date" placeholder="Date d'arrivée" type="text"/>
	</p>
	<p>
		<input id="end-date" placeholder="Date de départ" type="text"/>
	</p>
</section>

<?php 


$url = "https://www.googleapis.com/calendar/v3/calendars/te6v0l7kol4vuc5j31flqvd9k0%40group.calendar.google.com/events?orderBy=updated&timeMin=2015-02-14T06%3A00%3A00%2B01%3A00&key=AIzaSyB5I_g-fNbqmngpoWBf3BI7AScNCo3pDSI";

$json = file_get_contents($url);
$obj = json_decode($json);
foreach ($obj->items as $item) {
	if(isset($item->start->date)){
		// echo 'Du '.date("j/n/Y",strtotime($item->start->date));
		// echo ' au '.date("j/n/Y",strtotime($item->end->date)).'<br>';
		?>

		<script>
			jQuery(document).ready(function($) {
				$('#calendar td').not('.ui-state-disabled').each(function(index, el) {
					if($(this).data('month') === <?php echo date("n",strtotime($item->start->date))-1?> && $(this).data('year') === <?php echo date("Y",strtotime($item->start->date))?> && $(this).children('a').html() == <?php echo date("j",strtotime($item->start->date))?>){

						$(this).addClass('booked start-booking');

						var setBooked = function(td){
							if(td.next('td').length != 0){
								$nextTd = td.next('td');
							}else if(td.parent('tr').next('tr').length != 0){
								$nextTd = td.parent('tr').next('tr').children('td').first();
							}else if(td.parents('.ui-datepicker-group').next('.ui-datepicker-group').length != 0){
								$nextTd = td.parents('.ui-datepicker-group').next('.ui-datepicker-group').find('td').first();
							}else{
								return false;
							}

							if(td.hasClass('ui-state-disabled')){
								if(!$nextTd.hasClass('ui-state-disabled')){
									td.addClass('previously');
									$nextTd.addClass('previously-rounded');
								}
							}

							if($nextTd.hasClass('ui-state-disabled')){
								if(!td.hasClass('ui-state-disabled')){
									td.addClass('continued-rounded');
									$nextTd.addClass('continued');
								}
							}

							if($nextTd.data('month') === <?php echo date("n",strtotime($item->end->date))-1?> && $nextTd.data('year') === <?php echo date("Y",strtotime($item->end->date))?> && $nextTd.children('a').html() == <?php echo date("j",strtotime($item->end->date))?>){
								
								$nextTd.addClass('booked end-booking');
								return false;
							}else{
								$nextTd.addClass('booked');
							}
							setBooked($nextTd);
						}

						setBooked($(this));
					}
				});
			});
			
		</script>

		<?php
	}
	elseif(isset($item->start->datetime)){

	}
}


 ?>

</body>
</html>