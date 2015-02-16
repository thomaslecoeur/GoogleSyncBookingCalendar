<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Google Sync Booking Calendar | Made with love by Thomas Lecoeur</title>
	<script src="lib/jquery-1.10.2.js"></script>
	<script src="lib/jquery-ui.js"></script>
	<script src="main.js"></script>
	<script src="js/GoogleSyncBookingCalendar.jquery.js"></script>

	<link rel="stylesheet" href="stylesheets/style.css">
	<link rel="stylesheet" href="lib/font-awesome-4.2.0/css/font-awesome.min.css">

</head>
<body>

<header id="header">
	<h1>Google Sync Booking Calendar <span class="version">Beta Version</span></h1>
	<h2>A user-friedly booking dates picker synced with your Google booking agenda</h2>
	<nav>
		<ul>
			<li><a title="Github" href="https://github.com/Thomeuxe/GoogleSyncBookingCalendar" target="_blank"><i class="fa fa-github"></i></a></li>
			<li><a title="Thomas Lecoeur's Twitter" href="https://twitter.com/Thomas_Lecoeur" target="_blank"><i class="fa fa-twitter"></i></a></li>
			<li><a title="Developer's website" href="http://www.thomaslecoeur.com" target="_blank"><i class="fa fa-globe"></i></a></li>
			<li><a title="Report a bug" href="http://www.thomaslecoeur.com#contact"><i class="fa fa-bug"></i></a></li>
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
	$date = new stdClass();
	$date->start = new stdClass();
	$date->end = new stdClass();
	if(isset($item->start->date)){
		$date->start->year = (int) date("Y",strtotime($item->start->date));
		$date->start->month = (int) date("n",strtotime($item->start->date))-1;
		$date->start->day = (int) date("j",strtotime($item->start->date));


		$date->end->year = (int) date("Y",strtotime($item->end->date));
		$date->end->month = (int) date("n",strtotime($item->end->date))-1;
		$date->end->day = (int) date("j",strtotime($item->end->date));
	}
	//var_dump($date);
		// echo 'Du '.date("j/n/Y",strtotime($item->start->date));
		// echo ' au '.date("j/n/Y",strtotime($item->end->date)).'<br>';
		?>
		<!-- <script>
			jQuery(document).ready(function($) {
				setBookings(<?php echo date("Y",strtotime($item->start->date))?>, <?php echo date("n",strtotime($item->start->date))-1?>, <?php echo date("n",strtotime($item->start->date))?>, <?php echo date("Y",strtotime($item->end->date))?>, <?php echo date("n",strtotime($item->end->date))-1?>, <?php echo date("n",strtotime($item->end->date))?>);
			});
		</script> -->
		<script>

			jQuery(document).ready(function($) {
				$('#calendar td').not('.ui-state-disabled').each(function(index, el) {
					if($(this).data('month') === <?php echo $date->start->month ?> && $(this).data('year') === <?php echo $date->start->year ?> && $(this).children('a').html() == <?php echo $date->start->day ?>){

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

							if($nextTd.data('month') === <?php echo $date->end->month ?> && $nextTd.data('year') === <?php echo $date->end->year ?> && $nextTd.children('a').html() == <?php echo $date->end->day ?>){
								
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


 ?>

</body>
</html>