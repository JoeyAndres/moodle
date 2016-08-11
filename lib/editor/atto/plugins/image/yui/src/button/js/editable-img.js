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
        if (!this.nodeWrapper) {
            this.node.wrap(Y.Handlebars.compile(Y.M.atto_image.imgWrapperTemplate)({
                content: ''
            }));
            this.nodeWrapper = this.node.ancestor('.atto-image-wrapper');
        }

        this.enable();

        this._publishEvents();

        Y.log('initialized', 'debug', Y.M.atto_image.EditableImg.NAME);
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

        Y.log('enabled', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Destroys the EditableImg.
     */
    disable: function() {
        // If scaffolding is not a yet establish, don't do a thing.
        if (!this._enable) {
            return;
        }

        this.stopDeleteMutationObserver();

        this._destroyImgNode();
        this._destroyImgWrapper();

        this._enable = false;

        Y.log('disabled', 'debug', Y.M.atto_image.EditableImg.NAME);
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

    /**
     * The container of the node.
     * @return {Y.Node} Return the nodeWrapper.
     */
    getImgWrapper: function() {
        return this.nodeWrapper;
    },

    /**
     * Sets the size of the img.
     * @param {{width: {Number}, height: {Number}}} size New size of the image.
     */
    setSize: function(size) {
        this.node.setAttrs({
            width: size.width,
            height: size.height
        });

        // Since nodeWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeWrapper.setStyles({
            width: size.width,
            height: size.height
        });
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
        this.nodeWrapper.appendChild(controlNode);
    },

    /**
     * Publish events for Y.M.atto_image.resizable object.
     *
     * @private
     */
    _publishEvents: function() {
        /**
         * @event atto_image_EditableImg:click Fired when at least one of the nodes inside resize div is clicked.
         *                                   (Or resize obj is clicked).
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':click', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_EditableImg:dblclick Fired when at least one of the nodes inside resize div is double
         *                                      clicked.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':dblclick', {
            emitFacade: true,
            broadcast: 2  // Global broadcast, just like button clicks.
        }, this);

        /**
         * @event atto_image_EditableImg:init Fired once at the beginning. Due to some bug in YUI.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':init', {
            emitFacade: true,
            broadcast: 2, // Global broadcast, just like button clicks.
            context: this
        }, this);

        /**
         * @event atto_image_EditableImg:delete Fired once the node (image) or any auxiliary
         *        resizing items is deleted.
         */
        this.publish(Y.M.atto_image.EditableImg.NAME + ':delete', {
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
        this._enableImageEditable(this.node);
    },

    /**
     * Destroys the stuff from @see this._setupImgNode
     * @private
     */
    _destroyImgNode: function() {
        this._disableImageEditable(this.node);
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

        // Copy all styling from node to container.
        this.nodeWrapper.getDOMNode().style.cssText = this.node.getDOMNode().style.cssText;

        // Do this so we can delete the image.
        this.nodeWrapper.setAttribute('contenteditable', true);

        // Since nodeWrapper is div, we can only set its size via css styles not html attributes.
        this.nodeWrapper.setStyles({
            width: this.node.getAttribute('width'),
            height: this.node.getAttribute('height')
        });

        /*
         * Setup some quirks, i.e. Although they are styling that applies outside the border, we don't want some
         * values of them since they can disrupt proper operation.
         *
         * display: We want initial|display|inline -> inline-block to respect the margins.
         */
        var nodeDisplayStyle = this.node.getComputedStyle("display") || 'inline-block';
        if (nodeDisplayStyle.toLowerCase() === "inline") {
            nodeDisplayStyle = "inline-block";
        }

        // Position: We want initial|static -> relative so child with position: absolute, respect container.
        // @see https://developer.mozilla.org/en/docs/Web/CSS/position
        var nodePositionStyle = this.node.getComputedStyle("position") || 'relative';
        if (nodePositionStyle.toLowerCase() === "static" || nodePositionStyle.toLowerCase() === "initial") {
            nodePositionStyle = "relative";
        }

        /*
         * Reset all styling that applies from border within, the following is the list of such, and explanation why:
         * a.) width/height: We want the container to hug node (img)
         * b.) padding: We want the container to hug node
         * c.) border-width: We want the container to hug node, plus, node already have this (copied from node).
         * d.) (... Insert something due to a bug ...)
         */
        this.nodeWrapper.setStyles({
            // (3) Quirks.
            display: nodeDisplayStyle,
            position: nodePositionStyle
        });

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
            Y.log('dragstart', 'debug', Y.M.atto_image.EditableImg.NAME);
            e.halt(true);
        }, this);
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

        this.nodeWrapper.detachAll();

        // This doesn't have to be done but just in case the user manually edit the width/height of the image,
        // might as well have the nodeWrapper automatically adjust to the size of that.
        this.nodeWrapper.setStyles({
            width: 'auto',
            height: 'auto'
        });

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
        this.fire(Y.M.atto_image.EditableImg.NAME + ':click', e);
        Y.log('click', 'debug', Y.M.atto_image.EditableImg.NAME);
    },

    /**
     * Event handler for dblclick event.
     *
     * @param {Y.EventFacade} e Event facade object.
     * @private
     */
    _onDblClick: function(e) {
        e.stopPropagation();
        this.fire(Y.M.atto_image.EditableImg.NAME + ':dblclick', e);
        Y.log('dblclick', 'debug', Y.M.atto_image.EditableImg.NAME);
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

        this.fire(Y.M.atto_image.EditableImg.NAME + ':delete');
        Y.log('delete', 'debug', Y.M.atto_image.EditableImg.NAME);
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
        Y.log(supported ? 'supported' : 'not supported', 'debug', Y.M.atto_image.EditableImg.NAME);
        return supported;
    }
});