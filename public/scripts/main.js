//getting HTML templates from zee DOM
var restaurantTemplate = $('[data-id ="restaurant-template"]').text()
var addBarDefault = '<a href="#/restaurants/new"><h2>Add a new Restaurant</h2></a>'
var addBarMenuTemplate = $('[data-id ="add-bar-template"]').text()

//setting up variables that remain constant
$content = $('.content')
$addBar = $('#add-bar')



//event listeners

$addBar.on('click', '[data-action="new-restaurant"]', addNewRestaurant)
$content.on('click', 'button[data-action="expand-restaurant-info"]', expandRestaurantInfo)


//Router functions

function home() {
  collapseAddNewMenu();
  getFromServer('/restaurants')
}


//basic server interactions
function getFromServer(url) {
  $.ajax({
    url: url,
    type: "GET",
    success: renderRestaurant
  })
}

function addNewRestaurant(event) {
  event.preventDefault();
  var newName = $(this).parents('form').find('input#restaurant-name').val()
  var newCuisine = $(this).parents('form').find('input#restaurant-cuisine').val()
  var newLocation = $(this).parents('form').find('input#restaurant-location').val()
  var newImageURL = $(this).parents('form').find('input#restaurant-image').val()

  var dataObject = {
    name: newName,
    location: newLocation,
    cuisine: newCuisine,
    image_url: newImageURL
  }
  debugger
  postToServer('/restaurants', dataObject)
}

function postToServer(url, data) {
  $.ajax({
    url: url,
    data: data,
    type: "POST",
    success: console.log(data)
  })
}



//rendering functions
function renderRestaurant(data) {
  $content.html("")
  var sortedData = _.sortBy(data, function(obj) {
    return -obj.id;
  })
  var restaurantArray = _.map(sortedData, function(element, index, list) {
    return Mustache.render(restaurantTemplate, element);
    // debugger
  })
  $content.append(restaurantArray)
};


function expandAddNewMenu() {
  $addBar.html("")
  $addBar.append(addBarMenuTemplate)
}

function collapseAddNewMenu() {
  $addBar.html("")
  $addBar.append(addBarDefault)
}

function expandRestaurantInfo(event) {
  var restaurantName = $(this).parents('.twelve.columns.restaurant').find('h2').text()
  debugger
}

//INVOCATIONS
home()