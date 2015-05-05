//getting HTML templates from zee DOM
var restaurantTemplate = $('[data-id ="restaurant-template"]').text()
var addBarDefault = '<a href="#/restaurants/new"><h4>Add a new Restaurant</h4></a>'
var addBarCancel = '<a href="#/"><h4>Never Mind</h4></a>'
var addBarMenuTemplate = $('[data-id ="add-bar-template"]').text()
var menuTemplate = $('[data-id ="menu-template"]').text()
var otherItemCard = $('[data-id="other-item-card"]').text()
var deleteButton = '<input class="button cancel" data-action="delete-restaurant" type="submit" value="Delete Restaurant">'
var aboutTemplate = $('[data-id ="about-template"]').text()
var statsTemplate = $('[data-id ="stats-template"]').text()


//setting up variables that remain constant
var $content = $('.content')
var $addBar = $('#add-bar')
var $footer = $('footer')
var $body = $('body')


//event listeners

$addBar.on('click', '[data-action="new-restaurant"]', addNewRestaurant)
$content.on('click', 'button[data-action="expand-restaurant-info"]', expandRestaurantInfo)
$content.on('click', 'input[data-action="update-restaurant"]', updateRestaurant)
$content.on('click', 'input[data-action="delete-restaurant"]', deleteRestaurant)
$content.on('click', '[data-action="expand-restaurant-menu"]', viewMenu)
$content.on('click', '[data-action="collapse-restaurant-menu"]', function(event) {
  var restaurantId = $(event.target).attr('data-id')
  collapseMenu(restaurantId)
})
$content.on('click', '[data-action="new-item"]', submitNewItem)
$content.on('click', '[data-action="remove-item"]', removeItem)

$content.on('input', '[contentEditable="true"]', updateItem)



//Router functions

function home(event) {
  hideAbout();
  hideStats();
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

  // 
  updateServer('/restaurants/' + id, dataObject)
  home()
}

function deleteRestaurant(event) {

  var $form = $(this).parents('.info').find('form')
  var id = $form.attr('data-id')
  deleteFromServer('/restaurants/' + id)
  home();

  // 
}



//basic server interactions

function getFromServer(url, callback) {
  $.ajax({
    url: url,
    type: "GET",
    success: callback
  })
}


