<?php
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

/**
 * CSS transform rule validation.
 *
 * @package    core_htmlpurifier
 * @copyright  2016 Joey Andres <jandres@ualberta.ca>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @class HTMLPurifier_AttrDef_CSS_Transform
 *
 * Validates Transform as defined by CSS.
 *
 * TODO: matrix, matrix3d, skew, skewX, skewY, prespective
 */
class HTMLPurifier_AttrDef_CSS_Transform extends HTMLPurifier_AttrDef {
    static protected $floatpattern = "[-+]?[0-9]*\\.?[0-9]+";

    /**
     * @param string $transform
     * @param HTMLPurifier_Config $config
     * @param HTMLPurifier_Context $context
     * @return bool|string
     */
    public function validate($transform, $config, $context)
    {
        $transform = trim($transform);
        if ($transform === '') {
            return false;
        }

        if ($transform === 'none') {
            return $transform;
        }

        if (!self::validate_translate($transform) ||
            !self::validate_rotate($transform) ||
            !self::validate_scale($transform)) {
            return false;
        }

        return $transform;
    }

    /**
     * @param string $transform
     * @return bool true if no translate pattern exist, or the given $transform is valid translate.
     */
    static protected function validate_translate($transform) {
        $floatpattern = self::$floatpattern;
        $translateunitpattern = "(?:em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|%)";

        $translatexyzattern = "/translate[XYZ]\\(\\s*{$floatpattern}{$translateunitpattern}\\s*\\)/";
        $translatepattern =
            "/translate\\(\\s*{$floatpattern}{$translateunitpattern}\\s*," .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*\\)/";
        $translate3dpattern =
            "/translate3d\\(" .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*," .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*," .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*\\)/";

        $translatexyzexist = preg_match("/translate[XYZ]\\(/", $transform) == 1;
        $translateexist = preg_match("/translate\\(/", $transform) == 1;
        $translate3dexist = preg_match("/translate3d\\(/", $transform) == 1;

        $translatexyzvalid = $translatexyzexist && preg_match($translatexyzattern, $transform) == 1;
        $translatevalid = $translateexist && preg_match($translatepattern, $transform) == 1;
        $translate3dvalid = $translate3dexist && preg_match($translate3dpattern, $transform) == 1;

        $translatetransformdne = !($translatexyzexist || $translateexist || $translate3dexist);
        return $translatexyzvalid || $translatevalid || $translate3dvalid || $translatetransformdne;
    }

    /**
     * @param string $transform
     * @return bool true if no rotate pattern exist, or the given $transform is valid rotate.
     */
    static protected function validate_rotate($transform) {
        $floatpattern = self::$floatpattern;
        $rotateunitpattern = "(?:deg|grad|rad|turn)";
        $rotatexyzpattern = "/rotate[XYZ]?\\(\\s*{$floatpattern}{$rotateunitpattern}\\s*\\)/";
        $rotate3dpattern = "/rotate3d\\(" .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*{$floatpattern}{$rotateunitpattern}\\s*\\)/";

        $basicrotateexist = preg_match("/rotate[XYZ]?\\(/", $transform) == 1;
        $rotate3dexist = preg_match("/rotate3d\\(/", $transform) == 1;

        $basicrotatevalid = $basicrotateexist && preg_match($rotatexyzpattern, $transform) == 1;
        $rotate3dvalid = $rotate3dexist && preg_match($rotate3dpattern, $transform) == 1;

        $rotatetransformdne = !($basicrotateexist || $rotate3dexist);
        return $basicrotatevalid || $rotate3dvalid || $rotatetransformdne;
    }

    /**
     * @param string $transform
     * @return bool true if no scale pattern exist, or the given $transform is valid scale.
     */
    static protected function validate_scale($transform) {
        $floatpattern = self::$floatpattern;
        $scalepatern = "/scale\\(\\s*{$floatpattern}\\s*(?:,\\s*{$floatpattern}\\s*)?\\)/";
        $scalexyzpattern = "/scale[XYZ]\\(\\s*{$floatpattern}\\s*\\)/";
        $scale3dpattern = "/scale3d\\(" .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*\\)/";

        $scaleexist = preg_match("/scale\\(/", $transform) == 1;
        $scalexyzexist = preg_match("/scale[XYZ]\\(/", $transform) == 1;
        $scale3dexist = preg_match("/scale3d\\(/", $transform) == 1;

        $scalevalid = $scaleexist && preg_match($scalepatern, $transform) == 1;
        $scalexyzvalid = $scalexyzexist && preg_match($scalexyzpattern, $transform) == 1;
        $scale3dvalid = $scale3dexist && preg_match($scale3dpattern, $transform) == 1;

        $scaletransformdne = !($scaleexist || $scalexyzexist || $scale3dexist);
        return $scalevalid || $scalexyzvalid || $scale3dvalid || $scaletransformdne;
    }
}
