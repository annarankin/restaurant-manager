$.ajax({
  url: "https://api.nutritionix.com/v1_1/search/cheddar%20cheese?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=fae2a401&appKey=fe781f4f2b30d67668dc634ab4529e43",
  type: "GET",
  success: function(data) {
    console.log(data)
  }
})

