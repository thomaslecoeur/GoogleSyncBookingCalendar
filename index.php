<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="lib/jquery-1.10.2.js"></script>
	<script src="lib/jquery-ui.js"></script>
	<script src="main.js"></script>
	<script>
	    $(function() {
	    	var startSelected = false;
	    	var endSelected = false;

	    	$('#calendar').datepicker({
			        inline: true,
      				numberOfMonths: 12,
			        showOtherMonths: true,
			        minDate: 0,
			        maxDate: "+11m",
			        hideIfNoPrevNext: true,
			        onSelect: function (date, inst) {
			        	inst.inline = false; // Disable calendar reset
			        	if(!startSelected && !endSelected){
			        		$('#start-date').val(date);
			        	}else if(startSelected && !endSelected){
			        		$('#end-date').val(date);
			        	}
			        	else{
			        		$('#start-date').val("");
			        		$('#end-date').val("");
			        	}
				    }
			    });

	    	$.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );

	    	$('#calendar td').click(function(event) {
	    		if(!startSelected && !endSelected){
	    			startSelected = true;
		    		$(this).addClass('selected-booking');
		    		$(this).prepend('<aside class="bookingInfo-start">Début du séjour</aside>');
	    		}else if(startSelected && !endSelected){
	    			// var wrong = false;
	    			// while($endTd !== $(this) && wrong == false){
	    			// 	$('.selected-booking').
	    			// }
	    			var $cells = $('#calendar td'),
			        idx_1 = $cells.index($('.selected-booking')),
			        idx_2 = $cells.index($(this));

	    			if(!$cells.slice(idx_1, idx_2 + 1).is('.booked:not(.start-booking)') && $cells.slice(idx_1, idx_2 + 1).length > 1){
		    			endSelected = true;
				    	$cells.slice(idx_1+1, idx_2).addClass('booking-time');
			    		$(this).addClass('selected-booking');
			    		$(this).append('<aside class="bookingInfo-end">Fin du séjour</aside>');
			    	}else{
			    		$(this).append('<aside class="bookingInfo-end alert">Réservation impossible</aside>');
			    		$('.alert').delay(3000).fadeOut();
			    	}
	    		}else{
	    			$('aside.bookingInfo-start, aside.bookingInfo-end').remove();
	    			$('.selected-booking').removeClass('selected-booking');
	    			$('.booking-time').removeClass('booking-time');
	    			startSelected = false;
	    			endSelected = false;
	    		}
	    	});

	    	//$('#calendar .ui-datepicker-group').hide();
	    	//$('#calendar .ui-datepicker-group').slice(0, 3).show();
	    });
	</script>

	<link href='http://fonts.googleapis.com/css?family=Quicksand:700' rel='stylesheet' type='text/css'>

	<link rel="stylesheet" href="stylesheets/style.css">

</head>
<body>
	
<div id="calendar"></div>

<input id="start-date" type="text"/><input id="end-date" type="text"/>

<?php 


$url = "https://www.googleapis.com/calendar/v3/calendars/te6v0l7kol4vuc5j31flqvd9k0%40group.calendar.google.com/events?orderBy=updated&timeMin=2015-02-14T06%3A00%3A00%2B01%3A00&key=AIzaSyB5I_g-fNbqmngpoWBf3BI7AScNCo3pDSI";

$json = file_get_contents($url);
$obj = json_decode($json);
//var_dump($obj->items);
//$obj->items[] = $obj->items[0];
// $obj->items[0]->start->date = '2015-03-21';
// $obj->items[0]->end->date = '2015-03-24';


// $obj->items[1]->start->date = '2015-03-30';
// $obj->items[1]->end->date = '2015-04-02';

// $obj->items[21]->start->date = '2015-04-29';
// $obj->items[21]->end->date = '2015-05-02';

//var_dump($obj->items);
//var_dump($obj->items);
foreach ($obj->items as $item) {
	if(isset($item->start->date)){
		// echo 'Du '.date("j/n/Y",strtotime($item->start->date));
		// echo ' au '.date("j/n/Y",strtotime($item->end->date)).'<br>';
		?>

		<script>
			jQuery(document).ready(function($) {
				$('#calendar td').not('.ui-state-disabled').each(function(index, el) {
					// console.log(el);
					//console.log($(this).children('a').html());
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