(function($)
{
       $.fn.GSBookingCalendar=function(options)
       {
              var dateTime = new Date();
              var year = dateTime.getFullYear();
              var month = ((dateTime.getMonth().length+1) === 1)? (dateTime.getMonth()+1) : '0' + (dateTime.getMonth()+1);
              var day = dateTime.getDate();

              var defauts=
              {
                     'calendarID': null,
                     'key': null,
                     'timeMin': 'now',
                     'timeMax': null,
                     'show': 3, //TODO
                     'lang': null,
                     'outputDateFormat': 'yy-mm-dd',
                     'output': true,
                     'showNav': true, //TODO
                     'prevText': 'previous',
                     'nextText': 'next'
              };

              var param=$.extend(defauts, options);

              /**
              *
              * Set language
              *
              **/

              if(param.lang){
                     $.datepicker.setDefaults( $.datepicker.regional[ param.lang ] );
              }else{
                     $.datepicker.setDefaults( $.datepicker.regional[ "en" ] );
              }
              

              /**
              *
              * Configurate timeMin and timeMax values
              *
              **/

              if( $.isPlainObject(param.timeMax) )
              {
                     param.timeMax = new Date(
                            param.timeMax.year + 1,
                            param.timeMax.month,
                            param.timeMax.day,
                            0,
                            0,
                            0
                     ).toISOString();
              }
              else if($.type( param.timeMax ) === 'string')
              {
                     /**
                     
                            TODO:
                            - Add the + X years/months/days
                     
                     **/
                     
              }
              else
              {
                     param.timeMax = new Date(9999, 1, 1).toISOString();
              }

              if( param.timeMin == 'now' ) {
                     param.timeMin = new Date().toISOString();
              }
              else if( $.isPlainObject(param.timeMin) )
              {
                     param.timeMin = new Date(
                            param.timeMin.year,
                            param.timeMin.month-1,
                            param.timeMin.day,
                            1,
                            0,
                            0
                     ).toISOString();
              }
              

              /**
              *
              * Ajax request
              *
              **/

              var bookings;

              // Disable asyncroning
              $.ajaxSetup({async:false});

              // Create the request
              var calendarRequest = $.ajax({
                     url: 'https://www.googleapis.com/calendar/v3/calendars/' + param.calendarID + '/events',
                     type: 'GET',
                     dataType: 'json',
                     data: {
                            key: param.key,
                            timeMin: param.timeMin,
                            timeMax: param.timeMax
                     }
              })
              .done(function() {
                     // Stock Json response
                     var bookings = calendarRequest.responseJSON.items;
              })
              .fail(function() {
                     console.log("error in the request");
              });

              return this.each(function()
              {
                     $calendar = $(this);
                     $calendar.datepicker({
                            inline: true,
                            numberOfMonths: 12,
                            showOtherMonths: true,
                            minDate: 0,
                            maxDate: "+11m",
                            hideIfNoPrevNext: true,
                            onSelect: function (date, inst) {
                                   inst.inline = false;
                                   currentDate = date;
                            },
                            dateFormat: param.outputDateFormat
                     });

                     /* Adding navigation buttons */

                     $calendar.append('<nav><button class="nav prev"></button><button class="nav next"></button></nav>');

                     /* Set n calendars visible */

                     $($calendar.find('.ui-datepicker-group')).hide();
                     $($calendar.find('.ui-datepicker-group')).slice(0, param.show).show().addClass('visible');

                     $($calendar.find('nav .prev')).attr('disabled', 'disabled');

                     /* Enable navigation */

                     $($calendar.find('nav .prev')).click(function(event) {
                            if(!$($calendar.find('.ui-datepicker-group-first')).hasClass('visible')){
                                   $($calendar.find('nav .next')).removeAttr('disabled', 'disabled');
                                   $prevCalendar = $($calendar.find('.ui-datepicker-group.visible')).first().prevAll('.ui-datepicker-group').slice(0, param.show);
                                   $($calendar.find('.ui-datepicker-group.visible')).fadeOut(100, function() {
                                          $prevCalendar.fadeIn(100);
                                   });;
                                   $($calendar.find('.ui-datepicker-group.visible')).removeClass('visible');
                                   $prevCalendar.addClass('visible');

                                   if($('.ui-datepicker-group-first').hasClass('visible'))
                                          $('#calendar nav .prev').attr('disabled', 'disabled');
                            }
                     });

                     $($calendar.find('nav .next')).click(function(event) {
                            if(!$($calendar.find('.ui-datepicker-group-last')).hasClass('visible')){
                                   $($calendar.find('nav .prev')).removeAttr('disabled', 'disabled');
                                   $nextCalendar = $($calendar.find('.ui-datepicker-group.visible')).last().nextAll('.ui-datepicker-group').slice(0, param.show);
                                   $($calendar.find('.ui-datepicker-group.visible')).fadeOut(100, function() {
                                          $nextCalendar.fadeIn(100);
                                   });;
                                   $($calendar.find('.ui-datepicker-group.visible')).removeClass('visible');
                                   $nextCalendar.addClass('visible');

                                   if($('.ui-datepicker-group-last').hasClass('visible'))
                                          $('#calendar nav .next').attr('disabled', 'disabled');
                            }
                     });

                     var $cells = $calendar.find('td');

                     $.each(bookings, function(index, val) {
                            startTime = $.datepicker.parseDate( "yy-mm-dd", val.start.date );
                            startYear = startTime.getFullYear();
                            startMonth = startTime.getMonth(); // from 0 to 11
                            startDay = startTime.getDate(); // from 1 to X

                            endTime = $.datepicker.parseDate( "yy-mm-dd", val.end.date );
                            endYear = endTime.getFullYear();
                            endMonth = endTime.getMonth(); // from 0 to 11
                            endDay = endTime.getDate(); // from 1 to X

                            $startCaseLink = $calendar
                                          .find("td[data-year='" + startYear + "'][data-month='" + startMonth + "'] a")
                                          .filter(
                                          function() {
                                                 return $(this).text() == startDay;
                                          });

                            $startCase = $startCaseLink.parent('td');
                            $startCase.addClass('booked start-booking');

                            $endCaseLink = $calendar
                                          .find("td[data-year='" + endYear + "'][data-month='" + endMonth + "'] a")
                                          .filter(
                                          function() {
                                                 return $(this).text() == endDay;
                                          });

                            $endCase = $endCaseLink.parent('td');
                            $endCase.addClass('booked end-booking');

                            idx_1 = $cells.index($startCase);
                            idx_2 = $cells.index($endCase);
                            $cells.slice(idx_1+1, idx_2).addClass('booked full-booked');

                            var continued = false;
                            var previously = false;

                            $.each($cells.slice(idx_1+1, idx_2), function(index, val) {
                                   if($(this).hasClass('ui-state-disabled') && !continued){
                                         $(this).addClass('continued');
                                         continued = true;
                                   }

                                   if($(this).hasClass('ui-state-disabled') && !$($cells[$cells.index(val)+1]).hasClass('ui-state-disabled') && !previously){
                                          console.log();
                                          $(this).addClass('previously');
                                          previously = true;
                                   }
                            });
                     });

                     if(param.output){
                            startSelected = false;
                            endSelected = false;
                            var $cells = $('#calendar td');

                            $calendar.find("td:not(.ui-state-disabled):not(.full-booked)").click(function(event) {
                                   var error = false;
                                   if( !$(event.target).is('a, td') )
                                          return false;
                                   if(param.startOutput && !startSelected){
                                          if(!$(this).hasClass('start-booking')){ 
                                                 startSelected = true;
                                                 $(this).addClass('selected-booking arrival');
                                                 $(this).prepend('<aside class="bookingInfo-start"><span class="deleteBooking deleteAll"></span>Début du séjour</aside>');
                                                 param.startOutput.val(currentDate);

                                                 idx_1 = $cells.index($(this));
                                          }
                                          else{
                                                 error = true;
                                          }
                                   }
                                   else if(param.endOutput && !endSelected){
                                          idx_2 = $cells.index($(this));

                                          if(!$cells.slice(idx_1, idx_2 + 1).hasClass('full-booked') && !($cells.slice(idx_1 + 1, idx_2).hasClass('start-booking') && $cells.slice(idx_1, idx_2 + 1).hasClass('end-booking')) && $cells.slice(idx_1, idx_2 + 1).length > 1){
                                                 endSelected = true;
                                                 $cells.slice(idx_1+1, idx_2).addClass('booking-time');

                                                 $(this).addClass('selected-booking departure');
                                                 $(this).append('<aside class="bookingInfo-end">Fin du séjour<span class="deleteBooking deleteEnd"></span></aside>');
                                                 param.endOutput.val(currentDate);
                                                 console.log("2");
                                          }else{
                                                 error = true;
                                          }
                                   }

                                   if(error == true){
                                          $(this).append('<aside class="bookingInfo-end alert">Réservation impossible</aside>');
                                          $('.alert').delay(1500).fadeOut();
                                   }
                            });

                            $('td').on('click', '.deleteAll', function(event) {
                                   event.preventDefault();
                                   $('.bookingInfo-start, .bookingInfo-end').remove();
                                   $('.selected-booking').removeClass('selected-booking');
                                   $('.booking-time').removeClass('booking-time');
                                   startSelected = false;
                                   endSelected = false;
                                   param.startOutput.val("");
                                   param.endOutput.val("");
                            });

                            $('td').on('click', '.deleteEnd', function(event) {
                                   event.preventDefault();
                                   $('.bookingInfo-end').remove();
                                   $('.selected-booking.departure').removeClass('selected-booking');
                                   $('.booking-time').removeClass('booking-time');
                                   endSelected = false;
                                   param.endOutput.val("");
                            });
                     }
                     
              });
       };
})(jQuery);