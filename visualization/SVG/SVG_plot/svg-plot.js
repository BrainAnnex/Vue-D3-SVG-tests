/********************************************************************************************************************

		LOW-LEVEL GRAPHICS:  CLASS "SVGplot"

 ********************************************************************************************************************/

class SVGplot
/* 	Low-level plotting class, specific to the SVG language.

	All coordinates are screen-coordinate integers (origin at top/left; y-axis pointing down)

	Screen coordinates referred to as:  (Sx, Sy)
 */
{
    constructor(plot_width, plot_height)
    // Create the opening <SVG> tag
    {
        this.svg = "";			// The SVG code (XML text string), representing the overall plot being built up

        this.svg = `<svg viewBox='0 0 ${plot_width} ${plot_height}' xmlns='http://www.w3.org/2000/svg'>\n`;
        // Need the "xmlns" part to prevent the program "SVG-edit" from complaining

        return this;
    }


    add_point(Sx, Sy, r, color)
    // Add a point, with the specified coordinates, radius, and color
    {
        this.svg += `<circle cx='${Sx}' cy='${Sy}' r='${r}' stroke='${color}' stroke-width='1' />\n`;

        //console.log(this.svg);
        return this;
    }


    add_line(Sx1, Sy1, Sx2, Sy2)
	/* 	Add to the current plot a line (segment) between the two specified points: (Sx1, Sy1) and (Sx2, $y2)
	 */
	{
		this.svg += `<line x1='${Sx1}' y1='${Sy1}' x2='${Sx2}' y2='${Sy2}' stroke='black' />\n`;

		return this;
	}

    // ----------------------------------------------------------------------------

    terminate_plot()
    // Close the <SVG> element and return the string with the complete SVG code
    {
        this.svg += "</svg>\n";

        return this.svg;

    }  // terminatePlot()
}



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

let plot = new SVGplot(200, 400);

svg_code = plot
    .add_point(30, 10, 5, 'green')
    .add_point(80, 30, 3, 'orange')
    .add_line(30, 10, 80, 30)
    .terminate_plot();

console.log(svg_code);


