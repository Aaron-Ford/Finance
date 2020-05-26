$(document).ready(function(){

	//Click Handlers



		$('.icon-container .material-icons.quick-add').click(function(){

			if($(this).data('quick-add-type') == 'General'){
						refreshForm();
		$('.overlay').addClass('visible');
		$('.expense-container').addClass('expanded');
			$('.Expense-Type').show();

		setFormHeight();
			} else {
		refreshForm();
		$('.submission').show();

		setBreadcrumbs($(this).data('quick-add-type'), true);
		$("input[name='Expense Type'][value=Essentials]").attr('checked', 'checked');
		$("input[name=Essentials][value=" + $(this).data('quick-add-type') + "]").attr('checked', 'checked');


		// gotoNext($(this).data('quick-add-type'), true);

		$('.overlay').addClass('visible');
		$('.expense-container').addClass('expanded');
		setFormHeight();


}
		
	});

		function hideForm(){
$('.expense-container').removeClass('expanded');
			$('.overlay').removeClass('visible');
			$('.expense-container').css('height', '0px');
			$('.expense-container').css('overflow','hidden');
		}





	$("body").click(function(e) {
		if ($(event.target).hasClass('overlay')) {
			hideForm();
			
		} else if ($('.datepicker-modal').hasClass('open')){
															$('.expense-container').css('overflow', 'visible');



		} 
	});

	$(document).on('click','.chip', function(){
		gotoPrevious($(this).text());
	});


	generateForm();




	const scriptURL = 'https://script.google.com/macros/s/AKfycbzWd2FjKvWojfASyAwsl3lIFgRkPwgKdmSvlcIEInUBU7y56nw/exec'
	const form = document.forms['submit-to-google-sheet']

	form.addEventListener('submit', e => {
		$('input').each(function(){
			if($(this).val() == undefined || $(this).val() == 'undefined'){
				$(this).val('');
			}
		});
		e.preventDefault()
		fetch(scriptURL, { method: 'POST', body: new FormData(form)})
		.then(response => M.toast({html: 'Expense submitted.'}))
		.catch(error => console.error('Error!', error.message))
		hideForm();
	})

});



//Create Radio Form

function generateForm(){
	createRadio('Expense Type', ['Essentials:checkbook', 'Discretionary:cash-multiple']);
	createRadio('Essentials', ['~Variable', 'Petrol:gas-station', 'Groceries:cart', 'Household:spray-bottle', '|', '~Bills & Utilities', 'Mortgage:home', 'Vehicle:car', 'Cell Phone:cellphone', 'Internet:wifi', 'Water:water-pump', 'Trash:delete', 'Electric:flash', 'Natural Gas:thermometer']);
	createRadio('Discretionary', ['~Discretionary Category', 'Activities:hiking', 'Dining:silverware', 'Gifts:gift', 'Health:hospital-box', 'Home Furnishings:sofa', 'Pet:dog-side', 'Travel:airplane', '|', '~Discretionary Category', 'Aubrey:human-female', 'Aaron:human-male', 'Other:dots-horizontal']);
	createRadio('Travel', ['Flight:airplane-takeoff', 'Parking:parking', 'Toll:highway', 'Hotel:bed-king', 'Rental Car:car', 'Gas:gas-station']);
	createRadio('Vehicle', ['Payment:cash-usd', 'Insurance:shield-car', 'Maintenance:wrench', 'Toll:highway']);
	createRadio('Aaron', ['Computer:desktop-tower', 'Camera:camera', 'Tool:hand-saw', 'Clothes:hanger', 'Other:dots-horizontal']);
	createRadio('Aubrey', ['Clothes:hanger', 'Makeup:brush', 'Hair:hair-dryer', 'Other:dots-horizontal']);
	generateSubmissionSection();
	$('.radio-wrapper').hide();
	$('.submission').hide();
	$('.expense-container').css('overflow','hidden');
	$('.tag-container').html('<div class="chip waves waves-effect active">Expense Type</div>');
}

