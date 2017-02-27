import 'react';
import './main.css';
import component from './component';

const demoComponent = component();
document.body.appendChild(demoComponent);

// // set up hot module replacement
// if(module.hot) {
//   module.hot.accept('./component', () => {
//     const nextComponent = component();

//     document.body.replaceChild(nextComponent, demoComponent);
//     demoComponent = nextComponent;
//   })
// }

// NOTE: ===>>> UGLIFY JS SHOWS ERROR WHEN USING THE ABOVE ES6 ARROW FUNCTION IN MODULE.HOT.ACCEPT
// set up hot module replacement
if(module.hot) {
  module.hot.accept('./component', function() {
    const nextComponent = component();

    document.body.replaceChild(nextComponent, demoComponent);
    demoComponent = nextComponent;
  })
}
