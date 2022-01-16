class SVGhelper
/* 	Helper function to generate either individual SVG tags, or larger SVG constructs.

	All coordinates are screen-coordinate integers (origin at top/left; x-axis point right; y-axis pointing DOWN)

	Screen coordinates referred to as:  (Sx, Sy)
 */
{

    /*
        SHAPES
     */

    point(Sx, Sy, r = 2, color = 'black')
    // Create a point, with the specified coordinates, radius, and color
    {
         return `<circle cx='${Sx}' cy='${Sy}' r='${r}' stroke='${color}' stroke-width='1' fill='black'/>`;
    }


    line(Sx1, Sy1, Sx2, Sy2)    // stroke-width='1'
    /* 	Create a line (segment) between the two specified points: (Sx1, Sy1) and (Sx2, Sy2)
     */
    {
         return `<line x1='${Sx1}' y1='${Sy1}' x2='${Sx2}' y2='${Sy2}'/>`;
    }



    /*
        GROUPS
     */

    start_group(attributes = "")
	// The SVG opening tag for a group of graphic elements
	{
		if (attributes == "")
			return "<g>";
		else
			return `<g ${attributes}>`;
	}

	end_group()
	// A SVG end tag for a group of graphic elements
	{
		return "</g>";
	}



    /*
        TEXT
     */

    text(label, Sx, Sy, style_options = "")
    /*  Create a text label at the specified point.
        The x-position of the text refers to its left side, unless CSS
        directives such as "text-anchor: middle"  are used.
        The y-position refers to the BOTTOM of the text.
     */
    {
        if (style_options)
            return `<text x='${Sx}' y='${Sy}' ${style_options}>${label}</text>`;
        else
            return `<text x='${Sx}' y='${Sy}'>${label}</text>`;

        return this;
    }



    /*
        COMMENT
     */

    comment(text)
    {
        return `<!-- ${text} -->`;
    }



    /*
        TICKS and LABELS (for Axes)
     */


	vertical_tick(Sx, Sy, extension_above, extension_below)
	/* 	Create a vertical plot tick mark (i.e. meant for a horizontal axis) at the point (Sx,Sy).
		extension_above and extension_below are, respectively the lengths of the tick portions
		shown above and below the axis
	 */
	{
		const Sy_tick_min = Sy - extension_above;	// Highest point in the vertical segment forming the tack
		const Sy_tick_max = Sy + extension_below;	// Lowest point in the vertical segment forming the tack

        return this.line(Sx, Sy_tick_min, Sx, Sy_tick_max);
	}




    /*
        AXES
     */

    axis_bottom( {  Sxmin, Sxmax,
                    Sy_axis,
                    categorical_labels,
                    tick_above=0,
                    tick_below=6} )
    /*  Create a horizontal axis line meant to be placed below a plot.

        Use CSS for styling.  The following classes are created:
                            'axis-line', 'ticks', 'tick-labels'

        EXAMPLE:  g.tick-labels { translate(0, 10px); }  to shift down the tick labels

        Sxmin:              x-coord of left side of axis, in screen coordinates
        Sxmax:              x-coord of right side of axis, in screen coordinates
        Sy_axis:            y-coord of axis, in screen coordinates
        categorical_labels  List of desired label names (equally-spaced, at the center of their intervals)
        tick_above:         Amount by which ticks stick above axis, in screen coordinates
        tick_below:         Amount by which ticks stick below axis, in screen coordinates
     */
    {
        // Horizontal axis line
        let svg = "";

        svg += this.start_group("class='axis-line'");
        svg += this.line(Sxmin, Sy_axis, Sxmax, Sy_axis);
        svg += this.end_group();

        const n_ticks = categorical_labels.length;
        const bin_width = (Sxmax - Sxmin) / n_ticks;

        /* Handle the TICKS (kept together as an SVG group)
         */
        svg += this.start_group("class='ticks'");	            // Pass a class used for all the ticks

        for (let Sx_tick = Sxmin + 0.5 * bin_width;
                                Sx_tick <= Sxmax;
                                Sx_tick += bin_width)
        {
            svg += this.vertical_tick(Sx_tick, Sy_axis, tick_above, tick_below);
        }

        svg += this.end_group();                                // end of the ticks


        /* Handle the TICK LABELS (kept together as an SVG group)
         */
        svg += this.start_group("class='tick-labels'");         // Pass a class used for all the labels

        let label_index = 0;
        for (let Sx_tick = Sxmin + 0.5 * bin_width;
                                Sx_tick <= Sxmax;
                                Sx_tick += bin_width)
        {
            svg += this.text(categorical_labels[label_index], Sx_tick, Sy_axis+tick_below, "dy=0.9em");
            // Note: dy specifies a downward shift proportional to the font size,
            //       to clear the ticks regardless of font.  Extra control can be achieved with CSS

            label_index += 1;
        }

        svg += this.end_group();                                // end of the labels

        return svg;
    }


    axis_bottom_from_scale( {   x_scale_func,
                                Sy_axis,
                                categorical_labels,
                                tick_above=0,
                                tick_below=6  } )
    /*  Create a horizontal axis line meant to be placed below a plot.

        Use CSS for styling.  The following classes are created:
                            'axis-line', 'ticks', 'tick-labels'

        EXAMPLE:  g.tick-labels { translate(0, 10px); }  to shift down the tick labels

        x_scale_func:       function produced with d3.scaleBand()
        Sy_axis:            y-coord of axis, in screen coordinates
        categorical_labels  List of desired label names (equally-spaced, at the center of their intervals)
        tick_above:         Amount by which ticks stick above axis, in screen coordinates
        tick_below:         Amount by which ticks stick below axis, in screen coordinates
     */
    {
        const n_items = categorical_labels.length;

        const bin_width = x_scale_func.bandwidth();

        const Sxmin = x_scale_func(categorical_labels[0]);
        const Sxmax = x_scale_func(categorical_labels[n_items-1]) + bin_width;

        // Horizontal axis line
        let svg = "";

        svg += this.start_group("class='axis-line'");
        svg += this.line(Sxmin, Sy_axis, Sxmax, Sy_axis);
        svg += this.end_group();


        /* Handle the TICKS (kept together as an SVG group)
         */
        svg += this.start_group("class='ticks'");	            // Pass a class used for all the ticks

        for (let item_index = 0;  item_index < n_items;  ++item_index)  {
            let Sx_tick = x_scale_func(categorical_labels[item_index]) + 0.5 * bin_width;
            svg += this.vertical_tick(Sx_tick, Sy_axis, tick_above, tick_below);
        }

        svg += this.end_group();                                // end of the ticks


        /* Handle the TICK LABELS (kept together as an SVG group)
         */
        svg += this.start_group("class='tick-labels'");         // Pass a class used for all the labels

        for (let item_index = 0;  item_index < n_items;  ++item_index)  {
            let Sx_tick = x_scale_func(categorical_labels[item_index]) + 0.5 * bin_width;
            svg += this.text(categorical_labels[item_index], Sx_tick, Sy_axis+tick_below, "dy=0.9em");
            // Note: dy specifies a downward shift proportional to the font size,
            //       to clear the ticks regardless of font.  Extra control can be achieved with CSS
        }

        svg += this.end_group();                                // end of the labels

        return svg;
    }



    axis_left()
    // TODO
    {
    }

}