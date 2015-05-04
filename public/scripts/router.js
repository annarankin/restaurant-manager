//setting up router options


//setting up routes.
var routes = {
  '/' : home,
  "/restaurants/": {
    '/new': {
      on: expandAddNewMenu
    },
    "/:id": {
      on: expandRestaurantInfo
    },
    "/:id/items": {
      on: function(id) {
        console.log(id + "/items")
      }
    }
  },
  '/about' : showAbout,
  '/stats' : showStats
}

//ROUTES TAKE 2



var router = Router(routes)

router.init()