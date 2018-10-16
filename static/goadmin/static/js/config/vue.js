Vue.use(VueMaterial);
console.log(VueMaterial);
Vue.material.registerTheme('tabs', {
  primary: 'blue',accent: 'white'
});

Vue.material.registerTheme('brownbg', {
  primary: 'brown',accent: 'red', background:'white'
});


Vue.material.registerTheme('teal', {
  primary: 'brown', accent:'red', background:{color:'black',hue:100}
})

Vue.material.registerTheme('rgb', {
    primary: 'red',accent: 'blue',background:'green'
});
