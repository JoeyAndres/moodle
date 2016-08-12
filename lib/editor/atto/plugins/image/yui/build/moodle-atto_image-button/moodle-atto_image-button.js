YUI.add('moodle-atto_image-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Note: atto-image-helper-* classes are removed.

Y.namespace('M.atto_image');
Y.M.atto_image.imgWrapperTemplate = '<div class="atto-image-wrapper" contenteditable="false"></div>';
Y.M.atto_image.innerImgWrapperTemplate = '<div class="atto-image-inner-wrapper" contenteditable="false"></div>';
Y.M.atto_image.innerImgWrapperCoordinateHelpers =
    '<div class="atto-image-helper-inner-wrapper-coordinate atto_control" contenteditable="false">' +
    '    <div class="yui3-resize-handle yui3-resize-handle-tl"></div>' +
    '    <div class="yui3-resize-handle yui3-resize-handle-tr"></div>' +
    '    <div class="yui3-resize-handle yui3-resize-handle-bl"></div>' +
    '    <div class="yui3-resize-handle yui3-resize-handle-br"></div>' +
    '</div>';
Y.M.atto_image.imageEditableClass = 'atto-image-helper-editable';
Y.M.atto_image.resizeOverlayNodeTemplate = '<div class="atto-image-resize-overlay atto_control {{classes}}"></div>';
Y.M.atto_image.rotateHandleTemplate =
    '<div class="atto-image-rotate-handle-container atto_control atto-image-editable-helper-wrapper" ' +
    '     contenteditable="false">' +
    '    <div class="atto-image-rotate-handle-vertical-line"></div>' +
    '    <div class="atto-image-rotate-handle"></div>' +
    '</div>';
Y.M.atto_image.cropOverlayNodeTemplate =
    '<div class="atto-image-crop-overlay atto_control" contenteditable="false"></div>';
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2015 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * This is where utility functions are placed so they can be modified easily.
 *
 * @module moodle-atto_image-utility
 */

Y.M.atto_image.utility = {
    /**
     * A helper function for parsing string to base 10 and avoiding jsling/shifter complains about having no radix.
     *
     * @param {String|Number} val
     * @returns {Number}
     */
    parseInt10: function(val) {
        return parseInt(val, 10);
    },

    /**
     * A helper function for getting the natural image size prior to any html attributes and css styling.
     *
     * @param {string} src Source of the image.
     * @return {{width: {Number}, height: {Number}}} The object containing width and height.
     */
    getNaturalImageSize: function(src) {
        var img = new Image();
        img.src = src;
        return {width: img.width, height: img.height};
    },

    /**
     * Acquires the DOM node size without the border and margin.
     *
     * @param {Y.Node} node The to acquire size.
     * @return {{width: {Number}, height: {Number}}} Width and height without the border and margin.
     */
    getNodeSize: function(node) {
        var newWidth =
            Y.M.atto_image.utility.parseInt10(node.getComputedStyle("width")) -
            Y.M.atto_image.utility.getHorizontalNonContentWidth(node);
        var newHeight =
            Y.M.atto_image.utility.parseInt10(node.getComputedStyle("height")) -
            Y.M.atto_image.utility.getVerticalNonContentWidth(node);
        return {width: newWidth, height: newHeight};
    },

    /**
     * A helper function for getting the approximate aspect ratio.
     *
     * @param {{width: {Number}, height: {Number}}} size of the image to acquire aspect ratio of.
     * @returns {number} aspect ratio approximation.
     */
    getNaturalImageAspectRatio: function(size) {
        // We need imageSizeMultiplier so that when we divide, we get more precision for our aspect ratio approximation.
        var imageSizeMultiplier = 1000;
        return (size.width * imageSizeMultiplier) / (size.height * imageSizeMultiplier);
    },

    /**
     * @param {Y.Node} node to acquire the total horizontal border.
     * @returns {Number} Total horizontal border in px.
     */
    getHorizontalBorderWidth: function(node) {
        var borderLeftWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-left-width"));
        var borderRightWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-right-width"));
        return borderLeftWidth + borderRightWidth;
    },

    /**
     * @param {Y.Node} node to acquire the total vertical border.
     * @returns {Number} Total vertical border in px.
     */
    getVerticalBorderWidth: function(node) {
        var borderTopWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-top-width"));
        var borderBottomWidth = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("border-bottom-width"));
        return borderTopWidth + borderBottomWidth;

    },

    /**
     * @param {Y.Node} node to acquire the total horizontal padding.
     * @returns {Number} Total horizontal border in px.
     */
    getHorizontalPaddingWidth: function(node) {
        var paddingLeft = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-left"));
        var paddingRight = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-right"));
        return paddingLeft + paddingRight;
    },

    /**
     * @param {Y.Node} node to acquire the total vertical padding.
     * @returns {Number} Total vertical border in px.
     */
    getVerticalPaddingWidth: function(node) {
        var paddingBottom = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-bottom"));
        var paddingTop = Y.M.atto_image.utility.parseInt10(node.getComputedStyle("padding-top"));
        return paddingBottom + paddingTop;
    },

    /**
     * @param {Y.Node} node to acquire the total non-content (border+padding) width .
     * @returns {Number} Total horizontal non-content in px.
     *
     * Note: Margin is not part of this, since by def'n, margin is outside box-model.
     */
    getHorizontalNonContentWidth: function(node) {
        return this.getHorizontalBorderWidth(node) + this.getHorizontalPaddingWidth(node);
    },

    /**
     * @param {Y.Node} node to acquire the total non-content (border+padding) height.
     * @returns {Number} Total vertical non-content in px.
     *
     * Note: Margin is not part of this, since by def'n, margin is outside box-model.
     */
    getVerticalNonContentWidth: function(node) {
        return this.getVerticalBorderWidth(node) + this.getVerticalPaddingWidth(node);
    },

    /**
     * Compares two rangy object if their selection is the same.
     *
     * @param {rangy.Range} rangy1
     * @param {rangy.Range} rangy2
     * @return {boolean} True if the selection they range represents are equal.
     */
    rangyCompare: function(rangy1, rangy2) {
        return (
            (rangy1.startContainer == rangy2.startContainer) &&
            (rangy1.endContainer == rangy2.endContainer) &&
            (rangy1.startOffset == rangy2.startOffset) &&
            (rangy1.endOffset == rangy2.endOffset)
        );
    },

    /**
     * Disable custom contenteditable features on img.
     *
     * @param {Y.Node} editorNode
     */
    disableContentEditable: function(editorNode) {
        editorNode.all('.atto-image-wrapper').each(function(node) {
            node.getDOMNode().setAttribute('contenteditable', false);
        });

        // Disable IE's custom contenteditable features on img.
        editorNode.all('img').each(function(imgNode) {
            imgNode.getDOMNode().setAttribute('unselectable', 'on');
        });
    },

    /**
     * Get the center coordinate of the image.
     * @param {Y.Node} node The node to acquire the center coordinate.
     * @returns {{x: number, y: number}} Center coordinate of the given node.
     */
    getNodeCenterClientCoord: function(node) {
        var nodeClientRect = node.getDOMNode().getBoundingClientRect();
        return {
            x: nodeClientRect.left + nodeClientRect.width / 2,
            y: nodeClientRect.top + nodeClientRect.height / 2
        };
    },

    /**
     * Get's angle between two points.
     *
     * @param {{x: {Number}, y: {Number}}} p1 First coordinate.
     * @param {{x: {Number}, y: {Number}}} p2 Second coordinate.
     * @return {Number} Angle between p1 and p2 in left-hand rule coordinate system.
     */
    get2DAngle: function(p1, p2) {
        var x = p2.x - p1.x;
        var y =  p2.y - p1.y;

        return -(Y.M.atto_image.utility.radToDeg(Math.atan2(x, y)) - 180);
    },

    /**
     * Converts the given deg to rad.
     * @param {Number} deg The deg to convert to radians.
     * @return {Number} rad The converted deg.
     */
    degToRad: function(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Converts the given rad to deg.
     * @param {Number} rad The rad to convert to deg.
     * @return {Number} deg The converted rad.
     */
    radToDeg: function(rad) {
        return rad * (180 / Math.PI);
    },

    /**
     * A robust (handles different browsers) method for rotating the node.
     *
     * @param {Y.Node} node Node to rotate.
     * @param {Number} deg Degrees of rotation.
     */
    rotateNode: function(node, deg) {
        var domNode = node.getDOMNode();

        domNode.style.webkitTransform = 'rotate('+deg+'deg)';
        domNode.style.mozTransform    = 'rotate('+deg+'deg)';
        domNode.style.msTransform     = 'rotate('+deg+'deg)';
        domNode.style.oTransform      = 'rotate('+deg+'deg)';
        domNode.style.transform       = 'rotate('+deg+'deg)';
    },

    /**
     * Acquires the current rotation properties of the given node.
     * @param {Y.Node} node Node to acquire rotation of.
     * @returns {Number} Angle in degrees.
     */
    getRotateNode: function(node) {
        /**
         * @see https://css-tricks.com/get-value-of-css-rotation-through-javascript/
         *
         * @param {DOMNode} el DOMNode to acquire rotation of.
         * @returns {number} Angle in degrees.
         */
        function rotateDegree(el) {
            var st = window.getComputedStyle(el, null);
            var tr = st.getPropertyValue("-webkit-transform") ||
                st.getPropertyValue("-moz-transform") ||
                st.getPropertyValue("-ms-transform") ||
                st.getPropertyValue("-o-transform") ||
                st.getPropertyValue("transform") ||
                "none";

            if (tr == "none") {
                return 0;
            }

            // With rotate(30deg)...
            // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)

            // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

            var values = tr.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];

            var angle = Math.atan2(b, a) * (180/Math.PI);

            if (angle < 0) {
                angle += 360;
            }

            return angle;
        }

        return rotateDegree(node.getDOMNode());
    },

    /**
     * @see http://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
     * @param coordinate LH-coordinate point to rotate.
     * @param angle LH-coordinate angle.
     * @returns {*[]}
     */
    rotate: function(coordinate, angle) {
        angle = -angle;  // Convert to LH-coordinate angle.
        var radians = Y.M.atto_image.utility.degToRad(angle),
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            // Rotation matrix.
            nx = (cos * coordinate.x) + (sin * coordinate.y),
            ny = (cos * coordinate.y) - (sin * coordinate.x);
        return {x: nx, y: ny};
    },

    /**
     *
     * @param {{x: Number, y: Number}} coord Coordinate to normalize.
     * @param {{x: Number, y: Number}} origin Origin coordinate to normalize coord on.
     * @returns {{x: number, y: number}} The normalized coord.
     */
    normalizeCoordinate: function(coord, origin) {
        return {
            x: coord.x - origin.x,
            y: coord.y - origin.y
        };
    }
};// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * MutationObserver is cool and all, but there are limits. For instance, we can't
 * watch the Y.Node itself, but only its children. Since watching the node AND node's children
 * is a common pattern for resize/crop/rotate, this module is built.
 *
 *     var crazyNode = Y.one('#foo');
 *     var options = {
 *       node: crazyNode,
 *       deletionCallback: function(removedNodes) {
 *         console.log('crazyNode or it's children have been deleted.');
 *       },
 *
 *       // Usual MutationObserver arguments from down here.
 *       childList: true,  // True by default. Ovverride to false if you want.
 *       subtree: true  // True by default. Override to false if you want.
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.DeleteMutationObserver
 */
Y.M.atto_image.DeleteMutationObserver = function() {
    Y.M.atto_image.DeleteMutationObserver.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.DeleteMutationObserver, Y.Base, {
    /**
     * The node being watched.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * The mutation observer that observe's this.node's mutation.
     *
     * @property _mutationObserver
     * @type {null|MutationObserver}
     * @default null
     * @private
     */
    _mutationObserver: null,

    /**
     * The mutation observer that observe's this.node's children's mutation.
     *
     * @property _childrenMutationObserver
     * @type {null|MutationObserver}
     * @default null
     * @private
     */
    _childrenMutationObserver: null,

    /**
     * @property _mutationObserverConfig
     * @type {Object}
     * @default {childList: true, subtree: true}
     * @private
     */
    _mutationObserverConfig: {childList: true, subtree: true},

    /**
     * @property _deletionCallback
     * @type {Function|null}
     * @default null
     * @private
     */
    _deletionCallback: null,

    /**
     * When a div with many children is deleted, multiple calls to _deletionCallback might be called. What if
     * the developer calls Y.M.atto_image.DeletionMutationObserver.stop() in first callback?
     * The remaining _deletionCallback (for other deleted DOM elements) are still going to be called.
     * To avoid this, this.stop() will set this._start flag to false thus avoiding further calls to _deletionCallback.
     *
     * @property _start
     * @type {Boolean}
     * @default false
     * @private
     */
    _start: false,

    initializer: function(cfg) {
        this.node = cfg.node;
        this._deletionCallback = cfg.deletionCallback;

        delete cfg.node;
        delete cfg.deletionCallback;
        // @see http://yuilibrary.com/yui/docs/api/classes/YUI.html#method_merge
        // "The properties from later objects will overwrite those in earlier objects."
        this._mutationObserverConfig = Y.merge(this._mutationObserverConfig, cfg);

    },

    destructor: function() {
        this.detachAll();
        this.stop();
    },

    /**
     * Starts the MutationObserver instances.
     */
    start: function() {
        this._start = true;

        this._childrenMutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !this.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.DeleteMutationObserver.node
            if (nodeNotSet) {
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred && this._start) {
                    if (this._deletionCallback) {
                        this._deletionCallback(mutation.removedNodes);
                    }
                }
            });
        }.bind(this));
        this._childrenMutationObserver.observe(this.node.getDOMNode(), this._mutationObserverConfig);

        this._mutationObserver = new MutationObserver(function(mutations) {
            var nodeNotSet = !this.node;

            // For now, to reduce error, just throw a debug warning when node not set so we reduce error rate. Wait
            // until developer sets the Y.M.atto_image.DeleteMutationObserver.node
            if (nodeNotSet) {
                return;
            }

            mutations.forEach(function(mutation) {
                var deletionOccurred = mutation.removedNodes.length > 0;
                if (deletionOccurred && this._start) {
                    if ([].indexOf.call(mutation.removedNodes, this.node.getDOMNode()) >= 0) {
                        if (this._deletionCallback) {
                            this._deletionCallback(mutation.removedNodes);
                        }
                    }
                }
            });
        }.bind(this));
        this._mutationObserver.observe(this.node.ancestor().getDOMNode(), this._mutationObserverConfig);
    },

    /**
     * Stops MutationObserver instances.
     */
    stop: function() {
        this._start = false;

        if (this._mutationObserver) {
            this._mutationObserver.disconnect();
            this._mutationObserver = null;
        }

        if (this._childrenMutationObserver) {
            this._childrenMutationObserver.disconnect();
            this._childrenMutationObserver = null;
        }
    }
}, {
    NAME: 'atto_image_DeleteMutationObserver',

    /**
     * See if DeleteMutationObserver is supported.
     *
     * @return {Boolean} true if supported in browser, false otherwise.
     */
    isSupported: function() {
        var supported = Y.Lang.isObject(window.MutationObserver);
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// Copied from Y.Resize.
var T = 't',
    TR = 'tr',
    R = 'r',
    BR = 'br',
    B = 'b',
    BL = 'bl',
    L = 'l',
    TL = 'tl';

/**
 * Encapsulate the editable image.
 * This is aggregated by editable classes, e.g. Y.M.atto_image.resizable.
 *
 * @class Y.M.atto_image.EditableImg
 */
Y.M.atto_image.EditableImg = function() {
    Y.M.atto_image.EditableImg.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.EditableImg, Y.Base, {
    /**
     * The DOM element to be edited, more specifically, img.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * The editor instance where the editable img is located.
     *
     * @property host
     * @type {null|Y.M.atto_editor}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    host: null,

    /**
     * Disabled by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * The DeleteMutationObserver for self.node
     *
     * @property _nodeDeletionMutationObserver
     * @type {null|Y.M.atto_image.DeleteMutationObserver}
     * @default null
     * @private
     */
    _nodeDeletionMutationObserver: null,

    /**
     * The orientation. e.g. R if right side is top.
     *
     * @property _orientation
     * @type {string}
     * @default null
     * @private
     */
    _orientation: T,

    innerNodeWrapper: null,

    /**
     * Represents .atto-image-wrapper that wraps the node.
     *
     * @property nodeWrapper
     * @type {null|Y.Node}
     * @default null
     */
    nodeWrapper: null,

    initializer: function(cfg) {
        this.node = cfg.node;

        this.nodeWrapper = this.node.ancestor('.atto-image-wrapper');
        this.innerNodeWrapper = this.node.ancestor('.atto-image-inner-wrapper');
        if (!this.nodeWrapper || !this.innerNodeWrapper) {
            this.node.wrap(Y.M.atto_image.innerImgWrapperTemplate);
            this.innerNodeWrapper = this.node.ancestor('.atto-image-inner-wrapper');
            this.innerNodeWrapper.wrap(Y.M.atto_image.imgWrapperTemplate);
            this.nodeWrapper = this.node.ancestor('.atto-image-wrapper');

            // First time setup to atto-image-inner-wrapper, that is copy width/height data from img.
            this.innerNodeWrapper.setStyles(this.getOriginalImgSize());
        }

        this.innerImgWrapperCoordinateHelpers = Y.Node.create(Y.M.atto_image.innerImgWrapperCoordinateHelpers);
        this.innerNodeWrapper.appendChild(this.innerImgWrapperCoordinateHelpers);

        this.host = cfg.host;

        this.enable();

        this._publishEvents();

    },

    destructor: function() {
        this.innerImgWrapperCoordinateHelpers.remove(true);

        this.detachAll();
        this.disable();
    },

    /**
     * Create the EditableImg.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._setupImgWrapper();
        this._setupImgNode();
        this.startDeleteMutationObserver();

        this._enable = true;

    },

    /**
     * Destroys the EditableImg.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.node.detachAll();
        this.innerNodeWrapper.detachAll();
        this.nodeWrapper.detachAll();

        this.stopDeleteMutationObserver();
        this._destroyImgNode();
        this._destroyImgWrapper();

        this._enable = false;

    },

    /**
     * Starts watching node deletion if not already. Note we don't watch nodeWrapper, since deleting
     * nodeWrapper, delete's everything.
     */
    startDeleteMutationObserver: function() {
        if (!this._nodeDeletionMutationObserver) {
            this._nodeDeletionMutationObserver = new Y.M.atto_image.DeleteMutationObserver({
                node: this.node,
                deletionCallback: this._onDelete.bind(this)
            });
            this._nodeDeletionMutationObserver.start();
        }
    },

    /**
     * Stops watching nodeWrapper (and its children) for deletion.
     */
    stopDeleteMutationObserver: function() {
        // Ensure to disable all MutationObservers first since we will be deleting those node.
        // We will be calling deletionCallback which we don't want. What if we just want to disable
        // the resizable and not call this.deleteNode().
        if (this._nodeDeletionMutationObserver) {
            this._nodeDeletionMutationObserver.stop();
            this._nodeDeletionMutationObserver = null;
        }
    },

    /**
     * The node being edited.
     * @return {Y.Node} this.node The node being edited.
     */
    getNode: function() {
        return this.node;
    },

    getImgWrapperXY: function() {
        return this.innerImgWrapperCoordinateHelpers.one('.yui3-resize-handle-tl').getXY();
    },

    /**
     * The container of the node.
     * @return {Y.Node} Return the nodeWrapper.
     */
    getImgWrapper: function() {
        return this.nodeWrapper;
    },

    getOrientation: function() {
        return this._orientation;
    },

    getOriginalImgSize: function() {
        return {
            width: this.node.getAttribute('width'),
            height: this.node.getAttribute('height')
        };
    },

    setOriginalImgSize: function(size) {
        this.node.setAttrs({
            width: size.width,
            height: size.height
        });
    },

    getOriginalImgOffset: function() {
        return {
            left: parseFloat(this.node.getStyle('left')),
            top: parseFloat(this.node.getStyle('top'))
        };
    },

    setOriginalImgOffset: function(offset) {
        this.node.setStyles({
            left: offset.left + 'px',
            top: offset.top + 'px'
        });
    },

    getImgSize: function() {
        return {
            width: parseFloat(this.innerNodeWrapper.getStyle('width')),
            height: parseFloat(this.innerNodeWrapper.getStyle('height'))
        };
    },

    /**
     * Sets the size of the img.
     * @param {{width: {Number}, height: {Number}}} size New size of the image.
     */
    setSize: function(size) {
        var oldSize = this.getImgSize();

        var oldSizeRatio = {
            width: size.width / oldSize.width,
            height: size.height / oldSize.height
        };

        this.innerNodeWrapper.setStyles({
            width: size.width,
            height: size.height
        });

        // Since nodeWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeWrapper.setStyles({
            width: size.width,
            height: size.height
        });

        var oldOriginalSize = this.getOriginalImgSize();

        var newOriginalSize = {
            width: oldSizeRatio.width * oldOriginalSize.width,
            height: oldSizeRatio.height * oldOriginalSize.height
        };

        this.setOriginalImgSize(newOriginalSize);

        var oldOriginalOffset = this.getOriginalImgOffset();

        var newOriginalOffset = {
            left: oldSizeRatio.width * oldOriginalOffset.left,
            top: oldSizeRatio.height * oldOriginalOffset.top
        };

        this.setOriginalImgOffset(newOriginalOffset);

        this.fire('transform');
    },

    /**
     * Gets the current angle of the image.
     * @returns {Number} The current angle of the image.
     */
    getRotation: function() {
        return Y.M.atto_image.utility.getRotateNode(this.innerNodeWrapper);
    },

    /**
     * Rotates the image with the given angle.
     * @param {Number} angle Angle to rotate the image.
     */
    setRotation: function(angle) {
        Y.M.atto_image.utility.rotateNode(this.innerNodeWrapper, angle);
        this.nodeWrapper.get('children').each(function(node) {
            if (node.hasClass('atto_control')) {
                Y.M.atto_image.utility.rotateNode(node, angle);
            }
        });
        this._updateOrientation();
        this.fire('transform');
    },

    /**
     * Call this when done with transformation. It re-centers the image with respect to the current rotation and size so
     * that it respects the DOM elements around.
     */
    recalculateImgWrapper: function() {
        var nodeRect = this.innerNodeWrapper.getDOMNode().getBoundingClientRect();
        this._updateOrientation();

        this.nodeWrapper.setStyles({
            width: nodeRect.width,
            height: nodeRect.height
        });

        this._removeOrientationClasses(this.nodeWrapper);
        this.nodeWrapper.addClass('atto-image-helper-orientation-' + this._orientation);

        this.nodeWrapper.get('children').each(function(node) {
            node.setStyles({
                left: (nodeRect.width - this.getImgSize().width) / 2,
                top: (nodeRect.height - this.getImgSize().height) / 2
            });
        }, this);

        this.fire('recalculated');
        this.select();
    },

    /**
     * Select the editable image.
     */
    select: function() {
        // Keep selection when done recalculating. These way we can always delete or copy it.
        window.rangy.getSelection().removeAllRanges();  // Deselect all selection.
        var selection = this.getSelection();
        this.host.setSelection(selection);  // Set selection (window.rangy).
    },

    /**
     * Gets the editable image selection (including the wrapper).
     * @returns {[rangy.Range]}
     */
    getSelection: function() {
        var selection = null;
        var isFirefox = Y.UA.gecko > 0;
        if (isFirefox) {
            /*
             * A bug when selecting things in firefox,
             * @see http://stackoverflow.com/questions/11432933/how-to-select-a-node-in-a-range-with-webkit-browsers
             *
             * This is amended by adding dummy span before and after the object.
             *
             * Note: If this is done in chrome, the span won't be selected, thus we only do this for firefox. If
             *       span are selected, the paste handler can clean them up since they have atto_control class.
             */
            this.nodeWrapper.insert('<span class="atto_control">', 'before');
            this.nodeWrapper.insert('<span class="atto_control">', 'after');
            var newSelectionRange = window.rangy.createRange();
            newSelectionRange.setStartBefore(this.nodeWrapper.getDOMNode());
            newSelectionRange.setEndAfter(this.nodeWrapper.getDOMNode());
            newSelectionRange.setStart(newSelectionRange.startContainer, newSelectionRange.startOffset - 1);
            newSelectionRange.setEnd(newSelectionRange.endContainer, newSelectionRange.endOffset + 1);

            selection = [newSelectionRange];
        } else {
            selection = this.host.getSelectionFromNode(this.nodeWrapper);
        }

        return selection;
    },

    /**
     * Adds a control node that aids the editing of the imae. e.g. for Y.M.atto_image.resizable,
     * control node with the be the Y.M.atto_image.resizable._resizeOverlayNode.
     *
     * To make controls disappear during save/autosave or paste, atto_control class is attached to them.
     *
     * @param {Y.Node} controlNode The node that aids the editing of the image.
     */
    addControl: function(controlNode) {
        controlNode.addClass('atto_control');
        Y.M.atto_image.utility.rotateNode(controlNode, this.getRotation());
        this.nodeWrapper.appendChild(controlNode);
    },

    /**
     * Publish events for Y.M.atto_image.resizable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event click Fired when at least one of the nodes inside image wrapper div is clicked.
         *              (Or resize obj is clicked).
         */
        this.publish('click', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event dblclick Fired when at least one of the nodes inside image wrapper is double clicked.
         */
        this.publish('dblclick', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event init Fired once at the beginning.
         */
        this.publish('init', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event delete Fired once the node (image) or any EditableImg items is deleted.
         */
        this.publish('delete', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);


        /**
         * @event transform Fired while transforming, e.g. translate, rotate, resize, crop, ...
         */
        this.publish('transform', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event recalculated Must be fired every time this.recalculateImgWrapper is called.
         */
        this.publish('recalculated', {
            prefix: Y.M.atto_image.EditableImg.NAME,
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * Setup this.node for editing.
     * @private
     */
    _setupImgNode: function() {
    },

    /**
     * Destroys the stuff from @see this._setupImgNode
     * @private
     */
    _destroyImgNode: function() {
        this.node.detachAll();
    },

    /**
     * Apply styling specific for editable images. These are gotten rid of after save.
     * @see clean.js of atto
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    _enableImageEditable: function(node) {
        node.addClass(Y.M.atto_image.imageEditableClass);
    },

    /**
     * @see enableImageEditable, this is simply the opposite.
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    _disableImageEditable: function(node) {
        node.removeClass(Y.M.atto_image.imageEditableClass);
    },

    /**
     * Setup the nodeWrapper styles/attribute if not yet setup.
     * @private
     */
    _setupImgWrapper: function() {
        if (!this.nodeWrapper) {
            return;
        }

        // Do this so we can delete the image.
        this.nodeWrapper.setAttribute('contenteditable', true);

        // Since nodeWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeWrapper.setStyles(this.getImgSize());

        // Setup event handlers.
        // Bubble up the click event from container to this resizable object.
        this.nodeWrapper.on("click", this._onClick, this);
        this.nodeWrapper.on("dblclick", this._onDblClick, this);

        // Bubble up the click event from container's children to this resizable object.
        // Note: For some reason resizing does not call click event, thus no worries when those handles are selected
        //       for dragging.
        this.nodeWrapper.get("children").each(function(child) {
            child.on('click', this._onClick, this);
        }, this);
        this.nodeWrapper.get("children").each(function(child) {
            child.on('dblclick', this._onDblClick, this);
        }, this);

        /**
         * Resize container contains many components. If we are dragging something, many things
         * to consider what we might be dragging around. A node that is dragged out of container also becomes
         * it's own node, thus when Y.M.atto_image.resizable.disable is called, those node are left lying
         * around. Solution is just disallow dragging.
         */
        this.nodeWrapper.before('dragstart', function(e) {
            e.halt(true);
        }, this);

        this._enableImageEditable(this.nodeWrapper);
    },

    /**
     * Does not really "destroy" this.nodeWrapper, but rather disassemble the setup that should only exist while
     * editing.
     * @private
     */
    _destroyImgWrapper: function() {
        if (!this.nodeWrapper) {
            return;
        }

        this._disableImageEditable(this.nodeWrapper);
        this._removeOrientationClasses(this.nodeWrapper);

        this.nodeWrapper.detachAll();

        // Done editing the image at this point. To ensure user can't enter text, set this to contenteditable=false.
        this.nodeWrapper.setAttribute('contenteditable', false);
    },

    /**
     * Event handler for click event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        this.fire('click', e);
        this.select();
    },

    /**
     * Event handler for dblclick event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire('dblclick', e);
        this.select();
    },

    /**
     * Event handler for delete event.
     *
     * @param {NodeList} nodes Node(s) that got deleted.
     * @private
     */
    _onDelete: function() {
        this.disable();

        // Delete everything.
        this.nodeWrapper.remove(true);

        this.fire('delete');
    },

    /**
     * Updates this._orientation
     * @private
     */
    _updateOrientation: function() {
        var imgAngle = this.getRotation();

        var tIsTop = imgAngle >= 330 && imgAngle <= 360 || imgAngle >= 0 && imgAngle < 30;
        var tlIsTop = imgAngle >= 30 && imgAngle < 60;
        var lIsTop = imgAngle >= 60 && imgAngle < 120;
        var blIsTop = imgAngle >= 120 && imgAngle < 150;
        var bIsTop = imgAngle >= 150 && imgAngle < 210;
        var brIsTop = imgAngle >= 210 && imgAngle < 240;
        var rIsTop = imgAngle >= 240 && imgAngle < 300;
        var trIsTop = imgAngle >= 300 && imgAngle < 330;

        if (tIsTop) {
            this._orientation = T;
        } else if(tlIsTop) {
            this._orientation = TL;
        } else if(rIsTop) {
            this._orientation = R;
        } else if(blIsTop) {
            this._orientation = BL;
        } else if(bIsTop) {
            this._orientation = B;
        } else if(brIsTop) {
            this._orientation = BR;
        } else if(lIsTop) {
            this._orientation = L;
        } else if(trIsTop) {
            this._orientation = TR;
        }

    },

    /**
     * Remove all orientation classes.
     * @param {Y.Node} node To remove all atto-image-helper-orientation-*
     * @private
     */
    _removeOrientationClasses: function(node) {
        node.removeClass('atto-image-helper-orientation-t');
        node.removeClass('atto-image-helper-orientation-tl');
        node.removeClass('atto-image-helper-orientation-r');
        node.removeClass('atto-image-helper-orientation-bl');
        node.removeClass('atto-image-helper-orientation-b');
        node.removeClass('atto-image-helper-orientation-br');
        node.removeClass('atto-image-helper-orientation-l');
        node.removeClass('atto-image-helper-orientation-tr');
    }
}, {
    NAME: 'atto_image_EditableImg',

    /**
     * Function to check if Y.M.atto_image.resizable is supported.
     *
     * @return {Boolean} true if Y.M.atto_image.resizable is supported, otherwise false.
     */
    isSupported: function() {
        var supported = Y.M.atto_image.DeleteMutationObserver.isSupported();
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds image resizing capability. Suppose you have an img DOM node with id='foo-img', to
 * resize the img:
 *
 *     var options = {
 *       node: Y.one('img#foo-img')
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.resizable
 */
Y.M.atto_image.resizable = function() {
    Y.M.atto_image.resizable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.resizable, Y.Base, {
    /**
     * The DOM element to resize, more specifically, img.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * Represents the EditableImg, the thing where we suspend the resize handles and the thing
     * that user can see while in img editing mode.
     *
     * @property _editableImg
     * @type {null|Y.M.atto_image.EditableImg}
     * @private
     */
    _editableImg: null,

    /**
     * Keeps track of the Y.Overlay object during resizing. Null when not resizing (this._enable is false).
     *
     * @property _resizableOverlay
     * @type {null|Y.Overlay}
     * @default null
     * @private
     */
    _resizableOverlay: null,

    /**
     * _resizableOverlayNode as opposed to _resizableOverlay, is the DOM object _resizableOverlay will be dealing with.
     *
     * @property _resizableOverlayNode
     * @type {null|Y.Node}
     * @default null
     * @private
     */
    _resizableOverlayNode: null,

    /**
     * False by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * @property preserveAspectRatio
     * @type {Boolean}
     * @default false
     * @public
     */
    preserveAspectRatio: false,

    initializer: function(cfg) {
        this._editableImg = cfg.editableImg;
        this.node = this._editableImg.node;

        if (!Y.Lang.isUndefined(cfg.preserveAspectRatio)) {
            this.preserveAspectRatio = cfg.preserveAspectRatio;
        }

        this.enable();
        this._publishEvents();

    },

    destructor: function() {
        this.disable();
    },

    /**
     * Call to build the resizing scaffolding.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        // If this._editableImg is click/dblclick, we pass the event here.
        this._editableImg.on('click', this._onClick.bind(this));
        this._editableImg.on('dblclick', this._onDblClick.bind(this));

        this._resizableOverlayNode = this._createResizeOverlayNode();
        this._editableImg.addControl(this._resizableOverlayNode, false);

        // We don't want this._editableImg.addControl rotating this since this will be wrapped by Y.Overlay, and
        // Y.Overlay don't like rotated children (twisted children).
        Y.M.atto_image.utility.rotateNode(this._resizableOverlayNode, 0);

        this._resizableOverlay = this._createResizeOverlay(this._resizableOverlayNode, this._editableImg.innerNodeWrapper);

        Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), this._editableImg.getRotation());

        // Align again since rotation might have misalign this._resizeOverlay to the image.
        this._resizableOverlay.align();

        this._editableImg.on(['recalculated', 'transform'], this._onEditableImgRecalculated, this);

        this._enable = true;
    },

    /**
     * Call to take down the resizing scaffolding.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.detachAll();

        // Garbage collection, in reverse order. Note some operations are redundant, but I want order.

        if (this._resizableOverlay) {
            this._resizableOverlay.destroy(true);
            this._resizableOverlay = null;
        }

        if (this._resizableOverlayNode) {
            this._resizableOverlayNode.remove(true);
            this._resizableOverlayNode = null;
        }

        this._enable = false;
    },

    /**
     * Get the node being resized.
     * @return {Y.Node} this.node The node being resized.
     */
    getNode: function() {
        return this.node;
    },

    /**
     * Get nodeWrapper.
     *
     * @returns {null|Y.Node} The container for auxiliary Y.Node, which contains resize handles.
     */
    getImgWrapper: function() {
        return this._editableImg.getImgWrapper();
    },

    /**
     * Publish events for Y.M.atto_image.resizable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish('click', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event dblclick Fired when at least one of the nodes inside resize div is double clicked.
         */
        this.publish('dblclick', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event resize:start Fired before resizing.
         */
        this.publish('resize:start', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event resize:resize Fired during resizing.
         */
        this.publish('resize:resize', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event resize:end Fired after resizing.
         */
        this.publish('resize:end', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish('init', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event delete Fired once the node (image) or any auxiliary resizing items is deleted.
         */
        this.publish('delete', {
            prefix: Y.M.atto_image.resizable.NAME,
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * @see this._resizeOverlayNode
     *
     * @returns {Y.Node}
     * @private
     */
    _createResizeOverlayNode: function() {
        var resizableOverlayTemplate = Y.Handlebars.compile(Y.M.atto_image.resizeOverlayNodeTemplate);
        return Y.Node.create(resizableOverlayTemplate({classes: ''}));
    },

    /**
     * @see this._resizeOverlay
     *
     * @param {Y.Node} resizableOverlayNode A div that will be manipulated by Y.Overlay.
     * @param {Y.Node} nodeToOverlay The node (img in our case) that will be placed inside resizableOverlayNode.
     * @returns {Y.Overlay}
     * @private
     */
    _createResizeOverlay: function(resizableOverlayNode, nodeToOverlay) {
        var resizableOverlay = new Y.Overlay({
            srcNode: resizableOverlayNode,

            visible: true,
            render: true,

            // Place overlay on top of each other.
            align: {node: nodeToOverlay, points: ["tl", "tl"]}
        });
        this._setResizeOverlaySize(resizableOverlay);
        resizableOverlay.plug(Y.Plugin.Resize, {
            handles: ['t', 'r', 'b', 'l', 'tr', 'tl', 'br', 'bl']
        });
        resizableOverlay.resize.plug(Y.Plugin.ResizeConstrained, {
            // todo: get rid of this and have this set dynamically. cp google docs.
            preserveRatio: this.preserveAspectRatio
        }, this);

        // Setup resize event handlers.
        resizableOverlay.resize.on('resize:start', this._onResizeStart, this);
        resizableOverlay.resize.on('resize:resize', this._onResize, this);
        resizableOverlay.resize.on('drag:end', this._onResizeEnd, this);

        // So that the overlay is deleted when saving.
        resizableOverlay.get("boundingBox").addClass('atto_control');
        resizableOverlay.get("boundingBox").addClass('atto-image-editable-helper-wrapper');
        resizableOverlay.get("boundingBox").addClass('atto-image-resize-overlay-wrapper');
        resizableOverlay.get("boundingBox").setAttribute('contenteditable', false);

        return resizableOverlay;
    },

    /**
     * Event handler for resizing start.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResizeStart: function(e) {
        this.fire('resize:start', e);

    },

    /**
     * Event handler for resizing.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResize: function(e) {
        this._resizableOverlay.align();

        // To copy google docs like resizing, only allow the Y.Overlay to show the preview, don't resize
        // this._editableImg.

        this.fire('resize:resize', e);
    },

    /**
     * Event handler for resizing end.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResizeEnd: function(e) {
        this._resizableOverlay.align();

        this._editableImg.setSize(this._getResizeOverlaySize());

        // Note: this will in turn call _onEditableImgRecalculated
        this._editableImg.recalculateImgWrapper();

        this.fire(Y.M.atto_image.resizable.NAME + ':resize:end', e);
    },

    /**
     * Event handler for click event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        this.fire('click', e);
    },

    /**
     * Event handler for dblclick event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire('dblclick', e);
    },

    /**
     * Resizable's handler when  this._editableImg recalculated properties after transformation.
     * @param {Y.EventFacade} e EventFacade for when this._editableImg recalculated properties after transformation.
     * @private
     */
    _onEditableImgRecalculated: function() {
        // Don'd call this callback when disabled.
        if (!this._enable) {
            return;
        }

        var imgAngle = this._editableImg.getRotation();
        var orientation = this._editableImg.getOrientation();

        // Default: orientation == TL || orientation == TR || orientation == T
        if(orientation == R) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 90);
        } else if(orientation == B || orientation == BR || orientation == BL) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 180);
        } else if(orientation == L) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 270);
        }

        this._setResizeOverlaySize();
        this._resizableOverlay.align();
    },

    /**
     * Gets the size of the resizeOverlay,j factoring orientation.
     * @returns {{width: Number, height: Number}}
     * @private
     */
    _getResizeOverlaySize: function() {
        var newWidth = this._resizableOverlay.resize.info.offsetWidth;
        var newHeight = this._resizableOverlay.resize.info.offsetHeight;
        var sizeAttrs = {width: newWidth, height: newHeight};
        var orientation = this._editableImg.getOrientation();
        if (orientation == L || orientation == R) {
            sizeAttrs = {width: newHeight, height: newWidth};
        }
        return sizeAttrs;
    },

    /**
     * Set the size of the overlay from node (image), factoring orientation.
     * @param {undefined|Y.Overlay} resizableOverlay
     * @private
     */
    _setResizeOverlaySize: function(resizableOverlay) {
        resizableOverlay = resizableOverlay || this._resizableOverlay;

        /*
         * Since overlay always point up (as much as possible), if top is left/right in which overlay is almost
         * perpendicular to img, swap width/height so they still over each other exactly.
         */
        var sizeAttrs = this._editableImg.getImgSize();
        var orientation = this._editableImg.getOrientation();
        if (orientation == L || orientation == R) {
            sizeAttrs = {width: this._editableImg.getImgSize().height, height: this._editableImg.getImgSize().width};
        }
        resizableOverlay.get('boundingBox').setStyles(sizeAttrs);
    }
}, {
    NAME: 'atto_image_resizable',

    /**
     * Function to check if Y.M.atto_image.resizable is supported.
     *
     * @return {Boolean} true if Y.M.atto_image.resizable is supported, otherwise false.
     */
    isSupported: function() {
        var supported =
            Y.M.atto_image.DeleteMutationObserver.isSupported() &&
            Y.M.atto_image.EditableImg.isSupported();
        return supported;
    }
});// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds image rotating capability. Suppose you have an img DOM node with id='foo-img', to
 * rotate the img:
 *
 *     var options = {
 *       node: Y.one('img#foo-img')
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.rotatable
 */
Y.M.atto_image.rotatable = function() {
    Y.M.atto_image.rotatable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.rotatable, Y.Base, {
    /**
     * The DOM element to resize, more specifically, img.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * Represents the EditableImg, the thing where we suspend the resize handles and the thing
     * that user can see while in img editing mode.
     *
     * @property _editableImg
     * @type {null|Y.M.atto_image.EditableImg}
     * @private
     */
    _editableImg: null,

    /**
     * False by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    /**
     * The container for the rotation handle.
     *
     * @property _rotateControlNode
     * @type {null|Y.Node}
     * @default null
     * @privte
     */
    _rotateControlNode: null,

    /**
     * The container for the rotation handle node. The thing that is grabbed to
     * rotate the image.
     *
     * @property _rotateControlHandleNode
     * @type {null|Y.Node}
     * @default null
     * @privte
     */
    _rotateControlHandleNode: null,

    initializer: function(cfg) {
        this._editableImg = cfg.editableImg;
        this.node = this._editableImg.node;

        this.enable();
        this._publishEvents();

    },

    destructor: function() {
        this.detachAll();
        this.disable();
    },

    /**
     * Call to build the rotate scaffolding.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._rotateControlNode = Y.Node.create(Y.M.atto_image.rotateHandleTemplate);
        this._rotateControlHandleNode = this._rotateControlNode.one('.atto-image-rotate-handle');
        this._rotateControlNode.addClass('atto-image-editable-helper-wrapper');

        var rotating = false;
        this._rotateControlHandleNode.on(['mousedown'], function(e) {
            rotating = true;
            this._onRotateStart(e);
        }, this);
        this._rotateControlHandleNode.on(['mousemove', 'mousemoveoutside'], function(e) {
            if (rotating) {
                this._onRotate(e);
            }
        }, this);
        this._rotateControlHandleNode.on(['mouseup', 'mouseupoutside'], function(e) {
            if (rotating) {
                this._onRotateEnd(e);
            }
            rotating = false;
        }, this);

        this._editableImg.addControl(this._rotateControlNode);

        // If this._editableImg is click/dblclick, we pass the event here.
        this._editableImg.on('click', this._onClick.bind(this));
        this._editableImg.on('dblclick', this._onDblClick.bind(this));
        this._editableImg.on('recalculated', this._onEditableImgRecalculated, this);

        this._enable = true;
    },

    /**
     * Call to take down the rotate scaffolding.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        if (this._rotateControlHandleNode) {
            this._rotateControlHandleNode.remove(true);
            this._rotateControlHandleNode = null;
        }

        if (this._rotateControlNode) {
            this._rotateControlNode.remove(true);
            this._rotateControlNode = null;
        }

        this._enable = false;
    },

    /**
     * Publish events for Y.M.atto_image.rotatable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish('click', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event dblclick Fired when at least one of the nodes inside resize div is double clicked.
         */
        this.publish('dblclick', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event rotate:start Fired before rotating.
         */
        this.publish('rotate:start', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event rotate:rotate Fired during rotate.
         */
        this.publish('rotate:rotate', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event rotate:end Fired after rotate.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':rotate:end', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish('init', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event delete Fired once the node (image) or any auxiliary resizing items is deleted.
         */
        this.publish('delete', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2,  // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    /**
     * Event handler for click event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        this.fire('click', e);
    },

    /**
     * Event handler for dblclick event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire('dblclick', e);
    },

    /**
     * atto_image_rotatable:rotate:start handler.
     *
     * @param {Y.EventFacade} e EventFacade for when rotate start.
     * @private
     */
    _onRotateStart: function() {
        this.fire('rotate:start');
    },

    /**
     * atto_image_rotatable:rotate:rotate handler.
     *
     * @param {Y.EventFacade} e EventFacade for when rotating.
     * @private
     */
    _onRotate: function(e) {
        var mouseCoord = {x: e.clientX, y: e.clientY};
        var imgCenterCoord = Y.M.atto_image.utility.getNodeCenterClientCoord(
            this._editableImg.innerNodeWrapper
        );

        var mouseAngle = Y.M.atto_image.utility.get2DAngle(imgCenterCoord, mouseCoord);

        this._editableImg.setRotation(mouseAngle);

        this.fire('rotate:rotate');
    },

    /**
     * atto_image_rotatable:rotate:rotate handler.
     *
     * @param {Y.EventFacade} e EventFacade for when rotate ends.
     * @private
     */
    _onRotateEnd: function() {
        this._editableImg.recalculateImgWrapper();
        this.fire('rotate:end');
    },

    /**
     * Rotatable's handler when  this._editableImg recalculated properties after transformation.
     * @param {Y.EventFacade} e EventFacade for when this._editableImg recalculated properties after transformation.
     * @private
     */
    _onEditableImgRecalculated: function() {
        // Don'd call this callback when disabled.
        if (!this._enable) {
            return;
        }

        this._rotateControlNode.setStyles(this._editableImg.getImgSize());
    }
}, {
    NAME: 'atto_image_rotatable'
});// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Adds image cropping capability. Suppose you have an img DOM node with id='foo-img', to
 * crop the img:
 *
 *     var options = {
 *       node: Y.one('img#foo-img')
 *     };
 *     var croppable = new Y.M.atto_image.croppable(node);
 *
 * @class Y.M.atto_image.croppable
 */
Y.M.atto_image.croppable = function() {
    Y.M.atto_image.croppable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.croppable, Y.Base, {
    /**
     * The DOM element to crop, more specifically, img.
     *
     * @property node
     * @type {null|Y.Node}
     * @required
     * @default null
     * @writeOnce
     * @public
     */
    node: null,

    /**
     * Represents the EditableImg, the thing where we suspend the crop handles and the thing
     * that user can see while in img editing mode.
     *
     * @property _editableImg
     * @type {null|Y.M.atto_image.EditableImg}
     * @private
     */
    _editableImg: null,

    /**
     * Keeps track of the Y.Overlay object during crop. Null when not crop (this._enable is false).
     *
     * @property _cropOverlay
     * @type {null|Y.Overlay}
     * @default null
     * @private
     */
    _cropOverlay: null,

    /**
     * _cropOverlayNode as opposed to _cropOverlay, is the DOM object _cropOverlay will be dealing with.
     *
     * @property _cropOverlayNode
     * @type {null|Y.Node}
     * @default null
     * @private
     */
    _cropOverlayNode: null,

    /**
     * False by default.
     *
     * @property _enable
     * @type {Boolean}
     * @default null
     * @private
     */
    _enable: false,

    initializer: function(cfg) {
        this._editableImg = cfg.editableImg;
        this.node = this._editableImg.node;

        this._publishEvents();

    },

    destructor: function() {
        this.disable();
    },

    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._cropOverlayNode = this._createCropOverlayNode();
        this._editableImg.addControl(this._cropOverlayNode, false);

        // We don't want this._editableImg.addControl rotating this since this will be wrapped by Y.Overlay, and
        // Y.Overlay don't like rotated children (twisted children).
        Y.M.atto_image.utility.rotateNode(this._cropOverlayNode, 0);

        this._cropOverlay = this._createCropOverlay(this._cropOverlayNode, this._editableImg.node);

        Y.M.atto_image.utility.rotateNode(this._cropOverlay.get('boundingBox'), this._editableImg.getRotation());

        // Align again since rotation might have misalign this_cropOverlayNode to the image.
        this._cropOverlay.align();

        // Although Y.M.atto_image.editable_image.addControl adds a atto_control to a given node,
        // this._createResizeOverlay wraps that with '.yui3-resize-handles-wrapper' thus, we need to
        // wrap it with atto_control.
        this._editableImg.getImgWrapper().one('.yui3-resize-handles-wrapper').addClass('atto_control');

        // Make this a mehtod in EditableImage and give this a more meaningful name.
        this._editableImg.getImgWrapper().addClass('atto-image-helper-show-cropped');

        this._editableImg.on(['recalculated', 'transform'], this._onEditableImgRecalculated, this);

        this._enable = true;
    },

    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.detachAll();

        this._editableImg.getImgWrapper().removeClass('atto-image-helper-show-cropped');

        // Garbage collection, in reverse order. Note some operations are redundant, but I want order.

        if (this._cropOverlay) {
            this._cropOverlay.destroy(true);
            this._cropOverlay = null;
        }

        if (this._cropOverlayNode) {
            this._cropOverlayNode.remove(true);
            this._cropOverlayNode = null;
        }

        this._enable = false;
    },

    _publishEvents: function() {
        /**
         * @event click Fired when at least one of the nodes inside div is clicked.
         */
        this.publish('click', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event dblclick Fired when at least one of the nodes inside crop div is double clicked.
         */
        this.publish('dblclick', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event crop:start Fired before rotating.
         */
        this.publish('crop:start', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event crop:crop Fired during rotate.
         */
        this.publish('crop:crop', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event crop:end Fired after rotate.
         */
        this.publish('crop:end', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish('init', {
            prefix: Y.M.atto_image.croppable.NAME,
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);
    },

    _createCropOverlayNode: function() {
        var cropOverlayTemplate = Y.Handlebars.compile(Y.M.atto_image.cropOverlayNodeTemplate);
        return Y.Node.create(cropOverlayTemplate());
    },

    _createCropOverlay: function (cropOverlayNode, nodeToOverlay) {
        var cropOverlay = new Y.Overlay({
            srcNode: cropOverlayNode,

            visible: true,
            render: true,

            // Place overlay on top of each other.
            align: {node: nodeToOverlay, points: ["tl", "tl"]}
        });
        this._setCropOverlaySize(cropOverlay);
        cropOverlay.plug(Y.Plugin.Resize, {
            handles: ['t', 'r', 'b', 'l', 'tr', 'tl', 'br', 'bl']
        });

        cropOverlay.resize.plug(Y.Plugin.ResizeConstrained, {}, this);

        // Setup resize event handlers.
        cropOverlay.resize.on('resize:start', this._onCropStart, this);
        cropOverlay.resize.on('resize:resize', this._onCrop, this);
        cropOverlay.resize.on('drag:end', this._onCropEnd, this);

        cropOverlay.plug(Y.Plugin.Drag, {}, this);
        cropOverlay.dd.on('drag:start', this._onDragStart, this);
        cropOverlay.dd.on('drag:drag', this._onDrag, this);
        cropOverlay.dd.on('drag:end', this._onDragEnd, this);

        cropOverlay.get("boundingBox").addClass('atto-image-editable-helper-wrapper');
        cropOverlay.get('boundingBox').addClass('atto-image-crop-overlay-wrapper');
        cropOverlay.get("boundingBox").addClass('atto_control');  // So that the overlay is deleted when saving.
        cropOverlay.get("boundingBox").setAttribute('contenteditable', false);

        return cropOverlay;
    },

    /**
     * Event handler for crop start.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onCropStart: function(e) {
        this.fire('crop:start', e);
    },

    /**
     * Event handler for cropping.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onCrop: function(e) {
        this._cropOverlay.align();
        this.fire('crop:crop', e);
    },

    /**
     * Event handler for crop end.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onCropEnd: function(e) {
        this._cropOverlay.align();

        this._editableImg.setOriginalImgSize(this._getCropOverlaySize());

        // Note: this will in turn call _onEditableImgRecalculated
        this._editableImg.recalculateImgWrapper();

        this.fire('crop:end', e);
    },

    /**
     * Event handler for drag:start event.
     * @param {EventFacade} e Y.Plugin.Drag's drag:start EventFacade.
     * @private
     */
    _onDragStart: function(e) {
        this.fire('drag:start', e);
    },

    /**
     * Event handler for drag:drag event.
     * @param {EventFacade} e Y.Plugin.Drag's drag:drag EventFacade.
     * @private
     */
    _onDrag: function(e) {
        this._editableImg.setOriginalImgOffset(this._getCropOverlayOffset());
        this.fire('drag:drag', e);
    },

    /**
     * Event handler for drag:end event.
     * @param {EventFacade} e Y.Plugin.Drag's drag:end EventFacade.
     * @private
     */
    _onDragEnd: function(e) {
        this._editableImg.setOriginalImgOffset(this._getCropOverlayOffset());
        this._cropOverlay.align();
        this.fire('drag:end', e);
    },

    /**
     * Croppable's handler when  this._editableImg recalculated properties after transformation.
     * @param {Y.EventFacade} e EventFacade for when this._editableImg recalculated properties after transformation.
     * @private
     */
    _onEditableImgRecalculated: function() {
        // Don'd call this callback when disabled.
        if (!this._enable) {
            return;
        }

        var imgAngle = this._editableImg.getRotation();
        var orientation = this._editableImg.getOrientation();

        // Default: orientation == TL || orientation == TR || orientation == T
        if(orientation == R) {
            Y.M.atto_image.utility.rotateNode(this._cropOverlay.get('boundingBox'), imgAngle + 90);
        } else if(orientation == B || orientation == BR || orientation == BL) {
            Y.M.atto_image.utility.rotateNode(this._cropOverlay.get('boundingBox'), imgAngle + 180);
        } else if(orientation == L) {
            Y.M.atto_image.utility.rotateNode(this._cropOverlay.get('boundingBox'), imgAngle + 270);
        }

        this._setCropOverlaySize();
        this._cropOverlay.align();
    },

    _getCropOverlayXY: function() {
        var cropHandleWrapper = this._cropOverlay.resize.get('handlesWrapper');
        switch (this._editableImg.getOrientation()) {
            case R:
                return cropHandleWrapper.one('.yui3-resize-handle-bl').getXY();
            case BR:
            case B:
            case BL:
                return cropHandleWrapper.one('.yui3-resize-handle-br').getXY();
            case L:
                return cropHandleWrapper.one('.yui3-resize-handle-tr').getXY();
            case T:
            case TR:
            case TL:
                return cropHandleWrapper.one('.yui3-resize-handle-tl').getXY();
            default:
                return cropHandleWrapper.one('.yui3-resize-handle-tl').getXY();
        }
    },

    _getCropOverlayOffset: function() {
        var normalizedImgWrapperCoord = Y.M.atto_image.utility.normalizeCoordinate({
            x: this._getCropOverlayXY()[0],
            y: this._getCropOverlayXY()[1]
        }, {
            x: this._editableImg.getImgWrapperXY()[0],
            y: this._editableImg.getImgWrapperXY()[1]
        });
        var transformedImgWrapperCoord = Y.M.atto_image.utility.rotate(
            normalizedImgWrapperCoord,
            -this._editableImg.getRotation()
        );

        return {left: transformedImgWrapperCoord.x, top: transformedImgWrapperCoord.y};
    },

    /**
     * Gets the size of the _cropOverlay, factoring orientation.
     * @returns {{width: Number, height: Number}}
     * @private
     */
    _getCropOverlaySize: function() {
        var newWidth = this._cropOverlay.resize.info.offsetWidth;
        var newHeight = this._cropOverlay.resize.info.offsetHeight;
        var sizeAttrs = {width: newWidth, height: newHeight};
        var orientation = this._editableImg.getOrientation();
        if (orientation == L || orientation == R) {
            sizeAttrs = {width: newHeight, height: newWidth};
        }
        return sizeAttrs;
    },

    /**
     * Set the size of the overlay from node (image), factoring orientation.
     * @param {undefined|Y.Overlay} cropOverlay
     * @private
     */
    _setCropOverlaySize: function(cropOverlay) {
        cropOverlay = cropOverlay || this._cropOverlay;

        /*
         * Since overlay always point up (as much as possible), if top is left/right in which overlay is almost
         * perpendicular to img, swap width/height so they still over each other exactly.
         */
        var sizeAttrs = this._editableImg.getOriginalImgSize();
        var orientation = this._editableImg.getOrientation();
        if (orientation == L || orientation == R) {
            sizeAttrs = {
                width: this._editableImg.getOriginalImgSize().height,
                height: this._editableImg.getOriginalImgSize().width
            };
        }
        cropOverlay.get('boundingBox').setStyles(sizeAttrs);
    },

    /**
     * Remove all orientation classes.
     * @param {Y.Node} node To remove all atto-image-helper-orientation-*
     * @private
     */
    _removeOrientationClasses: function(node) {
        node.removeClass('atto-image-helper-orientation-t');
        node.removeClass('atto-image-helper-orientation-tl');
        node.removeClass('atto-image-helper-orientation-r');
        node.removeClass('atto-image-helper-orientation-bl');
        node.removeClass('atto-image-helper-orientation-b');
        node.removeClass('atto-image-helper-orientation-br');
        node.removeClass('atto-image-helper-orientation-l');
        node.removeClass('atto-image-helper-orientation-tr');
    }
}, {
    NAME: 'atto_image_croppable'
});// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_image
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_image_alignment-button
 */

/**
 * Atto image selection tool.
 *
 * @namespace M.atto_image
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

var CSS = {
        RESPONSIVE: 'img-responsive',
        INPUTALIGNMENT: 'atto_image_alignment',
        INPUTALT: 'atto_image_altentry',
        INPUTHEIGHT: 'atto_image_heightentry',
        INPUTSUBMIT: 'atto_image_urlentrysubmit',
        INPUTURL: 'atto_image_urlentry',
        INPUTSIZE: 'atto_image_size',
        INPUTWIDTH: 'atto_image_widthentry',
        IMAGEALTWARNING: 'atto_image_altwarning',
        IMAGEBROWSER: 'openimagebrowser',
        IMAGEPRESENTATION: 'atto_image_presentation',
        INPUTCONSTRAIN: 'atto_image_constrain',
        INPUTCUSTOMSTYLE: 'atto_image_customstyle',
        IMAGEPREVIEW: 'atto_image_preview',
        IMAGEPREVIEWBOX: 'atto_image_preview_box'
    },
    SELECTORS = {
        INPUTURL: '.' + CSS.INPUTURL
    },
    ALIGNMENTS = [
        // Vertical alignment.
        {
            name: 'text-top',
            str: 'alignment_top',
            value: 'vertical-align',
            margin: '0 .5em'
        }, {
            name: 'middle',
            str: 'alignment_middle',
            value: 'vertical-align',
            margin: '0 .5em'
        }, {
            name: 'text-bottom',
            str: 'alignment_bottom',
            value: 'vertical-align',
            margin: '0 .5em',
            isDefault: true
        },

        // Floats.
        {
            name: 'left',
            str: 'alignment_left',
            value: 'float',
            margin: '0 .5em 0 0'
        }, {
            name: 'right',
            str: 'alignment_right',
            value: 'float',
            margin: '0 0 0 .5em'
        }, {
            name: 'customstyle',
            str: 'customstyle',
            value: 'style'
        }
    ],

    REGEX = {
        ISPERCENT: /\d+%/
    },

    COMPONENTNAME = 'atto_image',

    TEMPLATE = '' +
            '<form class="atto_form">' +
                '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                '<input class="fullwidth {{CSS.INPUTURL}}" type="url" id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                '<br/>' +

                // Add the repository browser button.
                '{{#if showFilepicker}}' +
                    '<button class="{{CSS.IMAGEBROWSER}}" type="button">{{get_string "browserepositories" component}}</button>' +
                '{{/if}}' +

                // Add the Alt box.
                '<div style="display:none" role="alert" class="warning {{CSS.IMAGEALTWARNING}}">' +
                    '{{get_string "presentationoraltrequired" component}}' +
                '</div>' +
                '<label for="{{elementid}}_{{CSS.INPUTALT}}">{{get_string "enteralt" component}}</label>' +
                '<input class="fullwidth {{CSS.INPUTALT}}" type="text" value="" id="{{elementid}}_{{CSS.INPUTALT}}" size="32"/>' +
                '<br/>' +

                // Add the presentation select box.
                '<input type="checkbox" class="{{CSS.IMAGEPRESENTATION}}" id="{{elementid}}_{{CSS.IMAGEPRESENTATION}}"/>' +
                '<label class="sameline" for="{{elementid}}_{{CSS.IMAGEPRESENTATION}}">' +
                    '{{get_string "presentation" component}}' +
                '</label>' +
                '<br/>' +

                // Add the size entry boxes.
                '<label class="sameline" for="{{elementid}}_{{CSS.INPUTSIZE}}">{{get_string "size" component}}</label>' +
                '<div id="{{elementid}}_{{CSS.INPUTSIZE}}" class="{{CSS.INPUTSIZE}}">' +
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTWIDTH}}">{{get_string "width" component}}</label>' +
                '<input type="text" class="{{CSS.INPUTWIDTH}} input-mini" id="{{elementid}}_{{CSS.INPUTWIDTH}}" size="4"/> x ' +

                // Add the height entry box.
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTHEIGHT}}">{{get_string "height" component}}</label>' +
                '<input type="text" class="{{CSS.INPUTHEIGHT}} input-mini" id="{{elementid}}_{{CSS.INPUTHEIGHT}}" size="4"/>' +

                // Add the constrain checkbox.
                '<input type="checkbox" class="{{CSS.INPUTCONSTRAIN}} sameline" id="{{elementid}}_{{CSS.INPUTCONSTRAIN}}"/>' +
                '<label for="{{elementid}}_{{CSS.INPUTCONSTRAIN}}">{{get_string "constrain" component}}</label>' +
                '</div>' +

                // Add the alignment selector.
                '<label class="sameline" for="{{elementid}}_{{CSS.INPUTALIGNMENT}}">{{get_string "alignment" component}}</label>' +
                '<select class="{{CSS.INPUTALIGNMENT}}" id="{{elementid}}_{{CSS.INPUTALIGNMENT}}">' +
                    '{{#each alignments}}' +
                        '<option value="{{value}}:{{name}};">{{get_string str ../component}}</option>' +
                    '{{/each}}' +
                '</select>' +
                // Hidden input to store custom styles.
                '<input type="hidden" class="{{CSS.INPUTCUSTOMSTYLE}}"/>' +
                '<br/>' +

                // Add the image preview.
                '<div class="mdl-align">' +
                '<div class="{{CSS.IMAGEPREVIEWBOX}}">' +
                    '<img src="#" class="{{CSS.IMAGEPREVIEW}}" alt="" style="display: none;"/>' +
                '</div>' +

                // Add the submit button and close the form.
                '<button class="{{CSS.INPUTSUBMIT}}" type="submit">{{get_string "saveimage" component}}</button>' +
                '</div>' +
            '</form>',

        IMAGETEMPLATE = '' +
            '<img src="{{url}}" alt="{{alt}}" ' +
                '{{#if width}}width="{{width}}" {{/if}}' +
                '{{#if height}}height="{{height}}" {{/if}}' +
                '{{#if presentation}}role="presentation" {{/if}}' +
                'style="{{alignment}}{{margin}}{{customstyle}}"' +
                '{{#if classlist}}class="{{classlist}}" {{/if}}' +
                '{{#if id}}id="{{id}}" {{/if}}' +
                'unselectable="on" ' +
                '/>';

Y.namespace('M.atto_image').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * The most recently selected image.
     *
     * @param _selectedImage
     * @type Node
     * @private
     */
    _selectedImage: null,

    /**
     * A reference to the currently open form.
     *
     * @param _form
     * @type Node
     * @private
     */
    _form: null,

    /**
     * The dimensions of the raw image before we manipulate it.
     *
     * @param _rawImageDimensions
     * @type Object
     * @private
     */
    _rawImageDimensions: null,

    /**
     * Resizable object.
     *
     * @param _resizable
     * @type Y.M.atto_image.resizable
     * @private
     */
    _resizable: null,

    /**
     * Rotatable object.
     *
     * @param _rotatable
     * @type Y.M.atto_image.resizable
     * @private
     */
    _rotatable: null,

    _croppable: null,

    /**
     * Represents the current editable image.
     *
     * @param _editableImg
     * @type Y.M.atto_image.resizable
     * @private
     */
    _editableImg: null,

    initializer: function() {
        var host = this.get('host');

        this.addButton({
            icon: 'e/insert_edit_image',
            callback: this._displayDialogue,
            tags: 'img',
            tagMatchRequiresAll: false
        });

        // To disable text being entered in content editable, set contenteditable=false in .atto-image-wrapper.
        Y.M.atto_image.utility.disableContentEditable(this.editor);

        this.editor.delegate('dblclick', this._displayDialogue, 'img', this);
        this.editor.delegate('click', this._handleClick, 'img', this);
        this.editor.on('drop', this._handleDragDrop, this);

        // Handle cases when something not an image is selected.
        this.editor.delegate('click', this._handleDeselect, ':not(img)', this);

        // Disable dragging for now. atto-image-wrapper is contenteditable=false so that text can't be written inside
        // it. The down side is that when dragging an image out of it, the image is cloned instead of moved.
        // MDL-55530
        this.editor.delegate('dragstart', function(e) {
            e.halt(true);
        }, '.atto-image-wrapper', this);

        // e.preventDefault needed to stop the default event from clobbering the desired behaviour in some browsers.
        this.editor.on('dragover', function(e) {
            e.preventDefault();
        }, this);
        this.editor.on('dragenter', function(e) {
            e.preventDefault();
        }, this);

        host.on('atto:htmlcleaned', this._handleHtmlClean, this);
        host.on(['atto:pastehtmlstylescleaned', 'atto:pastehtmlclasscleaned'], this._handleClassClean, this);
    },

    /**
     * Handles atto:htmlcleaned for atto_image package.
     *
     * @param {EventFacade} e EventFacade modified by atto_editor's clean.js
     */
    _handleHtmlClean: function(e) {
        var content = e.args.html;

        var invalidString = !content;
        if (invalidString) {
            e.args.html = '';
            return;
        }

        // Removes atto-image-helper* classes.
        content = content.replace(
                /(<[^>]*?class\s*?=\s*?")([^>"]*)(")/gi,
                function(match, group1, group2, group3) {
                    var group2WithoutHelperClass = group2.replace(/(?:^|[\s])[\s]*atto-image-helper[_a-zA-Z0-9\-]*/gi, "");
                    return group1 + group2WithoutHelperClass + group3;
                }
            );

        // This pattern is taken from Y.M.atto_editor._cleanStyles for handling content cleanup.
        var holder = document.createElement('div');
        holder.innerHTML = content;
        var contentNode = Y.one(holder);

        if (!contentNode) {
            e.args.html = content || '';
            return;
        }

        // Remove ".atto-image-wrapper .atto_control" elements.
        contentNode.all('.atto-image-wrapper .atto_control').remove(true);

        // Remove ".atto-image-wrapper > [elem]" elements, where [elem]
        // is any unwanted element(s) inserted during clean.js's operation.
        // - clean.js inserts <br> in the immediate child of .atto-image-wrapper, remove them.
        contentNode.all('.atto-image-wrapper > br').remove(true);
        contentNode.all('.atto-image-inner-wrapper > br').remove(true);

        // Set contenteditable=false for al atto-image-wrapper so other editors can't insert text in this image
        // wrappers.
        contentNode.all('.atto-image-wrapper[contenteditable=true]').setAttribute('contenteditable', false);

        content = contentNode.getHTML();

        e.args.html = content;
    },

    /**
     * Callback passed to 'atto:pastehtmlclasscleaned' events.
     *
     * @param {EventFacade} e EventFacade modified by 'atto:pastehtmlclasscleaned'  event.
     * @private
     */
    _handleClassClean: function(e) {
        // It exempts .atto-image-wrapper from class attribute removal.
        var nodeList = e.args;
        var exemptionNodeList = nodeList.filter(function(node) {
            return Y.one(node).ancestor('.atto-image-wrapper', true);
        });
        exemptionNodeList.forEach(function(node) {
            if (nodeList.indexOf(node) >= 0) {
                nodeList.splice(nodeList.indexOf(node), 1);
            }
        });
    },

    /**
     * Handle a drag and drop event with an image.
     *
     * @method _handleDragDrop
     * @param {EventFacade} e
     * @private
     */
    _handleDragDrop: function(e) {

        var self = this,
            host = this.get('host'),
            template = Y.Handlebars.compile(IMAGETEMPLATE);

        host.saveSelection();
        e = e._event;

        // Only handle the event if an image file was dropped in.
        var handlesDataTransfer = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length);
        if (handlesDataTransfer && /^image\//.test(e.dataTransfer.files[0].type)) {

            var options = host.get('filepickeroptions').image,
                savepath = (options.savepath === undefined) ? '/' : options.savepath,
                formData = new FormData(),
                timestamp = 0,
                uploadid = "",
                xhr = new XMLHttpRequest(),
                imagehtml = "",
                keys = Object.keys(options.repositories);

            e.preventDefault();
            e.stopPropagation();
            formData.append('repo_upload_file', e.dataTransfer.files[0]);
            formData.append('itemid', options.itemid);

            // List of repositories is an object rather than an array.  This makes iteration more awkward.
            for (var i = 0; i < keys.length; i++) {
                if (options.repositories[keys[i]].type === 'upload') {
                    formData.append('repo_id', options.repositories[keys[i]].id);
                    break;
                }
            }
            formData.append('env', options.env);
            formData.append('sesskey', M.cfg.sesskey);
            formData.append('client_id', options.client_id);
            formData.append('savepath', savepath);
            formData.append('ctx_id', options.context.id);

            // Insert spinner as a placeholder.
            timestamp = new Date().getTime();
            uploadid = 'moodleimage_' + Math.round(Math.random() * 100000) + '-' + timestamp;
            host.focus();
            host.restoreSelection();
            imagehtml = template({
                url: M.util.image_url("i/loading_small", 'moodle'),
                alt: M.util.get_string('uploading', COMPONENTNAME),
                id: uploadid
            });
            host.insertContentAtFocusPoint(imagehtml);
            self.markUpdated();

            // Kick off a XMLHttpRequest.
            xhr.onreadystatechange = function() {
                var placeholder = self.editor.one('#' + uploadid),
                    result,
                    file,
                    newhtml,
                    newimage;

                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        result = JSON.parse(xhr.responseText);
                        if (result) {
                            if (result.error) {
                                if (placeholder) {
                                    placeholder.remove(true);
                                }
                                return new M.core.ajaxException(result);
                            }

                            file = result;
                            if (result.event && result.event === 'fileexists') {
                                // A file with this name is already in use here - rename to avoid conflict.
                                // Chances are, it's a different image (stored in a different folder on the user's computer).
                                // If the user wants to reuse an existing image, they can copy/paste it within the editor.
                                file = result.newfile;
                            }

                            // Replace placeholder with actual image.
                            newhtml = template({
                                url: file.url,
                                presentation: true
                            });
                            newimage = Y.Node.create(newhtml);
                            if (placeholder) {
                                placeholder.replace(newimage);
                            } else {
                                self.editor.appendChild(newimage);
                            }
                            self.markUpdated();
                        }
                    } else {
                        Y.use('moodle-core-notification-alert', function() {
                            new M.core.alert({message: M.util.get_string('servererror', 'moodle')});
                        });
                        if (placeholder) {
                            placeholder.remove(true);
                        }
                    }
                }
            };
            xhr.open("POST", M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', true);
            xhr.send(formData);
            return false;
        }

    },

    /**
     * Handle a click on an image.
     *
     * @method _handleClick
     * @param {EventFacade} e EventFacade with resizable field added.
     * @private
     */
    _handleClick: function(e) {
        var image = e.target;

        this._initEditableImg(image);

        // Prevent further bubbling the DOM tree.
        // @see http://yuilibrary.com/yui/docs/event/#facade-properties
        // Without this, this will propagate up (bubble) and will hit the textarea, thus calling _handleDeselect,
        // immediately deselecting anything.
        e.halt(true);
    },

    /**
     * Calls to initialize this._editableImg.
     * @param {DOMNode} image node to be edited.
     * @private
     */
    _initEditableImg: function(image) {
        // There are 3 cases:
        // 1. this._editableImg exist and image is already this._editableImg.node
        // 2. this._editableImg exist and image is not this._editableImg.node
        // 3. this._editableImg does not exist
        var self = this;
        var imageAlreadyEditable = this._editableImg && this._editableImg.node.getDOMNode() === image.getDOMNode();
        if (imageAlreadyEditable) {
            return;
        }

        var imageIsNotEditable = this._editableImg && this._editableImg.node.getDOMNode() !== image.getDOMNode();
        if (imageIsNotEditable) {
            this._destroyEditableImg();
        }

        this._editableImg = new Y.M.atto_image.EditableImg({
            node: image,
            host: this.get('host'),
            after: {
                // A bug in YUI. @see https://github.com/yui/yui3/issues/1043 in which resizable.on('init', callback)
                // won't fire. Issue above suggest this solution.
                init: function() {
                    this.on('init', self._editableImgInitHandler, self);
                    this.fire('init');
                }
            }
        });
    },

    /**
     * Destroys the this._editableImg and then this._croppable, this._resizable, this._rotatable.
     * @private
     */
    _destroyEditableImg: function() {
        if (this._editableImg) {
            this._editableImg.destroy();
            this._editableImg = null;

            this._destroyCroppable(this._croppable);
            this._destroyResizable(this._resizable);
            this._destroyRotatable(this._rotatable);
        }
    },

    /**
     * Handler when a new instance is created within the editor. And attaches this._croppable, this._resizable,
     * this._rotatable to it.
     * @param {EventFacade} e EventFacade for atto_image_EditableImg:init event.
     * @private
     */
    _editableImgInitHandler: function(e) {
        var editableImg = e.target;

        editableImg.node.removeClass(CSS.RESPONSIVE);

        this._initRotatable(editableImg);
        this._initResizable(editableImg);
        this._initCroppable(editableImg);

        // TODO: comment to MDL-54709
        // editableImg.on('dblclick', this._displayDialogueWhileResizing, this);
        editableImg.on('dblclick', function() {
            if (this._croppable) {
                if (!this._croppable._enable) {
                    this._croppable.enable();
                    editableImg.recalculateImgWrapper();
                } else {
                    this._croppable.disable();
                }
            }
        }, this);

        // Recalculate the width/height just in case someone manually (or moodle) edit the style attribute.
        editableImg.recalculateImgWrapper();
    },

    /**
     * Deselect event handler.
     *
     * @param {EventFacade} e
     * @private
     */
    _handleDeselect: function() {
        if (this._editableImg) {
            // If there is an image selected, such that this._resizable is set. Delete it.
            this._destroyEditableImg();
            this._editableImg = null;
        }
    },

    /**
     * Handler when the resizable is created in the editor. It deals with cases in which there are multiple images
     * in the editor.
     *
     * @param {EventFacade} e EventFacade with resizable field added.
     * @private
     */
    _resizableInitHandler: function(e) {
        // If something was selected, deselect it. (Both range and resizable selection).
        var newResizable = e.currentTarget;
        if (newResizable !== this._resizable) {
            this._resizable = newResizable;
            this._resizable.enable();
        }
    },

    /**
     * Handler when the resizable is deleted. Since Y.M.att_image.resizable basically self destructs, might aswell
     * clear our reference to it.
     *
     * @param {EventFacade} e EventFacade
     * @private
     */
    _resizableDeleteHandler: function(e) {
        var resizable = e.target;
        this._destroyResizable(resizable);
    },

    /**
     * Initialize this._resizable.
     *
     * @param {Y.M.atto_image.EditableImg} editableImg The object that represents the editable image.
     * @private
     */
    _initResizable: function(editableImg) {
        if (!Y.M.atto_image.resizable.isSupported()) {
            return;
        }

        var self = this;
        var resizeCfg = {
            editableImg: editableImg,
            after: {
                // A bug in YUI. @see https://github.com/yui/yui3/issues/1043 in which resizable.on('init', callback)
                // won't fire. Issue above suggest this solution.
                init: function() {
                    this.on('init', self._resizableInitHandler, self);
                    this.fire('init');
                }
            }
        };
        this._resizable = new Y.M.atto_image.resizable(resizeCfg);
        this._resizable.on('resize:start', this._resizableResizeStartHandler, this);
    },

    /**
     * Destroy _resizable
     * @param {Y.M.atto_image.resizable} resizable Resizable instance.
     * @private
     */
    _destroyResizable: function(resizable) {
        // This is probably usually the case in which the resizable = this._resizable. Either way,
        // we are deleting it.
        if (resizable == this._resizable) {
            this._resizable = null;
        }

        if (resizable) {
            resizable.destroy();
        }
    },

    _initRotatable: function(editableImg) {
        var rotateCfg = {
            editableImg: editableImg,
            after: {
                // A bug in YUI. @see https://github.com/yui/yui3/issues/1043 in which resizable.on('init', callback)
                // won't fire. Issue above suggest this solution.
                init: function() {
                    this.fire('init');
                }
            }
        };
        this._rotatable = new Y.M.atto_image.rotatable(rotateCfg);
    },

    _destroyRotatable: function(rotatable) {
        if (rotatable == this._rotatable) {
            this._rotatable = null;
        }

        if (rotatable) {
            rotatable.destroy();
        }
    },

    _initCroppable: function(editableImg) {
        var croppable = {
            editableImg: editableImg,
            after: {
                // A bug in YUI. @see https://github.com/yui/yui3/issues/1043 in which resizable.on('init', callback)
                // won't fire. Issue above suggest this solution.
                init: function() {
                    this.fire('init');
                }
            }
        };
        this._croppable = new Y.M.atto_image.croppable(croppable);
    },

    _destroyCroppable: function(croppable) {
        if (croppable == this._croppable) {
            this._croppable = null;
        }

        if (croppable) {
            croppable.destroy();
        }
    },

    _enableCroppable: function() {
        if (this._croppable) {
            this._croppable.enable();
        }
    },

    _disableCroppable: function() {
        if (this._croppable) {
            this._croppable.disable();
        }
    },

    /**
     * Display the image editing tool.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        // Reset the image dimensions.
        this._rawImageDimensions = null;

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('imageproperties', COMPONENTNAME),
            width: '480px',
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTURL
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent())
                .show();
    },

    /**
     * This is called instead of _displayDialogue if the dblclicked occured whilre resizing.
     *
     * @param {EventFacade} e Event object.
     * @private
     */
    _displayDialogueWhileResizing: function(e) {
        var resizable = e.resizable;

        // Resizable should exist, but check for sanity.
        // Currently, the selected element during the dblclick'd is/are the auxiliary DOM elements (we don't want).
        // So we want to destroy the current resizable to reveal the original image, which we change our selection to.
        if (resizable) {
            var imgNode = resizable.node;
            this._destroyResizable(resizable);
            var nodeSelection = this.get('host').getSelectionFromNode(imgNode);
            this.get('host').setSelection(nodeSelection);
            this._currentSelection = this.get('host').getSelection();
        }

        this._displayDialogue();

        // Don't let other dblclick handler handle this.
        e.stopImmediatePropagation();
    },

    /**
     * Set the inputs for width and height if they are not set, and calculate
     * if the constrain checkbox should be checked or not.
     *
     * @method _loadPreviewImage
     * @param {String} url
     * @private
     */
    _loadPreviewImage: function(url) {
        var image = new Image();
        var self = this;

        image.onerror = function() {
            var preview = self._form.one('.' + CSS.IMAGEPREVIEW);
            preview.setStyles({
                'display': 'none'
            });

            // Centre the dialogue when clearing the image preview.
            self.getDialogue().centerDialogue();
        };

        image.onload = function() {
            var input, currentwidth, currentheight, widthRatio, heightRatio;

            self._rawImageDimensions = {
                width: this.width,
                height: this.height
            };

            input = self._form.one('.' + CSS.INPUTWIDTH);
            currentwidth = input.get('value');
            if (currentwidth === '') {
                input.set('value', this.width);
                currentwidth = "" + this.width;
            }
            input = self._form.one('.' + CSS.INPUTHEIGHT);
            currentheight = input.get('value');
            if (currentheight === '') {
                input.set('value', this.height);
                currentheight = "" + this.height;
            }
            input = self._form.one('.' + CSS.IMAGEPREVIEW);
            input.setAttribute('src', this.src);
            input.setStyles({
                'display': 'inline'
            });

            input = self._form.one('.' + CSS.INPUTCONSTRAIN);
            if (currentwidth.match(REGEX.ISPERCENT) && currentheight.match(REGEX.ISPERCENT)) {
                input.set('checked', currentwidth === currentheight);
            } else {
                if (this.width === 0) {
                    this.width = 1;
                }
                if (this.height === 0) {
                    this.height = 1;
                }
                // This is the same as comparing to 3 decimal places.
                widthRatio = Math.round(1000 * parseInt(currentwidth, 10) / this.width);
                heightRatio = Math.round(1000 * parseInt(currentheight, 10) / this.height);
                input.set('checked', widthRatio === heightRatio);
            }

            // Apply the image sizing.
            self._autoAdjustSize(self);

            // Centre the dialogue once the preview image has loaded.
            self.getDialogue().centerDialogue();
        };

        image.src = url;
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            canShowFilepicker = this.get('host').canShowFilepicker('image'),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                component: COMPONENTNAME,
                showFilepicker: canShowFilepicker,
                alignments: ALIGNMENTS
            }));

        this._form = content;

        // Configure the view of the current image.
        this._applyImageProperties(this._form);

        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.IMAGEPRESENTATION).on('change', this._updateWarning, this);
        this._form.one('.' + CSS.INPUTALT).on('change', this._updateWarning, this);
        this._form.one('.' + CSS.INPUTWIDTH).on('blur', this._autoAdjustSize, this);
        this._form.one('.' + CSS.INPUTHEIGHT).on('blur', this._autoAdjustSize, this, true);
        this._form.one('.' + CSS.INPUTCONSTRAIN).on('change', function(event) {
            if (event.target.get('checked')) {
                this._autoAdjustSize(event);
            }
        }, this);
        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._setImage, this);

        if (canShowFilepicker) {
            this._form.one('.' + CSS.IMAGEBROWSER).on('click', function() {
                    this.get('host').showFilepicker('image', this._filepickerCallback, this);
            }, this);
        }

        return content;
    },

    _autoAdjustSize: function(e, forceHeight) {
        forceHeight = forceHeight || false;

        var keyField = this._form.one('.' + CSS.INPUTWIDTH),
            keyFieldType = 'width',
            subField = this._form.one('.' + CSS.INPUTHEIGHT),
            subFieldType = 'height',
            constrainField = this._form.one('.' + CSS.INPUTCONSTRAIN),
            keyFieldValue = keyField.get('value'),
            subFieldValue = subField.get('value'),
            imagePreview = this._form.one('.' + CSS.IMAGEPREVIEW),
            rawPercentage,
            rawSize;

        // If we do not know the image size, do not do anything.
        if (!this._rawImageDimensions) {
            return;
        }

        // Set the width back to default if it is empty.
        if (keyFieldValue === '') {
            keyFieldValue = this._rawImageDimensions[keyFieldType];
            keyField.set('value', keyFieldValue);
            keyFieldValue = keyField.get('value');
        }

        // Clear the existing preview sizes.
        imagePreview.setStyles({
            width: null,
            height: null
        });

        // Now update with the new values.
        if (!constrainField.get('checked')) {
            // We are not keeping the image proportion - update the preview accordingly.

            // Width.
            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;
                imagePreview.setStyle('width', rawSize + 'px');
            } else {
                imagePreview.setStyle('width', keyFieldValue + 'px');
            }

            // Height.
            if (subFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(subFieldValue, 10);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize + 'px');
            } else {
                imagePreview.setStyle('height', subFieldValue + 'px');
            }
        } else {
            // We are keeping the image in proportion.
            if (forceHeight) {
                // By default we update based on width. Swap the key and sub fields around to achieve a height-based scale.
                var _temporaryValue;
                _temporaryValue = keyField;
                keyField = subField;
                subField = _temporaryValue;

                _temporaryValue = keyFieldType;
                keyFieldType = subFieldType;
                subFieldType = _temporaryValue;

                _temporaryValue = keyFieldValue;
                keyFieldValue = subFieldValue;
                subFieldValue = _temporaryValue;
            }

            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                // This is a percentage based change. Copy it verbatim.
                subFieldValue = keyFieldValue;

                // Set the width to the calculated pixel width.
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;

                // And apply the width/height to the container.
                imagePreview.setStyle('width', rawSize);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize);
            } else {
                // Calculate the scaled subFieldValue from the keyFieldValue.
                subFieldValue = Math.round((keyFieldValue / this._rawImageDimensions[keyFieldType]) *
                        this._rawImageDimensions[subFieldType]);

                if (forceHeight) {
                    imagePreview.setStyles({
                        'width': subFieldValue,
                        'height': keyFieldValue
                    });
                } else {
                    imagePreview.setStyles({
                        'width': keyFieldValue,
                        'height': subFieldValue
                    });
                }
            }

            // Update the subField's value within the form to reflect the changes.
            subField.set('value', subFieldValue);
        }
    },

    /**
     * Update the dialogue after an image was selected in the File Picker.
     *
     * @method _filepickerCallback
     * @param {object} params The parameters provided by the filepicker
     * containing information about the image.
     * @private
     */
    _filepickerCallback: function(params) {
        if (params.url !== '') {
            var input = this._form.one('.' + CSS.INPUTURL);
            input.set('value', params.url);

            // Auto set the width and height.
            this._form.one('.' + CSS.INPUTWIDTH).set('value', '');
            this._form.one('.' + CSS.INPUTHEIGHT).set('value', '');

            // Load the preview image.
            this._loadPreviewImage(params.url);
        }
    },

    /**
     * Applies properties of an existing image to the image dialogue for editing.
     *
     * @method _applyImageProperties
     * @param {Node} form
     * @private
     */
    _applyImageProperties: function(form) {
        var properties = this._getSelectedImageProperties(),
            img = form.one('.' + CSS.IMAGEPREVIEW),
            i,
            css;

        if (properties === false) {
            img.setStyle('display', 'none');
            // Set the default alignment.
            for (i in ALIGNMENTS) {
                if (ALIGNMENTS[i].isDefault === true) {
                    css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                    form.one('.' + CSS.INPUTALIGNMENT).set('value', css);
                }
            }
            // Remove the custom style option if this is a new image.
            form.one('.' + CSS.INPUTALIGNMENT).getDOMNode().options.remove(ALIGNMENTS.length - 1);
            return;
        }

        if (properties.align) {
            form.one('.' + CSS.INPUTALIGNMENT).set('value', properties.align);
            // Remove the custom style option if we have a standard alignment.
            form.one('.' + CSS.INPUTALIGNMENT).getDOMNode().options.remove(ALIGNMENTS.length - 1);
        } else {
            form.one('.' + CSS.INPUTALIGNMENT).set('value', 'style:customstyle;');
        }
        if (properties.customstyle) {
            form.one('.' + CSS.INPUTCUSTOMSTYLE).set('value', properties.customstyle);
        }
        if (properties.width) {
            form.one('.' + CSS.INPUTWIDTH).set('value', properties.width);
        }
        if (properties.height) {
            form.one('.' + CSS.INPUTHEIGHT).set('value', properties.height);
        }
        if (properties.alt) {
            form.one('.' + CSS.INPUTALT).set('value', properties.alt);
        }
        if (properties.src) {
            form.one('.' + CSS.INPUTURL).set('value', properties.src);
            this._loadPreviewImage(properties.src);
        }
        if (properties.presentation) {
            form.one('.' + CSS.IMAGEPRESENTATION).set('checked', 'checked');
        }

        // Update the image preview based on the form properties.
        this._autoAdjustSize();
    },

    /**
     * Gets the properties of the currently selected image.
     *
     * The first image only if multiple images are selected.
     *
     * @method _getSelectedImageProperties
     * @return {object}
     * @private
     */
    _getSelectedImageProperties: function() {
        var properties = {
                src: null,
                alt: null,
                width: null,
                height: null,
                align: '',
                presentation: false
            },

            // Get the current selection.
            images = this.get('host').getSelectedNodes(),
            i,
            width,
            height,
            style,
            css,
            image,
            margin;

        if (images) {
            images = images.filter('img');
        }

        if (images && images.size()) {
            image = images.item(0);
            this._selectedImage = image;

            style = image.getAttribute('style');
            properties.customstyle = style;
            style = style.replace(/ /g, '');

            width = image.getAttribute('width');
            if (!width.match(REGEX.ISPERCENT)) {
                width = parseInt(width, 10);
            }
            height = image.getAttribute('height');
            if (!height.match(REGEX.ISPERCENT)) {
                height = parseInt(height, 10);
            }

            if (width !== 0) {
                properties.width = width;
            }
            if (height !== 0) {
                properties.height = height;
            }
            for (i in ALIGNMENTS) {
                css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                if (style.indexOf(css) !== -1) {
                    margin = 'margin:' + ALIGNMENTS[i].margin + ';';
                    margin = margin.replace(/ /g, '');
                    // Must match alignment and margins - otherwise custom style is selected.
                    if (style.indexOf(margin) !== -1) {
                        properties.align = css;
                        break;
                    }
                }
            }
            properties.src = image.getAttribute('src');
            properties.alt = image.getAttribute('alt') || '';
            properties.presentation = (image.get('role') === 'presentation');
            return properties;
        }

        // No image selected - clean up.
        this._selectedImage = null;
        return false;
    },

    /**
     * Update the form when the URL was changed. This includes updating the
     * height, width, and image preview.
     *
     * @method _urlChanged
     * @private
     */
    _urlChanged: function() {
        var input = this._form.one('.' + CSS.INPUTURL);

        if (input.get('value') !== '') {
            // Load the preview image.
            this._loadPreviewImage(input.get('value'));
        }
    },

    /**
     * Update the image in the contenteditable.
     *
     * @method _setImage
     * @param {EventFacade} e
     * @private
     */
    _setImage: function(e) {
        var form = this._form,
            url = form.one('.' + CSS.INPUTURL).get('value'),
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            width = form.one('.' + CSS.INPUTWIDTH).get('value'),
            height = form.one('.' + CSS.INPUTHEIGHT).get('value'),
            alignment = form.one('.' + CSS.INPUTALIGNMENT).get('value'),
            margin = '',
            presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked'),
            constrain = form.one('.' + CSS.INPUTCONSTRAIN).get('checked'),
            imagehtml,
            customstyle = '',
            i,
            css,
            classlist = [],
            host = this.get('host');

        e.preventDefault();

        // Check if there are any accessibility issues.
        if (this._updateWarning()) {
            return;
        }

        // Focus on the editor in preparation for inserting the image.
        host.focus();
        if (url !== '') {
            if (this._selectedImage) {
                host.setSelection(host.getSelectionFromNode(this._selectedImage));
            } else {
                host.setSelection(this._currentSelection);
            }

            if (alignment === 'style:customstyle;') {
                alignment = '';
                customstyle = form.one('.' + CSS.INPUTCUSTOMSTYLE).get('value');
            } else {
                for (i in ALIGNMENTS) {
                    css = ALIGNMENTS[i].value + ':' + ALIGNMENTS[i].name + ';';
                    if (alignment === css) {
                        margin = ' margin: ' + ALIGNMENTS[i].margin + ';';
                    }
                }
            }

            if (constrain) {
                classlist.push(CSS.RESPONSIVE);
            }

            if (!width.match(REGEX.ISPERCENT) && isNaN(parseInt(width, 10))) {
                form.one('.' + CSS.INPUTWIDTH).focus();
                return;
            }
            if (!height.match(REGEX.ISPERCENT) && isNaN(parseInt(height, 10))) {
                form.one('.' + CSS.INPUTHEIGHT).focus();
                return;
            }

            var template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                url: url,
                alt: alt,
                width: width,
                height: height,
                presentation: presentation,
                alignment: alignment,
                margin: margin,
                customstyle: customstyle,
                classlist: classlist.join(' ')
            });

            this.get('host').insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();

    },

    /**
     * Update the alt text warning live.
     *
     * @method _updateWarning
     * @return {boolean} whether a warning should be displayed.
     * @private
     */
    _updateWarning: function() {
        var form = this._form,
            state = true,
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked');
        if (alt === '' && !presentation) {
            form.one('.' + CSS.IMAGEALTWARNING).setStyle('display', 'block');
            form.one('.' + CSS.INPUTALT).setAttribute('aria-invalid', true);
            form.one('.' + CSS.IMAGEPRESENTATION).setAttribute('aria-invalid', true);
            state = true;
        } else {
            form.one('.' + CSS.IMAGEALTWARNING).setStyle('display', 'none');
            form.one('.' + CSS.INPUTALT).setAttribute('aria-invalid', false);
            form.one('.' + CSS.IMAGEPRESENTATION).setAttribute('aria-invalid', false);
            state = false;
        }
        this.getDialogue().centerDialogue();
        return state;
    }
});


}, '@VERSION@', {
    "requires": [
        "moodle-editor_atto-rangy",
        "moodle-editor_atto-plugin",
        "resize",
        "resize-plugin",
        "dd-plugin"
    ]
});
