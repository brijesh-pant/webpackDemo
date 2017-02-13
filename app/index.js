import component from './component';

const demoComponent = component();
document.body.appendChild(demoComponent);

// set up hot module replacement
if(module.hot) {
  module.hot.accept('./component', () => {
    const nextComponent = component();

    document.body.replaceChild(nextComponent, demoComponent);
    demoComponent = nextComponent;
  })
}
