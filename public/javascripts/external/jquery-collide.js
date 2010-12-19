$.ui.plugin.add("draggable", "collide", {
    start: function(event, ui) {
        var $t = $(this), widget = $t.data("draggable");
        // TODO - make peers configurable
        widget.peers = $t.siblings();
        widget.mode = widget.options.collide;
        // If we're being dragged, then *we're* the overlapper. :)
        if (widget.mode == 'flag') $t.removeClass('ui-draggable-overlapped');
    },

    drag: function(event, ui) {
        var $t = $(this), widget = $t.data("draggable");
        if (widget.mode == 'flag') $t.removeClass('ui-draggable-overlapping');
        $(widget.peers).each(function (i, peer) {
            var $p = $(peer);
            var ix1 = ui.position.left, ix2 = ix1 + $t.width();
            var iy1 = ui.position.top, iy2 = iy1 + $t.height();
            var px1 = $p.position().left, px2 = px1 + $p.width();
            var py1 = $p.position().top, py2 = py1 + $p.height();
            
            // Test for overlap
            if (((ix1 &lt;= px1 &amp;&amp; ix2 &gt;= px1) || (ix1 &lt;= px2 &amp;&amp; ix2 &gt;= px2)) &amp;&amp;
                ((iy1 &lt;= py1 &amp;&amp; iy2 &gt;= py1) || (iy1 &lt;= py2 &amp;&amp; iy2 &gt;= py2))) {
                if (widget.mode == 'flag') {
                    $p.addClass('ui-draggable-overlapped');
                    $t.addClass('ui-draggable-overlapping');
                    $p.removeClass('ui-draggable-overlapping');
                } else if (widget.mode == 'block') {
                    // Calculate a ratio of the overlap to decide which face to slide along
                    overlapx = Math.min(ix2, px2) - Math.max(ix1, px1);
                    overlapy = Math.min(iy2, py2) - Math.max(iy1, py1);
                    if (Math.abs(overlapx) &gt; Math.abs(overlapy)) {
                        if (iy1 &lt;= py1) ui.position.top = py1 - $t.height();
                        if (iy1 &gt; py1) ui.position.top = py2;
                    } else {
                        if (ix1 &lt;= px1) ui.position.left = px1 - $t.width();
                        if (ix1 &gt; px1) ui.position.left = px2;
                    }
                }
            } else {
                if (widget.mode == 'flag') {
                    $p.removeClass('ui-draggable-overlapping');
                    $p.removeClass('ui-draggable-overlapped');
                }
            }
        });
    }
});