var sidebar = Vue.extend({
  template: "#sidebar",
  data: function () {
    return {
      message: 'Hello Vue.js!'
    }
  }
})

Vue.component('sidebar', sidebar);

