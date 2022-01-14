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

    line(Sx1, Sy1, Sx2, Sy2, color = "black", style_options = "stroke-width='1'")
    /* 	Create a line (segment) between the two specified points: (Sx1, Sy1) and (Sx2, Sy2)
     */
    {
         return `<line x1='${Sx1}' y1='${Sy1}' x2='${Sx2}' y2='${Sy2}' stroke='${color}' ${style_options}/>\n`;
    }



    /*
        GROUPS
     */

    start_group(attributes = "")
	// The SVG opening tag for a group of graphic elements
	{
		if (attributes == "")
			return "<g>\n";
		else
			return "<g $attributes>\n";
	}

	function end_group()
	// A SVG end tag for a group of graphic elements
	{
		return "</g>\n";
	}



    /*
        TEXT
     */

    text(label, Sx, Sy, color = "black", size=8, style_options = "")
    // Create a text label at the specified point
    {
        if (style_options)
            return `<text x='${Sx}' y='${Sy}' fill='${color}' font-size='${size}' ${style_options}>${label}</text>`;
        else
            return `<text x='${Sx}' y='${Sy}' fill='${color}' font-size='${size}'>${label}</text>`;

        return this;
    }



    /*
        COMMENT
     */

    comment(text)
    {
        return `<!-- ${text} -->\n`;
    }



    /*
        TICKS and LABELS (for Axes)
     */


	vertical_tick(Sx, Sy, extension_above, extension_below)
	/* 	Create a vertical plot tick mark (i.e. for a horizontal axis) at the point (x,y).
		extension_above and extension_below are, respectively the lengths of the tick portions
		 shown above and below the axis
	 */
	{
		Sy_tick_min = Sy - extension_above;	// Highest point in the vertical segment forming the tack
		Sy_tick_max = Sy + extension_below;	// Lowest point in the vertical segment forming the tack

        return this.line(Sx, Sy_tick_min, Sx, Sy_tick_max, color="grey");
	}

	vertical_tick_label(Sx, Sy, label_text)
    // Add the specified label below the plot's vertical tack mark at the point (Sx,Sy)
    {
        //$labelLength = strlen($labelText);

        // Adjust to the left the x-positioning based on the size of the label; should also be adjusted based on font size
        /*
        if ($labelLength == 1)
            $labelX = $Sx - 2;
        elseif ($labelLength == 2)
            $labelX = $Sx - 5;
        elseif ($labelLength == 3)
            $labelX = $Sx - 8;
        else
            $labelX = $Sx - 10;
        */

        Sx_label = Sx - 5;
        Sy_label = Sy + 13;		// Should be adjusted based on font size

        return this.text(label_text, Sx_label, Sy_label, "gray");

    }  // vertical_tick_label


    /*
        AXES
     */

    axis_bottom({   xmin,
                    xmax,
                    y,
                    color = "black",
                    dx_tick,
                    label_frequency = 1,
                    x_map,
                    y_map
                 })
    /*
        dx_tick     Spacing between tacks on horizontal axis (in plot coordinates)
     */
    {
        // Convert from Plot to Screen coordinates
        const Sxmin = x_map(xmin);
        const Sxmax = x_map(xmax);
        const Sy_axis = y_map(y);

        const dx_tick = 5;			// Spacing between tacks on horizontal axis (in plot coordinates)

        // Horizontal axis line
        var svg = this.line(Sxmin, Sy, Sxmax, Sy_axis, color = color);

        /* First pass for the ticks (kept together as an SVG group)
         */
        svg += this.start_group("stroke='gray'");	// Pass a styling used for all the tacks

        n_ticks = 0;
        for (x_tick = xmin; x_tick <= xmax; x_tick += dx_tick)  {
            //console.log(`Adding tack line at ${x_tick}`);
            n_ticks += 1;

            Sx_tick = x_map(x_tick);        // Convert from Plot to Screen coordinates

            if ((n_ticks-1) % label_frequency == 0)		// If this tack is to receive a label...
                svg += this.vertical_tick(Sx_tick, Sy_axis, 2, 6);		// ... then make it longer
            else
                svg += this.vertical_tick(Sx_tick, Sy_axis, 2, 2);		// ... otherwise, short


            if (n_ticks > 300)
                break;				// don't go overboard with excessive tacks!
        }
        svg += this.end_group();


        /* Second pass for the labels (kept together as an SVG group)
         */
        svg += this.start_group();

        n_ticks = 0;
        for (x_tick = xmin; x_tick <= xmax; x_tick += dx_tick)  {
            //console.log(`Adding tack line at ${x_tick}`);
            n_ticks += 1;

            Sx_tick = x_map(x_tick);        // Convert from Plot to Screen coordinates

            if ((n_ticks-1) % label_frequency == 0)		// Starting at the very first one, and then proceeding by multiples
                svg += this.vertical_tick_label(Sx_tick, Sy_axis, x_tick);	// Use the value x_tick as a label


            if (n_ticks > 300)
                break;				// don't go overboard with excessive tack labels!
        }
        svg += this.end_group();
    }


    axis_left(ymin, ymax, x, label, color, n_ticks, y_map)
    {
    }

}