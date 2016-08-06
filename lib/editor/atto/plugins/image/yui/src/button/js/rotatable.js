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
 * Adds image rotating capability. Suppose you have an img DOM node with id='foo-img', to
 * rotate the img:
 *
 *     var editableImg = Y.M.atto_image.EditableImg({
 *         node: Y.one('img#foo-img')
 *     });
 *     var options = {
 *       editableImg: editableImg
 *     };
 *     var rotatable = new Y.M.atto_image.rotatable(node);
 *
 * @class Y.M.atto_image.rotatable
 */
Y.M.atto_image.rotatable = function() {
    Y.M.atto_image.rotatable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.M.atto_image.rotatable, Y.Base, {
    /**
     * The DOM element to rotate, more specifically, img.
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
     * Represents the EditableImg, the thing where we suspend the rotate handles and the thing
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

        Y.log('initialized', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    destructor: function() {
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
        this._editableImg.on('click', this._onClick, this);
        this._editableImg.on('dblclick', this._onDblClick, this);
        this._editableImg.on('recalculated', this._onEditableImgRecalculated, this);

        this._enable = true;
        Y.log('enabled', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    /**
     * Call to take down the rotate scaffolding.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this._editableImg.detach('recalculated', this._onEditableImgRecalculated, this);
        this._editableImg.detach('dblclick', this._onDblClick, this);
        this._editableImg.detach('click', this._onClick, this);

        this.detachAll();

        if (this._rotateControlHandleNode) {
            this._rotateControlHandleNode.remove(true);
            this._rotateControlHandleNode = null;
        }

        if (this._rotateControlNode) {
            this._rotateControlNode.remove(true);
            this._rotateControlNode = null;
        }

        this._enable = false;
        Y.log('disabled', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    /**
     * Publish events for Y.M.atto_image.rotatable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event click Fired when at least one of the nodes inside editableImg div is clicked.
         */
        this.publish('click', {
            prefix: Y.M.atto_image.rotatable.NAME,
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event dblclick Fired when at least one of the nodes editableImg div is double clicked.
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
    },

    /**
     * Event handler for click event on rotate auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onClick: function(e) {
        e.stopPropagation();
        this.fire('click', e);
        Y.log('click', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    /**
     * Event handler for dblclick event on rotate auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire('dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.rotatable.NAME);
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
        var imgCenterCoord = Y.M.atto_image.utility.getNodeCenterClientCoord(this._editableImg.node);

        var mouseAngle = Y.M.atto_image.utility.get2DAngle(imgCenterCoord, mouseCoord);
        Y.log(mouseAngle, 'debug', Y.M.atto_image.rotatable.NAME);

        this._editableImg.setRotation(mouseAngle);

        this.fire('rotate:rotate');
    },

    /**
     * rotate:rotate handler.
     *
     * @param {Y.EventFacade} e EventFacade for when rotate ends.
     * @private
     */
    _onRotateEnd: function() {
        this._editableImg.recalculateImgWrapper();
        Y.log('onRotateEnd', 'debug', Y.M.atto_image.rotatable.NAME);
        this.fire('rotate:end');
    },

    /**
     * Rotatable's handler when  this._editableImg recalculated properties after transformation.
     * @param {Y.EventFacade} e EventFacade for when this._editableImg recalculated properties after transformation.
     * @private
     */
    _onEditableImgRecalculated: function() {
        // Don't call this callback when disabled.
        if (!this._enable) {
            return;
        }
    }
}, {
    NAME: 'atto_image_rotatable'
});