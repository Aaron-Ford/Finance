 var dark = false;


$(document).ready(function(){



//Materialize CSS Initialization
 $('.modal').modal();
 $('.collapsible').collapsible();
 $('.tabs').tabs({
   swipeable : true
 });
  $('.datepicker').datepicker();



//Background Colors
 $('.savings').click(function(){
  $('body').addClass('savings').removeClass('mortgage').removeClass('budget');
});

 $('.budget').click(function(){
  $('body').addClass('budget').removeClass('savings').removeClass('mortgage');
  var dt = new Date();
  var time = dt.getHours();
});

 $('.mortgage').click(function(){
  $('body').addClass('mortgage').removeClass('savings').removeClass('budget');
});


 $(document).mousedown(function(e){
  changeTheme(e);
});


//Display Settings

 $(window).resize(function() {
  $('.carousel').css('height','calc(100vh - 120px)');
});


//Click Handlers

 $('.material-icons').click(function(){
  $('.overlay').addClass('visible');
  $('.expense-container').addClass('expanded');
   setTimeout(setFormHeight, 0);
// setFormHeight();
});


 $("body").click(function(e) {
  if ($(event.target).hasClass('overlay')) {
       $('.expense-container').removeClass('expanded');
   $('.overlay').removeClass('visible');
   $('.expense-container').css('height', '0px');
  } else if ($('.datepicker-modal').hasClass('open')){
    console.log('IT EXISTS');
    

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
  refreshForm();
})



});




//Functions


//Theme
function changeTheme(e){
  switch(e.which)
  {
    case 1:
            //left Click
            break;
            case 2:
            if (dark == false){
             document.documentElement.setAttribute('data-theme', 'dark');
             dark = true;
           } else {
            document.documentElement.setAttribute('data-theme', 'light');
            dark = false;
          }
          break;
          case 3:
            //right Click
            break;
          }
    return true;// to allow the browser to know that we handled it.
  }



//Carousel Display
function setCarouselHeight(){

  var maxCarouselHeight = 0;
  $('.carousel-item').each(function(){
    if ($(this).height() > maxCarouselHeight){
      maxCarouselHeight = $(this).height();
    }
  });

  $('.carousel').css('height', maxCarouselHeight + 50 + 'px');

}


//Create Radio Form

function generateForm(){
  createRadio('Expense Type', ['Essentials:checkbook', 'Discretionary:cash-multiple']);
  createRadio('Essentials', ['~Variable', 'Petrol:gas-station', 'Groceries:cart', 'Household:spray-bottle', '|', '~Bills & Utilities', 'Mortgage:home', 'Vehicle:car', 'Cell Phone:cellphone', 'Internet:wifi', 'Water:water-pump', 'Trash:delete', 'Electric:flash', 'Natural Gas:thermometer']);
  createRadio('Discretionary', ['~Discretionary Category', 'Activities:hiking', 'Dining:silverware', 'Gifts:gift', 'Health:hospital-box', 'Home Furnishings:sofa', 'Pet:dog-side', 'Travel:airplane', '|', '~Discretionary Category', 'Aubrey:human-female', 'Aaron:human-male', 'Other:dots-horizontal']);
  createRadio('Groceries', ['Option 1', 'Option 2']);
    createRadio('Travel', ['Flight:airplane-takeoff', 'Parking:parking', 'Toll:highway', 'Hotel:bed-king', 'Rental Car:car', 'Gas:gas-station']);
        createRadio('Vehicle', ['Payment:cash-usd', 'Insurance:shield-car', 'Maintenance:wrench']);
        createRadio('Aaron', ['Computer:desktop-tower', 'Camera:camera', 'Tool:hand-saw', 'Clothes:hanger']);
  generateSubmissionSection();
  $('.radio-wrapper:not(.Expense-Type)').addClass('hidden').addClass('faded');
  $('.submission').addClass('hidden').hide();
  $('.expense-container').css('overflow','hidden');
  $('.tag-container').html('<div class="chip waves waves-effect deep-purple white-text">Expense Type</div>')
}

 function createRadio(name, values){

  var htmlString = '<div class ="' + name.replace(' ', '-') + ' radio-wrapper row">';
  for (var i =0; i < values.length; i++){
    if (values[i] != '|' && !values[i].startsWith('~')){
      var subValues = values[i].split(':')
      if (name == 'Expense Type'){
        htmlString += '<div class = "col s6"><label class ="center"><input name="' + name + '" type = "radio" value="' + subValues[0] + '" onclick="gotoNext(this)"/><i class="mdi mdi-' + subValues[1] + '"></i><p>' + subValues[0] + '</p></label></div>';
      } else {
      htmlString += '<div class = "col s3"><label class ="center"><input name="' + name + '" type = "radio" value="' + subValues[0] + '" onclick="gotoNext(this)"/><i class="mdi mdi-' + subValues[1] + '"></i><p>' + subValues[0] + '</p></label></div>';
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
  var height = 0;

  $('.expense-container .radio-buttons .radio-wrapper:not(.hidden)').each(function(){
    height += $(this).outerHeight(true);
    console.log('radio wrapper height is ' + $(this).outerHeight(true));
  });
  height += $('.tag-container').outerHeight(true);
  console.log('tag container height is ' + $('.tag-container').outerHeight(true));
  // height += $('.expense-container h4').outerHeight(true);
  console.log('expense container height is ' + $('.expense-container').innerHeight());
  console.log('height is ' + height);
  // if ($('.expense-container').innerHeight() < height){
    $('.expense-container').innerHeight(height);
  // }
}

function setFormHeight2(){
  var height = 0;

  $('.expense-container .radio-buttons .radio-wrapper.faded:not(.hidden)').each(function(){
    height += $(this).outerHeight(true);
    console.log('radio wrapper height is ' + $(this).outerHeight(true));
  });
  height += $('.tag-container').outerHeight(true);
  console.log('tag container height is ' + $('.tag-container').outerHeight(true));
  // height += $('.expense-container h4').outerHeight(true);
  console.log('expense container height is ' + $('.expense-container').innerHeight());
  console.log('height is ' + height);
  // if ($('.expense-container').innerHeight() < height){
    $('.expense-container').innerHeight(height);
  // }
}


//Add Expense

function gotoNext(elem){
  $('.chip').removeClass('deep-purple').removeClass('white-text');
  if($('.tag-container').text() != ''){
    $('.tag-container').append('<i class ="material-icons next-arrow">keyboard_arrow_right</i>');
    $('.tag-container').append('<div class="chip deep-purple white-text waves waves-effect">' + $(elem).val() + '</div>');
  } else {
    $('.tag-container').append('<div class="chip">' + $(elem).val() + '</div>');
  }

changeView(elem, true);


}


function changeView(elem, next){
    $('.radio-wrapper').addClass('fade-out');

    if(next == true){
      var obj = $('.'+$(elem).val())
    } else {
      var obj = $('.'+elem.replace(' ', '-'));
    }
        if($(obj)[0]){



  $(obj).delay(300).queue(function(){
    $('.radio-wrapper').removeClass('fade-out').addClass('faded').addClass('hidden');
          $(this).removeClass('hidden').removeClass('fade-out').dequeue();
      setFormHeight2();
      
    });
  $(obj).delay(300).queue(function(){
    $(this).removeClass('faded').dequeue();
      
    });



  } else {
    $('.submission').delay(1000).removeClass('hidden');
    $('.expense-container').css('overflow','visible');
  }

 // setTimeout(setFormHeight, 400);
}


function gotoPrevious(elem){
  $('.chip').removeClass('deep-purple').removeClass('white-text');
  if($('.tag-container').text() != ''){
    $('.tag-container').append('<div class="chip deep-purple white-text waves waves-effect">' + elem + '</div>');
  } else {
    $('.tag-container').append('<div class="chip">' + elem + '</div>');
  }

  var chipFound = false;
  $('.chip').each(function(){
    if (chipFound == false){
      if ($(this).text() == elem){
        $(this).addClass('deep-purple').addClass('white-text');
        chipFound = true;
      }
    } else {
      $('.' + $(this).text().replace(' ', '-') + ' input').prop('checked', false);
      $(this).prev('i').remove();
      $(this).remove();

    }
  });


changeView(elem, false);
$('.expense-container').css('overflow','hidden');
}


function refreshForm(){
  $('form').html('');
  generateForm();
  setTimeout(setFormHeight, 0);
  // setFormHeight();
}

function generateSubmissionSection(){
  $('form').prepend('<div class="submission radio-wrapper"><div class="section"><div class="input-field"><i class="material-icons prefix">attach_money</i><input id="icon_prefix" type="text" class="validate" type="number" name="Amount" required><label for="icon_prefix">Amount</label></div></div><div class="section"><div class="input-field"><i class="material-icons prefix">calendar_today</i><input id="datepicker" type="text" class="datepicker validate" name="Date"><label for="icon_prefix"></label></div></div><button type="submit" class="btn hidden deep-purple">Submit</button></div>');
  var date = new Date();
  document.getElementById("datepicker").value = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
  $('.datepicker').datepicker();
}

