HTMLWidgets.widget({

  name: 'r3dmol',

  type: 'output',

  factory: (el, width, height) => {

    let initialized = false;
    const elementId = el.id;
    const container = document.getElementById(elementId);
    let view;

    const evalCallback = (callbackArray, paramSet) => {
      while (callbackArray.length) {
        let name = callbackArray.shift();
        paramSet[name] = eval('(' + paramSet[name] + ')');
      }
      return (paramSet);
    }

    const validateData = data => {
      return (typeof (data) === "string" ? data : data.join("\n"));
    }

    return {

      renderValue: function (x) {
        // alias this
        const that = this;
        if (!initialized) {
          initialized = true;
          // attach the widget to the DOM
          container.widget = that;

          $(el).css({
            position: x.position || "relative",
          });
          view = $3Dmol.createViewer($(container), x.configs);
        }
        // Now that the widget is initialized, call any outstanding API
        // functions that the user wantd to run on the widget
        const numApiCalls = x.api.length;
        // Save last call function name for auto render function call
        const lastCallFunction = x.api[numApiCalls - 1].method;
        const isAutoRenderFunction = [
          // add
          "addArrow", "addBox", "addCurve", "addCylinder", "addLine",
          "addSphere", "addShape", "addStyle", "addLabel", "addModel",
          "addVolumetricData", "addPropertyLabels", "addResLabels",
          "addSurface",
          // set
          "setStyle", "setBackgroundColor", "setWidth", "setProjection",
          "setZoomLimits", "setHeight", "setSlab", "setViewStyle", "resize_m",
          "setHoverDuration",
          // remove
          "removeAllLabels", "removeAllModels", "removeAllShapes",
          "removeAllSurfaces", "removeLabel",
          // animate
          "spin", "rotate", "translate", "translateScene", "zoom", "zoomTo",
          "enableFog", "center"
        ];

        for (let i = 0; i < numApiCalls; i++) {
          let call = x.api[i];
          const method = call.method;
          delete call.method;
          try {
            that[method](call);
          } catch (err) { }
        }
        // Auto render
        if (isAutoRenderFunction.findIndex(el => el === lastCallFunction) > -1) {
          view.render();
        }
      },

      resize: (width, height) => {
        container.setAttribute('width', width);
        container.setAttribute('height', height);
      },
      render: () => view.render(),
      rotate: params => view.rotate(params.angle, params.axis, params.animationDuration, params.fixedPath),
      addArrow: params => view.addArrow(evalCallback(['callback'], params.spec)),
      addAsOneMolecule: params => view.addAsOneMolecule(validateData(params.data), params.format),
      addBox: params => view.addBox(params.spec),
      addCurve: params => view.addCurve(params.spec),
      addCylinder: params => view.addCylinder(evalCallback(['callback', 'hover_callback', 'unhover_callback'], params.spec)),
      addLabel: params => view.addLabel(params.text, params.options, params.sel, params.noshow),
      addLine: params => view.addLine(params.spec),
      addPropertyLabels: params => view.addPropertyLabels(params.prop, params.sel, params.style),
      addResLabels: params => view.addResLabels(params.sel, params.style, params.byframe),
      addSphere: params => view.addSphere(params.spec),
      addShape: params => view.addShape(params.shapeSpec),
      addStyle: params => view.addStyle(params.sel, params.style),
      addModel: params => view.addModel(validateData(params.data), params.format, params.options),
      // TODO: not working
      addModelsAsFrames: params => view.addModelsAsFrames(validateData(params.data), params.format),
      addIsosurface: params => view.addIsosurface(new $3Dmol.VolumeData(validateData(params.data), "cube"), params.isoSpec),
      // TODO: not working
      addSurface: params => view.addSurface(params.type, params.style, params.atomsel, params.allsel, params.focus, evalCallback(['surfacecallback'], params.surfacecallback)),
      removeAllLabels: () => view.removeAllLabels(),
      removeAllModels: () => view.removeAllModels(),
      removeAllShapes: () => view.removeAllShapes(),
      removeAllSurfaces: () => view.removeAllSurfaces(),
      removeLabel: () => view.removeLabel(),
      setStyle: params => view.setStyle(params.sel, params.style),
      isAnimated: () => {
        return view.isAnimated();
      },
      setBackgroundColor: params => view.setBackgroundColor(params.hex, params.alpha),
      setSlab: params => view.setSlab(params.near, params.far),
      setViewStyle: params => view.setViewStyle(params.style),
      setHoverDuration: params => view.setHoverDuration(params.hoverDuration),
      spin: params => view.spin(params.axis),
      setWidth: params => view.setWidth(params.width),
      setHeight: params => view.setHeight(params.height),
      setProjection: params => view.setProjection(params.scheme),
      setZoomLimits: params => view.setZoomLimits(params.lower, params.upper),
      stopAnimate: () => { // TODO: not working.
        view.stopAnimate();
      },
      animate: params => view.animate(params.options),
      enableFog: params => view.enableFog(params.fog),
      translate: params => view.translate(params.x, params.y, params.animationDuration, params.fixedPath),
      translateScene: params => view.translateScene(params.x, params.y, params.animationDuration, params.fixedPath),
      zoom: (params) => view.zoom(params.factor, params.animationDuration, params.fixedPath),
      zoomTo: (params) => view.zoomTo(params.sel, params.animationDuration, params.fixedPath),
      center: (params) => view.center(params.sel, params.animationDuration, params.fixedPath),
    };
  }
});
