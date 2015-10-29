(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Samsara"] = factory();
	else
		root["Samsara"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Core: __webpack_require__(1),
	        Events: __webpack_require__(36),
	        Inputs: __webpack_require__(37),
	        Layouts: __webpack_require__(47),
	        Streams: __webpack_require__(55),
	        Transitions: __webpack_require__(56)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        ContainerSurface: __webpack_require__(2),
	        Context: __webpack_require__(24),
	        Engine: __webpack_require__(32),
	        LayoutNode: __webpack_require__(20),
	        SizeNode: __webpack_require__(18),
	        Surface: __webpack_require__(3),
	        Timer: __webpack_require__(33),
	        Transform: __webpack_require__(7),
	        Transitionable: __webpack_require__(28),
	        View: __webpack_require__(34)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Surface = __webpack_require__(3);
	    var Context = __webpack_require__(24);
	    var dirtyQueue = __webpack_require__(15);
	    var preTickQueue = __webpack_require__(13);
	    var Transform = __webpack_require__(7);
	    var EventHandler = __webpack_require__(5);

	    var defaultLayout = {
	        transform : Transform.identity,
	        opacity : 1,
	        origin : null,
	        align : null,
	        nextSizeTransform : Transform.identity
	    };

	    /**
	     * ContainerSurface enables nesting of DOM. A ContainerSurface manages
	     *  its own render tree that it inserts inside a DOM node. Typically
	     *  this is used for clipping by settings `{overflow : hidden}` as a CSS
	     *  property.
	     *
	     *  @example
	     *
	     *      var myContainer = new ContainerSurface({
	     *          size : [100,100],
	     *          properties : {overflow : hidden}
	     *      });
	     *
	     *      var surface = new Surface({
	     *          size : [200,200],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      myContainer.add(surface);
	     *
	     *      context.add(myContainer);
	     *
	     * @class ContainerSurface
	     * @extends Core.Surface
	     * @namespace Core
	     * @uses Core.Context
	     * @constructor
	     *
	     * @param [options] {Object}                Options
	     * @param [options.size] {Number[]}         Size (width, height) in pixels. These can also be `true` or `undefined`.
	     * @param [options.classes] {String[]}      CSS classes
	     * @param [options.properties] {Object}     Dictionary of CSS properties
	     * @param [options.attributes] {Object}     Dictionary of HTML attributes
	     * @param [options.content] {String}        InnerHTML content
	     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
	     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
	     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
	     * @param [options.opacity] {Number}        Opacity
	     */
	    function ContainerSurface(options) {
	        Surface.call(this, options);

	        this._container = document.createElement('div');
	        this._container.classList.add('samsara-container');

	        this.context = new Context({el : this._container});
	        this.setContent(this._container);

	        this.context._size.subscribe(this.size);
	        this.context._layout.subscribe(this.layout.map(function(){
	            return defaultLayout;
	        }));
	    }

	    ContainerSurface.prototype = Object.create(Surface.prototype);
	    ContainerSurface.prototype.constructor = ContainerSurface;
	    ContainerSurface.prototype.elementType = 'div';
	    ContainerSurface.prototype.elementClass = 'samsara-surface';

	    /**
	     * Get current perspective in pixels.
	     *
	     * @method getPerspective
	     * @return {Number} Perspective in pixels
	     */
	    ContainerSurface.prototype.getPerspective = function getPerspective() {
	        return Context.prototype.getPerspective.apply(this.context, arguments);
	    };

	    /**
	     * Set current perspective in pixels.
	     *
	     * @method setPerspective
	     * @param perspective {Number}  Perspective in pixels
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback executed on completion of transition
	     */
	    ContainerSurface.prototype.setPerspective = function setPerspective(){
	        Context.prototype.setPerspective.apply(this.context, arguments);
	    };

	    /**
	     * Extends the render tree with a provided node.
	     *
	     * @method add
	     * @param node {Object}     Node, Surface, or View
	     * @return {RenderTreeNode}
	     */
	    ContainerSurface.prototype.add = function add() {
	        return Context.prototype.add.apply(this.context, arguments);
	    };

	    /**
	     * Place the document element this component manages into the document.
	     *
	     * @method deploy
	     * @private
	     * @param target {Node} Container DOM element
	     */
	    ContainerSurface.prototype.deploy = function deploy() {
	        Surface.prototype.deploy.apply(this, arguments);
	    };

	    module.exports = ContainerSurface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Samsara Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var ElementOutput = __webpack_require__(4);
	    var dirtyQueue = __webpack_require__(15);

	    /**
	     * Surface is a wrapper for DOM element controlled by Samsara.
	     *  Samsara will commit opacity, size and CSS3 `transform` properties into the Surface.
	     *  CSS classes, properties and DOM attributes can also be added and dynamically changed.
	     *  Surfaces also act as sources for DOM events such as `click`.
	     *
	     * @example
	     *
	     *      var context = Engine.createContext({
	     *          el : document.querySelector('#myElement')
	     *      });
	     *
	     *      var surface = new Surface({
	     *          content : 'Hello world!',
	     *          size : [true,100],
	     *          opacity : .5,
	     *          classes : ['myClass1', 'myClass2'],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      context.add(surface);
	     *
	     *      Engine.start();
	     *
	     *  @example
	     *
	     *      // same as above but create an image instead
	     *      var surface = new Surface({
	     *          attributes : {
	     *              src : 'cat.jpg'
	     *          },
	     *          size : [100,100],
	     *          tagName : 'img'
	     *      });
	     *
	     * @class Surface
	     * @namespace Core
	     * @constructor
	     * @extends Core.ElementOutput
	     * @param [options] {Object}                Options
	     * @param [options.size] {Number[]}         Size (width, height) in pixels. These can also be `true` or `undefined`.
	     * @param [options.classes] {String[]}      CSS classes
	     * @param [options.properties] {Object}     Dictionary of CSS properties
	     * @param [options.attributes] {Object}     Dictionary of HTML attributes
	     * @param [options.content] Sstring}        InnerHTML content
	     * @param [options.origin] {Number[]}       Origin (x,y), with values between 0 and 1
	     * @param [options.margins] {Number[]}      Margins (x,y) in pixels
	     * @param [options.proportions] {Number[]}  Proportions (x,y) with values between 0 and 1
	     * @param [options.aspectRatio] {Number}    Aspect ratio
	     * @param [options.opacity=1] {Number}      Opacity
	     * @param [options.tagName="div"] {String}  HTML tagName
	     */
	    function Surface(options) {
	        this.properties = {};
	        this.attributes = {};
	        this.content = '';
	        this.classList = [];

	        this._dirtyClasses = [];
	        this._classesDirty = true;
	        this._stylesDirty = true;
	        this._attributesDirty = true;
	        this._dirty = false;
	        this._cachedSize = null;

	        if (options) {
	            this._contentDirty = false;

	            // default to DOM size for provided elements
	            if (options.el && !options.size)
	                options.size = [true, true];

	            ElementOutput.call(this, options.el);
	            this.setOptions(options);
	        }
	        else {
	            this._contentDirty = true;
	            ElementOutput.call(this);
	        }
	    }

	    Surface.prototype = Object.create(ElementOutput.prototype);
	    Surface.prototype.constructor = Surface;
	    Surface.prototype.elementType = 'div'; // default tagName, but can be overriden in options
	    Surface.prototype.elementClass = 'samsara-surface';

	    function _setDirty(){
	        if (this._dirty) return;

	        dirtyQueue.push(function(){
	            var target = this._currentTarget;

	            if (this._contentDirty) {
	                this.deploy(target);
	                this._contentDirty = false;
	            }

	            if (this._classesDirty) {
	                _removeClasses.call(this, target);
	                _applyClasses.call(this, target);
	                this._classesDirty = false;
	            }

	            if (this._stylesDirty) {
	                _applyStyles.call(this, target);
	                this._stylesDirty = false;
	            }

	            if (this._attributesDirty) {
	                _applyAttributes.call(this, target);
	                this._attributesDirty = false;
	            }
	            this._dirty = false;
	        }.bind(this))
	    }

	    function _applyClasses(target) {
	        for (var i = 0; i < this.classList.length; i++)
	            target.classList.add(this.classList[i]);
	    }

	    function _applyStyles(target) {
	        for (var key in this.properties)
	            target.style[key] = this.properties[key];
	    }

	    function _applyAttributes(target) {
	        for (var key in this.attributes)
	            target.setAttribute(key, this.attributes[key]);
	    }

	    function _removeClasses(target) {
	        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
	        this._dirtyClasses = [];
	    }

	    function _removeStyles(target) {
	        for (var key in this.properties)
	            target.style[key] = '';
	    }

	    function _removeAttributes(target) {
	        for (var key in this.attributes)
	            target.removeAttribute(key);
	    }
	    
	    /**
	     * Setter for HTML attributes.
	     *
	     * @method setAttributes
	     * @chainable
	     * @param attributes {Object}   HTML Attributes
	     */
	    Surface.prototype.setAttributes = function setAttributes(attributes) {
	        for (var key in attributes) {
	            var value = attributes[key];
	            if (value != undefined) this.attributes[key] = attributes[key];
	        }
	        this._attributesDirty = true;
	        _setDirty.call(this);
	        return this;
	    };

	    /**
	     * Getter for HTML attributes.
	     *
	     * @method getAttributes
	     * @return {Object}
	     */
	    Surface.prototype.getAttributes = function getAttributes() {
	        return this.attributes;
	    };

	    /**
	     * Setter for CSS properties.
	     *  Note: properties are camelCased, not hyphenated.
	     *
	     * @method setProperties
	     * @chainable
	     * @param properties {Object}   CSS properties
	     */
	    Surface.prototype.setProperties = function setProperties(properties) {
	        for (var key in properties)
	            this.properties[key] = properties[key];
	        this._stylesDirty = true;
	        _setDirty.call(this);
	        return this;
	    };

	    /**
	     * Getter for CSS properties.
	     *
	     * @method getProperties
	     * @return {Object}             Dictionary of this Surface's properties.
	     */
	    Surface.prototype.getProperties = function getProperties() {
	        return this.properties;
	    };

	    /**
	     * Add CSS class to the list of classes on this Surface.
	     *
	     * @method addClass
	     * @chainable
	     * @param className {String}    Class name
	     */
	    Surface.prototype.addClass = function addClass(className) {
	        if (this.classList.indexOf(className) < 0) {
	            this.classList.push(className);
	            this._classesDirty = true;
	            _setDirty.call(this);
	        }
	        return this;
	    };

	    /**
	     * Remove CSS class from the list of classes on this Surface.
	     *
	     * @method removeClass
	     * @param className {string}    Class name
	     */
	    Surface.prototype.removeClass = function removeClass(className) {
	        var i = this.classList.indexOf(className);
	        if (i >= 0) {
	            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
	            this._classesDirty = true;
	            _setDirty.call(this);
	        }
	    };

	    /**
	     * Toggle CSS class for this Surface.
	     *
	     * @method toggleClass
	     * @param  className {String}   Class name
	     */
	    Surface.prototype.toggleClass = function toggleClass(className) {
	        var i = this.classList.indexOf(className);
	        (i == -1)
	            ? this.addClass(className)
	            : this.removeClass(className);
	    };

	    /**
	     * Reset classlist.
	     *
	     * @method setClasses
	     * @chainable
	     * @param classlist {String[]}  ClassList
	     */
	    Surface.prototype.setClasses = function setClasses(classList) {
	        var i = 0;
	        var removal = [];
	        for (i = 0; i < this.classList.length; i++) {
	            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
	        }
	        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
	        // duplicates are already checked by addClass()
	        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
	        _setDirty.call(this);
	        return this;
	    };

	    /**
	     * Get array of CSS classes attached to this Surface.
	     *
	     * @method getClasslist
	     * @return {String[]}
	     */
	    Surface.prototype.getClassList = function getClassList() {
	        return this.classList;
	    };

	    /**
	     * Set or overwrite innerHTML content of this Surface.
	     *
	     * @method setContent
	     * @chainable
	     * @param content {String|DocumentFragment} HTML content
	     */
	    Surface.prototype.setContent = function setContent(content) {
	        if (this.content !== content) {
	            this.content = content;
	            this._contentDirty = true;
	            _setDirty.call(this);
	        }
	        return this;
	    };

	    /**
	     * Return innerHTML content of this Surface.
	     *
	     * @method getContent
	     * @return {String}
	     */
	    Surface.prototype.getContent = function getContent() {
	        return this.content;
	    };

	    /**
	     * Set options for this surface
	     *
	     * @method setOptions
	     * @param options {Object} Overrides for default options. See constructor.
	     */
	    Surface.prototype.setOptions = function setOptions(options) {
	        if (options.tagName !== undefined) this.elementType = options.tagName;
	        if (options.opacity !== undefined) this.setOpacity(options.opacity);
	        if (options.size !== undefined) this.setSize(options.size);
	        if (options.origin !== undefined) this.setOrigin(options.origin);
	        if (options.proportions !== undefined) this.setProportions(options.proportions);
	        if (options.margins !== undefined) this.setMargins(options.margins);
	        if (options.classes !== undefined) this.setClasses(options.classes);
	        if (options.properties !== undefined) this.setProperties(options.properties);
	        if (options.attributes !== undefined) this.setAttributes(options.attributes);
	        if (options.content !== undefined) this.setContent(options.content);
	        if (options.aspectRatio !== undefined) this.setAspectRatio(options.aspectRatio);
	    };

	    /**
	     * Allocates the element-type associated with the Surface, adds its given
	     *  element classes, and prepares it for future committing.
	     *
	     * @private
	     * @method setup
	     * @param allocator {ElementAllocator} Allocator
	     */
	    Surface.prototype.setup = function setup(allocator) {
	        // create element of specific type
	        var target = allocator.allocate(this.elementType);

	        // add any element classes
	        if (this.elementClass) {
	            if (this.elementClass instanceof Array) {
	                for (var i = 0; i < this.elementClass.length; i++)
	                    this.addClass(this.elementClass[i]);
	            }
	            else this.addClass(this.elementClass);
	        }

	        // set the currentTarget and any bound listeners
	        this.attach(target);

	        // set all dirty flags to true
	        this._opacityDirty = true;
	        this._stylesDirty = true;
	        this._classesDirty = true;
	        this._attributesDirty = true;
	        this._contentDirty = true;
	        this._originDirty = true;
	        this._transformDirty = true;
	    };

	    /**
	     * Remove all Samsara-relevant data from the Surface.
	     *
	     * @private
	     * @method remove
	     * @param allocator {ElementAllocator} Allocator
	     */
	    Surface.prototype.remove = function remove(allocator) {
	        var target = this._currentTarget;

	        // cache the target's contents for later deployment
	        this.recall(target);

	        // hide the element
	        target.style.display = 'none';
	        target.style.opacity = '';
	        target.style.width = '';
	        target.style.height = '';

	        // clear all styles, classes and attributes
	        _removeStyles.call(this, target);
	        _removeAttributes.call(this, target);
	        _removeClasses.call(this, target);

	        // garbage collect current target and remove bound event listeners
	        this.detach();

	        // store allocated node in cache for recycling
	        allocator.deallocate(target);
	    };

	    /**
	     * Insert the Surface's content into the currentTarget.
	     *
	     * @private
	     * @method deploy
	     * @param target {Node} Container DOM element
	     */
	    Surface.prototype.deploy = function deploy(target) {
	        //TODO: make sure target.tagName is of correct type! Tag pools must be implemented.
	        this._eventOutput.emit('deploy');
	        var content = this.getContent();
	        if (content instanceof Node) {
	            while (target.hasChildNodes()) target.removeChild(target.firstChild);
	            target.appendChild(content);
	        }
	        else target.innerHTML = content;
	    };

	    /**
	     * Cache the content of the Surface in a document fragment for future deployment.
	     *
	     * @private
	     * @method recall
	     * @param target {Node}
	     */
	    Surface.prototype.recall = function recall(target) {
	        this._eventOutput.emit('recall');
	        var df = document.createDocumentFragment();
	        while (target.hasChildNodes()) df.appendChild(target.firstChild);
	        this.setContent(df);
	    };

	    /**
	     * Getter for size.
	     *
	     * @method getSize
	     * @return {Number[]}
	     */
	    Surface.prototype.getSize = function getSize() {
	        // TODO: remove cachedSize
	        return this._cachedSpec.size || this._cachedSize;
	    };

	    /**
	     * Setter for size.
	     *
	     * @method setSize
	     * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
	     */
	    Surface.prototype.setSize = function setSize(size) {
	        this._cachedSize = size;
	        this._sizeNode.set({size : size});
	        _setDirty.call(this);
	    };

	    /**
	     * Setter for proportions.
	     *
	     * @method setProportions
	     * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
	     */
	    Surface.prototype.setProportions = function setProportions(proportions) {
	        this._sizeNode.set({proportions : proportions});
	        _setDirty.call(this);
	    };

	    /**
	     * Setter for margins.
	     *
	     * @method setMargins
	     * @param margins {Number[]|Stream} Margins as [width, height] in pixels, or a stream.
	     */
	    Surface.prototype.setMargins = function setMargins(margins) {
	        this._sizeNode.set({margins : margins});
	        _setDirty.call(this);
	    };

	    /**
	     * Setter for aspect ratio. If only one of width or height is specified,
	     *  the aspect ratio will replace the unspecified dimension by scaling
	     *  the specified dimension by the value provided.
	     *
	     * @method setAspectRatio
	     * @param aspectRatio {Number|Stream} Aspect ratio.
	     */
	    Surface.prototype.setAspectRatio = function setAspectRatio(aspectRatio) {
	        this._sizeNode.set({aspectRatio : aspectRatio});
	        _setDirty.call(this);
	    };

	    /**
	     * Setter for origin.
	     *
	     * @method setOrigin
	     * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
	     */
	    Surface.prototype.setOrigin = function setOrigin(origin){
	        this._layoutNode.set({origin : origin});
	        this._originDirty = true;
	        _setDirty.call(this);
	    };

	    /**
	     * Setter for opacity.
	     *
	     * @method setOpacity
	     * @param opacity {Number} Opacity
	     */
	    Surface.prototype.setOpacity = function setOpacity(opacity){
	        this._layoutNode.set({opacity : opacity});
	        this._opacityDirty = true;
	        _setDirty.call(this);
	    };

	    module.exports = Surface;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var Transform = __webpack_require__(7);
	    var Stream = __webpack_require__(8);
	    var ResizeStream = __webpack_require__(17);
	    var SizeNode = __webpack_require__(18);
	    var LayoutNode = __webpack_require__(20);
	    var sizeAlgebra = __webpack_require__(22);
	    var layoutAlgebra = __webpack_require__(23);

	    var usePrefix = !('transform' in document.documentElement.style);
	    var devicePixelRatio = window.devicePixelRatio || 1;
	    var invDevicePixelRatio = 1 / devicePixelRatio;
	    var MIN_OPACITY = 0.0001;
	    var MAX_OPACITY = 0.9999;
	    var EPSILON = 1e-5;
	    var _zeroZero = [0,0];

	    /**
	     * Responsible for committing CSS3 properties to the DOM and providing DOM event hooks
	     *  from a provided DOM element. Where Surface's API handles inputs from the developer
	     *  from within Samsara, ElementOutput handles the DOM interaction layer.
	     *
	     *
	     * @class ElementOutput
	     * @constructor
	     * @namespace Core
	     * @uses Core.LayoutNode
	     * @uses Core.SizeNode
	     * @private
	     * @param {Node} element document parent of this container
	     */
	    function ElementOutput(element) {
	        this._currentTarget = null;

	        this._cachedSpec = {
	            transform : null,
	            opacity : 1,
	            origin : null,
	            size : null
	        };

	        this._eventOutput = new EventHandler();
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventForwarder = function _eventForwarder(event) {
	            this._eventOutput.emit(event.type, event);
	        }.bind(this);

	        this._sizeNode = new SizeNode();
	        this._layoutNode = new LayoutNode();

	        this._size = new EventHandler();
	        this._layout = new EventHandler();

	        this.size = ResizeStream.lift(function elementSizeLift(sizeSpec, parentSize){
	            if (!parentSize) return false; // occurs when surface is never added
	            return sizeAlgebra(sizeSpec, parentSize);
	        }, [this._sizeNode, this._size]);

	        this.layout = Stream.lift(function(parentSpec, objectSpec, size){
	            if (!parentSpec || !size) return false;
	            return (objectSpec)
	                ? layoutAlgebra(objectSpec, parentSpec, size)
	                : parentSpec;
	        }, [this._layout, this._layoutNode, this.size]);

	        this.layout.on('start', function(){
	            if (!this._currentTarget){
	                var root = this._getRoot();
	                this.setup(root.allocator);
	            }
	        }.bind(this));

	        this.layout.on('update', commitLayout.bind(this));
	        this.layout.on('end', commitLayout.bind(this));

	        this.size.on('resize', function(size){
	            if (!this._currentTarget){
	                var root = this._getRoot();
	                this.setup(root.allocator);
	            }
	            commitSize.call(this, size);
	        }.bind(this));

	        this._currentTarget = null;

	        this._opacityDirty = true;
	        this._originDirty = true;
	        this._transformDirty = true;
	        this._isVisible = true;

	        if (element) this.attach(element);
	    }

	    function _formatCSSOrigin(origin) {
	        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
	    }

	    function _xyNotEquals(a, b) {
	        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
	    }

	    var _setOpacity = function _setOpacity(element, opacity){
	        if (opacity >= MAX_OPACITY)     opacity = MAX_OPACITY;
	        else if (opacity < MIN_OPACITY) opacity = MIN_OPACITY;
	        element.style.opacity = opacity;
	    };

	    var _setOrigin = usePrefix
	        ? function _setOrigin(element, origin) {
	        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
	    }
	        : function _setOrigin(element, origin) {
	        element.style.transformOrigin = _formatCSSOrigin(origin);
	    };

	    var _setTransform = (usePrefix)
	        ? function _setTransform(element, transform) {
	        element.style.webkitTransform = _formatCSSTransform(transform);
	    }
	        : function _setTransform(element, matrix) {
	        element.style.transform = _formatCSSTransform(matrix);
	    };

	    var _setSize = function _setSize(target, size){
	        if (size[0] === true) size[0] = target.offsetWidth;
	        else target.style.width = Math.ceil(size[0] * devicePixelRatio) * invDevicePixelRatio + 'px';

	        if (size[1] === true) size[1] = target.offsetHeight;
	        else target.style.height = Math.ceil(size[1] * devicePixelRatio) * invDevicePixelRatio + 'px';
	    };


	    function _addEventListeners(target) {
	        for (var i in this._eventOutput.listeners)
	            target.addEventListener(i, this._eventForwarder);
	    }

	    function _removeEventListeners(target) {
	        for (var i in this._eventOutput.listeners)
	            target.removeEventListener(i, this._eventForwarder);
	    }

	    function _formatCSSTransform(transform) {
	        var result = 'matrix3d(';
	        for (var i = 0; i < 15; i++) {
	            if (Math.abs(transform[i]) < EPSILON) transform[i] = 0;
	            result += (i === 12 || i === 13)
	                ? Math.round(transform[i] * devicePixelRatio) * invDevicePixelRatio + ','
	                : transform[i] + ',';
	        }
	        return result + transform[15] + ')';
	    }

	    // {Visibility : hidden} allows for DOM events to pass through the element
	    var _setOpacity = function _setOpacity(element, opacity){
	        if (!this._isVisible && opacity > MIN_OPACITY){
	            element.style.visibility = 'visible';
	            this._isVisible = true;
	        }

	        if (opacity > MAX_OPACITY) opacity = MAX_OPACITY;
	        else if (opacity < MIN_OPACITY) {
	            opacity = MIN_OPACITY;
	            if (this._isVisible){
	                element.style.visibility = 'hidden';
	                this._isVisible = false;
	            }
	        }

	        if (this._isVisible) element.style.opacity = opacity;
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method on
	     *
	     * @param type {String}         DOM event channel name, e.g., "click", "touchmove"
	     * @param handler {Function}    Handler. It's only argument will be an emitted data payload.
	     */
	    ElementOutput.prototype.on = function on(type, handler) {
	        if (this._currentTarget)
	            this._currentTarget.addEventListener(type, this._eventForwarder);
	        EventHandler.prototype.on.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Removes a previously added handler to the `type` channel.
	     *  Undoes the work of `on`.
	     *
	     * @method removeListener
	     * @param type {String}         DOM event channel name e.g., "click", "touchmove"
	     * @param handler {Function}    Handler
	     */
	    ElementOutput.prototype.off = function off(type, handler) {
	        EventHandler.prototype.off.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Emit an event with optional data payload. This will execute all listening
	     *  to the channel name with the payload as only argument.
	     *
	     * @method emit
	     * @param type {string}         Event channel name
	     * @param [payload] {Object}    User defined data payload
	     */
	    ElementOutput.prototype.emit = function emit(type, payload) {
	        EventHandler.prototype.emit.apply(this._eventOutput, arguments);
	    };

	    /**
	     * Assigns the DOM element for committing and to and attaches event listeners.
	     *
	     * @private
	     * @method attach
	     * @param {Node} target document parent of this container
	     */
	    ElementOutput.prototype.attach = function attach(target) {
	        this._currentTarget = target;
	        _addEventListeners.call(this, target);
	    };

	    /**
	     * Removes the associated DOM element in memory and detached event listeners.
	     *
	     * @private
	     * @method detach
	     */
	    ElementOutput.prototype.detach = function detach() {
	        var target = this._currentTarget;
	        if (target) {
	            _removeEventListeners.call(this, target);
	            target.style.display = '';
	        }
	        this._currentTarget = null;
	    };

	    function commitLayout(layout) {
	        var target = this._currentTarget;
	        if (!target) return;

	        var cache = this._cachedSpec;

	        var transform = layout.transform || Transform.identity;
	        var opacity = (layout.opacity === undefined) ? 1 : layout.opacity;
	        var origin = layout.origin || _zeroZero;

	        this._transformDirty = Transform.notEquals(cache.transform, transform);
	        this._opacityDirty = this._opacityDirty || (cache.opacity !== opacity);
	        this._originDirty = this._originDirty || (origin && _xyNotEquals(cache.origin, origin));

	        if (this._opacityDirty) {
	            cache.opacity = opacity;
	            _setOpacity.call(this, target, opacity);
	        }

	        if (this._originDirty){
	            cache.origin = origin;
	            _setOrigin(target, origin);
	        }

	        if (this._transformDirty) {
	            cache.transform = transform;
	            _setTransform(target, transform);
	        }

	        this._originDirty = false;
	        this._transformDirty = false;
	        this._opacityDirty = false;
	    }

	    function commitSize(size){
	        var target = this._currentTarget;
	        if (!target) return;

	        if (_xyNotEquals(this._cachedSpec.size, size)){
	            this._cachedSpec.size = size;
	            _setSize(target, size);
	            this.emit('resize', size);
	        }
	    }

	    module.exports = ElementOutput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventEmitter = __webpack_require__(6);

	    /**
	     * EventHandler extends EventEmitter to provide subscription methods.
	     *  It also includes helper methods on the constructor for setting up Controllers and Views
	     *  with input and output emitters.
	     *
	     *  @example
	     *
	     *      var eventHandlerA = new EventHandler();
	     *      var eventHandlerB = new EventHandler();
	     *
	     *      eventHandlerB.subscribe(eventHandlerA);
	     *
	     *      eventHandlerB.on('name', function(payload){
	     *          console.log(payload) // {data : 0}
	     *      });
	     *
	     *      eventHandlerA.emit('name', {data : 0});
	     *
	     * @class EventHandler
	     * @namespace Core
	     * @extends Core.EventEmitter
	     * @constructor
	     */
	    function EventHandler() {
	        EventEmitter.apply(this, arguments);

	        this.upstream = []; // upstream event handlers
	        this.upstreamListeners = {}; // upstream listeners
	    }

	    EventHandler.prototype = Object.create(EventEmitter.prototype);
	    EventHandler.prototype.constructor = EventHandler;

	    /**
	     * Constructor helper method. Assign an event handler to receive an object's input events.
	     *  Defines `trigger`, `subscribe` and `unsubscribe` methods on the class instance.
	     *
	     * @method setInputHandler
	     * @static
	     * @param object {Object}           Class instance
	     * @param handler {EventHandler}    EventHandler representing an input source
	     */
	    EventHandler.setInputHandler = function setInputHandler(object, handler) {
	        object.trigger = handler.trigger.bind(handler);
	        object.subscribe = handler.subscribe.bind(handler);
	        object.unsubscribe = handler.unsubscribe.bind(handler);
	    };

	    /**
	     * Constructor helper method. Assign an event handler to emit an object's output events.
	     *  Defines `emit`, `on` and `off` methods on the class instance.
	     *
	     * @method setOutputHandler
	     * @static
	     * @param object {Object}           Object to provide on, off and emit methods
	     * @param handler {EventHandler}    Handler assigned event handler
	     */
	    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
	        handler.bindThis(object);
	        object.emit = handler.emit.bind(handler);
	        object.on = handler.on.bind(handler);
	        object.off = handler.off.bind(handler);
	    };

	    /**
	     * Constructor helper method. Given an events dictionary of {eventName : handler} pairs, attach them to
	     *  a provided input handler for an object.
	     *
	     * @method setInputEvents
	     * @static
	     * @private
	     * @param object {Object}           Object to provide on, off and emit methods
	     * @param handler {EventHandler}    Handler assigned event handler
	     */
	    EventHandler.setInputEvents = function setInputEvents(object, events, handlerIn){
	        for (var key in events) {
	            var handlerName = events[key];
	            var handler = (typeof handlerName === 'string')
	                ? object[handlerName]
	                : handlerName;
	            if (handler) handlerIn.on(key, handler.bind(object));
	        }
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *  Extends EventEmitter's `on` method.
	     *
	     * @method on
	     * @param type {String}             Event channel name
	     * @param handler {Function}        Handler
	     */
	    EventHandler.prototype.on = function on(type, handler) {
	        EventEmitter.prototype.on.apply(this, arguments);
	        if (!(type in this.upstreamListeners)) {
	            var upstreamListener = this.trigger.bind(this, type);
	            this.upstreamListeners[type] = upstreamListener;
	            for (var i = 0; i < this.upstream.length; i++) {
	                this.upstream[i].on(type, upstreamListener);
	            }
	        }
	    };

	    /**
	     * Listen for events from an an upstream source.
	     *
	     * @method subscribe
	     * @param source {EventEmitter} Event source
	     */
	    EventHandler.prototype.subscribe = function subscribe(source) {
	        var index = this.upstream.indexOf(source);
	        if (index < 0) {
	            this.upstream.push(source);
	            for (var type in this.upstreamListeners) {
	                source.on(type, this.upstreamListeners[type]);
	            }
	        }
	        return source;
	    };

	    /**
	     * Stop listening to events from an upstream source.
	     *  Undoes work of `subscribe`.
	     *
	     * @method unsubscribe
	     * @param source {EventEmitter} Event source
	     */
	    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
	        var index = this.upstream.indexOf(source);
	        if (index >= 0) {
	            this.upstream.splice(index, 1);
	            for (var type in this.upstreamListeners) {
	                source.off(type, this.upstreamListeners[type]);
	            }
	        }
	        return source;
	    };

	    module.exports = EventHandler;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * EventEmitter represents an asynchronous channel for broadcasting and receiving events.
	     *
	     * @example
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventEmitter.on('send', function(payload){
	     *          console.log(payload) // {data : 0}
	     *      });
	     *
	     *      // sometime later...
	     *      eventEmitter.emit('send', {data : 0});
	     *
	     * @class EventEmitter
	     * @namespace Core
	     * @constructor
	     */
	    function EventEmitter() {
	        this.listeners = {};
	        this._owner = this;
	    }

	    /**
	     * Broadcast an event on the `type` channel with an optional payload. This will call the handlers
	     *  of all EventEmitters listening on the `type` channel with the (optional) data payload
	     *  as its argument.
	     *
	     * @method emit
	     *
	     * @param type {String}     Channel name
	     * @param data {Object}     Payload
	     */
	    EventEmitter.prototype.emit = function emit(type, data) {
	        if (data === false) return; // do not propagate
	        var handlers = this.listeners[type];
	        if (handlers) {
	            for (var i = 0; i < handlers.length; i++)
	                handlers[i].call(this._owner, data);
	        }
	    };

	    /**
	     * Alias for emit.
	     *
	     * @method trigger
	     */
	    EventEmitter.prototype.trigger = EventEmitter.prototype.emit;


	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method on
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    EventEmitter.prototype.on = function on(type, handler) {
	        if (!(type in this.listeners)) this.listeners[type] = [];
	        this.listeners[type].push(handler);
	    };

	    /**
	     * Behaves like `EventEmitter.prototype.on`, except the handler is only executed once.
	     *
	     * @method once
	     * @param type {String}         Event type key (for example, 'click')
	     * @param handler {Function}    Callback
	     */
	    EventEmitter.prototype.once = function once(type, handler){
	        var onceHandler = function(){
	            handler.apply(this, arguments);
	            EventEmitter.prototype.off.call(this, type, onceHandler);
	        }.bind(this);
	        this.on(type, onceHandler);
	    };

	   /**
	     * Removes the `handler` from the `type` channel.
	     *   This undoes the work of `on`.
	     *
	     * @method off
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    EventEmitter.prototype.off = function off(type, handler) {
	        if (!type) {
	            this.listeners = {};
	            return;
	        }

	        var listener = this.listeners[type];
	        if (listener !== undefined) {
	            if (!handler) this.listeners[type] = []; // remove all listeners of given type
	            else {
	                var index = listener.indexOf(handler);
	                if (index >= 0) listener.splice(index, 1);
	            }
	        }
	    };

	    /**
	     * A convenience method to bind the provided object to all added handlers.
	     *
	     * @method bindThis
	     * @param owner {Object}        Bound `this` context
	     */
	    EventEmitter.prototype.bindThis = function bindThis(owner) {
	        this._owner = owner;
	    };

	    module.exports = EventEmitter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * A library for creating and composing CSS3 matrix transforms.
	     *  A Transform is a 16 element float array `t = [t0, ..., t15]`
	     *  that corresponds to a 4x4 transformation matrix (in row-major order)
	     *
	     *  ```
	     *    ┌               ┐
	     *    │ t0  t1  t2  0 │
	     *    │ t4  t5  t6  0 │
	     *    │ t8  t9  t10 0 │
	     *    │ t12 t13 t14 1 │
	     *    └               ┘
	     *  ```
	     *
	     *  This matrix is a data structure encoding a combination of translation,
	     *  scale, skew and rotation components.
	     *
	     *  Note: these matrices are transposes from their mathematical counterparts.
	     *
	     *  @example
	     *
	     *      var layoutNode = var LayoutNode({
	     *          transform : Transform.translate([100,200,50])
	     *      });
	     *
	     *  @example
	     *
	     *      var transitionable = new Transitionable(0);
	     *
	     *      var transform = transitionable.map(function(value){
	     *          return Transform.scaleX(value);
	     *      });
	     *
	     *      var layoutNode = var LayoutNode({
	     *          transform : transform
	     *      });
	     *
	     *      transitionable.set(100, {duration : 500});
	     *
	     * @class Transform
	     * @static
	     */
	    var Transform = {};

	    /**
	     * Identity transform.
	     *
	     * @property identity {Array}
	     * @static
	     * @final
	     */
	    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	    //TODO: why do inFront/behind need to translate by >1 to overcome DOM order?
	    /**
	     * Transform for moving a renderable in front of another renderable in the z-direction.
	     *
	     * @property inFront {Array}
	     * @static
	     * @final
	     */
	    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1.001, 1];

	    /**
	     * Transform for moving a renderable behind another renderable in the z-direction.
	     *
	     * @property behind {Array}
	     * @static
	     * @final
	     */
	    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1.001, 1];

	    /**
	     * Compose Transform arrays via matrix multiplication.
	     *
	     * @method compose
	     * @static
	     * @param t1 {Transform} Left Transform
	     * @param t2 {Transform} Right Transform
	     * @return {Array}
	     */
	    Transform.compose = function multiply(t1, t2) {
	        if (t1 === Transform.identity) return t2.slice();
	        if (t2 === Transform.identity) return t1.slice();
	        return [
	            t1[0] * t2[0] + t1[4] * t2[1] + t1[8] * t2[2],
	            t1[1] * t2[0] + t1[5] * t2[1] + t1[9] * t2[2],
	            t1[2] * t2[0] + t1[6] * t2[1] + t1[10] * t2[2],
	            0,
	            t1[0] * t2[4] + t1[4] * t2[5] + t1[8] * t2[6],
	            t1[1] * t2[4] + t1[5] * t2[5] + t1[9] * t2[6],
	            t1[2] * t2[4] + t1[6] * t2[5] + t1[10] * t2[6],
	            0,
	            t1[0] * t2[8] + t1[4] * t2[9] + t1[8] * t2[10],
	            t1[1] * t2[8] + t1[5] * t2[9] + t1[9] * t2[10],
	            t1[2] * t2[8] + t1[6] * t2[9] + t1[10] * t2[10],
	            0,
	            t1[0] * t2[12] + t1[4] * t2[13] + t1[8] * t2[14] + t1[12],
	            t1[1] * t2[12] + t1[5] * t2[13] + t1[9] * t2[14] + t1[13],
	            t1[2] * t2[12] + t1[6] * t2[13] + t1[10] * t2[14] + t1[14],
	            1
	        ];
	    };

	    /**
	     * Convenience method to Compose several Transform arrays.
	     *
	     * @method composeMany
	     * @static
	     * @param {...Transform}    Transform arrays
	     * @return {Array}
	     */
	    Transform.composeMany = function composeMany(){
	        if (arguments.length > 2){
	            var first = arguments[0];
	            var second = arguments[1];
	            Array.prototype.shift.call(arguments);
	            arguments[0] = Transform.compose(first, second);
	            return Transform.composeMany.apply(null, arguments);
	        }
	        else return Transform.compose.apply(null, arguments);
	    };

	    /**
	     * Translate a Transform after the Transform is applied.
	     *
	     * @method thenMove
	     * @static
	     * @param t {Transform}     Transform
	     * @param v {Number[]}      Array of [x,y,z] translation components
	     * @return {Array}
	     */
	    Transform.thenMove = function thenMove(t, v) {
	        if (!v[2]) v[2] = 0;
	        return [t[0], t[1], t[2], 0, t[4], t[5], t[6], 0, t[8], t[9], t[10], 0, t[12] + v[0], t[13] + v[1], t[14] + v[2], 1];
	    };

	    /**
	     * Translate a Transform before the Transform is applied.
	     *
	     * @method moveThen
	     * @static
	     * @param v {Number[]}      Array of [x,y,z] translation components
	     * @param t {Transform}     Transform
	     * @return {Array}
	     */
	    Transform.moveThen = function moveThen(v, t) {
	        if (!v[2]) v[2] = 0;
	        var t0 = v[0] * t[0] + v[1] * t[4] + v[2] * t[8];
	        var t1 = v[0] * t[1] + v[1] * t[5] + v[2] * t[9];
	        var t2 = v[0] * t[2] + v[1] * t[6] + v[2] * t[10];
	        return Transform.thenMove(t, [t0, t1, t2]);
	    };

	    /**
	     * Return a Transform which represents translation by a translation vector.
	     *
	     * @method translate
	     * @static
	     * @param v {Number[]}      Translation vector [x,y,z]
	     * @return {Array}
	     */
	    Transform.translate = function translate(v) {
	        var x = v[0] || 0;
	        var y = v[1] || 0;
	        var z = v[2] || 0;
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the x-direction.
	     *
	     * @method translateX
	     * @static
	     * @param x {Number}        Translation amount
	     */
	    Transform.translateX = function translateX(x) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the y-direction.
	     *
	     * @method translateY
	     * @static
	     * @param y {Number}        Translation amount
	     */
	    Transform.translateY = function translateY(y) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, y, 0, 1];
	    };

	    /**
	     * Return a Transform which represents translation in the z-direction.
	     *
	     * @method translateZ
	     * @static
	     * @param z {Number}        Translation amount
	     */
	    Transform.translateZ = function translateZ(z) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1];
	    };

	    /**
	     * Return a Transform which represents a scaling by specified amounts in each dimension.
	     *
	     * @method scale
	     * @static
	     * @param v {Number[]}      Scale vector [x,y,z]
	     * @return {Array}
	     */
	    Transform.scale = function scale(v) {
	        var x = (v[0] !== undefined) ? v[0] : 1;
	        var y = (v[1] !== undefined) ? v[1] : 1;
	        var z = (v[2] !== undefined) ? v[2] : 1;
	        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the x-direction.
	     *
	     * @method scaleX
	     * @static
	     * @param x {Number}        Scale amount
	     */
	    Transform.scaleX = function scaleX(x) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the y-direction.
	     *
	     * @method scaleY
	     * @static
	     * @param y {Number}        Scale amount
	     */
	    Transform.scaleY = function scaleY(y) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, y, 0, 1];
	    };

	    /**
	     * Return a Transform which represents scaling in the z-direction.
	     *
	     * @method scaleZ
	     * @static
	     * @param z {Number}        Scale amount
	     */
	    Transform.scaleZ = function scaleZ(z) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, z, 1];
	    };

	    /**
	     * Scale a Transform after the Transform is applied.
	     *
	     * @method thenScale
	     * @static
	     * @param t {Transform}     Transform
	     * @param v {Number[]}      Array of [x,y,z] scale components
	     * @return {Array}
	     */
	    Transform.thenScale = function thenScale(t, v) {
	        var x = (v[0] !== undefined) ? v[0] : 1;
	        var y = (v[1] !== undefined) ? v[1] : 1;
	        var z = (v[2] !== undefined) ? v[2] : 1;
	        return [
	            x * t[0],  y * t[1],  z * t[2],  0,
	            x * t[4],  y * t[5],  z * t[6],  0,
	            x * t[8],  y * t[9],  z * t[10], 0,
	            x * t[12], y * t[13], z * t[14], 1
	        ];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the x-axis.
	     *
	     * @method rotateX
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateX = function rotateX(angle) {
	        var cosTheta = Math.cos(angle);
	        var sinTheta = Math.sin(angle);
	        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the y-axis.
	     *
	     * @method rotateY
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateY = function rotateY(angle) {
	        var cosTheta = Math.cos(angle);
	        var sinTheta = Math.sin(angle);
	        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representing a clockwise rotation around the z-axis.
	     *
	     * @method rotateX
	     * @static
	     * @param angle {Number}    Angle in radians
	     * @return {Array}
	     */
	    Transform.rotateZ = function rotateZ(theta) {
	        var cosTheta = Math.cos(theta);
	        var sinTheta = Math.sin(theta);
	        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the x-direction
	     *
	     * @method skewX
	     * @static
	     * @param angle {Number}    The angle between the top and left sides
	     * @return {Array}
	     */
	    Transform.skewX = function skewX(angle) {
	        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform representation of a skew in the y-direction
	     *
	     * @method skewY
	     * @static
	     * @param angle {Number}    The angle between the bottom and right sides
	     * @return {Array}
	     */
	    Transform.skewY = function skewY(angle) {
	        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    };

	    /**
	     * Return a Transform which represents an axis-angle rotation.
	     *
	     * @method rotateAxis
	     * @static
	     * @param v {Number[]}   Unit vector representing the axis to rotate about
	     * @param angle {Number} Radians to rotate clockwise about the axis
	     * @return {Array}
	     */
	    Transform.rotateAxis = function rotateAxis(v, angle) {
	        var sinTheta = Math.sin(angle);
	        var cosTheta = 1 - Math.cos(angle);
	        var verTheta = 1 - cosTheta; // versine of theta

	        var xxV = v[0] * v[0] * verTheta;
	        var xyV = v[0] * v[1] * verTheta;
	        var xzV = v[0] * v[2] * verTheta;
	        var yyV = v[1] * v[1] * verTheta;
	        var yzV = v[1] * v[2] * verTheta;
	        var zzV = v[2] * v[2] * verTheta;
	        var xs = v[0] * sinTheta;
	        var ys = v[1] * sinTheta;
	        var zs = v[2] * sinTheta;

	        return [
	            xxV + cosTheta, xyV + zs, xzV - ys, 0,
	            xyV - zs, yyV + cosTheta, yzV + xs, 0,
	            xzV + ys, yzV - xs, zzV + cosTheta, 0,
	            0, 0, 0, 1
	        ];
	    };

	    /**
	     * Return a Transform which represents a Transform applied about an origin point.
	     *  Useful for rotating and scaling relative to an origin.
	     *
	     * @method aboutOrigin
	     * @static
	     * @param v {Number[]}          Origin point [x,y,z]
	     * @param t {Transform}         Transform
	     * @return {Array}
	     */
	    Transform.aboutOrigin = function aboutOrigin(v, t) {
	        v[2] = v[2] || 0;
	        var t0 = v[0] - (v[0] * t[0] + v[1] * t[4] + v[2] * t[8]);
	        var t1 = v[1] - (v[0] * t[1] + v[1] * t[5] + v[2] * t[9]);
	        var t2 = v[2] - (v[0] * t[2] + v[1] * t[6] + v[2] * t[10]);
	        return Transform.thenMove(t, [t0, t1, t2]);
	    };

	    /**
	     * Returns a perspective Transform.
	     *
	     * @method perspective
	     * @static
	     * @param focusZ {Number}       z-depth of focal point
	     * @return {Array}
	     */
	    Transform.perspective = function perspective(focusZ) {
	        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1];
	    };

	    /**
	     * Return translation vector component of the given Transform.
	     *
	     * @method getTranslate
	     * @static
	     * @param t {Transform}         Transform
	     * @return {Number[]}
	     */
	    Transform.getTranslate = function getTranslate(t) {
	        return [t[12], t[13], t[14]];
	    };

	    /**
	     * Return inverse Transform for given Transform.
	     *   Note: will provide incorrect results if Transform is not invertible.
	     *
	     * @method inverse
	     * @static
	     * @param t {Transform} Transform
	     * @return {Array}
	     */
	    Transform.inverse = function inverse(t) {
	        // only need to consider 3x3 section for affine
	        var c0 = t[5] * t[10] - t[6] * t[9];
	        var c1 = t[4] * t[10] - t[6] * t[8];
	        var c2 = t[4] * t[9] - t[5] * t[8];
	        var c4 = t[1] * t[10] - t[2] * t[9];
	        var c5 = t[0] * t[10] - t[2] * t[8];
	        var c6 = t[0] * t[9] - t[1] * t[8];
	        var c8 = t[1] * t[6] - t[2] * t[5];
	        var c9 = t[0] * t[6] - t[2] * t[4];
	        var c10 = t[0] * t[5] - t[1] * t[4];
	        var detM = t[0] * c0 - t[1] * c1 + t[2] * c2;
	        var invD = 1 / detM;
	        var result = [
	            invD * c0, -invD * c4, invD * c8, 0,
	            -invD * c1, invD * c5, -invD * c9, 0,
	            invD * c2, -invD * c6, invD * c10, 0,
	            0, 0, 0, 1
	        ];
	        result[12] = -t[12] * result[0] - t[13] * result[4] - t[14] * result[8];
	        result[13] = -t[12] * result[1] - t[13] * result[5] - t[14] * result[9];
	        result[14] = -t[12] * result[2] - t[13] * result[6] - t[14] * result[10];
	        return result;
	    };

	    /**
	     * Returns the transpose of a Transform.
	     *
	     * @method transpose
	     * @static
	     * @param t {Transform}     Transform
	     * @return {Array}
	     */
	    Transform.transpose = function transpose(t) {
	        return [t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15]];
	    };

	    function _normSquared(v) {
	        return (v.length === 2)
	            ? v[0] * v[0] + v[1] * v[1]
	            : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
	    }
	    function _norm(v) {
	        return Math.sqrt(_normSquared(v));
	    }
	    function _sign(n) {
	        return (n < 0) ? -1 : 1;
	    }

	    /**
	     * Decompose Transform into separate `translate`, `rotate`, `scale` and `skew` components.
	     *
	     * @method interpret
	     * @static
	     * @private
	     * @param t {Transform}     Transform
	     * @return {Object}
	     */
	    Transform.interpret = function interpret(t) {
	        // QR decomposition via Householder reflections
	        // FIRST ITERATION

	        //default Q1 to the identity matrix;
	        var x = [t[0], t[1], t[2]];                // first column vector
	        var sgn = _sign(x[0]);                     // sign of first component of x (for stability)
	        var xNorm = _norm(x);                      // norm of first column vector
	        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
	        var mult = 2 / _normSquared(v);            // mult = 2/v'v

	        //bail out if our Matrix is singular
	        if (mult >= Infinity) {
	            return {
	                translate: Transform.getTranslate(t),
	                rotate: [0, 0, 0],
	                scale: [0, 0, 0],
	                skew: [0, 0, 0]
	            };
	        }

	        //evaluate Q1 = I - 2vv'/v'v
	        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonals
	        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
	        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
	        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

	        //upper diagonal
	        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
	        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
	        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

	        //lower diagonal
	        Q1[4] = Q1[1];                      // 1,0 entry
	        Q1[8] = Q1[2];                      // 2,0 entry
	        Q1[9] = Q1[6];                      // 2,1 entry

	        //reduce first column of M
	        var MQ1 = Transform.compose(Q1, t);

	        // SECOND ITERATION on (1,1) minor
	        var x2 = [MQ1[5], MQ1[6]];
	        var sgn2 = _sign(x2[0]);                    // sign of first component of x (for stability)
	        var x2Norm = _norm(x2);                     // norm of first column vector
	        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];    // v = x + sign(x[0])|x|e1
	        var mult2 = 2 / _normSquared(v2);           // mult = 2/v'v

	        //evaluate Q2 = I - 2vv'/v'v
	        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

	        //diagonal
	        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
	        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

	        //off diagonals
	        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
	        Q2[9] = Q2[6];                      // 1,2 entry

	        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
	        var Q = Transform.compose(Q2, Q1);      //note: really Q transpose
	        var R = Transform.compose(Q, t);

	        //remove negative scaling
	        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
	        R = Transform.compose(R, remover);
	        Q = Transform.compose(remover, Q);

	        //decompose into rotate/scale/skew matrices
	        var result = {};
	        result.translate = Transform.getTranslate(t);
	        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
	        if (!result.rotate[0]) {
	            result.rotate[0] = 0;
	            result.rotate[2] = Math.atan2(Q[4], Q[5]);
	        }
	        result.scale = [R[0], R[5], R[10]];
	        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

	        //double rotation workaround
	        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
	            result.rotate[1] = Math.PI - result.rotate[1];
	            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
	            if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;
	            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
	            else result.rotate[0] -= Math.PI;
	            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
	            else result.rotate[2] -= Math.PI;
	        }

	        return result;
	    };

	    /**
	     * Compose .translate, .rotate, .scale and .skew components into a Transform matrix.
	     *  The "inverse" of .interpret.
	     *
	     * @method build
	     * @static
	     * @private
	     * @param spec {Object} Object with keys "translate, rotate, scale, skew" and their vector values
	     * @return {Array}
	     */
	    Transform.build = function build(spec) {
	        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
	        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
	        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
	        return Transform.thenMove(
	            Transform.compose(Transform.compose(rotateMatrix, skewMatrix), scaleMatrix),
	            spec.translate
	        );
	    };

	    /**
	     * Weighted average between two matrices by averaging their
	     *  translation, rotation, scale, skew components.
	     *  f(M1,M2,t) = (1 - t) * M1 + t * M2
	     *
	     * @method average
	     * @static
	     * @param M1 {Transform}    M1 = f(M1,M2,0) Transform
	     * @param M2 {Transform}    M2 = f(M1,M2,1) Transform
	     * @param [t=1/2] {Number}
	     * @return {Array}
	     */
	    Transform.average = function average(M1, M2, t) {
	        t = (t === undefined) ? 0.5 : t;
	        var specM1 = Transform.interpret(M1);
	        var specM2 = Transform.interpret(M2);

	        var specAvg = {
	            translate: [0, 0, 0],
	            rotate: [0, 0, 0],
	            scale: [0, 0, 0],
	            skew: [0, 0, 0]
	        };

	        for (var i = 0; i < 3; i++) {
	            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
	            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
	            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
	            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
	        }

	        return Transform.build(specAvg);
	    };

	    /**
	     * Determine if two Transforms are component-wise equal.
	     *
	     * @method equals
	     * @static
	     * @param a {Transform}     Transform
	     * @param b {Transform}     Transform
	     * @return {Boolean}
	     */
	    Transform.equals = function equals(a, b) {
	        return !Transform.notEquals(a, b);
	    };

	    /**
	     * Determine if two Transforms are component-wise unequal
	     *
	     * @method notEquals
	     * @static
	     * @param a {Transform}     Transform
	     * @param b {Transform}     Transform
	     * @return {Boolean}
	     */
	    Transform.notEquals = function notEquals(a, b) {
	        if (a === b) return false;

	        return !(a && b) ||
	            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
	            a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] ||
	            a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] ||
	            a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
	    };

	    module.exports = Transform;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var EventMapper = __webpack_require__(9);
	    var SimpleStream = __webpack_require__(10);

	    var preTickQueue = __webpack_require__(13);
	    var postTickQueue = __webpack_require__(14);
	    var dirtyQueue = __webpack_require__(15);
	    var State = __webpack_require__(16);

	    var EVENTS = {
	        START : 'start',
	        UPDATE : 'update',
	        END : 'end',
	        RESIZE : 'resize'
	    };

	    /**
	     * Stream listens to `resize`, `start`, `update` and `end` events and
	     *  emits `start`, `update` and `end` events. `Resize` events get
	     *  unified with `start`, `update`, and `end` events depending on
	     *  when they are fired within Samsara's engine cycle.
	     *
	     *  If listening to multiple sources, Stream emits a single event per
	     *  Engine cycle.
	     *
	     *  @example
	     *
	     *      var position = new Transitionable([0,0]);
	     *      var size = new EventEmitter();
	     *
	     *      var translationStream = Stream.lift(function(position, size){
	     *          var translation = [
	     *              position[0] + size[0],
	     *              position[1] + size[1]
	     *          ];
	     *
	     *          return Transform.translate(translation);
	     *      }, [positionStream, sizeStream]);
	     *
	     *      translationStream.on('start', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      translationStream.on('update', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      translationStream.on('end', function(transform){
	     *          console.log(transform);
	     *      });
	     *
	     *      position.set([100, 50], {duration : 500});
	     *      size.emit('resize', [100,100]);
	     *
	     * @class Stream
	     * @extends Streams.SimpleStream
	     * @namespace Streams
	     * @param [options] {Object}            Options
	     * @param [options.start] {Function}    Custom logic to map the `start` event
	     * @param [options.update] {Function}   Custom logic to map the `update` event
	     * @param [options.end] {Function}      Custom logic to map the `end` event
	     * @constructor
	     */
	    function Stream(options){
	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        var isUpdating = false;
	        var dirtyStart = false;
	        var dirtyUpdate = false;
	        var dirtyEnd = false;

	        function start(data){
	            var payload = options && options.start ? options.start(data) : data;
	            if (payload !== false) this.emit(EVENTS.START, payload);
	            dirtyStart = false;
	        }

	        function update(data){
	            var payload = options && options.update ? options.update(data) : data;
	            if (payload !== false) this.emit(EVENTS.UPDATE, payload);
	            dirtyUpdate = false;
	        }

	        function end(data){
	            var payload = options && options.end ? options.end(data) : data;
	            if (payload !== false) this.emit(EVENTS.END, payload);
	            dirtyEnd = false;
	        }

	        this._eventInput.on(EVENTS.START, function(data){
	            if (dirtyStart || isUpdating) return;
	            dirtyStart = true;
	            preTickQueue.push(start.bind(this, data));
	        }.bind(this));

	        this._eventInput.on(EVENTS.UPDATE, function(data){
	            if (dirtyUpdate) return;
	            dirtyUpdate = true;
	            isUpdating = true;
	            postTickQueue.push(update.bind(this, data));
	        }.bind(this));

	        this._eventInput.on(EVENTS.END, function(data){
	            if (dirtyEnd) return;
	            dirtyEnd = true;
	            isUpdating = false;
	            dirtyQueue.push(end.bind(this, data));
	        }.bind(this));

	        this._eventInput.on(EVENTS.RESIZE, function(data){
	            switch (State.get()){
	                case State.STATES.START:
	                    this.trigger(EVENTS.START, data);
	                    break;
	                case State.STATES.UPDATE:
	                    this.trigger(EVENTS.UPDATE, data);
	                    break;
	                case State.STATES.END:
	                    this.trigger(EVENTS.END, data);
	                    break;
	            }
	        }.bind(this));
	    }

	    Stream.prototype = Object.create(SimpleStream.prototype);
	    Stream.prototype.constructor = Stream;

	    /**
	     * Extends SimpleStream.lift
	     *
	     * @static
	     * @return
	     */
	    Stream.lift = SimpleStream.lift;

	    /**
	     * Batches events for provided object of streams in
	     *  {key : stream} pairs. Emits one event per Engine cycle.
	     *
	     * @method merge
	     * @static
	     * @param streams {Object}  Dictionary of `resize` streams
	     */
	    Stream.merge = function(streamObj){
	        var mergedStream = new Stream();
	        var mergedData = (streamObj instanceof Array) ? [] : {};

	        mergedStream.addStream = function(key, stream){
	            var mapper = (function(key){
	                return new EventMapper(function(data){
	                    mergedData[key] = data;
	                    return mergedData;
	                });
	            })(key);

	            mergedStream.subscribe(mapper).subscribe(stream);
	        };

	        for (var key in streamObj){
	            var stream = streamObj[key];
	            mergedStream.addStream(key, stream);
	        }

	        return mergedStream;
	    };

	    module.exports = Stream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);

	    /**
	     * EventMapper modifies the data payload of an event based on
	     *  a provided function.
	     *
	     *  Note: it does not modify the event's `type`.
	     *
	     *  @example
	     *
	     *      var eventMapper = new EventMapper(function(payload){
	     *          return payload.x + payload.y
	     *      });
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventMapper.subscribe(eventEmitter);
	     *
	     *      eventMapper.on('name', function(value){
	     *          alert(value);
	     *      });
	     *
	     *      eventEmitter.emit('name', {x : 1, y : 2}); // alerts 3
	     *
	     * @class EventMapper
	     * @constructor
	     * @param map {Function}  Function to modify the event payload
	     */
	    function EventMapper(map) {
	        EventHandler.call(this);
	        this._mappingFunction = map;
	    }

	    EventMapper.prototype = Object.create(EventHandler.prototype);
	    EventMapper.prototype.constructor = EventMapper;

	    /**
	     * Emit mapped event.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventMapper.prototype.emit = function emit(type, data) {
	        var mappedData = this._mappingFunction(data);
	        EventHandler.prototype.emit.call(this, type, mappedData);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventMapper.prototype.trigger = EventMapper.prototype.emit;

	    module.exports = EventMapper;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var EventMapper = __webpack_require__(9);
	    var EventFilter = __webpack_require__(11);
	    var EventSplitter = __webpack_require__(12);

	    /**
	     * A SimpleStream wraps an EventHandler and provides convenience
	     *  methods of `map`, `filter`, `split`, and `pluck` to
	     *  transform one stream into another.
	     *
	     * @example
	     *
	     * @class SimpleStream
	     * @extends Core.EventHandler
	     * @private
	     * @namespace Streams
	     * @constructor
	     */
	    function SimpleStream(){
	        EventHandler.call(this);
	    }

	    SimpleStream.prototype = Object.create(EventHandler.prototype);
	    SimpleStream.prototype.constructor = SimpleStream;

	    /**
	     * Map converts the current stream into a new stream
	     *  with a modified (mapped) data payload.
	     *
	     * @method map
	     * @param mapperFn {Function}   Function to map event payload
	     */
	    SimpleStream.prototype.map = function(mapperFn){
	        var stream = new SimpleStream();
	        var mapper = new EventMapper(mapperFn);
	        stream.subscribe(mapper).subscribe(this);
	        return stream;
	    };

	    /**
	     * Filter converts the current stream into a new stream
	     *  that only emits if the filter condition is satisfied.
	     *  The function should return a Boolean.
	     *
	     * @method filter
	     * @param filterFn {Function}   Function to filter event payload
	     */
	    SimpleStream.prototype.filter = function(filterFn){
	        var filter = new EventFilter(filterFn);
	        var filteredStream = new SimpleStream();
	        filteredStream.subscribe(filter).subscribe(this);
	        return filteredStream;
	    };

	    /**
	     * Split maps one of several streams based on custom logic.
	     *  The function should return an EventEmitter.
	     *
	     * @method split
	     * @param splitterFn {Function}  Splitter function
	     */
	    SimpleStream.prototype.split = function(splitterFn){
	        var splitter = new EventSplitter(splitterFn);
	        var splitStream = new SimpleStream();
	        splitStream.subscribe(splitter).subscribe(this);
	        return splitStream;
	    };

	    /**
	     * Pluck is an opinionated mapper. It projects a Stream
	     *  onto one of its return values.
	     *
	     *  Useful if a Stream returns an array or an object.
	     *
	     * @method pluck
	     * @param key {String|Number}   Key to project event payload onto
	     */
	    SimpleStream.prototype.pluck = function(key){
	        return this.map(function(value){
	            return value[key];
	        });
	    };

	    //TODO: can this be inherited by other streams?
	    SimpleStream.merge = function(){};

	    /**
	     * Lift is like map, except it maps several event sources,
	     *  not only one.
	     *
	     *  @example
	     *
	     *      var liftedStream = SimpleStream.lift(function(payload1, payload2){
	     *          return payload1 + payload2;
	     *      }, [stream2, stream2]);
	     *
	     *      liftedStream.on('name'), function(data){
	     *          // data = 3;
	     *      });
	     *
	     *      stream2.emit('name', 1);
	     *      stream2.emit('name', 2);
	     *
	     * @method lift
	     * @static
	     * @param map {Function}            Function to map stream payloads
	     * @param streams {Array|Object}    Stream sources
	     */
	    SimpleStream.lift = function(map, streams){
	        //TODO: fix comma separated arguments
	        var mergedStream = (streams instanceof Array)
	            ? this.merge(streams)
	            : this.merge.apply(null, Array.prototype.splice.call(arguments, 1));

	        var mappedStream = new EventMapper(function liftMap(data){
	            return map.apply(null, data);
	        });

	        var liftedStream = new SimpleStream();
	        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

	        return liftedStream;
	    };

	    module.exports = SimpleStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);

	    /**
	     * EventFilter regulates the broadcasting of events based on
	     *  a specified condition prescribed by a provided function
	     *  with the signature `(type, data) -> Boolean`
	     *
	     *  @example
	     *
	     *      var eventFilter = new EventFilter(function(type, payload){
	     *          return (payload.value == 0);
	     *      });
	     *
	     *      var eventEmitter = new EventEmitter();
	     *
	     *      eventFilter.subscribe(eventEmitter);
	     *
	     *      eventFilter.on('click', function(data){
	     *          alert('fired');
	     *      });
	     *
	     *      eventEmitter.emit('click', {value : 0}); // fired
	     *      eventEmitter.emit('click', {value : 1}); // doesn't fire
	     *
	     * @class EventFilter
	     * @namespace Events
	     * @constructor
	     * @param filter {Function}  Function returning a Boolean
	     */
	    function EventFilter(filter) {
	        EventHandler.call(this);
	        this._condition = filter;
	    }
	    EventFilter.prototype = Object.create(EventHandler.prototype);
	    EventFilter.prototype.constructor = EventFilter;

	    /**
	     * Emit event if the condition is satisfied.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventFilter.prototype.emit = function emit(type, data) {
	        if (!this._condition(type, data)) return;
	        EventHandler.prototype.emit.apply(this, arguments);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventFilter.prototype.trigger = EventFilter.prototype.emit;

	    module.exports = EventFilter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);

	    /**
	     * EventSplitter routes events to various event destinations
	     *  based on custom logic. The return of the provided splitter
	     *  function should be of type EventEmitter.
	     *
	     *  @example
	     *
	     *      var eventEmitter = new EventEmitter();
	     *      var eventEmitterX = new eventEmitter();
	     *      var eventEmitterY = new eventEmitter();
	     *
	     *      var eventSplitter = new EventSplitter(function(payload){
	     *          return (payload.x > payload.y)
	     *              ? eventEmitterX;
	     *              : eventEmitterY;
	     *      });
	     *
	     *      eventSplitter.subscribe(eventEmitter);
	     *
	     *      eventEmitterX.on('move', function(){
	     *          console.log('x is bigger')
	     *      });
	     *
	     *      eventEmitterY.on('move', function(){
	     *          console.log('y is bigger')
	     *      })
	     *
	     *      eventEmitter.emit('move', {x : 3, y : 2}); // x is bigger
	     *
	     * @class EventSplitter
	     * @constructor
	     * @param splitter {Function}
	     */
	    function EventSplitter(splitter) {
	        EventHandler.call(this);
	        this._splitter = splitter;
	    }
	    EventSplitter.prototype = Object.create(EventHandler.prototype);
	    EventSplitter.prototype.constructor = EventSplitter;

	    /**
	     * Emit event.
	     *
	     * @method emit
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventSplitter.prototype.emit = function emit(type, data) {
	        var target = this._splitter.apply(this, arguments);
	        if (target && target.emit instanceof Function)
	            target.emit(type, data);
	    };

	    /**
	     * Alias of emit.
	     *
	     * @method trigger
	     * @param type {String} Channel name
	     * @param data {Object} Payload
	     */
	    EventSplitter.prototype.trigger = EventSplitter.prototype.emit;

	    module.exports = EventSplitter;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `start` events.
	     *  This queue is traversed first (but after DOM events are executed) by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `update` events.
	     *  This queue is traversed after the `preTickQueue` but before `dirtQueue`
	     *  by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * Queue that batches `end` and `dirty` events.
	     *  This queue is traversed after the `postTickQueue` by the Engine.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var STATE = {
	        NONE : -1,
	        START : 0,
	        UPDATE : 1,
	        END : 2
	    };

	    var currentState = STATE.START;

	    /**
	     * SUE specified the global state of the application, whether it is in a
	     *  `start`, `update` or `end` state. This is necessary for coordinating
	     *  `resize` events with `start`, `update`, `end` states in stream.
	     *
	     * @class SUE
	     * @namespace Core
	     * @static
	     * @private
	     */
	    var SUE = {};

	    SUE.STATES = STATE;

	    SUE.set = function set(state){
	        currentState = state;
	    };

	    SUE.get = function get(){
	        return currentState;
	    };

	    module.exports = SUE;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(10);
	    var EventMapper = __webpack_require__(9);
	    var EventHandler = __webpack_require__(5);

	    var preTickQueue = __webpack_require__(13);
	    var postTickQueue = __webpack_require__(14);
	    var dirtyQueue = __webpack_require__(15);
	    var State = __webpack_require__(16);

	    var EVENTS = {
	        RESIZE : 'resize'
	    };

	    /**
	     * ResizeStream is a stream that listens to and emits `resize` events.
	     *
	     * @class ResizeStream
	     * @private
	     * @extends Streams.Stream
	     * @namespace Streams
	     * @param [options] {Object}            Options
	     * @param [options.resize] {Function}   Custom logic to map the `resize` event
	     * @constructor
	     */
	    function ResizeStream(options){
	        var dirtyResize = false;

	        function resize(data){
	            var payload = (options && options.resize)
	                ? options.resize(data)
	                : data;
	            this.emit(EVENTS.RESIZE, payload);
	            dirtyResize = false;
	        }

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on(EVENTS.RESIZE, function(data){
	            if (!dirtyResize) {
	                var queue;
	                switch (State.get()){
	                    case State.STATES.START:
	                        queue = preTickQueue;
	                        break;
	                    case State.STATES.UPDATE:
	                        queue = postTickQueue;
	                        break;
	                    case State.STATES.END:
	                        queue = dirtyQueue;
	                        break;
	                }
	                queue.push(resize.bind(this, data));
	            }
	            dirtyResize = true;
	        }.bind(this));
	    }

	    ResizeStream.prototype = Object.create(SimpleStream.prototype);
	    ResizeStream.prototype.constructor = ResizeStream;

	    /**
	     * Extends SimpleStream.lift
	     *
	     * @method lift
	     * @static
	     */
	    ResizeStream.lift = SimpleStream.lift;

	    /**
	     * Batches resize events for provided object of streams in
	     *  {key : stream} pairs. Emits one `resize` event per Engine cycle.
	     *
	     * @method merge
	     * @static
	     * @private
	     * @param streams {Object}  Dictionary of `resize` streams
	     */
	    ResizeStream.merge = function(streams){
	        var mergedStream = new ResizeStream();
	        var mergedData = (streams instanceof Array) ? [] : {};

	        mergedStream.addStream = function(key, stream){
	            var mapper = (function(key){
	                return new EventMapper(function(data){
	                    mergedData[key] = data;
	                    return mergedData;
	                });
	            })(key);

	            mergedStream.subscribe(mapper).subscribe(stream);
	        };

	        for (var key in streams){
	            var stream = streams[key];
	            mergedStream.addStream(key, stream);
	        }

	        return mergedStream;
	    };

	    module.exports = ResizeStream;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);
	    var ResizeStream = __webpack_require__(17);
	    var SizeObservable = __webpack_require__(19);

	    /**
	     * Encapsulates a stream of size data (size, proportions, margins).
	     *  Listens on start/update/end events, batches them, and emits resize events downstream
	     *  to descendant size nodes.
	     *
	     *  Size can be defined with height and width given numerically, but
	     *  they can also be:
	     *
	     *  ```
	     *      `undefined` - takes the parent value
	     *      `true`      - takes the DOM calculated value
	     *      `false`     - value defined by setting an aspect ratio
	     *  ```
	     *
	     *  @example
	     *
	     *      var context = Engine.createContext();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var sizeNode = new SizeNode({
	     *          size : [100, undefined],
	     *          margins : [50, 50]
	     *      });
	     *
	     *      context.add(sizeNode).add(surface);
	     *
	     *      Engine.start();
	     *
	     * @class SizeNode
	     * @namespace Core
	     * @constructor
	     * @param sources {Object}                      Object of size sources
	     * @param [sources.size] {Stream|Array}         Size source
	     * @param [sources.margin] {Stream|Array}       Margin source
	     * @param [sources.proportions] {Stream|Array}  Proportions source
	     * @param [sources.aspectRatio] {Stream|Number} Aspect ratio source
	     */
	    function SizeNode(sources) {
	        this.stream = _createStream(sources);
	        EventHandler.setOutputHandler(this, this.stream);

	        this.stream._eventInput.on('start', function(data){
	            this.stream.trigger('resize', data);
	        }.bind(this));

	        this.stream._eventInput.on('update', function(data){
	            this.stream.trigger('resize', data);
	        }.bind(this));

	        this.stream._eventInput.on('end', function(data){
	            this.stream.trigger('resize', data);
	        }.bind(this));
	    }

	    /**
	     * Introduce new data streams to the size node in {key : value} pairs.
	     *  Here the `key` is one of "size", "proportions" or "marins".
	     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
	     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
	     *
	     * @method set
	     * @param obj {Object}      Object of data sources
	     */
	    SizeNode.prototype.set = function(obj){
	        // TODO: be able to overwrite streams. Not only add
	        for (var key in obj){
	            var value = obj[key];

	            var source = (value instanceof SimpleStream)
	                ? value
	                : new SizeObservable(value);

	            this.stream.addStream(key, source);
	        }
	    };

	    function _createStream(sources){
	        for (var key in sources){
	            var value = sources[key];
	            if (typeof value == 'number' || value instanceof Array){
	                var source = new SizeObservable(value);
	                sources[key] = source;
	            }
	        }
	        return ResizeStream.merge(sources);
	    }

	    module.exports = SizeNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	/* Documentation in progress. May be outdated. */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(10);
	    var preTickQueue = __webpack_require__(13);
	    var dirtyQueue = __webpack_require__(15);

	    /**
	     * A SizeObservable is a stream for resize events set discretely in time, as opposed to continuously.
	     *  It emits appropriate `resize` events upon calling the `set` method.
	     *
	     * @class Observable
	     * @constructor
	     * @private
	     * @extends Streams.SimpleStream
	     * @param value {Array} Size
	     */
	    function SizeObservable(value){
	        SimpleStream.call(this);
	        this.value = value;

	        if (value !== undefined) this.set(value);
	    }

	    SizeObservable.prototype = Object.create(SimpleStream.prototype);
	    SizeObservable.prototype.constructor = SizeObservable;

	    /**
	     * Getter for the provided size.
	     *
	     * @method get
	     * @return {Array}
	     */
	    SizeObservable.prototype.get = function(){
	        return this.value;
	    };

	    /**
	     * Setter for the provided size.
	     *
	     * @method set
	     * @param value {Array} Size
	     */
	    SizeObservable.prototype.set = function(value){
	        var self = this;
	        preTickQueue.push(function(){
	            self.value = value;
	            self.emit('resize', value);
	            dirtyQueue.push(function(){
	                self.emit('resize', value);
	            });
	        });
	    };

	    module.exports = SizeObservable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);
	    var Stream = __webpack_require__(8);
	    var Observable = __webpack_require__(21);

	    /**
	     * Encapsulates a stream of layout data (transform, origin, align, opacity).
	     *  Listens on start/update/end events, batches them, and emits them downstream
	     *  to descendant layout nodes.
	     *
	     *  @example
	     *
	     *      var context = Engine.createContext();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var opacity = new Transitionable(1);
	     *
	     *      var layout = new LayoutNode({
	     *          transform : Transform.translateX(100),
	     *          opacity : opacity
	     *      });
	     *
	     *      context.add(layout).add(surface);
	     *
	     *      Engine.on('click', function(){
	     *          opacity.set(0, {duration : 1000});
	     *      });
	     *
	     *      Engine.start();
	     *
	     * @class LayoutNode
	     * @constructor
	     * @namespace Core
	     * @param sources {Object}                          Object of layout sources
	     * @param [sources.transform] {Stream|Transform}    Transform source
	     * @param [sources.align] {Stream|Array}            Align source
	     * @param [sources.origin] {Stream|Array}           Origin source
	     * @param [sources.opacity] {Stream|Number}         Opacity source
	     */
	    function LayoutNode(sources) {
	        this.stream = _createStream(sources);
	        EventHandler.setOutputHandler(this, this.stream);
	    }

	    /**
	     * Introduce new data streams to the layout node in {key : value} pairs.
	     *  Here the `key` is one of "transform", "origin", "align" or "opacity".
	     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
	     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
	     *
	     * @method set
	     * @param sources {Object}      Object of data sources
	     */
	    LayoutNode.prototype.set = function(sources){
	        // TODO: be able to overwrite streams. Not only add
	        for (var key in sources){
	            var value = sources[key];

	            var source = (value instanceof SimpleStream)
	                ? value
	                : new Observable(value);

	            this.stream.addStream(key, source);
	        }
	    };

	    function _createStream(sources){
	        for (var key in sources){
	            var value = sources[key];
	            if (typeof value === 'number' || value instanceof Array){
	                var source = new Observable(value);
	                sources[key] = source;
	            }
	        }
	        return Stream.merge(sources);
	    }

	    module.exports = LayoutNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	/* Documentation in progress. May be outdated. */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var SimpleStream = __webpack_require__(10);
	    var preTickQueue = __webpack_require__(13);
	    var dirtyQueue = __webpack_require__(15);

	    /**
	     * An Observable is a stream for events set discretely in time, as opposed to continuously.
	     *  It emits appropriate `start` and `end` events upon calling the `set` method.
	     *
	     * @class Observable
	     * @constructor
	     * @private
	     * @extends Streams.Stream
	     * @param value {Number, String, Array, Object} Value
	     */
	    function Observable(value){
	        SimpleStream.call(this);
	        this.value = value;

	        if (value !== undefined) this.set(value);
	    }

	    Observable.prototype = Object.create(SimpleStream.prototype);
	    Observable.prototype.constructor = Observable;

	    /**
	     * Getter for the provided value.
	     *
	     * @method get
	     * @return {Number, String, Array, Object}
	     */
	    Observable.prototype.get = function(){
	        return this.value;
	    };

	    /**
	     * Setter for the provided value.
	     *
	     * @method set
	     * @param value {Number, String, Array, Object} Value
	     */
	    Observable.prototype.set = function(value){
	        var self = this;
	        preTickQueue.push(function(){
	            self.value = value;
	            self.emit('start', value);

	            dirtyQueue.push(function(){
	                self.emit('end', value);
	            });
	        });
	    };

	    module.exports = Observable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Defines the rules for composing size specs (size, margin, proportions) into a new size.
	     *  A margin array reduces the parent size by an amount specified in pixels.
	     *  A proportions array scales the parent size by a provided ratio.
	     *  A size array [width, height] can take `true`, `undefined`, or numeric values.
	     *      `undefined` takes the parent value
	     *      `true` takes the value defined by the DOM
	     *      numeric values override parent values
	     *
	     * @method compose
	     * @private
	     * @param spec {object}           Object size spec
	     * @param parentSize {object}     Parent size
	     * @return size {object}          Composed size
	     */

	    function compose(spec, parentSize){
	        if (!spec) return parentSize;

	        var size = new Array(2);

	        if (spec.size) {
	            // inheritance
	            if (spec.size[0] === undefined) size[0] = parentSize[0];
	            if (spec.size[1] === undefined) size[1] = parentSize[1];

	            // override
	            if (typeof spec.size[0] === 'number') size[0] = spec.size[0];
	            if (typeof spec.size[1] === 'number') size[1] = spec.size[1];

	            if (spec.size[0] === true) size[0] = true;
	            if (spec.size[1] === true) size[1] = true;
	        }

	        //TODO: what is parentSize isn't numeric? Compose margin/proportions?
	        if (spec.margins){
	            size[0] = parentSize[0] - (2 * spec.margins[0]);
	            size[1] = parentSize[1] - (2 * spec.margins[1]);
	        }

	        if (spec.proportions) {
	            if (typeof spec.proportions[0] === 'number') size[0] = spec.proportions[0] * parentSize[0];
	            if (typeof spec.proportions[1] === 'number') size[1] = spec.proportions[1] * parentSize[1];
	        }

	        if (spec.aspectRatio) {
	            if (typeof size[0] === 'number') size[1] = spec.aspectRatio * size[0];
	            else if (typeof size[1] === 'number') size[0] = spec.aspectRatio * size[1];
	        }

	        if (size[0] === undefined) size[0] = parentSize[0];
	        if (size[1] === undefined) size[1] = parentSize[1];

	        return size;
	    }

	    module.exports = compose;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);

	    var DEFAULT = {
	        OPACITY : 1,
	        TRANSFORM : Transform.identity,
	        ORIGIN : null,
	        ALIGN : null
	    };

	    /**
	     * Defines the rules for composing layout specs: transform, align, origin and opacity.
	     *  Transform is multiplied by the parent's transform (matrix multiplication).
	     *  Align is a proportional offset relative to the parent size.
	     *  Origin is a proportional offset relative to the current size.
	     *  Opacity is multiplied by the parent's opacity.
	     *
	     * @method compose
	     * @private
	     * @param spec {object}           Object layout spec
	     * @param parentSpec {object}     Parent layout spec
	     * @param size {Array}            Object size
	     * @return {object}               The composed layout spec
	     */

	    function compose(spec, parentSpec, size){
	        var parentOpacity = (parentSpec.opacity !== undefined) ? parentSpec.opacity : DEFAULT.OPACITY;
	        var parentTransform = parentSpec.transform || DEFAULT.TRANSFORM;

	        var origin = spec.origin || DEFAULT.ORIGIN;
	        var align = spec.align || DEFAULT.ALIGN;

	        var opacity = (spec.opacity !== undefined)
	            ? parentOpacity * spec.opacity
	            : parentOpacity;

	        var transform = (spec.transform)
	            ? Transform.compose(parentTransform, spec.transform)
	            : parentTransform;

	        var nextSizeTransform = (spec.origin)
	            ? parentTransform
	            : parentSpec.nextSizeTransform || parentTransform;

	        if (spec.size)
	            nextSizeTransform = parentTransform;

	        if (origin && (origin[0] || origin[1])){
	            //TODO: allow origin to propogate when size is non-numeric
	            var tx =  (typeof size[0] === 'number') ? -origin[0] * size[0] : 0;
	            var ty =  (typeof size[1] === 'number') ? -origin[1] * size[1] : 0;
	            transform = Transform.moveThen([tx, ty, 0], transform);
	            origin = null;
	        }

	        if (size && align && (align[0] || align[1])) {
	            var shift = _vecInContext([align[0] * size[0], align[1] * size[1], 0], nextSizeTransform);
	            transform = Transform.thenMove(transform, shift);
	            align = null;
	        }

	        return {
	            transform : transform,
	            opacity : opacity,
	            origin : origin,
	            align : align,
	            nextSizeTransform : nextSizeTransform
	        };
	    }

	    function _vecInContext(v, m) {
	        return [
	            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
	            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
	            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
	        ];
	    }

	    module.exports = compose;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var RootNode = __webpack_require__(25);
	    var EventHandler = __webpack_require__(5);
	    var ElementAllocator = __webpack_require__(27);
	    var Transitionable = __webpack_require__(28);
	    var ResizeStream = __webpack_require__(17);
	    var Stream = __webpack_require__(8);
	    var EventMapper = __webpack_require__(9);

	    var elementType = 'div';
	    var elementClass = 'samsara-context';

	    /**
	     * A Context defines a top-level DOM element inside which other nodes (like Surfaces) are rendered.
	     *  This DOM element can be provided as an argument if it exists in the document,
	     *  otherwise it is created for you and appended to the document's `<body>`.
	     *
	     *  The CSS class `samsara-context` is applied, which provides the minimal CSS necessary
	     *  to create a performant 3D context (specifically `preserve-3d`).
	     *
	     *  As of now, `Context` is not typically instantiated on its own, but rather is
	     *  created by calling `Engine.createContext()`. This may change in the near future.
	     *
	     *  @example
	     *
	     *      var context = Engine.createContext({
	     *          el : document.querySelector('#myElement')
	     *      });
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      context.add(surface);
	     *
	     *      Engine.start();
	     *
	     * @class Context
	     * @constructor
	     * @namespace Core
	     * @uses Core.RootNode
	     * @param [options] {Object}    Options
	     * @param [options.el] {Node}   DOM element which will serve as a container for added nodes
	     */
	    function Context(options) {
	        options = options || {};
	        var container = options.el || document.createElement(elementType);
	        container.classList.add(elementClass);

	        var allocator = new ElementAllocator(container);
	        this._node = new RootNode(allocator);
	        this._size = new ResizeStream();
	        this._layout = new EventHandler();

	        this.size = this._size.map(function(size){
	            return (options.el)
	                ? [container.clientWidth, container.clientHeight]
	                : size;
	        }.bind(this));

	        this._node._size.subscribe(this.size);
	        this._node._layout.subscribe(this._layout);

	        this._perspective = new Transitionable(0);

	        this._perspective.on('update', function(perspective){
	            setPerspective(container, perspective);
	        });

	        this._perspective.on('end', function(perspective){
	            setPerspective(container, perspective);
	        });

	        this.container = container;
	    }

	    /**
	     * Extends the render tree beginning with the Context's RootNode with a new node.
	     *  Delegates to RootNode's `add` method.
	     *
	     * @method add
	     *
	     * @param {Object}          Renderable
	     * @return {RenderTreeNode} Wrapped node
	     */
	    Context.prototype.add = function add() {
	        return RootNode.prototype.add.apply(this._node, arguments);
	    };

	    /**
	     * Get current perspective of this Context in pixels.
	     *
	     * @method getPerspective
	     * @return {Number} Perspective in pixels
	     */
	    Context.prototype.getPerspective = function getPerspective() {
	        return this._perspective.get();
	    };

	    /**
	     * Set current perspective of this context in pixels.
	     *
	     * @method setPerspective
	     * @param perspective {Number}  Perspective in pixels
	     * @param [transition] {Object} Transition definition
	     * @param [callback] {Function} Callback executed on completion of transition
	     */
	    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
	        this._perspective.set(perspective, transition, callback);
	    };

	    var usePrefix = !('perspective' in document.documentElement.style);

	    var setPerspective = usePrefix
	        ? function setPerspective(element, perspective) {
	        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
	    }
	        : function setPerspective(element, perspective) {
	        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
	    };

	    module.exports = Context;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var RenderTreeNode = __webpack_require__(26);

	    /**
	     * A RootNode is a first node in the Render Tree. It is like any other
	     *  RenderTreeNode but with the additional responsibility of defining
	     *  an allocating DOM node to render to.
	     *
	     * @class RootNode
	     * @constructor
	     * @private
	     * @extends Core.RenderTreeNode
	     * @param [allocator] {ElementAllocator} ElementAllocator
	     */
	    function RootNode(allocator) {
	        RenderTreeNode.call(this);
	        this.root = this;
	        this.allocator = allocator;
	    }

	    RootNode.prototype = Object.create(RenderTreeNode.prototype);
	    RootNode.prototype.constructor = RootNode;

	    module.exports = RootNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var Stream = __webpack_require__(8);
	    var ResizeStream = __webpack_require__(17);
	    var SizeNode = __webpack_require__(18);
	    var LayoutNode = __webpack_require__(20);
	    var layoutAlgebra = __webpack_require__(23);
	    var sizeAlgebra = __webpack_require__(22);

	    /**
	     * A node in the render tree. As such, it wraps a layout or size node,
	     *  providing them with an `add` method. By adding nodes, the render tree
	     *  is constructed, the leaves of which are `Surfaces`.
	     *
	     *  @constructor
	     *  @class RenderTreeNode
	     *  @private
	     *  @param object {SizeNode, LayoutNode, Surface, View}
	     */
	    function RenderTreeNode(object) {
	        // layout and size inputs
	        this._layout = new EventHandler();
	        this._size = new EventHandler();

	        // layout and size streams
	        this.size = null;
	        this.layout = null;

	        this.root = null;

	        if (object) _set.call(this, object);
	    }

	    /**
	     * Extends the render tree with a new node. Similar to how a tree data structure
	     *  is created, but instead of a node with an array of children, children subscribe
	     *  to notifications from the parent.
	     *
	     *  This method also takes `Views` (subtrees) and `Surfaces` (leaves).
	     *
	     * @method add
	     * @param node {SizeNode|LayoutNode|Surface|View} Node
	     * @return {RenderTreeNode}
	     */
	    RenderTreeNode.prototype.add = function add(node) {
	        var childNode;

	        if (node._isView){
	            if (this.root)
	                node._node.root = this.root;
	            else if (this.tempRoot)
	                node._node.tempRoot = this.tempRoot;
	            childNode = node;
	        }
	        else {
	            childNode = new RenderTreeNode(node);
	            if (this.tempRoot)
	                childNode.tempRoot = this.tempRoot;
	            else childNode.root = _getRootNode.call(this);
	        }

	        childNode._layout.subscribe(this.layout || this._layout);
	        childNode._size.subscribe(this.size || this._size);

	        return childNode;
	    };

	    function _getRootNode(){
	        if (this.root) return this.root;
	        if (this.tempRoot) return _getRootNode.call(this.tempRoot);
	        return this;
	    }

	    function _set(object) {
	        if (object instanceof SizeNode){
	            this.size = ResizeStream.lift(
	                function SGSizeAlgebra (objectSpec, parentSize){
	                    if (!parentSize) return false;
	                    return (objectSpec)
	                        ? sizeAlgebra(objectSpec, parentSize)
	                        : parentSize;
	                },
	                [object, this._size]
	            );
	            return;
	        }

	        if (object instanceof LayoutNode){
	            this.layout = Stream.lift(
	                function SGLayoutAlgebra (objectSpec, parentSpec, size){
	                    if (!parentSpec || !size) return false;
	                    return (objectSpec)
	                        ? layoutAlgebra(objectSpec, parentSpec, size)
	                        : parentSpec;
	                },
	                [object, this._layout, this._size]
	            );
	            return;
	        }

	        // object is a leaf node
	        object._size.subscribe(this._size);
	        object._layout.subscribe(this._layout);
	        object._getRoot = _getRootNode.bind(this);
	    }

	    module.exports = RenderTreeNode;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * Handles creating, allocating and removing DOM elements within a provided DOM element.
	     *  Manages a pool of nodes based on DOM tagName for DOM node reuse.
	     *  When a Surface is deallocated, its element is cleared and put back in the pool.
	     *  When a Surface is allocated, an existing cleared element of the same tagName is
	     *  looked for. If it is not found, a new DOM element is created.
	     *
	     * @class ElementAllocator
	     * @constructor
	     * @namespace Core
	     * @private
	     * @param container {Node} DOM element
	     */
	    function ElementAllocator(container) {
	        if (!container) container = document.createDocumentFragment();
	        this.container = container;
	        this.detachedNodes = {};
	    }

	    /**
	     * Move the DOM elements from their original container to a new one.
	     *
	     * @method migrate
	     * @param container {Node} DOM element
	     */
	    ElementAllocator.prototype.migrate = function migrate(container) {
	        var oldContainer = this.container;
	        if (container === oldContainer) return;

	        if (oldContainer instanceof DocumentFragment)
	            container.appendChild(oldContainer);
	        else {
	            while (oldContainer.hasChildNodes())
	                container.appendChild(oldContainer.firstChild);
	        }
	        this.container = container;
	    };

	    /**
	     * Allocate an element of specified type from the pool.
	     *
	     * @method allocate
	     * @param type {string} DOM tagName, e.g., "div"
	     * @return {Node}
	     */
	    ElementAllocator.prototype.allocate = function allocate(type) {
	        type = type.toLowerCase();
	        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
	        var nodeStore = this.detachedNodes[type];
	        var result;
	        if (nodeStore.length === 0){
	            result = document.createElement(type);
	            this.container.appendChild(result);
	        }
	        else result = nodeStore.pop();
	        return result;
	    };

	    /**
	     * De-allocate an element of specified type to the pool for recycling.
	     *
	     * @method deallocate
	     * @param element {Node} DOM element
	     */
	    ElementAllocator.prototype.deallocate = function deallocate(element) {
	        var nodeType = element.nodeName.toLowerCase();
	        var nodeStore = this.detachedNodes[nodeType];
	        nodeStore.push(element);
	    };

	    module.exports = ElementAllocator;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var dirtyQueue = __webpack_require__(15);
	    var preTickQueue = __webpack_require__(13);
	    var tickQueue = __webpack_require__(29);
	    var TweenTransition = __webpack_require__(30);
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);

	    var transitionMethods = {};

	    var STATE = {
	        NONE : -1,
	        START : 0,
	        UPDATE : 1,
	        END : 2
	    };

	    /**
	     * A way to transition numeric values and arrays of numbers between start and end states.
	     *  Transitions are given an easing curve and a duration.
	     *  Non-numeric values are ignored.
	     *
	     *  @example
	     *
	     *      var transitionable = new Transitionable(0);
	     *
	     *      transitionable.set(100, {duration : 1000, curve : 'easeIn'});
	     *
	     *      transitionable.on('start', function(value){
	     *          console.log(value); // 0
	     *      });
	     *
	     *      transitionable.on('update', function(value){
	     *          console.log(value); // numbers between 0 and 100
	     *      });
	     *
	     *      transitionable.on('end', function(value){
	     *          console.log(value); // 100
	     *      });
	     *
	     * @class Transitionable
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @param start {Number|Number[]}   Starting value
	     */
	    function Transitionable(start) {
	        this.transitionQueue = [];
	        this.endStateQueue = [];
	        this.callbackQueue = [];

	        this.state = start || 0;
	        this.velocity = undefined;
	        this._callback = undefined;
	        this._engineInstance = null;
	        this._currentMethod = null;
	        this._state = STATE.NONE;

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();
	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        var boundUpdate = _update.bind(this);

	        this._eventOutput.on('start', function(){
	            tickQueue.push(boundUpdate);
	        });

	        this._eventOutput.on('end', function(){
	            var index = tickQueue.indexOf(boundUpdate);
	            tickQueue.splice(index,1);
	        });

	        if (start !== undefined){
	            preTickQueue.push(function transitionableSet(){
	                // make sure didn't set in same tick as defined
	                if (this._state == STATE.NONE || this._state == STATE.END)
	                    this.set(start);
	            }.bind(this));
	        }
	    }

	    Transitionable.prototype = Object.create(SimpleStream.prototype);
	    Transitionable.prototype.constructor = Transitionable;

	    function _update(){
	        if (!this._engineInstance) return;
	        this.state = this._engineInstance.get();
	        this.emit('update', this.state);
	    }

	    function _loadNext() {
	        if (this.endStateQueue.length === 0) {
	            if (this._callback) {
	                var callback = this._callback;
	                this._callback = undefined;
	                callback();
	            }

	            dirtyQueue.push(function(){
	                if (this._engineInstance && !this._engineInstance.isActive()){
	                    this._state = STATE.END;
	                    this.emit('end', this.state);
	                }
	            }.bind(this));

	            return;
	        }

	        var endValue = this.endStateQueue.shift();
	        var transition = this.transitionQueue.shift();
	        this._callback = this.callbackQueue.shift();

	        var curve = transition.curve;
	        var method = (transition instanceof Object && curve && transitionMethods[curve])
	            ? transitionMethods[curve]
	            : TweenTransition;

	        if (this._currentMethod !== method) {
	            this._engineInstance = new method();
	            this._currentMethod = method;
	        }

	        this._engineInstance.reset(this.state, this.velocity);
	        this._state = STATE.UPDATE;

	        if (this.velocity !== undefined) {
	            this.velocity = this._engineInstance.getVelocity();
	            transition.velocity = this.velocity;
	        }

	        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
	    }

	    /**
	     * Constructor method. A way of registering other engines that can interpolate
	     *  between start and end values. For instance, a physics engine.
	     *
	     *  @method register
	     *  @param name {string}    Identifier for the engine
	     *  @param constructor      Constructor for the engine
	     */
	    Transitionable.register = function register(name, constructor) {
	        if (!(name in transitionMethods))
	            transitionMethods[name] = constructor;
	    };

	    /**
	     * Constructor method. Unregister an interpolating engine.
	     *  Undoes work of `register`.
	     *
	     *  @method unregister
	     *  @param name {string}    Identifier for the engine
	     */
	    Transitionable.unregister = function unregister(name) {
	        if (name in transitionMethods) {
	            delete transitionMethods[name];
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Define a new end value that will be transitioned towards with the prescribed
	     *  transition. An optional callback can fire when the transition completes.
	     *
	     * @method set
	     * @param endState {Number|Number[]}        End value
	     * @param [transition] {Object}             Transition definition
	     * @param [transition.curve] {string}       Easing curve name, e.g., "easeIn"
	     * @param [transition.duration] {string}    Duration of transition
	     * @param [callback] {Function}             Callback
	     */
	    Transitionable.prototype.set = function set(endState, transition, callback) {
	        if (!transition) {
	            this.reset(endState, undefined);

	            if (this._state !== STATE.START){
	                this._state = STATE.START;
	                this.emit('start', this.state);
	                dirtyQueue.push(function(){
	                    if (!this._engineInstance){
	                        this._state = STATE.END;
	                        this.emit('end', this.state);
	                    }
	                }.bind(this));
	            }

	            if (callback) callback();
	            return this;
	        }

	        if (this.isActive()) this.halt();
	        else {
	            if (this._state !== STATE.START){
	                this._state = STATE.START;
	                this.emit('start', this.state);
	            }
	        }

	        this.endStateQueue.push(endState);
	        this.transitionQueue.push(transition);
	        this.callbackQueue.push(callback);

	        _loadNext.call(this);

	        return this;
	    };

	    /**
	     * Return the current state of the transition.
	     *
	     * @method get
	     * @return {Number|Number[]}    Current state
	     */
	    Transitionable.prototype.get = function get() {
	        return this.state;
	    };

	    /**
	     * Cancel all transitions and reset to a provided state.
	     *
	     * @method reset
	     * @param startState {Number|Number[]}      Value state
	     * @param [startVelocity] {Number|Number[]} Velocity state (unused for now)
	     */
	    Transitionable.prototype.reset = function reset(startState, startVelocity) {
	        if (this._engineInstance)
	            this._engineInstance.reset(startState);

	        this._currentMethod = null;
	        this._engineInstance = null;
	        this.state = startState;
	        this.velocity = startVelocity;
	        this.endStateQueue = [];
	        this.transitionQueue = [];
	        this.callbackQueue = [];
	    };

	    /**
	     * Iterate through the provided values with the provided transitions. Firing an
	     *  optional callback when the series of transitions completes.
	     *  One transition may be provided as opposed to an array when you want all the
	     *  transitions to behave the same way.
	     *
	     * @method iterate
	     * @param values {Array}                    Array of values
	     * @param transitions {Object|Object[]}     Array of transitions
	     * @param [callback] {Function}             Callback
	     */
	    Transitionable.prototype.iterate = function iterate(values, transitions, callback){
	        if (values.length === 0) {
	            if (callback) callback();
	            return;
	        }

	        // sugar for same transition across value changes
	        var transition = (transitions instanceof Array)
	            ? transitions.shift()
	            : transitions;

	        this.set(values.shift(), transition, function(){
	            this.iterate(values, transitions, callback);
	        }.bind(this));
	    };

	    /**
	     * Loop indefinitely between values with provided transitions. Fire a callback
	     *  after each new value is reached.
	     *
	     * @method loop
	     * @param values {Array}                    Array of values
	     * @param transitions {Object|Object[]}     Array of transitions
	     * @param [callback] {Function}             Callback
	     */
	    Transitionable.prototype.loop = function(values, transitions, callback){
	        var val = values.slice(0);
	        this.iterate(values, transitions, function(){
	            if (callback) callback();
	            this.loop(val, transitions, callback);
	        }.bind(this));
	    };

	    /**
	     * Postpone a transition, and fire it by providing it in the callback parameter.
	     *
	     * @method delay
	     * @param callback {Function}   Callback
	     * @param duration {Number}     Duration of delay (in millisecons)
	     */
	    Transitionable.prototype.delay = function delay(callback, duration) {
	        this.set(this.get(), {
	            duration: duration,
	            curve: function(){return 0;}},
	            callback
	        );
	    };

	    /**
	     * Determine is the transition is ongoing, or has completed.
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    Transitionable.prototype.isActive = function isActive() {
	        return this._state == STATE.UPDATE;
	    };

	    /**
	     * Stop transition at the current value and erase all pending actions.
	     *
	     * @method halt
	     */
	    Transitionable.prototype.halt = function halt() {
	        var currentState = this.get();

	        if (this._engineInstance) this._engineInstance.reset(currentState);

	        this._currentMethod = null;
	        this._engineInstance = null;
	        this.state = currentState;
	        this.velocity = undefined;
	        this.endStateQueue = [];
	        this.transitionQueue = [];
	        this.callbackQueue = [];

	        dirtyQueue.push(function(){
	            if (!this._engineInstance){
	                this._state = STATE.END;
	                this.emit('end', this.state);
	            }
	        }.bind(this));
	    };

	    module.exports = Transitionable;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    /**
	     * This queue is executed before the postTickQueue and after the preTickQueue.
	     *  however, it differs in that the Engine does not clear the queue.
	     *  This must be done manually.
	     *
	     *  @private
	     */

	    module.exports = [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var OptionsManager = __webpack_require__(31);

	    var registeredCurves = {};
	    var eps = 1e-7; // for calculating velocity using finite difference

	    /**
	     * A method of interpolating between start and end values (numbers or
	     *  arrays of numbers) via an easing curve.
	     *
	     * @class TweenTransition
	     * @private
	     * @namespace Transitions
	     * @constructor
	     */
	    function TweenTransition(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._startTime = 0;
	        this._startValue = 0;
	        this._endValue = 0;
	        this._curve = undefined;
	        this._duration = 0;
	        this._active = false;
	        this._callback = undefined;
	        this.state = 0;
	        this.velocity = undefined;
	    }

	    /**
	     * Default easing curves.
	     *
	     * @property CURVES {object}
	     * @property CURVES.linear {Function}           Linear interpolation
	     * @property CURVES.easeIn {Function}           EaseIn interpolation
	     * @property CURVES.easeOut {Function}          EaseOut interpolation
	     * @property CURVES.easeInOut {Function}        EaseInOut interpolation
	     * @property CURVES.easeInOutBounce {Function}  EaseInOutBounce interpolation
	     * @property CURVES.spring {Function}           Spring-like interpolation
	     * @static
	     */
	    TweenTransition.CURVES = {
	        linear: function(t) {
	            return t;
	        },
	        easeIn: function(t) {
	            return t*t;
	        },
	        easeOut: function(t) {
	            return t*(2-t);
	        },
	        easeInOut: function(t) {
	            if (t <= 0.5) return 2*t*t;
	            else return -2*t*t + 4*t - 1;
	        },
	        easeOutBounce: function(t) {
	            return t*(3 - 2*t);
	        },
	        spring: function(t) {
	            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
	        }
	    };

	    TweenTransition.DEFAULT_OPTIONS = {
	        curve: TweenTransition.CURVES.linear,
	        duration: 500,
	        speed: 0
	    };

	    /**
	     * A way of registering custom easing curves by name.
	     *  Curves are functions that take a number between 0 and 1 and return
	     *  a number (often between 0 and 1, but can over/under shoot).
	     *
	     * @method register
	     * @static
	     * @param name {String}         Identifying name
	     * @param curve {Function}      Function defined on the domain [0,1]
	     * @return {Boolean}            False if key is taken, else true
	     */
	    TweenTransition.register = function register(name, curve) {
	        if (!registeredCurves[name]) {
	            registeredCurves[name] = curve;
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Remove curve from internal registry. Undoes work of `register`.
	     *
	     * @method deregister
	     * @static
	     * @param name {String}     Name dictionary key
	     * @return {Boolean}        False if key doesn't exist
	     */
	    TweenTransition.deregister = function deregister(name) {
	        if (registeredCurves[name]) {
	            delete registeredCurves[name];
	            return true;
	        }
	        else return false;
	    };

	    /**
	     * Retrieve all registered curves.
	     *
	     * @method getCurves
	     * @static
	     * @return {Object}
	     */
	    TweenTransition.getCurves = function getCurves() {
	        return registeredCurves;
	    };

	    function getCurve(curveName) {
	        var curve = registeredCurves[curveName];
	        if (curve !== undefined) return curve;
	        else throw new Error('curve not registered');
	    }

	    function _interpolate(a, b, t) {
	        return ((1 - t) * a) + (t * b);
	    }

	    function _speed2Duration(start, end, speed){
	        var duration;
	        var startValue = this._startValue;
	        if (startValue instanceof Array) {
	            var variance = 0;
	            for (var i in startValue)
	                variance += (end[i] - start[i]) * (end[i] - start[i]);
	            duration = Math.sqrt(variance) / speed;
	        }
	        else duration = Math.abs(end - start) / speed;

	        return duration;
	    }

	    function _clone(obj) {
	        if (obj instanceof Object) {
	            if (obj instanceof Array) return obj.slice(0);
	            else return Object.create(obj);
	        }
	        else return obj;
	    }

	    function _normalize(transition, endValue, defaultTransition) {
	        var result = {curve: defaultTransition.curve};
	        if (defaultTransition.duration) result.duration = defaultTransition.duration;
	        if (defaultTransition.speed) result.speed = defaultTransition.speed;
	        if (transition instanceof Object) {
	            if (transition.duration !== undefined) result.duration = transition.duration;
	            if (transition.curve) result.curve = transition.curve;
	            if (transition.speed) result.speed = transition.speed;
	        }
	        if (typeof result.curve === 'string') result.curve = getCurve(result.curve);
	        if (transition.speed) result.duration = _speed2Duration(endValue, this._startValue, transition.speed);

	        return result;
	    }

	    /**
	     * Set new value to transition to.
	     *
	     * @method set
	     * @param endValue {Number|Number[]}    End value
	     * @param [transition] {Object}         Transition object of type
	     *                                      {duration: number, curve: name}
	     * @param [callback] {Function}         Callback to execute on completion of transition
	     */
	    TweenTransition.prototype.set = function set(endValue, transition, callback) {
	        if (!transition) {
	            this.reset(endValue);
	            if (callback) callback();
	            return;
	        }

	        var curve = transition.curve;
	        if (!registeredCurves[curve] && TweenTransition.CURVES[curve])
	            TweenTransition.register(curve, TweenTransition.CURVES[curve]);

	        this._startValue = _clone(this.get());
	        transition = _normalize(transition, endValue, this.options);

	        this._startTime = Date.now();
	        this._endValue = _clone(endValue);
	        this._startVelocity = _clone(transition.velocity);
	        this._duration = transition.duration;
	        this._curve = transition.curve;
	        this._active = true;
	        this._callback = callback;
	    };

	    /**
	     * Cancel all transitions and reset to a stable state
	     *
	     * @method reset
	     * @param value {number|Number[]}       Value
	     * @param [velocity] {number|Number[]}  Velocity
	     */
	    TweenTransition.prototype.reset = function reset(value, velocity) {
	        this.state = _clone(value);
	        this.velocity = _clone(velocity);
	        this._startTime = 0;
	        this._duration = 0;
	        this._startValue = this.state;
	        this._startVelocity = this.velocity;
	        this._endValue = this.state;
	        this._active = false;
	    };

	    /**
	     * Get current velocity
	     *
	     * @method getVelocity
	     * @returns {Number}
	     */
	    TweenTransition.prototype.getVelocity = function getVelocity() {
	        return this.velocity;
	    };

	    /**
	     * Get current value.
	     *
	     * @method get
	     * @return {Number|Number[]}
	     */
	    TweenTransition.prototype.get = function get() {
	        if (this.isActive()) update.call(this);
	        return this.state;
	    };

	    function _calculateVelocity(current, start, curve, duration, t) {
	        var velocity;
	        var speed = (curve(t) - curve(t - eps)) / eps;
	        if (current instanceof Array) {
	            velocity = [];
	            for (var i = 0; i < current.length; i++){
	                velocity[i] = (typeof current[i] === 'number')
	                    ? speed * (current[i] - start[i]) / duration
	                    : 0;
	            }
	        }
	        else velocity = speed * (current - start) / duration;
	        return velocity;
	    }

	    function _calculateState(start, end, t) {
	        var state;
	        if (start instanceof Array) {
	            state = [];
	            for (var i = 0; i < start.length; i++) {
	                if (typeof start[i] === 'number')
	                    state[i] = _interpolate(start[i], end[i], t);
	                else
	                    state[i] = start[i];
	            }
	        }
	        else state = _interpolate(start, end, t);
	        return state;
	    }

	    function update() {
	        var timestamp = Date.now();

	        var timeSinceStart = timestamp - this._startTime;

	        if (timeSinceStart >= this._duration) {
	            this.state = this._endValue;
	            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
	            this._active = false;
	            if (this._callback) {
	                var callback = this._callback;
	                this._callback = undefined;
	                callback();
	            }
	            return;
	        }
	        else if (timeSinceStart < 0) {
	            this.state = this._startValue;
	            this.velocity = this._startVelocity;
	        }
	        else {
	            var t = timeSinceStart / this._duration;
	            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
	            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
	        }
	    }

	    /**
	     * Returns true if the animation is ongoing, false otherwise.
	     *
	     * @method isActive
	     * @return {Boolean}
	     */
	    TweenTransition.prototype.isActive = function isActive() {
	        return this._active;
	    };

	    /**
	     * Halt transition at current state and erase all pending actions.
	     *
	     * @method halt
	     */
	    TweenTransition.prototype.halt = function halt() {
	        this.reset(this.get());
	    };

	    module.exports = TweenTransition;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);

	    /**
	     *  A utility for setting options in a class that enables patching options
	     *   with prescribed defaults and emitting `change` events when options are changed.
	     *   Recursively defined for nested options objects.
	     *
	     *   Note: only JSONable objects are allowed, so no functions.
	     *
	     * @class OptionsManager
	     * @namespace Core
	     * @constructor
	     * @private
	     * @uses Core.EventHandler
	     * @param value {Object} Options object literal
	     */
	    function OptionsManager(value) {
	        this._value = value;
	        this._eventHandler = null;
	    }

	    /**
	     * Constructor method. Create OptionsManager from source dictionary with arguments overriden by patch dictionary.
	     *
	     * @method OptionsManager.patch
	     * @param options {Object}          Options to be patched
	     * @param patch {...Object}         Options to overwrite
	     * @return source {Object}
	     */
	    OptionsManager.patch = function patch(options, patch) {
	        var manager = new OptionsManager(options);
	        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
	        return options;
	    };

	    /**
	     * Constructor method. Convenience method to set options with defaults on an object instance.
	     *
	     * @method OptionsManager.patch
	     * @param options {Object}          Options to be patched
	     * @param overrides {...Object}     Options to overwrite
	     * @return source {Object}
	     */
	    OptionsManager.setOptions = function(instance, options, defaults){
	        defaults = defaults || _clone(instance.constructor.DEFAULT_OPTIONS) || {};
	        var optionsManager = new OptionsManager(defaults);
	        instance.setOptions = OptionsManager.prototype.setOptions.bind(optionsManager);
	        instance.getOptions = OptionsManager.prototype.getOptions.bind(optionsManager);
	        if (options) instance.setOptions(options);
	        return optionsManager.get();
	    };

	    function _createEventHandler() {
	        if (!this._eventHandler) this._eventHandler = new EventHandler();
	    }

	    /**
	     * Patch options with provided patches. Triggers `change` event on the object.
	     *
	     * @method patch
	     * @param options {Object}          Patch options
	     * @return this {OptionsManager}
	     */
	    OptionsManager.prototype.patch = function patch(options, clone) {
	        var myState = this._value;
	        for (var k in options) {
	            if ((k in myState) && (options[k] && options[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
	                if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
	                this.key(k).patch(options[k]);
	                if (this._eventHandler) this._eventHandler.emit('change', {key: k, value: this.key(k).value()});
	            }
	            else this.set(k, options[k]);
	        }
	        return this;
	    };

	    /**
	     * Alias for patch
	     *
	     * @method setOptions
	     */
	    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

	    /**
	     * Return OptionsManager based on sub-object retrieved by `key`.
	     *
	     * @method key
	     * @param key {string}      Key
	     * @return {OptionsManager} Value
	     */
	    OptionsManager.prototype.key = function key(key) {
	        var result = new OptionsManager(this._value[key]);
	        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
	        return result;
	    };

	    /**
	     * Look up options value by key or get the full options hash.
	     *
	     * @method get
	     * @param key {string}  Key
	     * @return {Object}     Associated object or full options hash
	     */
	    OptionsManager.prototype.get = function get(key) {
	        return key ? this._value[key] : this._value;
	    };

	    /**
	     * Alias for get
	     *
	     * @method getOptions
	     */
	    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

	    /**
	     * Set key to value. Outputs `change` event if a value is overwritten.
	     *
	     * @method set
	     * @param key {string}          Key
	     * @param value {Object}        Value
	     * @return {OptionsManager}     Updated OptionsManager
	     */
	    OptionsManager.prototype.set = function set(key, value) {
	        var originalValue = this.get(key);
	        this._value[key] = value;
	        if (this._eventHandler && value !== originalValue) this._eventHandler.emit('change', {key: key, value: value});
	        return this;
	    };

	    /**
	     * Adds a handler to the `type` channel which will be executed on `emit`.
	     *
	     * @method "on"
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    OptionsManager.prototype.on = function on(type, handler) {
	        _createEventHandler.call(this);
	        EventHandler.prototype.on.apply(this._eventHandler, arguments);
	    };

	    /**
	     * Removes the `handler` from the `type` channel.
	     *   This undoes the work of `on`.
	     *
	     * @method off
	     * @param type {String}         Channel name
	     * @param handler {Function}    Callback
	     */
	    OptionsManager.prototype.off = function off(type, handler) {
	        _createEventHandler.call(this);
	        EventHandler.prototype.off.apply(this._eventHandler, arguments);
	    };

	    function _clone(obj) {
	        var copy;
	        if (typeof obj === 'object') {
	            copy = (obj instanceof Array) ? [] : {};
	            for (var key in obj) {
	                var value = obj[key];
	                if (typeof value === 'object' && value !== null) {
	                    if (value instanceof Array) {
	                        copy[key] = [];
	                        for (var i = 0; i < value.length; i++)
	                            copy[key][i] = _clone(value[i]);
	                    }
	                    else copy[key] = _clone(value);
	                }
	                else copy[key] = value;
	            }
	        }
	        else copy = obj;

	        return copy;
	    }

	    module.exports = OptionsManager;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Context = __webpack_require__(24);
	    var Transform = __webpack_require__(7);
	    var State = __webpack_require__(16);
	    var RootNode = __webpack_require__(25);
	    var postTickQueue = __webpack_require__(14);
	    var preTickQueue = __webpack_require__(13);
	    var dirtyQueue = __webpack_require__(15);
	    var tickQueue = __webpack_require__(29);
	    var EventHandler = __webpack_require__(5);
	    var ResizeStream = __webpack_require__(17);
	    var Stream = __webpack_require__(8);


	    var contexts = [];
	    var roots = [];
	    var rafId = 0;
	    var eventForwarders = {};
	    var listenOnTick = false;
	    var size = new ResizeStream;
	    var layout = new EventHandler();
	    var eventHandler = new EventHandler();

	    var layoutSpec = {
	        transform : Transform.identity,
	        opacity : 1,
	        origin : null,
	        align : null,
	        nextSizeTransform : Transform.identity
	    };

	    /**
	     * Engine is a singleton object that is required to run a Samsara application.
	     *  It is the "heartbeat" of the application, managing the batching of streams
	     *  and creating `RootNodes` and `Contexts` to begin render trees.
	     *
	     *  It also listens and can respond to DOM events on the HTML `<body>` tag
	     *  and `window` object. For instance the `resize` event.
	     *
	     *  @example
	     *
	     *      var context = Engine.createContext();
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      context.add(surface);
	     *
	     *      Engine.start();
	     *
	     *      Engine.on('click', function(){
	     *          alert('clicked!');
	     *      });
	     *
	     * @class Engine
	     * @namespace Core
	     * @static
	     * @uses Core.EventHandler
	     */
	    var Engine = {};

	    EventHandler.setInputHandler(Engine, eventHandler);
	    EventHandler.setOutputHandler(Engine, eventHandler);

	    //TODO: add this only for full-screen apps
	    //document.body.classList.add('samsara-root');

	    /**
	     * Updates by a single frame of the application by looping through all function queues.
	     *  This is repeatedly called within a requestAnimationFrame loop until the application
	     *  is receiving no layout changes. At this point the requestAnimationFrame will be
	     *  canceled until the next change.
	     *
	     * @private
	     * @method step
	     */
	    Engine.step = function step() {
	        // browser events and their handlers happen before rendering begins
	        while (preTickQueue.length) (preTickQueue.shift())();

	        // tick signals base event flow coming in
	        State.set(State.STATES.UPDATE);

	        if (listenOnTick) eventHandler.emit('tick');
	        
	        for (var i = 0; i < tickQueue.length; i++) tickQueue[i]();

	        // post tick is for resolving larger components from their incoming signals
	        while (postTickQueue.length) (postTickQueue.shift())();

	        State.set(State.STATES.END);

	        while (dirtyQueue.length) (dirtyQueue.shift())();

	        State.set(State.STATES.START);
	    };

	    /**
	     * A ResizeStream representing the document's <body> size.
	     *
	     * @property size
	     */
	    Engine.size = size;

	    /**
	     * Creates a new Root Node from which a render tree can be constructed.
	     *  Use this to modify preexisting elements in 2D space.
	     *
	     * @method createRoot
	     * @static
	     * @return {RootNode}
	     */
	    Engine.createRoot = function createRoot(){
	        var root = new RootNode();
	        Engine.registerRoot(root);
	        return root;
	    };

	    /**
	     * Hook up listeners to a RootNode and add to an internal array for commiting.
	     *
	     * @method registerRoot
	     * @static
	     * @private
	     */
	    Engine.registerRoot = function registerRoot(root){
	        root._size.subscribe(size);
	        root._layout.subscribe(layout);
	        roots.push(root);
	    };

	    /**
	     * Remove listeners to RootNode and remove from internal commit array.
	     *
	     * @method deregisterRoot
	     * @static
	     * @private
	     */
	    Engine.deregisterRoot = function deregisterRoot(root){
	        var i = roots.indexOf(root);
	        if (i < 0) return;
	        root._size.unsubscribe(size);
	        root._layout.unsubscribe(layout);
	        roots.splice(i, 1);
	    };

	    /**
	     * Creates a new Context from which a render tree can be constructed.
	     *  If no DOM element is specified, one will be created and appended
	     *  to the document body.
	     *
	     * @method createContext
	     * @static
	     * @param [options] {Object}    Options
	     * @param [options.el] {Node}   Pre-existing element in the document
	     * @return {Context}
	     */
	    Engine.createContext = function createContext(options) {
	        var context = new Context(options);
	        Engine.registerContext(context);
	        if (!options || !options.el)
	            document.body.appendChild(context.container);
	        return context;
	    };

	    /**
	     * Registers an existing Context to be updated by the run loop.
	     *
	     * @method registerContext
	     * @static
	     * @private
	     * @param context {Context}     Context to register
	     */
	    Engine.registerContext = function registerContext(context) {
	        context._size.subscribe(size);
	        context._layout.subscribe(layout);
	        contexts.push(context);
	    };

	    /**
	     * Removes a Context from the run loop.
	     *  Note: this does not do any cleanup.
	     *
	     * @method deregisterContext
	     * @static
	     * @private
	     * @param context {Context}     Context to deregister
	     */
	    Engine.deregisterContext = function deregisterContext(context) {
	        var i = contexts.indexOf(context);
	        if (i < 0) return;
	        context._size.unsubscribe(size);
	        context._layout.unsubscribe(layout);
	        contexts.splice(i, 1);
	    };

	    /**
	     * Adds a handler to an event on the DOM <body>, e.g., "click".
	     *
	     * @method on
	     * @static
	     * @param type {String}         DOM event name
	     * @param handler {Function}    Handler
	     */
	    Engine.on = function on(type, handler){
	        if (type === 'tick') listenOnTick = true;
	        if (!(type in eventForwarders)) {
	            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
	            document.addEventListener(type, eventForwarders[type]);
	        }
	        eventHandler.on(type, handler);
	    };

	    /**
	     * Removes a previously added handler.
	     *
	     * @method off
	     * @static
	     * @param type {String}         DOM event name
	     * @param handler {Function}    Handler
	     */
	    Engine.off = function off(type, handler){
	        if (type === 'tick') listenOnTick = false;
	        if (!(type in eventForwarders)) {
	            document.removeEventListener(type, eventForwarders[type]);
	        }
	        eventHandler.off(type, handler);
	    };

	    /**
	     * Initiates the Engine's heartbeat.
	     *
	     * @method start
	     * @static
	     */
	    Engine.start = start;

	    function loop() {
	        Engine.step();
	        rafId = window.requestAnimationFrame(loop);
	    }

	    function start(){
	        handleResize();
	        preTickQueue.push(function start(){
	            layout.emit('start', layoutSpec);
	            dirtyQueue.push(function(){
	                layout.emit('end', layoutSpec);
	            });
	        });

	        loop();
	    }

	    function handleResize() {
	        var windowSize = [window.innerWidth, window.innerHeight];
	        size.emit('resize', windowSize);
	        eventHandler.emit('resize', windowSize);

	        dirtyQueue.push(function engineResizeClean(){
	            size.emit('resize', windowSize);
	        });
	    }

	    window.addEventListener('resize', handleResize, false);

	    module.exports = Engine;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var tickQueue = __webpack_require__(29);

	    /**
	     * A collection of timing utilities meant to translate the familiar setInterval, setTimeout
	     *  timers to use Samsara's internal clock, which is backed by a requestAnimationFrame (RAF) loop.
	     *  It also includes other helpful methods for debouncing.
	     *
	     * @example
	     *
	     *      Timer.setTimeout(function(){
	     *          alert('I will execute after 1 second');
	     *      }, 1000);
	     *
	     *      Timer.after(function(){
	     *          alert('I will execute on the following RAF loop');
	     *      }, 1);
	     *
	     *      var debouncedResize = Timer.debounce(function(){
	     *          // this code will execute when the `resize` event
	     *          // has stopped firing (for the last 200 milliseconds)
	     *      }, 200);
	     *
	     *      Engine.on('resize', function(){
	     *          debounceResize();
	     *      });
	     *
	     * @class Timer
	     * @static
	     */
	    var Timer = {};

	    var getTime = (window.performance)
	        ? function() { return window.performance.now(); }
	        : Date.now;

	    function _addTimerFunction(fn) {
	        tickQueue.push(fn);
	        return fn;
	    }

	    function _clearTimerFunction(fn){
	        var index = tickQueue.indexOf(fn);
	        if (index === -1) return;
	        tickQueue.splice(index, 1);
	    }

	    /**
	     * Wraps a function to be invoked after a certain amount of time.
	     *  After a set duration has passed, it executes the function.
	     *
	     * @method setTimeout
	     * @static
	     * @param handler {Function}    Function to be run after a specified duration
	     * @param duration {Number}     Time to delay execution (in milliseconds)
	     * @return {Function}
	     */
	    Timer.setTimeout = function setTimeout(handler, duration) {
	        var t = getTime();
	        var callback = function() {
	            var t2 = getTime();
	            if (t2 - t >= duration) {
	                handler.apply(this, arguments);
	                Timer.clear(callback);
	            }
	        };
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked at repeated intervals.
	     *
	     * @method setInterval
	     * @static
	     * @param handler {Function}    Function to be run at specified intervals
	     * @param interval {Number}     Time interval (in milliseconds)
	     * @return {Function}
	     */
	    Timer.setInterval = function setInterval(handler, duration) {
	        var t = getTime();
	        var callback = function() {
	            var t2 = getTime();
	            if (t2 - t >= duration) {
	                handler.apply(this, arguments);
	                t = getTime();
	            }
	        };
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked after a specified number of Engine ticks.
	     *
	     * @method after
	     * @static
	     * @param handler {Function}    Function to be executed
	     * @param numTicks {Number}     Number of frames to delay execution
	     * @return {Function}
	     */
	    Timer.after = function after(handler, numTicks) {
	        if (numTicks === undefined) return undefined;
	        var callback = function() {
	            numTicks--;
	            if (numTicks <= 0) { //in case numTicks is fraction or negative
	                handler.apply(this, arguments);
	                Timer.clear(callback);
	            }
	        };
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Wraps a function to be invoked every specified number of Engine ticks.
	     *
	     * @method every
	     * @static
	     * @param handler {Function}    Function to be executed
	     * @param numTicks {Number}     Number of frames per execution
	     * @return {Function}
	     */
	    Timer.every = function every(handler, numTicks) {
	        numTicks = numTicks || 1;
	        var initial = numTicks;
	        var callback = function() {
	            numTicks--;
	            if (numTicks <= 0) {
	                handler.apply(this, arguments);
	                numTicks = initial;
	            }
	        };
	        return _addTimerFunction(callback);
	    };

	    /**
	     * Cancel a timer.
	     *
	     * @method clear
	     * @static
	     * @param handler {Function} Handler
	     */
	    Timer.clear = function clear(handler) {
	        _clearTimerFunction(handler);
	    };

	    /**
	     * Debounces a function for specified duration.
	     *
	     * @method debounce
	     * @static
	     * @param handler {Function}  Handler
	     * @param duration {Number}   Duration
	     * @return {Function}
	     */
	    Timer.debounce = function debounce(handler, duration) {
	        var timeout;
	        return function() {
	            var args = arguments;

	            var fn = function() {
	                Timer.clear(timeout);
	                timeout = null;
	                handler.apply(this, args);
	            }.bind(this);

	            if (timeout) Timer.clear(timeout);
	            timeout = Timer.setTimeout(fn, duration);
	        };
	    };

	    /**
	     * Debounces a function for a specified number of Engine frames.
	     *
	     * @method frameDebounce
	     * @static
	     * @param handler {Function}  Handler
	     * @param numFrames {Number}  Number of frames
	     * @return {Function}
	     */
	    Timer.frameDebounce = function frameDebounce(handler, numFrames){
	        var timeout;
	        return function() {
	            var args = arguments;

	            var fn = function() {
	                timeout = null;
	                handler.apply(this, args);
	            }.bind(this);

	            if (timeout) Timer.clear(timeout);
	            timeout = Timer.after(fn, numFrames);
	        };
	    };

	    module.exports = Timer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var RenderTreeNode = __webpack_require__(26);
	    var Controller = __webpack_require__(35);
	    var SizeNode = __webpack_require__(18);
	    var LayoutNode = __webpack_require__(20);
	    var Transitionable = __webpack_require__(28);
	    var EventHandler = __webpack_require__(5);
	    var Stream = __webpack_require__(8);
	    var ResizeStream = __webpack_require__(17);
	    var SizeObservable = __webpack_require__(19);
	    var layoutAlgebra = __webpack_require__(23);
	    var sizeAlgebra = __webpack_require__(22);

	    /**
	     * A View provides encapsulation for a subtree of the render tree. You can build
	     *  complicated visual components and add them to a render tree as you would a `Surface`.
	     *
	     *  Custom `Views` are created by calling `extend` on the `View` constructor.
	     *
	     *  In addition to what a `Controller` provides, a View provides:
	     *
	     *      Render Tree method: `.add`
	     *      Size methods: `setSize`, `setProportions`
	     *      Layout methods: `setOpacity`, `setOrigin`
	     *
	     *  @example
	     *
	     *      var MyView = View.extend({
	     *          defaults : {
	     *              defaultOption1 : '',
	     *              defaultOption2 : 42
	     *          },
	     *          initialize : function(options){
	     *              // this method called on instantiation
	     *              // options are passed in after being patched by the specified defaults
	     *
	     *              var surface = new Surface({
	     *                  content : options.defaultOption1,
	     *                  size : [options.defaultOption2,100],
	     *                  properties : {background : 'red'}
	     *              });
	     *
	     *              this.add(surface);
	     *          }
	     *      });
	     *
	     *      var myView = new myView({defaultOption1 : 'hello'});
	     *
	     *      var context = Engine.createContext();
	     *      context.add(myView);
	     *
	     *      Engine.start()
	     *
	     * @class View
	     * @constructor
	     * @extends Core.Controller
	     * @uses Core.SizeNode
	     * @uses Core.LayoutNode
	     * @uses Core.SimpleStream
	     */
	    var View = Controller.extend({
	        _isView : true,
	        defaults : {
	            size : null,
	            origin : null,
	            opacity : 1
	        },
	        events : {
	            change : setOptions
	        },
	        constructor : function View(options){
	            this._size = new EventHandler();
	            this._layout = new EventHandler();

	            this._sizeNode = new SizeNode();
	            this._layoutNode = new LayoutNode();

	            this._node = new RenderTreeNode();
	            this._node.tempRoot = this._node;

	            this.size = ResizeStream.lift(
	                function ViewSizeAlgebra (sizeSpec, parentSize){
	                    if (!parentSize) return false;
	                    return (sizeSpec)
	                        ? sizeAlgebra(sizeSpec, parentSize)
	                        : parentSize;
	                },
	                [this._sizeNode, this._size]
	            );

	            var layout = Stream.lift(
	                function ViewLayoutAlgebra (parentSpec, objectSpec, size){
	                    if (!parentSpec || !size) return false;
	                    return (objectSpec)
	                        ? layoutAlgebra(objectSpec, parentSpec, size)
	                        : parentSpec;
	                }.bind(this),
	                [this._layout, this._layoutNode, this.size]
	            );

	            this._node._size.subscribe(this.size);
	            this._node._layout.subscribe(layout);

	            Controller.apply(this, arguments);
	            if (this.options) setOptions.call(this, this.options);
	        },
	        /**
	         * Extends the render tree subtree with a new node.
	         *
	         * @method add
	         * @param object {SizeNode|LayoutNode|Surface} Node
	         * @return {RenderTreeNode}
	         */
	        add : function add(){
	            return RenderTreeNode.prototype.add.apply(this._node, arguments);
	        },
	        /**
	         * Setter for size.
	         *
	         * @method setSize
	         * @param size {Number[]|Stream} Size as [width, height] in pixels, or a stream.
	         */
	        setSize : function setSize(size){
	            this._sizeNode.set({size : size});
	        },
	        /**
	         * Setter for proportions.
	         *
	         * @method setProportions
	         * @param proportions {Number[]|Stream} Proportions as [x,y], or a stream.
	         */
	        setProportions : function setProportions(proportions){
	            this._sizeNode.set({proportions : proportions});
	        },
	        /**
	         * Setter for origin.
	         *
	         * @method setOrigin
	         * @param origin {Number[]|Stream} Origin as [x,y], or a stream.
	         */
	        setOrigin : function setOrigin(origin){
	            this._layoutNode.set({origin : origin});
	        },
	        /**
	         * Setter for opacity.
	         *
	         * @method setOpacity
	         * @param opacity {Number|Stream} Opacity
	         */
	        setOpacity : function setOpacity(opacity){
	            this._layoutNode.set({opacity : opacity});
	        }
	    });

	    function setOptions(options){
	        for (var key in options){
	            var value = options[key];
	            switch (key){
	                case 'size':
	                    this.setSize(value);
	                    break;
	                case 'proportions':
	                    this.setProportions(value);
	                    break;
	                case 'origin':
	                    this.setOrigin(value);
	                    break;
	                case 'opacity':
	                    this.setOpacity(value);
	                    break;
	            }
	        }
	    }

	    module.exports = View;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * copyright © 2015 David Valdman
	 */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var OptionsManager = __webpack_require__(31);
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);

	    /**
	     * A utility class which can be extended by custom classes. These classes will then
	     *  include event input and output streams, a optionsManager for handling optional
	     *  parameters with defaults, and take an event dictionary.
	     *
	     *  Specifically, instantiations will have an `options` dictionary property,
	     *  `input`, `output` stream properties, and
	     *  `on`, `off`, `emit`, `trigger`, `subscribe`, `unsubscribe` methods.
	     *
	     *  @example
	     *
	     *      var MyClass = Controller.extend({
	     *          defaults : {
	     *              defaultOption1 : value1,
	     *              defaultOption2 : value2
	     *          },
	     *          events : {
	     *              'change' : myUpdateOptionsFunction
	     *          },
	     *          initialize : function(options){
	     *              // this method called on instantiation
	     *              // options are passed in after being patched by the specified defaults
	     *
	     *              this.input.on('test', function(){
	     *                  console.log('test fired');
	     *              });
	     *          }
	     *      });
	     *
	     *      var myInstance = new MyClass({
	     *          defaultOption1 : value3
	     *      });
	     *
	     *      // myInstance.options = {
	     *      //     defaultOption1 : value3,
	     *      //     defaultOption2 : value2
	     *      // }
	     *
	     *      myInstance.subscribe(anotherStream);
	     *
	     *      anotherStream.emit('test'); // "test fired" in console
	     *
	     * @class Controller
	     * @constructor
	     * @namespace Core
	     * @uses Core.OptionsManager
	     * @param options {Object} Instance options
	     */
	    function Controller(options) {
	        this.options = _clone(this.constructor.DEFAULT_OPTIONS || Controller.DEFAULT_OPTIONS);
	        this._optionsManager = new OptionsManager(this.options);
	        if (options) this.setOptions(options);

	        this.input = new SimpleStream();
	        this.output = new SimpleStream();
	        EventHandler.setInputHandler(this, this.input);
	        EventHandler.setOutputHandler(this, this.output);
	        EventHandler.setInputEvents(this, this.constructor.EVENTS || Controller.EVENTS, this.input);

	        this.input.bindThis(this);
	        this.input.subscribe(this._optionsManager);

	        if (this.initialize) this.initialize(this.options);
	    }

	    /**
	     * Overwrite the DEFAULT_OPTIONS dictionary on the constructor of the class you wish to extend
	     *  with the Controller to patch any options that are not prescribed on instantiation.
	     *
	     * @attribute DEFAULT_OPTIONS
	     * @readOnly
	     */
	    Controller.DEFAULT_OPTIONS = {};

	    /**
	     * Overwrite the EVENTS dictionary on the constructor of the class you wish to extend
	     *  with the Controller to include events in {key : value} pairs where the keys are
	     *  event channel names and the values are functions to be executed.
	     *
	     * @attribute EVENTS
	     * @readOnly
	     */
	    Controller.EVENTS = {};

	    /**
	     * Options getter.
	     *
	     * @method getOptions
	     * @param key {string}      Key
	     * @return object {Object}  Options value for the key
	     */
	    Controller.prototype.getOptions = function getOptions(key) {
	        return OptionsManager.prototype.getOptions.apply(this._optionsManager, arguments);
	    };

	    /**
	     *  Options setter.
	     *
	     *  @method setOptions
	     *  @param options {Object} Options
	     */
	    Controller.prototype.setOptions = function setOptions() {
	        OptionsManager.prototype.setOptions.apply(this._optionsManager, arguments);
	    };

	    var RESERVED_KEYS = {
	        DEFAULTS : 'defaults',
	        EVENTS : 'events'
	    };

	    function _clone(obj) {
	        var copy;
	        if (typeof obj === 'object') {
	            copy = (obj instanceof Array) ? [] : {};
	            for (var key in obj) {
	                var value = obj[key];
	                if (typeof value === 'object' && value !== null) {
	                    if (value instanceof Array) {
	                        copy[key] = [];
	                        for (var i = 0; i < value.length; i++)
	                            copy[key][i] = _clone(value[i]);
	                    }
	                    else copy[key] = _clone(value);
	                }
	                else copy[key] = value;
	            }
	        }
	        else copy = obj;

	        return copy;
	    }

	    function extend(protoObj, constants){
	        var parent = this;

	        var child = (protoObj.hasOwnProperty('constructor'))
	            ? function(){ protoObj.constructor.apply(this, arguments); }
	            : function(){ parent.apply(this, arguments); };

	        child.extend = extend;
	        child.prototype = Object.create(parent.prototype);
	        child.prototype.constructor = child;

	        for (var key in protoObj){
	            var value = protoObj[key];
	            switch (key) {
	                case RESERVED_KEYS.DEFAULTS:
	                    child.DEFAULT_OPTIONS = value;
	                    break;
	                case RESERVED_KEYS.EVENTS:
	                    if (!child.EVENTS) child.EVENTS = value;
	                    else
	                        for (var key in value)
	                            child.EVENTS[key] = value[key];
	                    break;
	                default:
	                    child.prototype[key] = value;
	            }
	        }


	        for (var key in constants)
	            child[key] = constants[key];

	        return child;
	    }

	    /**
	     * Allows a class to extend Controller.
	     *  Note: this is a method defined on the Controller constructor
	     *
	     * @method extend
	     * @param protoObj {Object}     Prototype properties of the extended class
	     * @param constants {Object}    Constants to be added to the extended class's constructor
	     */
	    Controller.extend = extend;

	    module.exports = Controller;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        EventEmitter: __webpack_require__(6),
	        EventHandler: __webpack_require__(5),
	        EventMapper: __webpack_require__(9),
	        EventFilter: __webpack_require__(11),
	        EventSplitter: __webpack_require__(12)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        GenericInput: __webpack_require__(38),
	        MouseInput: __webpack_require__(39),
	        TouchInput: __webpack_require__(40),
	        ScrollInput: __webpack_require__(42),
	        ScaleInput: __webpack_require__(43),
	        RotateInput: __webpack_require__(45),
	        PinchInput: __webpack_require__(46)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);

	    // Global registry of input constructors. Append only.
	    var registry = {};

	    /**
	     * Combines multiple inputs (e.g., mouse, touch, scroll) into one unified input.
	     *  Inputs must first be registered on the constructor by a unique identifier,
	     *  then they can be accessed on instantiation.
	     *
	     *      @example
	     *
	     *      // In main.js
	     *      GenericInput.register({
	     *          "mouse" : MouseInput,
	     *          "touch" : TouchInput
	     *      });
	     *
	     *      // in myFile.js
	     *      var input = new GenericInput(['mouse', 'touch'], options);
	     *
	     * @class GenericInput
	     * @constructor
	     * @namespace Inputs
	     * @extends Streams.SimpleStream
	     * @param inputs {Object|String[]}  Dictionary with {identifier : option} pairs
	     *                                  or an array of identifier strings
	     * @param [options] {Object} Options for all inputs
	     */
	    function GenericInput(inputs, options) {
	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._inputs = {};
	        if (inputs) this.addInput(inputs);
	        if (options) this.setOptions(options);
	    }

	    GenericInput.prototype = Object.create(SimpleStream.prototype);
	    GenericInput.prototype.constructor = GenericInput;

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    GenericInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    /**
	     * Register a global input class with an identifying key
	     *
	     * @method register
	     * @static
	     * @param inputObject {Object} an object of {input key : input options} fields
	     */
	    GenericInput.register = function register(inputObject) {
	        for (var key in inputObject){
	            if (registry[key]){
	                if (registry[key] === inputObject[key]) return; // redundant registration
	                else throw new Error('this key is registered to a different input class');
	            }
	            else registry[key] = inputObject[key];
	        }
	    };

	    /**
	     * Helper to set options on all input instances
	     *
	     * @method setOptions
	     * @param options {Object} options object
	     */
	    GenericInput.prototype.setOptions = function(options) {
	        for (var key in this._inputs)
	            this._inputs[key].setOptions(options);
	    };

	    /**
	     * Subscribe events from an input class
	     *
	     * @method subscribeInput
	     * @param key {String} identifier for input class
	     */
	    GenericInput.prototype.subscribeInput = function subscribeInput(key) {
	        var input = this._inputs[key];
	        input.subscribe(this._eventInput);
	        this._eventOutput.subscribe(input);
	    };

	    /**
	     * Unsubscribe events from an input class
	     *
	     * @method unsubscribeInput
	     * @param key {String} identifier for input class
	     */
	    GenericInput.prototype.unsubscribeInput = function unsubscribeInput(key) {
	        var input = this._inputs[key];
	        input.unsubscribe(this._eventInput);
	        this._eventOutput.unsubscribe(input);
	    };

	    function _addSingleInput(key, options) {
	        if (!registry[key]) return;
	        this._inputs[key] = new (registry[key])(options);
	        this.subscribeInput(key);
	    }

	    /**
	     * Add an input class to from the registered classes
	     *
	     * @method addInput
	     * @param inputs {Object|Array.String} an array of registered input keys
	     *    or an object with fields {input key : input options}
	     */
	    GenericInput.prototype.addInput = function addInput(inputs) {
	        if (inputs instanceof Array)
	            for (var i = 0; i < inputs.length; i++)
	                _addSingleInput.call(this, inputs[i]);
	        else if (inputs instanceof Object)
	            for (var key in inputs)
	                _addSingleInput.call(this, key, inputs[key]);
	    };

	    module.exports = GenericInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var OptionsManager = __webpack_require__(31);
	    var SimpleStream = __webpack_require__(10);

	    var MINIMUM_TICK_TIME = 8;
	    var _now = Date.now;

	    /**
	     * Wrapper for DOM mouse events. Converts
	     *
	     *      `mousedown` -> `start`
	     *      `mousemove` -> `update`
	     *      `mouseup`   -> `end`
	     *
	     * MouseInput emits these events with the following payload data:
	     *
	     *      `value`     - Displacement in pixels from `mousedown`
	     *      `delta`     - Differential in pixels between successive mouse positions
	     *      `velocity`  - Velocity of mouse movement in pixels per second
	     *      `clientX`   - DOM event clientX property
	     *      `clientY`   - DOM event clientY property
	     *      `offsetX`   - DOM event offsetX property
	     *      `offsetY`   - DOM event offsetY property
	     *
	     * @example
	     *
	     *      var surface = new Surface({
	     *          size : [100,100],
	     *          properties : {background : 'red'}
	     *      });
	     *
	     *      var mouseInput = new MouseInput({
	     *          direction : MouseInput.DIRECTION.X
	     *      });
	     *
	     *      mouseInput.subscribe(surface);
	     *
	     *      mouseInput.on('start', function(payload){
	     *          // fired on mouse down
	     *          console.log('start', payload);
	     *      });
	     *
	     *      mouseInput.on('update', function(payload){
	     *          // fired on mouse move
	     *          console.log('update', payload);
	     *      });
	     *
	     *      mouseInput.on('end', function(payload){
	     *          // fired on mouse up
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class MouseInput
	     * @constructor
	     * @extend SimpleStream
	     * @param [options] {Object}                Options
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in MouseInput.DIRECTION.
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     */
	    function MouseInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('mousedown',    handleStart.bind(this));
	        this._eventInput.on('mousemove',    handleMove.bind(this));
	        this._eventInput.on('mouseup',      handleEnd.bind(this));
	        this._eventInput.on('mouseleave',   handleLeave.bind(this));

	        this._payload = {
	            delta    : null,
	            value    : null,
	            velocity : null,
	            clientX  : 0,
	            clientY  : 0,
	            offsetX  : 0,
	            offsetY  : 0
	        };

	        this._position = null;      // to be deprecated
	        this._prevCoord = undefined;
	        this._prevTime = undefined;
	        this._down = false;
	        this._move = false;
	    }

	    MouseInput.prototype = Object.create(SimpleStream.prototype);
	    MouseInput.prototype.constructor = MouseInput;

	    MouseInput.DEFAULT_OPTIONS = {
	        direction: undefined,
	        scale: 1
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    MouseInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    function handleStart(event) {
	        var delta;
	        var velocity;

	        event.preventDefault(); // prevent drag

	        var x = event.clientX;
	        var y = event.clientY;

	        this._prevCoord = [x, y];
	        this._prevTime = _now();
	        this._down = true;
	        this._move = false;

	        if (this.options.direction !== undefined){
	            this._position = 0;
	            delta = 0;
	            velocity = 0;
	        }
	        else {
	            this._position = [0, 0];
	            delta = [0, 0];
	            velocity = [0, 0];
	        }

	        var payload = this._payload;
	        payload.delta = delta;
	        payload.value = this._position;
	        payload.velocity = velocity;
	        payload.clientX = x;
	        payload.clientY = y;
	        payload.offsetX = event.offsetX;
	        payload.offsetY = event.offsetY;

	        this._eventOutput.emit('start', payload);
	    }

	    function handleMove(event) {
	        if (!this._prevCoord) return;

	        var prevCoord = this._prevCoord;
	        var prevTime = this._prevTime;

	        var x = event.clientX;
	        var y = event.clientY;

	        var currTime = _now();

	        var diffX = x - prevCoord[0];
	        var diffY = y - prevCoord[1];

	        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

	        var velX = diffX / diffTime;
	        var velY = diffY / diffTime;

	        var scale = this.options.scale;
	        var nextVel;
	        var nextDelta;

	        if (this.options.direction === MouseInput.DIRECTION.X) {
	            nextDelta = scale * diffX;
	            nextVel = scale * velX;
	            this._position += nextDelta;
	        }
	        else if (this.options.direction === MouseInput.DIRECTION.Y) {
	            nextDelta = scale * diffY;
	            nextVel = scale * velY;
	            this._position += nextDelta;
	        }
	        else {
	            nextDelta = [scale * diffX, scale * diffY];
	            nextVel = [scale * velX, scale * velY];
	            this._position[0] += nextDelta[0];
	            this._position[1] += nextDelta[1];
	        }

	        var payload = this._payload;
	        payload.delta    = nextDelta;
	        payload.value    = this._position;
	        payload.velocity = nextVel;
	        payload.clientX  = x;
	        payload.clientY  = y;
	        payload.offsetX  = event.offsetX;
	        payload.offsetY  = event.offsetY;

	        this._eventOutput.emit('update', payload);

	        this._prevCoord = [x, y];
	        this._prevTime = currTime;
	        this._move = true;
	    }

	    function handleEnd() {
	        if (!this._down) return;

	        this._eventOutput.emit('end', this._payload);
	        this._prevCoord = undefined;
	        this._prevTime = undefined;
	        this._down = false;
	        this._move = false;
	    }

	    function handleLeave(event) {
	        if (!this._down || !this._move) return;

	        var boundMove = handleMove.bind(this);
	        var boundEnd = function(event) {
	            handleEnd.call(this, event);
	            document.removeEventListener('mousemove', boundMove);
	            document.removeEventListener('mouseup', boundEnd);
	        }.bind(this, event);

	        document.addEventListener('mousemove', boundMove);
	        document.addEventListener('mouseup', boundEnd);
	    }

	    module.exports = MouseInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TouchTracker = __webpack_require__(41);
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);
	    var OptionsManager = __webpack_require__(31);

	    var MINIMUM_TICK_TIME = 8;

	    /**
	     * Wrapper for DOM touch events. Converts
	     *
	     *      `touchstart` -> `start`
	     *      `touchmove`  -> `update`
	     *      `touchend`   -> `end`
	     *
	     * TouchInput emits these events with the following payload data:
	     *
	     *      `value`     - Displacement in pixels from `touchstart`
	     *      `delta`     - Differential in pixels between successive mouse positions
	     *      `velocity`  - Velocity of mouse movement in pixels per second
	     *      `clientX`   - DOM event clientX property
	     *      `clientY`   - DOM event clientY property
	     *      `count`     - DOM event for number of simultaneous touches
	     *      `touch`     - DOM touch event identifier
	     *
	     * @example
	     *
	     *      var touchInput = new TouchInput({
	     *          direction : TouchInput.DIRECTION.Y
	     *      });
	     *
	     *      touchInput.subscribe(Engine);
	     *
	     *      touchInput.on('start', function(payload){
	     *          // fired on mouse down
	     *          console.log('start', payload);
	     *      });
	     *
	     *      touchInput.on('update', function(payload){
	     *          // fired on mouse move
	     *          console.log('update', payload);
	     *      });
	     *
	     *      touchInput.on('end', function(payload){
	     *          // fired on mouse up
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class TouchInput
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @uses Inputs.TouchTracker
	     * @uses Core.OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in TouchInput.DIRECTION.
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     */
	    function TouchInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._eventOutput = new EventHandler();
	        this._touchTracker = new TouchTracker();

	        EventHandler.setOutputHandler(this, this._eventOutput);
	        EventHandler.setInputHandler(this, this._touchTracker);

	        this._touchTracker.on('trackstart', handleStart.bind(this));
	        this._touchTracker.on('trackmove', handleMove.bind(this));
	        this._touchTracker.on('trackend', handleEnd.bind(this));

	        this._payload = {
	            delta    : null,
	            value    : null,
	            velocity : null,
	            clientX  : undefined,
	            clientY  : undefined,
	            count    : 0,
	            touch    : undefined
	        };

	        this._position = null;
	    }

	    TouchInput.prototype = Object.create(SimpleStream.prototype);
	    TouchInput.prototype.constructor = TouchInput;

	    TouchInput.DEFAULT_OPTIONS = {
	        direction: undefined,
	        scale: 1
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    TouchInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    function handleStart(data) {
	        var velocity;
	        var delta;
	        if (this.options.direction !== undefined){
	            this._position = 0;
	            velocity = 0;
	            delta = 0;
	        }
	        else {
	            this._position = [0, 0];
	            velocity = [0, 0];
	            delta = [0, 0];
	        }

	        var payload = this._payload;
	        payload.delta = delta;
	        payload.value = this._position;
	        payload.velocity = velocity;
	        payload.clientX = data.x;
	        payload.clientY = data.y;
	        payload.count = data.count;
	        payload.touch = data.identifier;

	        this._eventOutput.emit('start', payload);
	    }

	    function handleMove(data) {
	        var history = data.history;

	        var currHistory = history[history.length - 1];
	        var prevHistory = history[history.length - 2];

	        var distantTime = prevHistory.timestamp;
	        var currTime = currHistory.timestamp;

	        var diffX = currHistory.x - prevHistory.x;
	        var diffY = currHistory.y - prevHistory.y;

	        var velDiffX = currHistory.x - prevHistory.x;
	        var velDiffY = currHistory.y - prevHistory.y;

	        var invDeltaT = Math.max(currTime - distantTime, MINIMUM_TICK_TIME);

	        var velX = velDiffX * invDeltaT;
	        var velY = velDiffY * invDeltaT;

	        var scale = this.options.scale;
	        var nextVel;
	        var nextDelta;

	        if (this.options.direction === TouchInput.DIRECTION.X) {
	            nextDelta = scale * diffX;
	            nextVel = scale * velX;
	            this._position += nextDelta;
	        }
	        else if (this.options.direction === TouchInput.DIRECTION.Y) {
	            nextDelta = scale * diffY;
	            nextVel = scale * velY;
	            this._position += nextDelta;
	        }
	        else {
	            nextDelta = [scale * diffX, scale * diffY];
	            nextVel = [scale * velX, scale * velY];
	            this._position[0] += nextDelta[0];
	            this._position[1] += nextDelta[1];
	        }

	        var payload = this._payload;
	        payload.delta      = nextDelta;
	        payload.velocity   = nextVel;
	        payload.value      = this._position;
	        payload.clientX    = data.x;
	        payload.clientY    = data.y;
	        payload.count      = data.count;
	        payload.touch      = data.identifier;

	        this._eventOutput.emit('update', payload);
	    }

	    function handleEnd(data) {
	        this._payload.count = data.count;
	        this._eventOutput.emit('end', this._payload);
	    }

	    module.exports = TouchInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	//TODO: deprecate in favor of generic history stream

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var OptionsManager = __webpack_require__(31);
	    var EventHandler = __webpack_require__(5);

	    var _now = Date.now;

	    /**
	     * Catalogues a history of touch events. Useful for creating more complex
	     *  touch recognition for gestures. Currently only used by TouchInput to
	     *  track previous touches to compute velocity.
	     *
	     * TouchTracker emits these events with the following payload data:
	     *
	     *      `x`             - Displacement in x-direction
	     *      `y`             - Displacement in y-direction
	     *      `identifier`    - DOM event touch identifier
	     *      `timestamp`     - Timestamp
	     *      `count`         - DOM event for number of simultaneous touches
	     *      `history`       - History of touches for the gesture
	     *
	     * @class TouchTracker
	     * @constructor
	     * @private
	     * @uses Core.OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.limit] {Number}          Number of touches to record
	     */

	    function TouchTracker(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this.touchHistory = {};
	        this._isTouched = false;

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('touchstart', _handleStart.bind(this));
	        this._eventInput.on('touchmove', _handleMove.bind(this));
	        this._eventInput.on('touchend', _handleEnd.bind(this));
	        this._eventInput.on('touchcancel', _handleEnd.bind(this));
	    }

	    TouchTracker.DEFAULT_OPTIONS = {
	        limit : 1 // number of simultaneous touches
	    };

	    /**
	     * Record touch data, if selective is false.
	     * @private
	     * @method track
	     * @param {Object} data touch data
	     */
	    TouchTracker.prototype.track = function track(data) {
	        this.touchHistory[data.identifier] = [data];
	    };

	    function _timestampTouch(touch, event, history) {
	        return {
	            x: touch.clientX,
	            y: touch.clientY,
	            identifier : touch.identifier,
	            timestamp: _now(),
	            count: event.touches.length,
	            history: history
	        };
	    }

	    function _handleStart(event) {
	        if (event.touches.length > this.options.limit) return;
	        this._isTouched = true;

	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var data = _timestampTouch(touch, event, null);
	            this._eventOutput.emit('trackstart', data);
	            if (!this.touchHistory[touch.identifier]) this.track(data);
	        }
	    }

	    function _handleMove(event) {
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var history = this.touchHistory[touch.identifier];
	            if (history) {
	                var data = _timestampTouch(touch, event, history);
	                this.touchHistory[touch.identifier].push(data);
	                this._eventOutput.emit('trackmove', data);
	            }
	        }
	    }

	    function _handleEnd(event) {
	        if (!this._isTouched) return;

	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            var history = this.touchHistory[touch.identifier];
	            if (history) {
	                var data = _timestampTouch(touch, event, history);
	                this._eventOutput.emit('trackend', data);
	                delete this.touchHistory[touch.identifier];
	            }
	        }

	        this._isTouched = false;
	    }

	    module.exports = TouchTracker;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	/* Documentation in progress. May be outdated. */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var OptionsManager = __webpack_require__(31);
	    var SimpleStream = __webpack_require__(10);
	    var Timer = __webpack_require__(33);

	    var MINIMUM_TICK_TIME = 8;

	    /**
	     * Wrapper for DOM wheel/mousewheel events. Converts `scroll` events
	     *  to `start`, `update` and `end` events and emits them with the payload:
	     *
	     *      `value`     - Scroll displacement in pixels from start
	     *      `delta`     - Scroll differential in pixels between subsequent events
	     *      `velocity`  - Velocity of scroll
	     *
	     * @example
	     *
	     *      var scrollInput = new ScrollInput();
	     *
	     *      scrollInput.subscribe(Engine) // listens on `window` events
	     *
	     *      scrollInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      scrollInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      scrollInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class ScrollInput
	     * @constructor
	     * @extends Streams.SimpleStream
	     * @uses Inputs.TouchTracker
	     * @uses Core.OptionsManager
	     * @param [options] {Object}                Options
	     * @param [options.direction] {Number}      Direction to project movement onto.
	     *                                          Options found in TouchInput.DIRECTION.
	     * @param [options.scale=1] {Number}        Scale the response to the mouse
	     */
	    function ScrollInput(options) {
	        this.options = OptionsManager.setOptions(this, options);

	        this._payload = {
	            delta    : null,
	            value    : null,
	            velocity : null
	        };

	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this._eventInput.on('mousewheel', handleMove.bind(this));
	        this._eventInput.on('wheel', handleMove.bind(this));

	        this._value = (this.options.direction === undefined) ? [0,0] : 0;
	        this._prevTime = undefined;
	        this._inProgress = false;

	        var self = this;
	        this._scrollEnd = Timer.debounce(function(){
	            self._inProgress = false;
	            self._eventOutput.emit('end', self._payload);
	        }, 100);
	    }

	    ScrollInput.prototype = Object.create(SimpleStream.prototype);
	    ScrollInput.prototype.constructor = ScrollInput;

	    ScrollInput.DEFAULT_OPTIONS = {
	        direction: undefined,
	        scale: 1
	    };

	    /**
	     * Constrain the input along a specific axis.
	     *
	     * @property DIRECTION {Object}
	     * @property DIRECTION.X {Number}   x-axis
	     * @property DIRECTION.Y {Number}   y-axis
	     * @static
	     */
	    ScrollInput.DIRECTION = {
	        X : 0,
	        Y : 1
	    };

	    var _now = Date.now;

	    function handleMove(event) {
	        // prevent scrolling of page simultaneously
	        event.preventDefault();

	        if (!this._inProgress) {
	            this._value = (this.options.direction === undefined) ? [0,0] : 0;
	            payload = this._payload;
	            payload.value = this._value;
	            payload.clientX = event.clientX;
	            payload.clientY = event.clientY;
	            payload.offsetX = event.offsetX;
	            payload.offsetY = event.offsetY;

	            this._eventOutput.emit('start', payload);
	            this._inProgress = true;
	            return;
	        }

	        var currTime = _now();
	        var prevTime = this._prevTime || currTime;

	        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
	        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

	        var invDeltaT = 1 / Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time
	        this._prevTime = currTime;

	        var velX = diffX * invDeltaT;
	        var velY = diffY * invDeltaT;

	        var scale = this.options.scale;
	        var nextVel;
	        var nextDelta;

	        if (this.options.direction === ScrollInput.DIRECTION.X) {
	            nextDelta = scale * diffX;
	            nextVel = scale * velX;
	            this._value += nextDelta;
	        }
	        else if (this.options.direction === ScrollInput.DIRECTION.Y) {
	            nextDelta = scale * diffY;
	            nextVel = scale * velY;
	            this._value += nextDelta;
	        }
	        else {
	            nextDelta = [scale * diffX, scale * diffY];
	            nextVel = [scale * velX, scale * velY];
	            this._value[0] += nextDelta[0];
	            this._value[1] += nextDelta[1];
	        }

	        var payload = this._payload;
	        payload.delta    = nextDelta;
	        payload.velocity = nextVel;
	        payload.value = this._value;

	        this._eventOutput.emit('update', payload);

	        // debounce `end` event
	        this._scrollEnd();
	    }

	    module.exports = ScrollInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TwoFingerInput = __webpack_require__(44);
	    var OptionsManager = __webpack_require__(31);

	    /**
	     * Detects two-finger pinching motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `value`         - Distance between the two touches
	     *      `delta`         - Differential in successive distances
	     *      `velocity`      - Relative velocity between two touches
	     *      `displacement`  - Total accumulated displacement
	     *      `center`        - Midpoint between the two touches
	     *      `touches`       - Array of DOM event touch identifiers
	     *
	     *  Note: Unlike PinchInput, which produces pixel values of displacement
	     *  between two touches, ScaleInput produces dimensionless values corresponding
	     *  to scaling of the initial distance between the touches. For example, if two
	     *  touches begin at 100 px apart, and move to 200 px apart, ScaleInput will emit
	     *  a value of 2 (for 2x magnification), while PinchInput will emit a value of 100.
	     *
	     * @example
	     *
	     *      var scaleInput = new ScaleInput();
	     *
	     *      scaleInput.subscribe(Engine) // listens on `window` events
	     *
	     *      scaleInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      scaleInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      scaleInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class ScaleInput
	     * @extends Inputs.TwoFingerInput
	     * @uses Core.OptionsManager
	     * @constructor
	     * @param options {Object}              Options
	     * @param [options.scale=1] {Number}    Scale the response to pinch
	     */
	    function ScaleInput(options) {
	        TwoFingerInput.call(this);

	        this.options = OptionsManager.setOptions(this, options);

	        this._startDist = 0;
	        this._scaleFactor = 1;
	    }

	    ScaleInput.prototype = Object.create(TwoFingerInput.prototype);
	    ScaleInput.prototype.constructor = ScaleInput;

	    ScaleInput.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    // handles initial touch of two fingers
	    ScaleInput.prototype._startUpdate = function _startUpdate(event) {
	        this._startDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

	        this._eventOutput.emit('start', {
	            count: event.touches.length,
	            touches: [this.touchAId, this.touchBId],
	            distance: this._startDist,
	            center: center
	        });
	    };

	    // handles movement of two fingers
	    ScaleInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
	        var scale = this.options.scale;

	        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

	        var delta = (currDist - this._startDist) / this._startDist;
	        var newScaleFactor = Math.max(1 + scale * delta, 0);
	        var veloScale = (newScaleFactor - this._scaleFactor) / diffTime;

	        this._eventOutput.emit('update', {
	            delta : delta,
	            scale: newScaleFactor,
	            velocity: veloScale,
	            distance: currDist,
	            center : center,
	            touches: [this.touchAId, this.touchBId]
	        });

	        this._scaleFactor = newScaleFactor;
	    };

	    module.exports = ScaleInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	// TODO: emit start, update, end events instead
	// of calling protected _startUpdate etc methods

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var EventHandler = __webpack_require__(5);
	    var SimpleStream = __webpack_require__(10);

	    var _now = Date.now;

	    /**
	     * Generalizes handling of two-finger touch events.
	     *  Helper to PinchInput, RotateInput, and ScaleInput.
	     *  This class is meant to be overridden and not used directly.
	     *
	     * @class TwoFingerInput
	     * @extends Streams.SimpleStream
	     * @private
	     * @constructor
	     */
	    function TwoFingerInput() {
	        this._eventInput = new EventHandler();
	        this._eventOutput = new EventHandler();

	        EventHandler.setInputHandler(this, this._eventInput);
	        EventHandler.setOutputHandler(this, this._eventOutput);

	        this.touchAEnabled = false;
	        this.touchAId = 0;
	        this.posA = null;
	        this.timestampA = 0;
	        this.touchBEnabled = false;
	        this.touchBId = 0;
	        this.posB = null;
	        this.timestampB = 0;

	        this._eventInput.on('touchstart', this.handleStart.bind(this));
	        this._eventInput.on('touchmove', this.handleMove.bind(this));
	        this._eventInput.on('touchend', this.handleEnd.bind(this));
	        this._eventInput.on('touchcancel', this.handleEnd.bind(this));
	    }

	    TwoFingerInput.prototype = Object.create(SimpleStream.prototype);
	    TwoFingerInput.prototype.constructor = TwoFingerInput;

	    /**
	     * Calculates the angle between two touches relative to [0,1].
	     *
	     * @method calculateAngle
	     * @static
	     * @param posA {Array}  First touch location (x,y)
	     * @param posB {Array}  Second touch location (x,y)
	     * @return {Number}
	     */
	    TwoFingerInput.calculateAngle = function(posA, posB) {
	        var diffX = posB[0] - posA[0];
	        var diffY = posB[1] - posA[1];
	        return Math.atan2(diffY, diffX);
	    };

	    /**
	     * Calculates the distance between two touches.
	     *
	     * @method calculateDistance
	     * @static
	     * @param posA {Array}  First touch location (x,y)
	     * @param posB {Array}  Second touch location (x,y)
	     * @return {Number}
	     */
	    TwoFingerInput.calculateDistance = function(posA, posB) {
	        var diffX = posB[0] - posA[0];
	        var diffY = posB[1] - posA[1];
	        return Math.sqrt(diffX * diffX + diffY * diffY);
	    };

	    /**
	     * Calculates the midpoint between two touches.
	     *
	     * @method calculateCenter
	     * @static
	     * @param posA {Array}  First touch location (x,y)
	     * @param posB {Array}  Second touch location (x,y)
	     * @return {Array}
	     */
	    TwoFingerInput.calculateCenter = function(posA, posB) {
	        return [(posA[0] + posB[0]) / 2.0, (posA[1] + posB[1]) / 2.0];
	    };

	    // private
	    TwoFingerInput.prototype.handleStart = function handleStart(event) {
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            if (!this.touchAEnabled) {
	                this.touchAId = touch.identifier;
	                this.touchAEnabled = true;
	                this.posA = [touch.pageX, touch.pageY];
	                this.timestampA = _now();
	            }
	            else if (!this.touchBEnabled) {
	                this.touchBId = touch.identifier;
	                this.touchBEnabled = true;
	                this.posB = [touch.pageX, touch.pageY];
	                this.timestampB = _now();
	                this._startUpdate(event);
	            }
	        }
	    };

	    // private
	    TwoFingerInput.prototype.handleMove = function handleMove(event) {
	        if (!(this.touchAEnabled && this.touchBEnabled)) return;
	        var prevTimeA = this.timestampA;
	        var prevTimeB = this.timestampB;
	        var diffTime;
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            if (touch.identifier === this.touchAId) {
	                this.posA = [touch.pageX, touch.pageY];
	                this.timestampA = _now();
	                diffTime = this.timestampA - prevTimeA;
	            }
	            else if (touch.identifier === this.touchBId) {
	                this.posB = [touch.pageX, touch.pageY];
	                this.timestampB = _now();
	                diffTime = this.timestampB - prevTimeB;
	            }
	        }
	        if (diffTime) this._moveUpdate(diffTime);
	    };

	    // private
	    TwoFingerInput.prototype.handleEnd = function handleEnd(event) {
	        for (var i = 0; i < event.changedTouches.length; i++) {
	            var touch = event.changedTouches[i];
	            if (touch.identifier === this.touchAId || touch.identifier === this.touchBId) {
	                if (this.touchAEnabled && this.touchBEnabled) {
	                    this._eventOutput.emit('end', {
	                        touches : [this.touchAId, this.touchBId],
	                        angle   : this._angle
	                    });
	                }
	                this.touchAEnabled = false;
	                this.touchAId = 0;
	                this.touchBEnabled = false;
	                this.touchBId = 0;
	            }
	        }
	    };

	    module.exports = TwoFingerInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TwoFingerInput = __webpack_require__(44);
	    var OptionsManager = __webpack_require__(31);

	    /**
	     * Detects two-finger rotational motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `value`         - Angle of rotation
	     *      `delta`         - Differential of successive angles
	     *      `velocity`      - Velocity of rotation
	     *      `center`        - Midpoint between the two touches
	     *      `touches`       - Array of DOM event touch identifiers
	     *
	     * @example
	     *
	     *      var rotateInput = new RotateInput();
	     *
	     *      rotateInput.subscribe(Engine) // listens on `window` events
	     *
	     *      rotateInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      rotateInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      rotateInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class RotateInput
	     * @extends Inputs.TwoFingerInput
	     * @uses Core.OptionsManager
	     * @constructor
	     * @param options {Object}              Options
	     * @param [options.scale=1] {Number}    Scale the response to pinch
	     */
	    function RotateInput(options) {
	        TwoFingerInput.call(this);

	        this.options = OptionsManager.setOptions(this, options);

	        this._angle = 0;
	        this._previousAngle = 0;
	    }

	    RotateInput.prototype = Object.create(TwoFingerInput.prototype);
	    RotateInput.prototype.constructor = RotateInput;

	    RotateInput.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    RotateInput.prototype._startUpdate = function _startUpdate(event) {
	        this._previousAngle = TwoFingerInput.calculateAngle(this.posA, this.posB);
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

	        this._angle = 0;

	        this._eventOutput.emit('start', {
	            count: event.touches.length,
	            value: this._angle,
	            center: center,
	            touches: [this.touchAId, this.touchBId]
	        });
	    };

	    RotateInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
	        var scale = this.options.scale;

	        var currAngle = TwoFingerInput.calculateAngle(this.posA, this.posB);
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

	        var diffTheta = scale * (currAngle - this._previousAngle);
	        var velTheta = diffTheta / diffTime;

	        this._angle += diffTheta;

	        this._eventOutput.emit('update', {
	            delta : diffTheta,
	            velocity: velTheta,
	            value: this._angle,
	            center: center,
	            touches: [this.touchAId, this.touchBId]
	        });

	        this._previousAngle = currAngle;
	    };

	    module.exports = RotateInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var TwoFingerInput = __webpack_require__(44);
	    var OptionsManager = __webpack_require__(31);

	    /**
	     * Detects two-finger pinching motion and emits `start`, `update` and
	     *  `end` events with the payload data:
	     *
	     *      `value`         - Distance between the two touches
	     *      `delta`         - Differential in successive distances
	     *      `velocity`      - Relative velocity between two touches
	     *      `displacement`  - Total accumulated displacement
	     *      `center`        - Midpoint between the two touches
	     *      `touches`       - Array of DOM event touch identifiers
	     *
	     * @example
	     *
	     *      var pinchInput = new PinchInput();
	     *
	     *      pinchInput.subscribe(Engine) // listens on `window` events
	     *
	     *      pinchInput.on('start', function(payload){
	     *          console.log('start', payload);
	     *      });
	     *
	     *      pinchInput.on('update', function(payload){
	     *          console.log('update', payload);
	     *      });
	     *
	     *      pinchInput.on('end', function(payload){
	     *          console.log('end', payload);
	     *      });
	     *
	     * @class PinchInput
	     * @extends Inputs.TwoFingerInput
	     * @uses Core.OptionsManager
	     * @constructor
	     * @param options {Object}              Options
	     * @param [options.scale=1] {Number}    Scale the response to pinch
	     */
	    function PinchInput(options) {
	        TwoFingerInput.call(this);

	        this.options = OptionsManager.setOptions(this, options);

	        this._displacement = 0;
	        this._previousDistance = 0;
	    }

	    PinchInput.prototype = Object.create(TwoFingerInput.prototype);
	    PinchInput.prototype.constructor = PinchInput;

	    PinchInput.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    PinchInput.prototype._startUpdate = function _startUpdate(event) {
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);
	        this._previousDistance = TwoFingerInput.calculateDistance(this.posA, this.posB);

	        this._displacement = 0;

	        this._eventOutput.emit('start', {
	            count: event.touches.length,
	            touches: [this.touchAId, this.touchBId],
	            value: this._previousDistance,
	            center: center
	        });
	    };

	    PinchInput.prototype._moveUpdate = function _moveUpdate(diffTime) {
	        var currDist = TwoFingerInput.calculateDistance(this.posA, this.posB);
	        var center = TwoFingerInput.calculateCenter(this.posA, this.posB);

	        var scale = this.options.scale;
	        var delta = scale * (currDist - this._previousDistance);
	        var velocity = delta / diffTime;

	        this._displacement += delta;

	        this._eventOutput.emit('update', {
	            delta : delta,
	            velocity: velocity,
	            value: currDist,
	            displacement: this._displacement,
	            center: center,
	            touches: [this.touchAId, this.touchBId]
	        });

	        this._previousDistance = currDist;
	    };

	    module.exports = PinchInput;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        DrawerLayout: __webpack_require__(48),
	        FlexibleLayout: __webpack_require__(51),
	        GridLayout: __webpack_require__(52),
	        SequentialLayout: __webpack_require__(53),
	        Scrollview: __webpack_require__(54)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);
	    var Transitionable = __webpack_require__(28);
	    var View = __webpack_require__(34);
	    var LayoutNode = __webpack_require__(20);
	    var Stream = __webpack_require__(8);
	    var Differential = __webpack_require__(49);
	    var Accumulator = __webpack_require__(50);
	    var EventMapper = __webpack_require__(9);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        },
	        SIDE : {
	            LEFT : 0,
	            TOP : 1,
	            RIGHT : 2,
	            BOTTOM : 3
	        },
	        ORIENTATION : {
	            POSITIVE :  1,
	            NEGATIVE : -1
	        }
	    };

	    /**
	     * A layout composed of two sections: content and drawer.
	     *
	     *  The drawer is initially hidden behind the content, until it is moved
	     *  by a call to setPosition. The source of the movement can be by subscribing
	     *  the layout to user input (like a Mouse/Touch/Scroll input), or by manually
	     *  calling setPosition with a transition.
	     *
	     *  The layout emits a `start`, `update` and `end` Stream with payload
	     *
	     *      `progress` - Number between 0 and 1 indicating how open the drawer is
	     *      `value` - Pixel displacement in how open the drawer is
	     *
	     *  It also emits `close` and `open` events.
	     *
	     *  The drawer can be revealed from any side of the content (top, left, bottom, right),
	     *  by specifying a side option.
	     *
	     *  @class DrawerLayout
	     *  @constructor
	     *  @namespace Layouts
	     *  @extends Core.View
	     *  @param [options] {Object}                       Options
	     *  @param [options.side] {Number}                  Side to reveal the drawer from. Defined in DrawerLayout.SIDES
	     *  @param [options.revealLength] {Number}          The maximum length to reveal the drawer
	     *  @param [options.velocityThreshold] {Number}     The velocity needed to complete the drawer transition
	     *  @param [options.positionThreshold] {Number}     The displacement needed to complete the drawer transition
	     *  @param [options.transitionClose] {Object}       A transition definition for closing the drawer
	     *  @param [options.transitionOpen] {Object}        A transition definition for opening the drawer
	     */
	    var DrawerLayout = View.extend({
	        defaults : {
	            side : CONSTANTS.SIDE.LEFT,
	            revealLength : undefined,
	            velocityThreshold : Infinity,
	            positionThreshold : 0,
	            transitionOpen : true,
	            transitionClose : true
	        },
	        events : {
	            change : _updateState
	        },
	        initialize : function initialize(options){
	            // DERIVED STATE

	            // vertical or horizontal movement
	            this.direction = _getDirectionFromSide(options.side);

	            // positive or negative movement along the direction
	            this.orientation = _getOrientationFromSide(options.side);

	            // scale the revealLength by the parity of the direction
	            this.options.revealLength *= this.orientation;

	            // open state (needed for toggling)
	            this.isOpen = false;

	            // STREAMS
	            
	            // responsible for manually moving the content without user input
	            this.transitionStream = new Transitionable(0);

	            // responsible for moving the content from user input
	            var gestureDelta = new Stream({
	                start : function (){
	                    this.position.unsubscribe(transitionDelta);
	                    return 0;
	                }.bind(this),
	                update : function (data){
	                    // modify the delta from user input to be constrained
	                    // by the revealLength
	                    var delta = data.delta;
	                    var newDelta = delta;
	                    var revealLength = options.revealLength;

	                    var currentPosition = this.position.get();
	                    var newPosition = currentPosition + delta;

	                    var MIN_LENGTH = 0;
	                    var MAX_LENGTH = 0;

	                    if (this.orientation === CONSTANTS.ORIENTATION.POSITIVE)
	                        MAX_LENGTH = revealLength;
	                    else
	                        MIN_LENGTH = revealLength;

	                    if (newPosition >= MAX_LENGTH || newPosition <= MIN_LENGTH){
	                        if (newPosition > MAX_LENGTH && newPosition > MIN_LENGTH && currentPosition !== MAX_LENGTH)
	                            newDelta = MAX_LENGTH - currentPosition;
	                        else if (newPosition < MIN_LENGTH && currentPosition !== MIN_LENGTH)
	                            newDelta = MIN_LENGTH - currentPosition;
	                        else newDelta = 0;
	                    }

	                    return newDelta;
	                }.bind(this),
	                end : function (data){
	                    this.position.subscribe(transitionDelta);
	                    var velocity = data.velocity;
	                    var orientation = this.orientation;
	                    var length = this.options.revealLength;
	                    var isOpen = this.isOpen;
	                    var currentPosition = this.position.get();

	                    var options = this.options;

	                    var MAX_LENGTH = orientation * length;
	                    var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
	                    var velocityThreshold = options.velocityThreshold;

	                    if (options.transition instanceof Object)
	                        options.transition.velocity = velocity;

	                    if (currentPosition === 0) {
	                        this.isOpen = false;
	                        return;
	                    }

	                    if (currentPosition === MAX_LENGTH) {
	                        this.isOpen = true;
	                        return;
	                    }

	                    var shouldToggle =
	                        Math.abs(velocity) > velocityThreshold           ||
	                        (!isOpen && currentPosition > positionThreshold) ||
	                        (isOpen && currentPosition < positionThreshold);

	                    (shouldToggle) ? this.toggle() : this.reset();
	                }.bind(this)
	            });

	            gestureDelta.subscribe(this.input);

	            var transitionDelta = new Differential();
	            transitionDelta.subscribe(this.transitionStream);

	            this.position = new Accumulator();
	            this.position.subscribe(gestureDelta);
	            this.position.subscribe(transitionDelta);

	            var outputMapper = new EventMapper(function(position){
	                return {
	                    value : position,
	                    progress : position / this.options.revealLength
	                }
	            }.bind(this));

	            this.output.subscribe(outputMapper).subscribe(this.position);
	        },
	        /**
	         * Set the drawer component with a Surface of View.
	         *
	         * @method addDrawer
	         * @param drawer {Surface|View}
	         */
	        addDrawer : function addDrawer(drawer){
	            if (this.options.revealLength == undefined)
	                this.options.revealLength = drawer.getSize()[this.direction];

	            this.drawer = drawer;
	            var layout = new LayoutNode({transform : Transform.behind});
	            this.add(layout).add(this.drawer);
	        },
	        /**
	         * Set the content component with a Surface or View.
	         *
	         * @method addContent
	         * @param content {Surface|View}
	         */
	        addContent : function addContent(content){
	            var transform = this.position.map(function(position){
	                return (this.direction === CONSTANTS.DIRECTION.X)
	                    ? Transform.translateX(position)
	                    : Transform.translateY(position)
	            }.bind(this));

	            var layout = new LayoutNode({transform : transform});

	            this.add(layout).add(content);
	        },
	        /**
	         * Reveals the drawer with a transition.
	         *   Emits an `open` event when an opening transition has been committed to.
	         *
	         * @method open
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        open : function open(transition, callback){
	            if (transition instanceof Function) callback = transition;
	            if (transition === undefined) transition = this.options.transitionOpen;
	            this.setPosition(this.options.revealLength, transition, callback);
	            if (!this.isOpen) {
	                this.isOpen = true;
	                this.emit('open');
	            }
	        },
	        /**
	         * Conceals the drawer with a transition.
	         *   Emits a `close` event when an closing transition has been committed to.
	         *
	         * @method close
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        close : function close(transition, callback){
	            if (transition instanceof Function) callback = transition;
	            if (transition === undefined) transition = this.options.transitionClose;
	            this.setPosition(0, transition, callback);
	            if (this.isOpen){
	                this.isOpen = false;
	                this.emit('close');
	            }
	        },
	        /**
	         * Toggles between open and closed states.
	         *
	         * @method toggle
	         * @param [transition] {Boolean|Object} transition definition
	         */
	        toggle : function toggle(transition){
	            if (this.isOpen) this.close(transition);
	            else this.open(transition);
	        },
	        /**
	         * Sets the position in pixels for the content's displacement.
	         *
	         * @method setPosition
	         * @param position {Number}             position
	         * @param [transition] {Boolean|Object} transition definition
	         * @param [callback] {Function}         callback
	         */
	        setPosition : function setPosition(position, transition, callback) {
	            this.transitionStream.reset(this.position.get());
	            this.transitionStream.set(position, transition, callback);
	        },
	        /**
	         * Resets to last state of being open or closed
	         *
	         * @method reset
	         * @param [transition] {Boolean|Object} transition definition
	         */
	        reset : function reset(transition) {
	            if (this.isOpen) this.open(transition);
	            else this.close(transition);
	        }
	    }, CONSTANTS);

	    function _getDirectionFromSide(side) {
	        var SIDE = CONSTANTS.SIDE;
	        var DIRECTION = CONSTANTS.DIRECTION;
	        return (side === SIDE.LEFT || side === SIDE.RIGHT)
	            ? DIRECTION.X
	            : DIRECTION.Y;
	    }

	    function _getOrientationFromSide(side) {
	        var SIDES = CONSTANTS.SIDE;
	        return (side === SIDES.LEFT || side === SIDES.TOP)
	            ? CONSTANTS.ORIENTATION.POSITIVE
	            : CONSTANTS.ORIENTATION.NEGATIVE;
	    }

	    function _updateState(data){
	        var key = data.key;
	        var value = data.value;
	        if (key !== 'side') {
	            this.direction = _getDirectionFromSide(value);
	            this.orientation = _getOrientationFromSide(value);
	        }
	        this.options.revealLength *= this.direction;
	    }

	    module.exports = DrawerLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Stream = __webpack_require__(8);
	    var OptionsManager = __webpack_require__(31);

	    /**
	     * Differential is a Stream that emits differentials of consecutive
	     *  input values.
	     *
	     *  It emits `start`, `update` and `end` events.
	     *
	     *  @example
	     *
	     *      var differential = new Differential();
	     *      // this gives differentials of mouse input
	     *      differential.subscribe(mouseInput.pluck('value'));
	     *
	     *
	     * @class Differential
	     * @extends Streams.Stream
	     * @uses Core.OptionsManager
	     * @namespace Streams
	     * @constructor
	     * @param [options] {Object}        Options
	     * @param [options.scale] {Number}  Scale to apply to differential
	     */
	    function Differential(options){
	        this.options = OptionsManager.setOptions(this, options);

	        var previous = undefined;
	        var delta = undefined;

	        Stream.call(this, {
	            update : function(){ return delta; }
	        });

	        this._eventInput.on('start', function(value){
	            previous = value;
	        });

	        this._eventInput.on('update', function(value){
	            var scale = this.options.scale;
	            if (previous instanceof Array){
	                delta = [];
	                for (var i = 0; i < previous.length; i++)
	                    delta[i] = scale * (value[i] - previous[i]);
	            }
	            else delta = scale * (value - previous);
	            previous = value;
	        }.bind(this));
	    }

	    Differential.DEFAULT_OPTIONS = {
	        scale : 1
	    };

	    Differential.prototype = Object.create(Stream.prototype);
	    Differential.prototype.constructor = Differential;

	    module.exports = Differential;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module){
	    var Stream = __webpack_require__(8);
	    var preTickQueue = __webpack_require__(13);
	    var dirtyQueue = __webpack_require__(15);

	    /**
	     * Accumulator is a Stream that accumulates a value given by a
	     *  number or array of numbers.
	     *
	     *  It emits `start`, `update` and `end` events.
	     *
	     *  @example
	     *
	     *      var accumulator = new Accumulator();
	     *
	     *      // this gives the total displacement of mouse input
	     *      accumulator.subscribe(mouseInput.pluck('delta'));
	     *
	     *
	     * @class Accumulator
	     * @extends Streams.Stream
	     * @namespace Streams
	     * @constructor
	     * @param [sum] {Number|Array}    Initial value
	     */
	    function Accumulator(sum){
	        // TODO: is this state necessary?
	        this.sum = undefined;

	        if (sum !== undefined) this.set(sum);

	        Stream.call(this, {
	            start : function(){
	                return this.sum || 0;
	            }.bind(this),
	            update : function(){ return this.sum; }.bind(this),
	            end : function(){ return this.sum || 0; }.bind(this)
	        });

	        this._eventInput.on('start', function(value){
	            if (this.sum === undefined) {
	                value = value || 0;
	                if (value instanceof Array){
	                    this.sum = [];
	                    for (var i = 0; i < value.length; i++)
	                        this.sum[i] = value[i];
	                }
	                else this.sum = value;
	            }
	        }.bind(this));

	        this._eventInput.on('update', function(value){
	            if (value instanceof Array){
	                if (!this.sum) this.sum = [];
	                for (var i = 0; i < value.length; i++)
	                    this.sum[i] += value[i];
	            }
	            else this.sum += value;
	        }.bind(this));
	    }

	    Accumulator.prototype = Object.create(Stream.prototype);
	    Accumulator.prototype.constructor = Accumulator;

	    /**
	     * Set accumulated value.
	     *
	     * @method set
	     * @param sum {Number}              Current value
	     * @param [silent=false] {Boolean}  Flag to suppress events
	     */
	    Accumulator.prototype.set = function(sum, silent){
	        this.sum = sum;
	        var self = this;
	        if (silent === true) return;
	        preTickQueue.push(function(){
	            self.trigger('start', sum);
	            dirtyQueue.push(function(){
	                self.trigger('end', sum);
	            });
	        })
	    };

	    /**
	     * Returns current accumulated value.
	     *
	     * @method get
	     * @return {Number}
	     */
	    Accumulator.prototype.get = function(){
	        return this.sum;
	    };

	    module.exports = Accumulator;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);
	    var Transitionable = __webpack_require__(28);
	    var View = __webpack_require__(34);
	    var Stream = __webpack_require__(8);
	    var LayoutNode = __webpack_require__(20);
	    var SizeNode = __webpack_require__(18);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        }
	    };

	    /**
	     * A layout which arranges items vertically or horizontally and
	     *  with sizes prescribed by ratios of a containing size. These
	     *  ratios can be animated.
	     *
	     * @class FlexibleLayout
	     * @constructor
	     * @namespace Layouts
	     * @extends Core.View
	     * @param [options] {Object}                        Options
	     * @param [options.direction]{Number}               Direction to lay out items
	     * @param [options.ratios] {Transitionable|Array}   The proportions
	     */
	    var FlexibleLayout = View.extend({
	        defaults : {
	            direction : CONSTANTS.DIRECTION.X,
	            ratios : []
	        },
	        initialize : function initialize(options){
	            var ratios = (options.ratios instanceof Transitionable)
	                ? options.ratios
	                : new Transitionable(options.ratios);

	            this.nodes = [];

	            var stateStream = Stream.lift(function(ratios, parentSize){
	                var direction = options.direction;

	                // calculate remaining size after true-sized nodes are accounted for
	                var flexLength = parentSize[direction];
	                var ratioSum = 0;
	                for (var i = 0; i < ratios.length; i++) {
	                    var ratio = ratios[i];
	                    var node = this.nodes[i];

	                    (typeof ratio !== 'number')
	                        ? flexLength -= node.getSize()[direction] || 0
	                        : ratioSum += ratio;
	                }

	                // calculate sizes and displacements of nodes
	                var displacement = 0;
	                var transforms = [];
	                var sizes = [];
	                for (var i = 0; i < ratios.length; i++) {
	                    node = this.nodes[i];
	                    ratio = ratios[i];

	                    var nodeLength = (typeof ratio === 'number')
	                        ? flexLength * ratio / ratioSum
	                        : node.getSize()[direction];

	                    var transform = (direction == CONSTANTS.DIRECTION.X)
	                        ? Transform.translateX(displacement)
	                        : Transform.translateY(displacement);

	                    var size = (direction == CONSTANTS.DIRECTION.X)
	                        ? [nodeLength, undefined]
	                        : [undefined, nodeLength];

	                    sizes.push(size);
	                    transforms.push(transform);

	                    displacement += nodeLength;
	                }

	                return {
	                    transforms : transforms,
	                    sizes : sizes
	                };

	            }.bind(this), [ratios, this.size]);

	            this.transforms = stateStream.pluck('transforms');
	            this.sizes = stateStream.pluck('sizes');
	        },
	        /**
	         * Add content as an array of Views or Surfaces.
	         *
	         * @method addItems
	         * @param items {Array}  An array of Views or Surfaces
	         */
	        addItems : function addItems(items){
	            this.nodes = items;

	            for (var i = 0; i < this.nodes.length; i++){
	                var node = this.nodes[i];

	                var layoutNode = new LayoutNode({
	                    transform : this.transforms.pluck(i)
	                });

	                var sizeNode = new SizeNode({
	                    size : this.sizes.pluck(i)
	                });

	                this.add(layoutNode).add(sizeNode).add(node);
	            }
	        }
	    }, CONSTANTS);

	    module.exports = FlexibleLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);
	    var View = __webpack_require__(34);
	    var Stream = __webpack_require__(8);
	    var LayoutNode = __webpack_require__(20);
	    var SizeNode = __webpack_require__(18);
	    var Transitionable = __webpack_require__(28);

	    /**
	     * A layout that arranges items in a grid and can rearrange the grid responsively.
	     *
	     *  The user provides the number of items per row in an array or a dictionary
	     *  with keys that are pixel values. The items will be sized to fill the available space.
	     *
	     *  Let itemsPerRow be a dictionary if you want the grid to rearrange responsively. The
	     *  keys should be pixel values. The row arrangement will be one of the entries of
	     *  the dictionary whose key value is closest to the parent width without exceeding it.
	     *
	     *  @class GridLayout
	     *  @constructor
	     *  @extends Core.View
	     *  @param [options] {Object}                           Options
	     *  @param options.itemsByRow {Array|Object}            Number of items per row, or an object of {width : itemsByRow} pairs
	     *  @param [options.gutter=0] {Transitionable|Number}   Gap space between successive items
	     */
	    var GridLayout = View.extend({
	        defaults : {
	            itemsPerRow : [],
	            gutter : 0
	        },
	        events : {},
	        initialize : function initialize(options){
	            var gutter = (options.gutter instanceof Transitionable)
	                ? options.gutter
	                : new Transitionable(options.gutter);

	            this.stream = Stream.lift(function(size, gutter){
	                if (!size) return false; // TODO: fix bug

	                var width = size[0];
	                var height = size[1];

	                var rows = ((options.itemsPerRow instanceof Array))
	                    ? options.itemsPerRow
	                    : selectRows(options.itemsPerRow, width);

	                var numRows = rows.length;
	                var rowHeight = (height - ((numRows - 1) * gutter)) / numRows;

	                var sizes = [];
	                var positions = [];

	                var y = 0;
	                for (var row = 0; row < numRows; row++){
	                    var numCols = rows[row];
	                    var colWidth = (width - ((numCols - 1) * gutter)) / numCols;

	                    var x = 0;
	                    for (var col = 0; col < numCols; col++){
	                        var size = [colWidth, rowHeight];
	                        sizes.push(size);
	                        positions.push([x,y]);
	                        x += colWidth + gutter;
	                    }

	                    y += rowHeight + gutter;
	                }

	                return {
	                    sizes : sizes,
	                    positions : positions
	                };
	            }, [this.size, gutter])
	        },
	        /**
	         * Add items to the layout.
	         *
	         * @method addItems
	         * @param [items] {Array}   Array of Surfaces or Views
	         */
	        addItems : function addItems(items){
	            var sizes = this.stream.pluck('sizes');
	            var positions = this.stream.pluck('positions');

	            for (var i = 0; i < items.length; i++){
	                var node = items[i];

	                var size = sizes.pluck(i);
	                var position = positions.pluck(i);

	                var transform = position.map(function(position){
	                    return Transform.translate(position);
	                });

	                var size = new SizeNode({size : size});
	                var layout = new LayoutNode({transform : transform});

	                this.add(size).add(layout).add(node);
	            }
	        }
	    });

	    function selectRows(rows, width){
	        for (var cutoff in rows) {
	            if (width <= parseInt(cutoff))
	                break;
	        }
	        return rows[cutoff];
	    }

	    module.exports = GridLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);
	    var View = __webpack_require__(34);
	    var ResizeStream = __webpack_require__(17);
	    var LayoutNode = __webpack_require__(20);

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        }
	    };

	    /**
	     * A layout which arranges items in series based on their size.
	     *  Items can be arranged vertically or horizontally.
	     *
	     * @class SequentialLayout
	     * @constructor
	     * @namespace Layouts
	     * @extends Core.View
	     * @param [options] {Object}                        Options
	     * @param [options.direction]{Number}               Direction to lay out items
	     * @param [options.spacing] {Transitionable|Array}  Gutter spacing between items
	     */
	    var SequentialLayout = View.extend({
	        defaults : {
	            direction : CONSTANTS.DIRECTION.X,
	            spacing : 0
	        },
	        initialize : function initialize(){},
	        /**
	         * Add content as an array of Views or Surfaces.
	         *
	         * @method addItems
	         * @param items {Array}  An array of Views or Surfaces
	         */
	        addItems : function addItems(items){
	            var sizes = [];
	            for (var i = 0; i < items.length; i++)
	                sizes.push(items[i].size);

	            var stream = ResizeStream.lift(function(){
	                var sizes = arguments;
	                var direction = this.options.direction;
	                var transforms = [];

	                var length = 0;
	                for (var i = 0; i < sizes.length; i++){
	                    var size = sizes[i];

	                    var transform = direction === CONSTANTS.DIRECTION.X
	                        ? Transform.translateX(length)
	                        : Transform.translateY(length);

	                    transforms.push(transform);

	                    length += size[direction] + this.options.spacing;
	                }

	                return {
	                    transforms : transforms,
	                    length: length
	                };
	            }.bind(this), sizes);

	            var transforms = stream.pluck('transforms');
	            var length = stream.pluck('length');

	            this.output.subscribe(length);

	            for (var i = 0; i < items.length; i++){
	                var node = items[i];
	                var transform = transforms.pluck(i);
	                var layout = new LayoutNode({transform : transform});
	                this.add(layout).add(node);
	            }
	        }
	    }, CONSTANTS);

	    module.exports = SequentialLayout;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    var Transform = __webpack_require__(7);
	    var Transitionable = __webpack_require__(28);
	    var View = __webpack_require__(34);
	    var LayoutNode = __webpack_require__(20);
	    var Stream = __webpack_require__(8);
	    var ResizeStream = __webpack_require__(17);
	    var Accumulator = __webpack_require__(50);
	    var Differential = __webpack_require__(49);

	    var SequentialLayout = __webpack_require__(53);
	    var ContainerSurface = __webpack_require__(2);

	    var GenericInput = __webpack_require__(38);
	    var ScrollInput = __webpack_require__(42);
	    var TouchInput = __webpack_require__(40);

	    GenericInput.register({
	        touch : TouchInput,
	        scroll : ScrollInput
	    });

	    var CONSTANTS = {
	        DIRECTION : {
	            X : 0,
	            Y : 1
	        }
	    };

	    var Scrollview = View.extend({
	        defaults : {
	            direction : CONSTANTS.DIRECTION.Y,
	            pageTransition : false
	        },
	        initialize : function(options){
	            this._currentIndex = 0;
	            this._previousIndex = 0;
	            this.itemOffset = 0;
	            this.items = [];
	            this.layout = new SequentialLayout({
	                direction : options.direction
	            });

	            var genericInput = new GenericInput(['touch', 'scroll'], {
	                direction : options.direction
	            });

	            var position = new Accumulator(0);
	            this.bounce = new Transitionable(0);

	            var bounceDifferential = new Differential();
	            var gestureDifferential = genericInput.pluck('delta');

	            bounceDifferential.subscribe(this.bounce);

	            position.subscribe(gestureDifferential);
	            position.subscribe(bounceDifferential);

	            if (options.pageTransition){
	                genericInput.on('end', function(){
	                    if (!shouldBounce) return;
	                    this.bounce.set(0);
	                    this.bounce.set(this.itemOffset, options.pageTransition);
	                }.bind(this));

	                genericInput.on('start', function(){
	                    if (this.bounce.isActive())
	                        this.bounce.halt();
	                }.bind(this));

	                this.bounce.on('end', function(){
	                    changePage.call(this, this._currentIndex);
	                }.bind(this));
	            }

	            var overflowStream = ResizeStream.lift(function(contentLength, viewportSize){
	                if (!contentLength) return false;
	                return viewportSize[options.direction] - contentLength;
	            }, [this.layout, this.size]);


	            var shouldBounce = true;
	            this.offset = Stream.lift(function(top, overflow){
	                shouldBounce = true;
	                if (!overflow) return false;

	                if (this.bounce.isActive())
	                    return Math.round(top);

	                if (top <= overflow) {
	                    shouldBounce = false;
	                    position.set(overflow, true);
	                    changePage.call(this, this._currentIndex);
	                    return overflow;
	                }
	                else if(top >= 0){
	                    shouldBounce = false;
	                    position.set(0, true);
	                    changePage.call(this, this._currentIndex);
	                    return 0;
	                }
	                else
	                    return Math.round(top);
	            }.bind(this), [position, overflowStream]);

	            var displacementNode = new LayoutNode({
	                transform : this.offset.map(function(position){
	                    return options.direction == CONSTANTS.DIRECTION.Y
	                        ? Transform.translateY(position)
	                        : Transform.translateX(position);
	                })
	            });

	            var container = new ContainerSurface({
	                properties : {
	                    overflow : 'hidden'
	                }
	            });

	            container.on('deploy', function(){
	                container._container.addEventListener('touchmove', function(event){
	                    event.preventDefault();
	                })
	            });

	            genericInput.subscribe(container);

	            container.add(displacementNode).add(this.layout);
	            this.add(container);
	        },
	        goto : function(index){
	            var position = this.itemOffset;
	            if (index > this._currentIndex){
	                for (var i = this._currentIndex; i < index; i++)
	                    position -= this.items[i].getSize()[this.options.direction];
	            }
	            else if (index < this._currentIndex){
	                for (var i = this._currentIndex; i > index; i--)
	                    position += this.items[i].getSize()[this.options.direction];
	            }
	            else return;

	            this.bounce.set(0);
	            this.bounce.set(position, {duration : 500});
	        },
	        addItems : function(items){
	            this.layout.addItems(items);
	            this.items = items;

	            var args = [this.offset];
	            for (var i = 0; i < items.length; i++){
	                args.push(items[i].size);
	            }

	            var accumLength = 0;
	            var itemOffsetStream = Stream.lift(function(){
	                if (arguments[1] === undefined) return false;

	                var offset = arguments[0];
	                var direction = this.options.direction;
	                var index = this._currentIndex;
	                var currentSize = arguments[index + 1];

	                if (!currentSize) return false;

	                var progress = 0;
	                var itemOffset = -offset - accumLength;
	                var currentLength = currentSize[direction];

	                if (itemOffset >= currentLength){
	                    // pass currentNode forwards
	                    this._currentIndex++;
	                    progress = 0;
	                    accumLength += currentLength;
	                }
	                else if (itemOffset < 0){
	                    // pass currentNode backwards
	                    if (this._currentIndex == 0) return false;
	                    this._currentIndex--;
	                    progress = 1;
	                    currentLength = arguments[this._currentIndex + 1][direction];
	                    accumLength -= currentLength;
	                }
	                else {
	                    progress = itemOffset / currentLength;
	                }

	                this.itemOffset = (itemOffset < currentLength / 2)
	                    ? itemOffset
	                    : itemOffset - currentLength;

	                return {
	                    index : this._currentIndex,
	                    progress : progress
	                };
	            }.bind(this), args);

	            this.output.subscribe(itemOffsetStream);

	            itemOffsetStream.on('start', function(value){
	            }.bind(this));

	            itemOffsetStream.on('update', function(value){
	            }.bind(this));

	            itemOffsetStream.on('end', function(value){
	            }.bind(this));
	        }
	    });

	    function changePage(index){
	        if (index == this._previousIndex) return;
	        this.emit('page', index);
	        this._previousIndex = index;
	    }

	    module.exports = Scrollview;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Accumulator: __webpack_require__(50),
	        Differential: __webpack_require__(49),
	        SimpleStream: __webpack_require__(10),
	        Stream: __webpack_require__(8),
	        Observable: __webpack_require__(21),
	        SizeObservable: __webpack_require__(19)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {
	    module.exports = {
	        Easing: __webpack_require__(57)
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
	 *
	 * @license MPL 2.0
	 * @copyright Famous Industries, Inc. 2014
	 */

	/* Modified work copyright © 2015 David Valdman */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, module) {

	    /**
	     * A library of easing curves.
	     *
	     * @example
	     *
	     *      var t = new Transitionable(0);
	     *
	     *      t.set(100, {
	     *          duration : 1000,
	     *          curve : Easing.inQuad
	     *      }
	     *
	     *      transitionable.on('start', function(value){
	     *          console.log(value); // 0
	     *      });
	     *
	     *      transitionable.on('update', function(value){
	     *          console.log(value); // numbers between 0 and 100
	     *      });
	     *
	     *      transitionable.on('end', function(value){
	     *          console.log(value); // 100
	     *      });
	     *
	     * @class Easing
	     * @namespace Transitions
	     * @static
	     */
	    var Easing = {

	        /**
	         * @method inQuad
	         * @static
	         */
	        inQuad: function(t) {
	            return t*t;
	        },

	        /**
	         * @method outQuad
	         * @static
	         */
	        outQuad: function(t) {
	            return -(t-=1)*t+1;
	        },

	        /**
	         * @method inOutQuad
	         * @static
	         */
	        inOutQuad: function(t) {
	            if ((t/=.5) < 1) return .5*t*t;
	            return -.5*((--t)*(t-2) - 1);
	        },

	        /**
	         * @method inCubic
	         * @static
	         */
	        inCubic: function(t) {
	            return t*t*t;
	        },

	        /**
	         * @method outCubic
	         * @static
	         */
	        outCubic: function(t) {
	            return ((--t)*t*t + 1);
	        },

	        /**
	         * @method inOutCubic
	         * @static
	         */
	        inOutCubic: function(t) {
	            if ((t/=.5) < 1) return .5*t*t*t;
	            return .5*((t-=2)*t*t + 2);
	        },

	        /**
	         * @method inQuart
	         * @static
	         */
	        inQuart: function(t) {
	            return t*t*t*t;
	        },

	        /**
	         * @method outQuart
	         * @static
	         */
	        outQuart: function(t) {
	            return -((--t)*t*t*t - 1);
	        },

	        /**
	         * @method inOutQuart
	         * @static
	         */
	        inOutQuart: function(t) {
	            if ((t/=.5) < 1) return .5*t*t*t*t;
	            return -.5 * ((t-=2)*t*t*t - 2);
	        },

	        /**
	         * @method inQuint
	         * @static
	         */
	        inQuint: function(t) {
	            return t*t*t*t*t;
	        },

	        /**
	         * @method outQuint
	         * @static
	         */
	        outQuint: function(t) {
	            return ((--t)*t*t*t*t + 1);
	        },

	        /**
	         * @method inOutQuint
	         * @static
	         */
	        inOutQuint: function(t) {
	            if ((t/=.5) < 1) return .5*t*t*t*t*t;
	            return .5*((t-=2)*t*t*t*t + 2);
	        },

	        /**
	         * @method inSine
	         * @static
	         */
	        inSine: function(t) {
	            return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
	        },

	        /**
	         * @method outSine
	         * @static
	         */
	        outSine: function(t) {
	            return Math.sin(t * (Math.PI/2));
	        },

	        /**
	         * @method inOutSine
	         * @static
	         */
	        inOutSine: function(t) {
	            return -.5*(Math.cos(Math.PI*t) - 1);
	        },

	        /**
	         * @method inExpo
	         * @static
	         */
	        inExpo: function(t) {
	            return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
	        },

	        /**
	         * @method outExpo
	         * @static
	         */
	        outExpo: function(t) {
	            return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
	        },

	        /**
	         * @method inOutExpo
	         * @static
	         */
	        inOutExpo: function(t) {
	            if (t===0) return 0.0;
	            if (t===1.0) return 1.0;
	            if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
	            return .5 * (-Math.pow(2, -10 * --t) + 2);
	        },

	        /**
	         * @method inCirc
	         * @static
	         */
	        inCirc: function(t) {
	            return -(Math.sqrt(1 - t*t) - 1);
	        },

	        /**
	         * @method outCirc
	         * @static
	         */
	        outCirc: function(t) {
	            return Math.sqrt(1 - (--t)*t);
	        },

	        /**
	         * @method inOutCirc
	         * @static
	         */
	        inOutCirc: function(t) {
	            if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
	            return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
	        },

	        /**
	         * @property inElastic
	         * @static
	         */
	        inElastic: function(t) {
	            var s=1.70158;var p=0;var a=1.0;
	            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
	            s = p/(2*Math.PI) * Math.asin(1.0/a);
	            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
	        },

	        /**
	         * @method outElastic
	         * @static
	         */
	        outElastic: function(t) {
	            var s=1.70158;var p=0;var a=1.0;
	            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
	            s = p/(2*Math.PI) * Math.asin(1.0/a);
	            return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
	        },

	        /**
	         * @method inOutElastic
	         * @static
	         */
	        inOutElastic: function(t) {
	            var s=1.70158;var p=0;var a=1.0;
	            if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
	            s = p/(2*Math.PI) * Math.asin(1.0/a);
	            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
	            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
	        },

	        /**
	         * @method inBack
	         * @static
	         */
	        inBack: function(t, s) {
	            if (s === undefined) s = 1.70158;
	            return t*t*((s+1)*t - s);
	        },

	        /**
	         * @method outBack
	         * @static
	         */
	        outBack: function(t, s) {
	            if (s === undefined) s = 1.70158;
	            return ((--t)*t*((s+1)*t + s) + 1);
	        },

	        /**
	         * @method inOutBack
	         * @static
	         */
	        inOutBack: function(t, s) {
	            if (s === undefined) s = 1.70158;
	            if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
	            return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
	        },

	        /**
	         * @method inBounce
	         * @static
	         */
	        inBounce: function(t) {
	            return 1.0 - Easing.outBounce(1.0-t);
	        },

	        /**
	         * @method outBounce
	         * @static
	         */
	        outBounce: function(t) {
	            if (t < (1/2.75)) {
	                return (7.5625*t*t);
	            } else if (t < (2/2.75)) {
	                return (7.5625*(t-=(1.5/2.75))*t + .75);
	            } else if (t < (2.5/2.75)) {
	                return (7.5625*(t-=(2.25/2.75))*t + .9375);
	            } else {
	                return (7.5625*(t-=(2.625/2.75))*t + .984375);
	            }
	        },

	        /**
	         * @method inOutBounce
	         * @static
	         */
	        inOutBounce: function(t) {
	            if (t < .5) return Easing.inBounce(t*2) * .5;
	            return Easing.outBounce(t*2-1.0) * .5 + .5;
	        },

	        /**
	         * @method createCustomCurve
	         * @static
	         */
	        createCustomCurve: function(slope0, slope1) {
	            if (slope0 === undefined) slope0 = 0; // slope at t = 0
	            if (slope1 === undefined) slope1 = 0; // slope at t = 1
	            return function(t) {
	                return slope0*t + (-2*slope0 - slope1 + 3)*t*t + (slope0 + slope1 - 2)*t*t*t;
	            };
	        }
	    };

	    module.exports = Easing;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
;