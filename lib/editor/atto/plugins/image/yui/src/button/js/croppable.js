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

        Y.log('initialized', 'debug', Y.M.atto_image.croppable.NAME);
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
        Y.log('enabled', 'debug', Y.M.atto_image.croppable.NAME);
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
        Y.log('disabled', 'debug', Y.M.atto_image.croppable.NAME);
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
        Y.log('crop start', 'debug', Y.M.atto_image.croppable.NAME);
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
        Y.log('crop end', 'debug', Y.M.atto_image.croppable.NAME);
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
        Y.log('Angle: ' + imgAngle + 'deg', 'debug', Y.M.atto_image.croppable.NAME);

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
});