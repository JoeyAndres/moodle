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
 *     var options = {
 *       node: Y.one('img#foo-img')
 *     };
 *     var resizable = new Y.M.atto_image.resizable(node);
 *
 * @class Y.M.atto_image.rotatable
 */
Y.namespace('M.atto_image').rotatable = function() {
    Y.M.atto_image.resizable.superclass.constructor.apply(this, arguments);
};
Y.extend(Y.namespace('M.atto_image').rotatable, Y.Base, {
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

    _rotateControlNode: null,

    _rotateControlHandleNode: null,

    initializer: function(cfg) {
        this._editableImg = cfg.editableImg;
        this.node = this._editableImg.node;

        this.enable();

        Y.log('initialized', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    /**
     * Call to build the rotate scaffolding.
     */
    enable: function() {
        // If scaffolding is already establish, don't do a thing.
        if (this._enable) {
            return;
        }

        this._editableImg.enable();  // todo: remove
        this._rotateControlNode = Y.Node.create(Y.M.atto_image.rotateHandleTemplate);
        this._rotateControlHandleNode = this._rotateControlNode.one('.atto-image-rotate-handle');

        var rotating = false;
        this._rotateControlHandleNode.on(['mousedown'], function() {
            rotating = true;
        }, this);
        this._rotateControlHandleNode.on(['mousedown', 'mousemoveoutside'], function(e) {
            if (rotating) {
                console.log('rotatating');
                var mouseCoord = {x: e.clientX, y: e.clientY};
                var imgCenterCoord = Y.M.atto_image.utility.getNodeCenterClientCoord(
                    this._editableImg.node
                );

                var mouseAngle = Y.M.atto_image.utility.get2DAngle(imgCenterCoord, mouseCoord);
                console.log(mouseAngle);

                this._editableImg.setRotation(mouseAngle);
            }
        }, this);
        this._rotateControlHandleNode.on(['mouseup', 'mouseupoutside'], function() {
            rotating = false;
            this._editableImg.recalculateImgWrapper();
            Y.log('onRotateEnd', 'debug', Y.M.atto_image.rotatable.NAME);
        }, this);

        this._editableImg.addControl(this._rotateControlNode);

        // If this._editableImg is click/dblclick, we pass the event here.
        this._editableImg.on(Y.M.atto_image.EditableImg.NAME + ':click', this._onClick.bind(this));
        this._editableImg.on(Y.M.atto_image.EditableImg.NAME + ':dblclick', this._onDblClick.bind(this));

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
         * @event atto_image_rotatable:click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_rotatable:dblclick Fired when at least one of the nodes inside resize div is double clicked.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_rotatable:resize:start Fired before resizing.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':resize:start', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_rotatable:resize:resize Fired during resizing.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':resize:resize', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_rotatable:resize:end Fired after resizing.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':resize:end', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_rotatable:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event atto_image_rotatable:delete Fired once the node (image) or any auxiliary resizing items is deleted.
         */
        this.publish(Y.M.atto_image.rotatable.NAME + ':delete', {
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
        this.fire(Y.M.atto_image.rotatable.NAME + ':click', e);
        Y.log('click', 'debug', Y.M.atto_image.rotatable.NAME);
    },

    /**
     * Event handler for dblclick event on resize auxiliary DOM elements.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire(Y.M.atto_image.rotatable.NAME + ':dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.rotatable.NAME);
    }
}, {
    NAME: 'atto_image_rotatable'
});