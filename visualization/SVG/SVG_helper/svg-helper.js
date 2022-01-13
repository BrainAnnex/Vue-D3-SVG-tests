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
        AXES
     */

    axis_bottom(xmin, xmax, y, label, color = "black", n_ticks, x_map, y_map)
    {
        const Sxmin = x_map(xmin);
        const Sxmax = x_map(xmax);
        const Sy = y_map(y);

        // Horizontal axis line
        var svg = this.line(Sxmin, Sy, Sxmax, Sy, color = color);
    }

    axis_left(ymin, ymax, x, label, color = "black", n_ticks, y_map)
    {
    }

}