function postToServer(url, data, callback) {
  $.ajax({
    url: url,
    data: data,
    type: "POST",
    success: callback
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

function patchServer(url, data) {
  $.ajax({
    url: url,
    data: data,
    type: "PATCH",
    success: console.log(data)
  })
}

function deleteFromServer(url) {
  $.ajax({
    url: url,
    type: "DELETE",
  })
}



// ------------------ rendering functions ------------------ 

function renderRestaurant(data) {
  $content.html("")
  var sortedData = _.sortBy(data, function(obj) {
    return -obj.id;
  })
  var restaurantArray = _.map(sortedData, function(element, index, list) {
    return Mustache.render(restaurantTemplate, element);
    // 
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
    // 
  $infoSection.find('.container').append(deleteButton)
    // 
}



// ------------------ MENU CREATION ------------------ 


function viewMenu(event) {

  //NOTE - 'this' referred to the context of the window. Probably because of chaining BLAH
  var restaurantId = $(event.target).attr('data-id');

  //look at parent div, close all divs that are not the parent div
  var $allRestaurants = $(event.target).parents('.content').children()
  var $otherRestaurants = _.reject($allRestaurants, function(el) {
    return $(el).attr('data-id') == restaurantId
  })
  _.each($otherRestaurants, function(el) {
    // 
    $(el).find('.info').html("")
  })
  expandMenu(restaurantId, event)
}


function expandMenu(restaurantId, event) {
  console.log('restaurant ID: ' + restaurantId)
    // debugger
  var $viewBtn = $('button[data-id="' + restaurantId + '"]')
  $viewBtn.attr('data-action', 'collapse-restaurant-menu')
  $viewBtn.text("Close Menu");
  getFromServer('/restaurants/' + restaurantId + '/items', function(restaurantItemData) {
    getFromServer('/items', function(allItemData) {
      var $infoSection = $('.twelve.columns.restaurant[data-id ="' + restaurantId + '"]').find('.info');
      console.log("got data, about to empty info section")

      $infoSection.html("")

      //calculate profits
      _.each(restaurantItemData, function(el) {
        el.profit = parseInt(el.price) * parseInt(el.order_count)
      })

      //append current items to restaurant menu
      $infoSection.append(Mustache.render(menuTemplate, {
        items: restaurantItemData,
        id: restaurantId
      }))

      //add click listener to each menu item
      var jqMenuItemImageArray = $infoSection.find('.image')

      _.each(jqMenuItemImageArray, function(el) {
        $(el).on('mouseenter', function() {
          var query = $(el).parents('.menu-item').find('[data-id ="name"]').text().replace(/ /g, "%20")
            // debugger
          $.ajax({
            url: "https://api.nutritionix.com/v1_1/search/" + query + "?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=" + appId + "&appKey=" + apikey,
            type: "GET",
            success: function(data) {
              console.log(data.hits[0].fields.item_name + ":\n" + data.hits[0].fields.nf_calories + " calories per " + data.hits[0].fields.nf_serving_size_unit)
              var $hoverDiv = $('<div class="hover animated bounceIn"><h5>' + data.hits[0].fields.item_name + ":</h5><p>" + data.hits[0].fields.nf_calories + " calories per " + data.hits[0].fields.nf_serving_size_unit + '</p></div>')
              $(el).parent('.menu-item').append($hoverDiv)
            }
          })
        });
        $(el).on('mouseleave', function() {
          $('.hover').remove()
        })
      });
      //rendering items from other restaurants
      renderOtherItems(restaurantId, restaurantItemData, allItemData)
        //make menu field droppable
      var dropster = new Droppabilly(document.getElementById('droppable'), {
        dragstersClassName: 'draggable',
        over: function(drop, drag) { //do nothing
        },
        out: function(drop, drag) { //do nothing
        },
        drop: dropThing //end drop funk
      });
    });
  });
}


function renderOtherItems(restaurantId, restaurantItemData, allItemData) {

  //gets the names of all foods currently on the restaurant's menu
  var currentItemNames = _.pluck(restaurantItemData, 'name')
    // 

  //rejects any items that already belong to this restaurant
  var notThisRestaurantArray = _.reject(allItemData, function(el) {
    //used soft equality so as to avoid parsing/stringifying. Also checked for duplicate names
    return (el.restaurantId == restaurantId || _.contains(currentItemNames, el.name));
  })

  //kill duplicate food items
  var noDupes = _.uniq(notThisRestaurantArray, false, function(el) {
      return el.name
    })
    //renders each element with moostache, makes it draggable
  var otherItemArray = _.map(noDupes, function(el) {
    var $newItemCard = $(Mustache.render(otherItemCard, el))
    return $newItemCard
  })

  //append ALL THE THINGS
  var $otherItemRow = $('.row.other-items')
  $otherItemRow.append(otherItemArray)

  //make 'em draggerbull
  var $draggable = $('.draggable').draggabilly()

}


function submitNewItem(event) {
  event.preventDefault();
  var itemName = $(this).parents('.row').find('[name="name"]').val()
  var itemPrice = $(this).parents('.row').find('[name="price"]').val()
  var itemImageURL = $(this).parents('.row').find('[name="image_url"]').val()
  var restaurantId = $(this).parents(".twelve.columns.restaurant").attr('data-id')
    // 

  var dataObject = {
    restaurantId: restaurantId,
    name: itemName,
    price: itemPrice,
    order_count: 0,
    image_url: itemImageURL
  }

  postToServer('/items', dataObject)
  expandMenu(restaurantId);
}

function removeItem(event) {
  var restaurantId = $(this).parents('.items').attr('data-id');
  var itemId = $(this).parents('.menu-item').attr('data-id');

  deleteFromServer('/items/' + itemId)
  expandMenu(restaurantId);
  // 
}

function updateItem(event) {
  var newValue = $(event.target).text()
  var itemId = $(event.target).parents('.menu-item').attr('data-id')
  var itemProperty = $(event.target).attr('data-id')

  if (itemProperty != 'name' && isNaN(parseInt(newValue))) {
    newValue = 0;
  }

    var dataObject = JSON.parse('{"' + itemProperty + '" : "' + newValue + '"}')
    // console.log(dataObject)
  updateServer('/items/' + itemId, dataObject)

  //update profits
  var itemPrice = parseInt($(event.target).parents('.menu-item').find('[data-id ="price"]').text())
  var orderCount = parseInt($(event.target).parents('.menu-item').find('[data-id ="order_count"]').text())
  var $profit = $(event.target).parents('.menu-item').find('[data-id ="profit"]')

  if (isNaN(itemPrice * orderCount)) {
    profit = 0;
  } else {
    profit = itemPrice * orderCount;
  }
  $profit.text(profit)
}


function dropThing(drop, drag) {
  //on drop, get item and restaurant info
  var itemId = $(drag).attr('data-id');
  var restaurantId = $(drop).attr('data-id')
  console.log(itemId + " and " + restaurantId)
    //get data from server about item
  getFromServer('/items/' + itemId, function(data) {
    var dataObject = {
        restaurantId: restaurantId,
        name: data.name,
        price: data.price,
        order_count: 0,
        image_url: data.image_url
      }
      //copy the item to current restaurant's menu
    postToServer('/items', dataObject, function(data) {
      console.log(data)
      console.log('ID: ' + restaurantId)
      expandMenu(restaurantId);
    })
  })
}
function collapseMenu(restaurantId) {

  var $viewBtn = $('button[data-id="' + restaurantId + '"]')
  $viewBtn.attr('data-action', 'expand-restaurant-menu')
  $viewBtn.text("View Menu");

  //empties the div of the restaurant that matches ID
  $('.restaurant[data-id="' + restaurantId + '"]').find('.info').html("")
}

function showAbout() {
  $body.append($(aboutTemplate))
}

function hideAbout() {
  $('.about').remove()
  $('.dimmer').remove()
}



// ------------------ STATISTICS CHART ------------------ 

function showStats() {
  $body.append($(statsTemplate))
  makeChart();
}

function hideStats() {
  $('.stats').remove()
  $body.find('.dimmer').remove()
}

function makeChart() {
  //get context of chart using jQuerrrz because I like jQuerz
  var context = $('#profit-chart').get(0).getContext("2d");
  //make ajax call, get data
  getFromServer('/items', function(data) {
    var sortedData = _.sortBy(data, function(el) {
      return -(el.price * el.order_count)
    }).splice(0, 10)
    var itemLabels = _.pluck(sortedData, 'name')
    var profitCalc = _.each(sortedData, function(el) {
      el.profit = el.price * el.order_count
    })
    var itemProfits = _.pluck(profitCalc, 'profit')

    // var _.each([1, 2, 3], alert)
    // debugger

    //create chart data object
    var dataTest = {
      labels: itemLabels,
      datasets: [{
        data: itemProfits,
        fillColor: "#ee4433",
      }]
    }

    //set up yo options for that chart
    options = {
        scaleLabel: function(valuePayload) {
          return '  $' + Number(valuePayload.value);
        },
      }
      //make new Chart (.Bar)
    var profitChart = new Chart(context).Bar(dataTest, options)
  })

}


//INVOKE THE POWERS
home()