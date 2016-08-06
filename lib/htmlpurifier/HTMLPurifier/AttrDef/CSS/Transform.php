<?php

/**
 * Validates Transform as defined by CSS.
 *
 * TODO: matrix, matrix3d, skew, skewX, skewY, prespective
 */
class HTMLPurifier_AttrDef_CSS_Transform extends HTMLPurifier_AttrDef
{

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

    static public function validate_translate($transform) {
        $floatpattern = "[-+]?[0-9]*\\.?[0-9]+";
        $translateunitpattern = "(?:em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|%)";
        $basictranslatepattern = "/translate[XYZ]?\\(\\s*{$floatpattern}{$translateunitpattern}\\s*\\)/";
        $translate3dpattern = "/translate3d\\(" .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*," .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*," .
            "\\s*{$floatpattern}{$translateunitpattern}\\s*\\)/";

        $basictranslatevalid = preg_match("/translate[XYZ]?/", $transform) == 1 &&
            preg_match($basictranslatepattern, $transform) == 1;
        $translate3dvalid = preg_match("/translate3d/", $transform) == 1 &&
            preg_match($translate3dpattern, $transform) == 1;

        $translatetransformdne = !$basictranslatevalid && !$translate3dvalid;
        return $basictranslatevalid || $translate3dvalid || $translatetransformdne;
    }

    static public function validate_rotate($transform) {
        $floatpattern = "[-+]?[0-9]*\\.?[0-9]+";
        $rotateunitpattern = "(?:deg|grad|rad|turn)";
        $basicrotatepattern = "/rotate[XYZ]?\\(\\s*{$floatpattern}{$rotateunitpattern}\\s*\\)/";
        $rotate3dpattern = "/rotate3d\\(" .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*{$floatpattern}{$rotateunitpattern}\\s*\\)/";

        $basicrotatevalid = preg_match("/rotate[XYZ]?/", $transform) == 1 &&
            preg_match($basicrotatepattern, $transform) == 1;
        $rotate3dvalid = preg_match("/rotate3d/", $transform) == 1 &&
            preg_match($rotate3dpattern, $transform) == 1;

        $rotatetransformdne = !$basicrotatevalid && !$rotate3dvalid;
        return $basicrotatevalid || $rotate3dvalid || $rotatetransformdne;
    }

    static public function validate_scale($transform) {
        $floatpattern = "[-+]?[0-9]*\\.?[0-9]+";
        $basicscalepattern = "/scale[XYZ]?\\(\\s*{$floatpattern}\\s*\\)/";
        $scale3dpattern = "/scale3d\\(" .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*," .
            "\\s*$floatpattern\\s*\\)/";

        $basicscalevalid = preg_match("/scale[XYZ]?/", $transform) == 1 &&
            preg_match($basicscalepattern, $transform) == 1;
        $scale3dvalid = preg_match("/scale3d/", $transform) == 1 &&
            preg_match($scale3dpattern, $transform) == 1;

        $scaletransformdne = !$basicscalevalid && !$scale3dvalid;
        return $basicscalevalid || $scale3dvalid || $scaletransformdne;
    }
}

// vim: et sw=4 sts=4
