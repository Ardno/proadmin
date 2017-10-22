import Drag from './drag'

const install = function(Vue) {
  Vue.directive('Drag', Drag)
}

if (window.Vue) {
  window.Drag = Drag
  Vue.use(install) // eslint-disable-line
}

Drag.install = install
export default Drag