function createRadio(name, values){
	var htmlString = '<div class ="' + name.replace(' ', '-') + ' radio-wrapper row">';
	for (var i =0; i < values.length; i++){
		if (values[i] != '|' && !values[i].startsWith('~')){
			var subValues = values[i].split(':')
			if (name == 'Expense Type'){
				htmlString += '<div class = "col s6"><label class ="center"><input name="' + name + '" type = "radio" value="' + subValues[0] + '" onclick="gotoNext(this, false)"/><i class="mdi mdi-' + subValues[1] + '"></i><p>' + subValues[0] + '</p></label></div>';
			} else {
				htmlString += '<div class = "col s3"><label class ="center"><input name="' + name + '" type = "radio" value="' + subValues[0] + '" onclick="gotoNext(this, false)"/><i class="mdi mdi-' + subValues[1] + '"></i><p>' + subValues[0] + '</p></label></div>';
			}
		} else if (values[i].startsWith('~')){
			htmlString += '<div class = "col s12"><h6>' + values[i].split('~').pop() + '</h6></div>'
		} else {
			htmlString += '<div class="divider col s12"></div>'
		}
	}
	htmlString += '<input type="hidden" name="' + name + '" value="" /></div>';
	$('form').prepend(htmlString);

}

//Generate Form Height

function setFormHeight(){
	var height = $('.expense-container > .container').outerHeight(true);
	$('.expense-container').innerHeight(height);
}


//Add Expense

function gotoNext(elem, quickAdd){
	if (quickAdd == false){
		setBreadcrumbs(elem, true);
		setExpenseView($(elem).val());
	} else {
		setBreadcrumbs(elem, true);
		setExpenseView(elem);
	}
	
	
	setFormHeight();
}

function gotoPrevious(elem){
	setBreadcrumbs(elem, false);
	let chipFound = false;
	$('.chip').each(function(){
		if (chipFound == false){
			if ($(this).text() == elem){
				$(this).addClass('active');
				chipFound = true;
			}
		} else {
			$('.' + $(this).text().replace(' ', '-') + ' input').prop('checked', false);
			$(this).prev('i').remove();
			$(this).remove();

		}
	});
	setExpenseView(elem.replace(' ', '-'));
	setFormHeight();
}

function setBreadcrumbs(elem, next){
	if (next == true && typeof elem != "string"){
		elem = $(elem).val();
	}
	$('.chip').removeClass('active');
	if($('.tag-container').text() != ''){
		if (next == true){
			$('.tag-container').append('<i class ="material-icons next-arrow">keyboard_arrow_right</i>');
		}
		$('.tag-container').append('<div class="chip active waves waves-effect">' + elem + '</div>');
	} else {
		$('.tag-container').append('<div class="chip">' + elem + '</div>');
	}
}

function setExpenseView(elem){
	$('.radio-wrapper').hide();
	if($('.radio-wrapper.'+elem)[0]){
		$('.'+elem).show();
		$('.expense-container').css('overflow','hidden');
	} else {
		$('.submission').show();
		$('.expense-container').css('overflow','visible');
	}
}

function refreshForm(){
	$('form').html('');
	generateForm();
	// setFormHeight();
}

function generateSubmissionSection(){
	$('form').prepend(
		'<div class="submission radio-wrapper row">' + 
		'<div class="section col s6">' +
		'<div class="input-field">' +
		'<input id="datepicker" type="text" class="datepicker validate" name="Date">' + 
		'<label for="icon_prefix" class="active">' +
		'Date' +
		'</label>' +		
		'</div>' +
		'</div>' +
		'<div class="section col s6">' +
		'<div class="input-field">' +
		'<input id="icon_prefix" class="validate" type="number" step=".01" name="Amount" required><label for="icon_prefix">' + 
		'Amount' + 
		'</label>' +
		'</div>' +
		'</div>' +
		'<div class ="section col s12">' +
		'<div class="input-field">' +
		'<input id="notes_label" type="text" class="validate" name="Notes"><label for="notes_label">' + 
		'Notes' + 
		'</label>' +
		'</div>' +
		'</div>' +
		'<div class = "section col s12">' +
		'<div class = "col s6 offset-s3 center">' + 
		'<button type="submit" class="btn hidden primary-color">' +
		'<i class="material-icons right white-text">' +
		'send' +
		'</i>' +
		'Submit' +
		'</button>' +
		'</div>' +
		'</div>' +
		'</div>'
		);
	var date = new Date();
	document.getElementById("datepicker").value = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
	$('.datepicker').datepicker();
}

