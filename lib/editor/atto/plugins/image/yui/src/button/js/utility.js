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
     * Apply styling specific for editable images. These are gotten rid of after save.
     * @see clean.js of atto
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    enableImageEditable: function(node) {
        node.addClass(Y.M.atto_image.imageEditableClass);
    },

    /**
     * @see enableImageEditable, this is simply the opposite.
     *
     * @param {Y.Node} node to enable hide until save feature.
     */
    disableImageEditable: function(node) {
        node.removeClass(Y.M.atto_image.imageEditableClass);
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
    disableImgWrapperContentEditable: function(editorNode) {
        editorNode.all('.atto-image-wrapper').each(function(imgNode) {
            imgNode.getDOMNode().setAttribute('contenteditable', false);
        });
    },

    /**
     * Disable IE's custom contenteditable features on img.
     *
     * @param {Y.Node} editorNode
     */
    disableIEImgContentEditable: function(editorNode) {
        editorNode.all('img').each(function(imgNode) {
            imgNode.getDOMNode().setAttribute('unselectable', 'on');
            imgNode.getDOMNode().setAttribute('contenteditable', false);
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

            return angle;
        }

        return rotateDegree(node.getDOMNode());
    }
};