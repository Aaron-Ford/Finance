 var dark = false;

//scriptURL = 'https://script.google.com/macros/s/AKfycbzWd2FjKvWojfASyAwsl3lIFgRkPwgKdmSvlcIEInUBU7y56nw/exec';
//budgetURL = '1kyO824yXeg-0r2hG8Zs8viHCuxgFr744cFB2lN3lzuY'

$(document).ready(function(){


  window.localStorage.getItem('user');
  console.log(window.localStorage.getItem('theme'));

  document.documentElement.setAttribute('data-theme', window.localStorage.getItem('theme'));


//Set current month
      var months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();

var currentMonthName = months[currentMonth];
console.log('Current month is ' + currentMonthName);
$('.month-title').text(currentMonthName);


//Materialize CSS Initialization
$('.modal').modal();
$('select').formSelect();

$('.collapsible').collapsible();
$('.tabs').tabs({
 swipeable : true
});
$('.datepicker').datepicker();
$('.sidenav').sidenav();


$('.switch.green').click(function(){
  document.documentElement.setAttribute('data-theme', 'green');
  window.localStorage.setItem('theme', 'green');
});

$('.switch.purple').click(function(){
  document.documentElement.setAttribute('data-theme', 'purple');
  window.localStorage.setItem('theme', 'purple');
});

$('.switch.blue').click(function(){
  document.documentElement.setAttribute('data-theme', 'blue');
  window.localStorage.setItem('theme', 'blue');
});
$('.switch.red').click(function(){
  document.documentElement.setAttribute('data-theme', 'red');
  window.localStorage.setItem('theme', 'red');
});
$('.switch.dark').click(function(){
  document.documentElement.setAttribute('data-theme', 'dark');
  window.localStorage.setItem('theme', 'dark');
});
$('.switch.google').click(function(){
  document.documentElement.setAttribute('data-theme', 'google');
  window.localStorage.setItem('theme', 'google');
});
var instance = M.Collapsible.getInstance($('.collapsible'));
var sidenavInstance = M.Sidenav.getInstance($('.sidenav'));

$('select').on('change', function() {

  showBudget(this.value);
  $('.carousel').scrollTop();


});

var months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};



$('input[type=radio][name="group2"]').change(function () {   
  $('.month-title').text(this.value);
  instance.close();


  var selectedMonth = months[this.value];
  setTimeout(function(){
  showBudget(selectedMonth);
  }, 300);

});

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
  $('.carousel').css('height','calc(100vh - 112px)');
});





$('.color-container').hide();





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
             $('.color-container').hide();
             dark = true;
           } else {
             $('.color-container').show();
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



