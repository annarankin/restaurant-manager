//getting HTML templates from zee DOM
var restaurantTemplate = $('[data-id ="restaurant-template"]').text()
var addBarDefault = '<a href="#/restaurants/new"><h4>Add a new Restaurant</h4></a>'
var addBarCancel = '<a href="#/"><h4>Never Mind</h4></a>'
var addBarMenuTemplate = $('[data-id ="add-bar-template"]').text()
var menuTemplate = $('[data-id ="menu-template"]').text()
var deleteButton = '<input class="button cancel" data-action="delete-restaurant" type="submit" value="Delete Restaurant">'

//setting up variables that remain constant
$content = $('.content')
$addBar = $('#add-bar')



//event listeners

$addBar.on('click', '[data-action="new-restaurant"]', addNewRestaurant)
$content.on('click', 'button[data-action="expand-restaurant-info"]', expandRestaurantInfo)
$content.on('click', 'input[data-action="update-restaurant"]', updateRestaurant)
$content.on('click', 'input[data-action="delete-restaurant"]', deleteRestaurant)
$content.on('click', '[data-action="expand-restaurant-menu"]', expandMenu)
$content.on('click', '[data-action="new-item"]', function(event) {
  event.preventDefault();
  // debugger;
  console.log(event)
})



//Router functions

function home(event) {
  collapseAddNewMenu();
  getFromServer('/restaurants', renderRestaurant)
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
  postToServer('/restaurants', dataObject)
  home();
}

function updateRestaurant(event) {
  console.log(this)
  var id = $(this).parents('form').attr('data-id')
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

  // debugger
  updateServer('/restaurants/' + id, dataObject)
  home()
}

function deleteRestaurant(event) {

  var $form = $(this).parents('.info').find('form')
  var id = $form.attr('data-id')
  deleteFromServer('/restaurants/' + id)
  home();

  // debugger
}



//basic server interactions

function getFromServer(url, callback) {
  $.ajax({
    url: url,
    type: "GET",
    success: callback
  })
}


function postToServer(url, data) {
  $.ajax({
    url: url,
    data: data,
    type: "POST",
    success: console.log(data)
  })
}

function updateServer(url, data) {
  $.ajax({
    url: url,
    data: data,
    type: "PUT",
    success: console.log(data)
  })
}

function deleteFromServer(url) {
  $.ajax({
    url: url,
    type: "DELETE",
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
  $addBar.append(addBarCancel)
  $addBar.append(Mustache.render(addBarMenuTemplate, {
    action: 'new-restaurant'
  }))
}

function collapseAddNewMenu() {
  $addBar.html("")
  $addBar.append(addBarDefault)
}

function expandRestaurantInfo(event) {

  var $infoSection = $(this).parents('.twelve.columns.restaurant').find('.info')
  $infoSection.html("")
  var $buttonBar = $(this).parents('.twelve.columns.restaurant').find('.buttons')


  //pull all current restaurant info out of the DOM
  var currentName = $(this).parents('.twelve.columns.restaurant').find('[data-id="name"]').text()
  var currentId = $(this).parents('.twelve.columns.restaurant').attr('data-id')
  var currentLocation = $(this).parents('.twelve.columns.restaurant').find('[data-id="location"]').text()
  var currentCuisine = $(this).parents('.twelve.columns.restaurant').find('[data-id="cuisine"]').text()
  var currentImgURL = $(this).parents('.twelve.columns.restaurant').find('[data-id="image"]').attr('src')

  //set up render object for Mustachin' into template
  var renderObject = {
    id: currentId,
    name: currentName,
    location: currentLocation,
    cuisine: currentCuisine,
    image_url: currentImgURL,
    action: 'update-restaurant'
  }
  var $deleteButton = $()

  $infoSection.append(Mustache.render(addBarMenuTemplate, renderObject))
    // debugger
  $infoSection.find('.container').append(deleteButton)
    // debugger
}

function expandMenu(event) {
    event.preventDefault();
    var id = $(this).parents(".twelve.columns.restaurant").attr('data-id')
    var $infoSection = $(this).parents(".twelve.columns.restaurant").find('.info')
      // debugger
    getFromServer('/restaurants/' + id + '/items', function(data) {
      console.log(data)
        //render menu
        //append to '.restaurant.info'
      $infoSection.html("")
      $infoSection.append(Mustache.render(menuTemplate, {items: data}))
    })
  }
  //INVOKE THE POWERS
home()