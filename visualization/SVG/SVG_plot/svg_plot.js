/*
	NOTE:   THIS IS AN OBSOLETE INTERIM LIBRARY, NOT COMPLETED NOR DIRECTLY USED (except in some early tests).

	        Partial port to JavaScript of the old PHP libraries with the same names (in folder "SVG_with_PHP");
	        this code is not in actual use, but it contributed to the final JavaScript library "SVG_helper" (in active use)

	Plots and Graphics with SVG, comprising the following CLASSES:

	    "SVGplot"
	    "coordsMapping"
	    "point"
	    "plotting"

	Screen coordinates referred to (not yet consistently) as:  (Sx, Sy)
 */



/********************************************************************************************************************

		LOW-LEVEL GRAPHICS:  CLASS "SVGplot"

 ********************************************************************************************************************/

class SVGplot
/* 	Low-level plotting class, specific to the SVG language.

	All coordinates are screen-coordinate integers (origin at top/left; x-axis point right; y-axis pointing DOWN)

	Screen coordinates referred to as:  (Sx, Sy)
 */
{
    constructor(plot_width, plot_height)
    // Create the opening <SVG> tag
    {
        this.svg = "";			// The SVG code (XML text string), representing the overall plot being built up

         //this.add_SVG_code(`<svg viewBox='0 0 ${plot_width} ${plot_height}' xmlns='http://www.w3.org/2000/svg'>`);
         this.add_SVG_code(`<svg width='${plot_width}' height='${plot_height}'>`);
        // Need the "xmlns" part to prevent the program "SVG-edit" from complaining

        return this;
    }



    /*
        SHAPES
     */

    add_point(Sx, Sy, r = 2, color = 'black')
    // Add a point, with the specified coordinates, radius, and color
    {
         this.add_SVG_code(`<circle cx='${Sx}' cy='${Sy}' r='${r}' stroke='${color}' stroke-width='1'  fill='black'/>`);

        //console.log(this.svg);
        return this;
    }


    add_line(Sx1, Sy1, Sx2, Sy2, color = "black", styleOptions = "stroke-width='1'")
	/* 	Add to the current plot a line (segment) between the two specified points: (Sx1, Sy1) and (Sx2, Sy2)
	    Color and  Styling options will be applied if provided
	 */
	{
		 this.add_SVG_code(`<line x1='${Sx1}' y1='${Sy1}' x2='${Sx2}' y2='${Sy2}' stroke='${color}' ${styleOptions}/>`);

		return this;
	}


	add_rectangle(x, y, width, height, class_name = "")
	// (x, y) is the coordinate of the left-top corner
    {
        //const Swidth = Sx2 - Sx1;
        //const SyTop = SyBase - height;

        this.add_SVG_code(`<rect x='${x}' y='${y}' width='${width}' height='${height}' fill='none' stroke='black'  class='${class_name}'/>`);

		return this;
    }

	add_rectangle_old(Sx1, Sx2, SyBase, height = 45)
    {
        const Swidth = Sx2 - Sx1;
        const SyTop = SyBase - height;

        this.add_SVG_code(`<rect x='${Sx1}' y='${SyTop}' width='${Swidth}' height='${height}' fill='none' stroke='black' />`);
        //$this->svg .= "<rect x='$x1' y='$yTop' width='$width' height='$height' fill='rgb(180,180,180)' stroke='none' opacity='0.3'/>\n";

		return this;
    }


    addCircle(Sx, Sy, r = 2)
    // Add a circle, with the specified coordinates and radius (optional)
    {
        this.add_SVG_code(`<circle cx='${Sx}' cy='${Sy}' r='${r}' stroke='gray' fill='none' />`);

		return this;
    }

    addHalfCircle(Sx, Sy, r = 2)
    // Add a half circle, open to the left, with the specified coordinates and radius (optional)
    {
        const top = Sy - r;
        const bottom = Sy + r;

        this.add_SVG_code(`<path d='M ${Sx},${top} A ${r},${r} 0 0,1 ${Sx},${bottom}' stroke='gray' fill='none' />`);

		return this;
    }



    /*
        TEXT
     */

    addText(label, Sx, Sy, color = "black", styleOptions = "")
    // Add a text label at the specified point
    {
        if (styleOptions)
           this.add_SVG_code(`<text x='${Sx}' y='${Sy}' fill='${color}' ${styleOptions}>${label}</text>`);
        else
            this.add_SVG_code(`<text x='${Sx}' y='${Sy}' font-size='8' fill='${color}'>${label}</text>`);

		return this;
    }


    // ----------------------------------------------------------------------------

    terminate_plot()
    // Close the <SVG> element and return the string with the complete SVG code
    {
        this.svg += "</svg>\n";

        return this.svg;
    }


    // ----------------------------------------------------------------------------

    add_SVG_code(SVGcode)
    // Append the given SVG code to the current plot (the SVG code being built), with a newline suffix for readibility
    {
        this.svg += SVGcode + "\n";
    }

} // class SVGplot



/********************************************************************************************************************

	            COORDINATE TRANSFORMATIONS

 ********************************************************************************************************************/

class CoordsMapping
{
	/*
		Affine coordinate transformation to map the [Tmin-Tmax] interval to [Zmin-Zmax]:

		Z = a T + b

			{Zmin = a Tmin + b
			{Zmax = a Tmax + b

		Solving for a and b:
			b = (Zmax-Zmin) / (Tmax-Tmin)
			a = Zmin - b*Tmin

		During the final transformation, all values are rounded off to integers
	*/

    constructor(Tmin, Tmax, Zmin, Zmax)
    {
        if (Tmin == Tmax)  {    //  Error situation when the denominator, below, would become zero
            alert("The first 2 arguments cannot be equal in CoordsMapping!");
            return;
        }
        this.b = (Zmax-Zmin) / (Tmax-Tmin);
        this.a = Zmin - this.b * Tmin;

        console.log(`Coordinate transformation pars (Z = a + b T) :  a = ${this.a}  | b = ${this.b}`);
    }



    transform(t)
    // Map a value from the old to the new coordinate system
    {
        return Math.round(this.a  +  this.b * t);
    }

}  // class CoordsMapping


/*
let x_scaling = new CoordsMapping(0., 10., 5., 105.);

let result = x_scaling.transform(0.01);

console.log(result);
*/

/*
let plot = new SVGplot(200, 400);

svg_code = plot
    .add_point(30, 10, 5, 'green')
    .add_point(80, 30, 3, 'orange')
    .add_line(30, 10, 80, 30)
    .terminate_plot();

console.log(svg_code);
*/