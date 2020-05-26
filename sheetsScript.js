      // Client ID and API key from the Developer Console
      var CLIENT_ID = '445085220435-idkhgdp1mjq4kms616f0eheht2k16f37.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyBJFf7DnKKWM5NRnIEr8X4JdSWGWUMOJyU';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

      var authorizeButton = document.getElementById('authorize_button');
      var signoutButton = document.getElementById('signout_button');

      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();




      /**
       *  On load, called to load the auth2 library and API client library.
       */
       function handleClientLoad() {

        gapi.load('client:auth2', initClient);




      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */

       var GoogleAuth;
       function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          fetch_basic_profile: true,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          GoogleAuth = gapi.auth2.getAuthInstance();
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        }, function(error) {
          console.log('ERROR START');
          $('.preloader-text').append('<p class="preloader-user-name" style = "display:none;">It appears this is a new account. Lets go through the setup process.</p>');
          appendPre(JSON.stringify(error, null, 2));
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */

       function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          console.log('CURRENT USER' + GoogleAuth.currentUser.get().getBasicProfile().getName());
          $('.preloader-text').append('<p class="preloader-user-name" style = "display:none;">Welcome back, ' + GoogleAuth.currentUser.get().getBasicProfile().getGivenName() + '.</p>');
          $('.preloader-user-name').fadeIn();
          $('.progress').fadeIn();
          $('.profile-pic').attr("src", GoogleAuth.currentUser.get().getBasicProfile().getImageUrl());
          $('.profile-name').text(GoogleAuth.currentUser.get().getBasicProfile().getGivenName());
          $('.personal').data('quick-add-type', GoogleAuth.currentUser.get().getBasicProfile().getGivenName());
          $('.profile-email').text(GoogleAuth.currentUser.get().getBasicProfile().getEmail());
          setTimeout(function(){
            showBudget(currentMonth);

          }, 500);
          
        } else {
          $(authorizeButton).fadeIn();
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
       function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
       function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
        window.location.reload();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
       function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

      function showIndividualExpenses(valueArray, monthValue) {
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        

        if (valueArray.values.length > 0) {

          for (i = 0; i < valueArray.values.length; i++) {              
            var row = valueArray.values[i];
            var dateSimple = row[0];
            var date = new Date(dateSimple).addHours(7);
            var month = date.getMonth();
            var category = row[2];
            var subCategory = row[3];
            var amount = row[4];
            var notes = row[5];
            if (notes == undefined || notes == 'undefined'){
              var notesDiv = '';
            } else {
              var notesDiv = '<div class = "notes">' + notes + '</div>';
            }
            if (month == monthValue){
              console.log('YES');
              $('.collapsible-body-inactive[data-category="' + category + '"]').addClass('collapsible-body').addClass('collection').removeClass('collapsible-body-inactive');    
              $('.collapsible-body[data-category="' + category + '"]').parent().find('table').addClass('highlight');
              $('.collapsible-body[data-category="' + category + '"]').append('<li class="collection-item"><div class = "bold">' + monthNames[date.getMonth()].substring(0,3).toUpperCase() + ' ' + date.getDate() + '<span class="right-align right">' + amount + '</span></div>' + notesDiv + '</li>');
            }
          }
        }
      }


      /**
       * Print the names and majors of students in a sample spreadsheet:
       * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
       */
       function showBudget(monthValue) {

        var ranges = [
        'Sheet1!A1:N100',
        'Form Responses!A1:F'
        ];
        gapi.client.sheets.spreadsheets.values.batchGet({
          spreadsheetId: '1kyO824yXeg-0r2hG8Zs8viHCuxgFr744cFB2lN3lzuY',
          ranges: ranges,
        }).then(function(response) {
          // scriptURL = 'https://script.google.com/macros/s/AKfycbzWd2FjKvWojfASyAwsl3lIFgRkPwgKdmSvlcIEInUBU7y56nw/exec';
          var range = response.result;
          console.log(range.valueRanges.length + ' ranges retrieved.');
          if (range.valueRanges.length > 0) {
            var currentLocation = '';
            var month = [];
            console.log('length is ' + range.valueRanges[0].values.length);
            for (i = 0; i < range.valueRanges[0].values.length; i++) {              
              var row = range.valueRanges[0].values[i];
              var sheetType = row[2];
              var monthSelect = row[monthValue + 2];
              if (sheetType == 'Actuals' || sheetType == 'Budget' || sheetType == 'Over/Under'){
                currentLocation = sheetType.replace(/[^a-zA-Z 0-9]+/g, '');
              } else {
                if (row[0] == 'Discretionary' || row[0] == 'Essentials'){
                  showExpense(row[1],row[0],currentLocation,monthSelect)
                }
              }



              var monthEssentials = [];
              var monthDiscretionary = [];
              // var discretionaryString = '<ul class ="collapsible">';
              var essentialsString = '<ul class ="collapsible">';

              function showExpense(expense, type, sheet, amount){
                if (month.find(x => x.expense === expense) != undefined){
                  month.find(x => x.expense === expense)[sheet] = amount;
                } else {
                  month.push({'expense': expense, 'type': type, Budget: amount});
                }




                for (var i = 0; i < month.length; i++){
                  let monthExpense = month[i];
                  if (monthExpense.type === 'Discretionary'){
                    monthDiscretionary.push(monthExpense);
                  } else if (monthExpense.type === 'Essentials'){
                    monthEssentials.push(monthExpense);
                  }

                }

                var discretionaryString = showRowValues(monthDiscretionary);
                var essentialsString = showRowValues(monthEssentials);

                document.getElementsByClassName('discretionary-container')[0].innerHTML = discretionaryString;
                document.getElementsByClassName('essentials-container')[0].innerHTML = essentialsString;



              }

              setTimeout(function(){
                $('.preloader').addClass('fadeOut');
              }, 500);



              setTimeout(function(){
                $('.discretionary-container tr').each(function(i){
                  var row = $(this);
                  setTimeout(function() {
                    row.removeClass('animation-start');
                  }, 1500 + (100*i));
                })
                $('.discretionary-container tr').each(function(i){
                  var row = $(this);
                  setTimeout(function() {
                    row.removeClass('hidden');
                  }, 1000 + (100*i));
                })

              }, 500);


              setTimeout(function(){
                $('.essentials-container tr').each(function(i){
                  var row = $(this);
                  setTimeout(function() {
                    row.removeClass('animation-start');
                  }, 1500 + (100*i));
                })
                $('.essentials-container tr').each(function(i){
                  var row = $(this);
                  setTimeout(function() {
                    row.removeClass('hidden');
                  }, 1000 + (100*i));
                })

              }, 500);


      

            }
            setCarouselHeight();
            $('.collapsible').collapsible();
showIndividualExpenses(range.valueRanges[1], monthValue);


          } else {
            appendPre('No data found.');
          }
        }, function(response) {
          $('.preloader-text').append('<p class="preloader-user-name" style = "display:none;">It appears this is a new account. Lets go through the setup process.</p>');
          appendPre('Error: ' + response.result.error.message);
          $('.preloader-user-name').fadeIn();
          console.log('ERROR END');



        });
    }

    function formatMoney(number, decPlaces, decSep, thouSep) {
      decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSep = typeof decSep === "undefined" ? "." : decSep;
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
      var j = (j = i.length) > 3 ? j % 3 : 0;

      return sign +
      (j ? i.substr(0, j) + thouSep : "") +
      i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
      (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
    }

    document.getElementById("b").addEventListener("click", event => {
      document.getElementById("x").innerText = "Result was: " + formatMoney(document.getElementById("d").value);
    });

  
    function showRowValues(monthExpenseType){

        var ExpenseTypeString = '<ul class = "collapsible">';
            for (var i =0; i < monthExpenseType.length; i++){
                  let monthExpenseTypeValue = monthExpenseType[i];
                  if (monthExpenseTypeValue.Actuals == undefined || monthExpenseTypeValue.Actuals == 'undefined'){
                    var actualsVal = 0;
                  } else {
                    var actualsVal = Number(monthExpenseTypeValue.Actuals.replace(/[^0-9.-]+/g,""));
                  }
                  var budgetVal = Number(monthExpenseTypeValue.Budget.replace(/[^0-9.-]+/g,""));
                  var percentSpent = 100 - ((budgetVal - actualsVal) / budgetVal * 100);
                  if (percentSpent >= 100){
                    percentSpent = 100;
                    monthExpenseTypeValue.OverUnder = '$0.00';
                  } else if (budgetVal < 0){
                    percentSpent = 100;
                  }
                  var remaining = (budgetVal - actualsVal);
                  if (remaining < 0){
                    remaining = 0;
                  }
                  var formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  });
                  remaining = formatter.format(remaining);
                  ExpenseTypeString += '<li><div class = "collapsible-header"><table><tbody><tr class = "animation-start hidden" style="width: ' + percentSpent + '%"><td>' + monthExpenseTypeValue.expense + '<span class = "percent-label">' + monthExpenseTypeValue.Actuals + '/' + monthExpenseTypeValue.Budget + '</span></td><td class="right-align">' + remaining + '</td></tr></tbody></table></div><ul class = "collapsible-body-inactive" data-category="' + monthExpenseTypeValue.expense + '"></ul></li>';
                }

                ExpenseTypeString += '</ul>';

                return ExpenseTypeString;
    }