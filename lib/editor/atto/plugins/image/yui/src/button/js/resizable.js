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

/**
 * Adds image resizing capability. Suppose you have an img DOM node with id='foo-img', to
 * resize the img:
 *
 *     var editableImg = Y.M.atto_image.EditableImg({
 *         node: Y.one('img#foo-img')
 *     });
 *     var options = {
 *       editableImg: editableImg
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

    initializer: function(cfg) {
        this._editableImg = cfg.editableImg;
        this.node = this._editableImg.node;
        
        this.enable();
        this._publishEvents();

        Y.log('initialized', 'debug', Y.M.atto_image.resizable.NAME);
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
        Y.log('enabled', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Call to take down the resizing scaffolding.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this._editableImg.detach(['recalculated', 'transform'], this._onEditableImgRecalculated, this);

        this.detachAll();  // In case there are events attached to this object.

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
        Y.log('disabled', 'debug', Y.M.atto_image.resizable.NAME);
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
        resizableOverlay.resize.plug(Y.Plugin.ResizeConstrained, {}, this);

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

        Y.log('resize start', 'debug', Y.M.atto_image.resizable.NAME);
    },

    /**
     * Event handler for resizing.
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onResize: function(e) {
        this._resizableOverlay.align();

        // Google doc like resizing. If tl, tr, bl, br resize handles are drag, preserve aspect ratio.
        switch (this._resizableOverlay.resize.handle) {
            case Y.M.atto_image.resizeHandles.TL:
            case Y.M.atto_image.resizeHandles.TR:
            case Y.M.atto_image.resizeHandles.BL:
            case Y.M.atto_image.resizeHandles.BR:
                this._resizableOverlay.resize.con.set('preserveRatio', true);
                break;
            default:
                this._resizableOverlay.resize.con.set('preserveRatio', false);
        }

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

        this.fire('resize:end', e);
        Y.log('resize end', 'debug', Y.M.atto_image.resizable.NAME);
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
        Y.log('click', 'debug', Y.M.atto_image.resizable.NAME);
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
        Y.log('dblclick', 'debug', Y.M.atto_image.resizable.NAME);
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

        /*
         * Y.Overlay blows up when it is in extreme angle (more than +/-90 deg). To deal with this, always
         * rotate so that the Y.Overlay's top always point up. E.g. if Y.Overlay's top side is on right, rotate
         * it back to 90 deg so Y.Overlay's top side is pointing up again.
         */
        if (orientation == Y.M.atto_image.resizeHandles.R) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 90);
        } else if (
            orientation == Y.M.atto_image.resizeHandles.B ||
            orientation == Y.M.atto_image.resizeHandles.BR ||
            orientation == Y.M.atto_image.resizeHandles.BL) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 180);
        } else if (orientation == Y.M.atto_image.resizeHandles.L) {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle + 270);
        } else {
            Y.M.atto_image.utility.rotateNode(this._resizableOverlay.get('boundingBox'), imgAngle);
        }

        this._setResizeOverlaySize();
        this._resizableOverlay.align();
    },

    /**
     * Gets the size of the resizeOverlay, factoring orientation.
     * @returns {{width: Number, height: Number}}
     * @private
     */
    _getResizeOverlaySize: function() {
        // @see Y.M.atto_image_resizable._onEditableImgRecalculated
        // Y.M.atto_image_resizable._onEditableImgRecalculated ensures Y.Overlay's top side is always pointing up.
        // If for some Y.Overlay's up is pointing L/R, Y.Overlay's width/height now don't match the
        // image (this._editable.node). More precisely, Y.Overlay's width is now image's height, and same goes
        // for Y.Overlay's height. Solution is to swap width/height atm.
        var newWidth = this._resizableOverlay.resize.info.offsetWidth;
        var newHeight = this._resizableOverlay.resize.info.offsetHeight;
        var sizeAttrs = {width: newWidth, height: newHeight};
        var orientation = this._editableImg.getOrientation();
        if (orientation == Y.M.atto_image.resizeHandles.L || orientation == Y.M.atto_image.resizeHandles.R) {
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

        // @see Y.M.atto_image_resizable._onEditableImgRecalculated
        // Y.M.atto_image_resizable._onEditableImgRecalculated ensures Y.Overlay's top side is always pointing up.
        // If for some Y.Overlay's up is pointing L/R, Y.Overlay's width/height now don't match the
        // image (this._editable.node). More precisely, Y.Overlay's width is now image's height, and same goes
        // for Y.Overlay's height. Solution is to swap width/height atm.
        var sizeAttrs = this._editableImg.getImgSize();
        var orientation = this._editableImg.getOrientation();
        if (orientation == Y.M.atto_image.resizeHandles.L || orientation == Y.M.atto_image.resizeHandles.R) {
            sizeAttrs = {width: sizeAttrs.height, height: sizeAttrs.width};
        }
        resizableOverlay.get('boundingBox').setStyles(sizeAttrs);
    }
}, {
    NAME: 'atto_image_resizable'
});