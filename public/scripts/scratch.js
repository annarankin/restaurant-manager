function viewMenu(event) {

  //NOTE - 'this' referred to the context of the window. Probably because of chaining BLAH
  var restaurantId = $(event.target).attr('data-id');

  //look at parent div, close all divs that are not the parent div
  var $allRestaurants = $(event.target).parents('.content').children()
  var $otherRestaurants = _.reject($allRestaurants, function(el) {
    return $(el).attr('data-id') == restaurantId
  })
  _.each($otherRestaurants, function(el) {
    // debugger
    $(el).find('.info').html("")
  })
  expandMenu(restaurantId)
}


function expandMenu(restaurantId) {

  console.log('restaurant ID: ' + restaurantId)
  var $infoSection = $('.twelve.columns.restaurant[data-id ="' + restaurantId + '"]').find('.info');
  var requestURI = '/restaurants/' + restaurantId + '/items'

  getFromServer(requestURI, function(restaurantItemData) {
    getFromServer('/items', function(allItemData) {
      $infoSection.html("")

      //append current items to restaurant menu
      $infoSection.append(Mustache.render(menuTemplate, {
        items: restaurantItemData
      }))

      var $otherItemRow = $('.row.other-items')

      //gets the names of all foods currently on the restaurant's menu
      var currentItemNames = _.pluck(restaurantItemData, 'name')
        // debugger

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
      $otherItemRow.append(otherItemArray)

      //make 'em draggerbull
      var $draggable = $('.draggable').draggabilly()
        //make 'em dropperbull
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


function dropThing(drop, drag) {
  // console.log($(drop).parents(".twelve.columns.restaurant").attr('data-id'))
  //on drop, get item and restaurant info
  var itemId = $(drag).attr('data-id');
  debugger
  var restaurantId = $(drop).find('[data-action ="remove-item"]').attr('data-id')
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
    postToServer('/items', dataObject, function(data) {})
      //reload the menu
      // debugger

  })

  var event = {
      target: drop
    }
    // console.log('event: ' + event)
  expandMenu(restaurantId);
}