import resources from './resources';

class Loader {
  constructor(config = {}) {
    this.version = '1.0.0';
    this.config = Object.assign({
    	// default config
    }, config);

    this.resources = this.config.resources;

    this._initResources();
  }

  init() {
    this.loadAll();
  }

  _initResources() {
    this.resources.forEach((resource) => {
      let { name, version, src } = resource;

      if (src.indexOf('${version}') > -1) {
        resource.src = src.replace(/\${version}/ig, version);
      }

      resource.inject = resource.inject || 'head';
    });
  }

  insertResource(name) {
    return new Promise((resolve, reject) => {
      let resource = this.resources.find((item) => {
        return item.name === name;
      });

      if (!resource || !resource.src) {
        reject('resource is invalid!');
      }

      let { src, inject, cb } = resource;

      let fileType = resource.src.split('.').pop();

      if (fileType === 'js') {
        let script = document.createElement('script');

        script.src = src;

        this.intoDOM(inject, script);

        script.onload = function() {
        	if (typeof cb === 'function') {
        		cb();
        	}

          resolve(resource);
        };
      } else {
        reject('resource type is invalid');
      }
    });
  }

  intoDOM(target, el) {
  	console.log(target);
  	if (el !== 'head') {
  		window.addEventListener('load', () => {
  			document.querySelector(target).appendChild(el);
  		});
  	} else {
      document.querySelector('head').appendChild(el);
  	}
  }

  load(name) {
    return this.insertResource(name)
  }

  loadAll() {
    let promises = this.resources.map((resource) => {
      return this.load(resource.name);
    });

    return Promise.all(promises);
  }
}

let loader = new Loader({ resources });

loader.init();
