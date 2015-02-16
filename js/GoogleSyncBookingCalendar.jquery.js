jQuery(document).ready(function($) {
	startSelected = false;
	endSelected = false;

	/* Init the calendar */

	$('#calendar').datepicker({
		inline: true,
		numberOfMonths: 12,
		showOtherMonths: true,
		minDate: 0,
		maxDate: "+11m",
		hideIfNoPrevNext: true,
		onSelect: function (date, inst) {
        	inst.inline = false; // Disable calendar reset
        	// if(!startSelected && !endSelected){
        	// 	if(startSelected)
        	// 		$('#start-date').val(date);
        	// }else if(startSelected && !endSelected){
        	// 	$('#end-date').val(date);
        	// }
        	// else{
        	// 	$('#start-date').val("");
        	// 	$('#end-date').val("");
        	// }
        	currentDate = date;
        }
    });

	/* Set the language of the calendar */

	$.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );

	/* Adding navigation buttons */

	$('#calendar').append('<nav><button class="nav prev">Previous</button><button class="nav next">Next</button></nav>');




	$('#calendar td').click(function(event) {
		if(!startSelected && !endSelected){
			if(!$(this).is('.booked:not(.end-booking)') && !$(this).is('.ui-state-disabled')){
				startSelected = true;
				$(this).addClass('selected-booking');
				$(this).prepend('<aside class="bookingInfo-start">Début du séjour</aside>');
				$('#start-date').val(currentDate);
			}else{
				$(this).append('<aside class="bookingInfo-end alert">Réservation impossible</aside>');
				$('.alert').delay(3000).fadeOut();
			}
		}else if(startSelected && !endSelected){
			var $cells = $('#calendar td'),
			idx_1 = $cells.index($('.selected-booking')),
			idx_2 = $cells.index($(this));
			if((!$cells.slice(idx_1, idx_2 + 1).is('.booked:not(.start-booking)') || ($('.selected-booking').hasClass('end-booking') && !$cells.slice(idx_1, idx_2 + 1).is('.booked:not(.start-booking):not(.end-booking)') && $cells.slice(idx_1, idx_2 + 1).filter('.end-booking').length <= 1)) && $cells.slice(idx_1, idx_2 + 1).length > 1 && !$(this).is('.ui-state-disabled')){
				endSelected = true;
				$cells.slice(idx_1+1, idx_2).addClass('booking-time');
				$(this).addClass('selected-booking');
				$(this).append('<aside class="bookingInfo-end">Fin du séjour</aside>');
				$('#end-date').val(currentDate);
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
			$('#start-date').val("");
        	$('#end-date').val("");
		}
	});

	/* Set n calendars visible & enable navigation */

	var show = 3;

	$('#calendar .ui-datepicker-group').hide();
	$('#calendar .ui-datepicker-group').slice(0, show).show().addClass('visible');

	$('#calendar nav .prev').attr('disabled', 'disabled');

	$('#calendar nav .prev').click(function(event) {
		if(!$('#calendar .ui-datepicker-group-first').hasClass('visible')){
			$('#calendar nav .next').removeAttr('disabled', 'disabled');
			$prevCalendar = $('#calendar .ui-datepicker-group.visible').first().prevAll('.ui-datepicker-group').slice(0, show);
			$('#calendar .ui-datepicker-group.visible').fadeOut(100, function() {
				$prevCalendar.fadeIn(100);
			});;
			$('#calendar .ui-datepicker-group.visible').removeClass('visible');
			$prevCalendar.addClass('visible');

			if($('.ui-datepicker-group-first').hasClass('visible'))
				$('#calendar nav .prev').attr('disabled', 'disabled');
		}
	});

	$('#calendar nav .next').click(function(event) {
		if(!$('#calendar .ui-datepicker-group-last').hasClass('visible')){
			$('#calendar nav .prev').removeAttr('disabled', 'disabled');
			$nextCalendar = $('#calendar .ui-datepicker-group.visible').last().nextAll('.ui-datepicker-group').slice(0, show);
			$('#calendar .ui-datepicker-group.visible').fadeOut(100, function() {
				$nextCalendar.fadeIn(100);
			});;
			$('#calendar .ui-datepicker-group.visible').removeClass('visible');
			$nextCalendar.addClass('visible');

			if($('.ui-datepicker-group-last').hasClass('visible'))
				$('#calendar nav .next').attr('disabled', 'disabled');
		}
	});

	setBookings = function(year, month, day, yearEnd, monthEnd, dayEnd){
	$('#calendar td').not('.ui-state-disabled').each(function(index, el) {
		console.log('lala');
		if($(this).data('month') === month && $(this).data('year') === year && $(this).children('a').html() == day){
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

				if($nextTd.data('month') === monthEnd && $nextTd.data('year') === yearEnd && $nextTd.children('a').html() == dayEnd){
					
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
}

});