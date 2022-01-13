<?
/*
	Last revised 7/5/2018

	LOW-LEVEL GRAPHICS for Plots and Graphics with SVG:  CLASSES "SVGplot", "coordsMapping" and "point"

	Screen coordinates referred to (not yet consistently) as:  (Sx, Sy)
 */



/********************************************************************************************************************

		LOW-LEVEL GRAPHICS:  CLASS "SVGplot"

 ********************************************************************************************************************/

class SVGplot	// TODO: maybe rename EasySVG
/* 	Low-level plotting class, specific to the SVG language.

	All coordinates are screen-coordinate integers (origin at top/left; y-axis pointing down)
 */
{
	private $svg = "";			// The SVG code (XML text string), representing the overall plot being built up

	// Handy defaults
	public $verticalArrowHalfWidth = 3;
	public $verticalArrowHeight = 6;


	function __construct($plot_width, $plot_height)
	// Create the opening <SVG> tag
	{
		//$this->svg = "<svg width='$plot_width' height='$plot_height' xmlns='http://www.w3.org/2000/svg'>\n";
		$this->svg = "<svg viewBox='0 0 $plot_width $plot_height' xmlns='http://www.w3.org/2000/svg'>\n";
		// Need the "xmlns" part to prevent the program "SVG-edit" from complaining
	}

	function addSVGcode($SVGcode)	// TODO: rename to add_SVG_code()
	// Append the given SVG code to the current plot (the SVG code being built), with a newline suffix for readability
	{
		$this->svg .= $SVGcode . "\n";
	}


	function startGroup($attributes = "")
	// Add an SVG opening tag for a group of graphic elements
	{
		if ($attributes == "")
			$this->svg .= "<g>\n";
		else
			$this->svg .= "<g $attributes>\n";
	}

	function endGroup()
	// Add an SVG end tag for a group of graphic elements
	{
		$this->svg .= "</g>\n";
	}


	function addPoint($Sx, $Sy, $r = 2, $color='green')
	// Add a point, with the specified coordinates, radius (optional), and color (optional)
	{
		$this->svg .= "<circle cx='$Sx' cy='$Sy' r='$r' stroke='$color' stroke-width='1' fill='black' />\n";
	}


	function addLine($Sx1, $Sy1, $Sx2, $Sy2, $color = "black", $styleOptions = "stroke-width='2'")
	/* 	Add to the current plot a line (segment) between the two specified points: ($Sx1, $Sy1) and ($Sx2, $Sy2)
		Color and  Styling options will be applied if provided
	 */
	{
		$this->svg .= "<line x1='$Sx1' y1='$Sy1' x2='$Sx2' y2='$Sy2' stroke='$color' $styleOptions />\n";
	}


	function addText($label, $Sx, $Sy, $color = "black", $styleOptions = "")
	// Add a text label at the specified point
	{
		if ($styleOptions)
			$this->svg .= "<text x='$Sx' y='$Sy' fill='$color' $styleOptions>$label</text>\n";
		else
			$this->svg .= "<text x='$Sx' y='$Sy' font-size='8' fill='$color'>$label</text>\n";

	} // addText()


	function addRectangle($Sx1, $Sx2, $SyBase, $height = 45)
	{
		$Swidth = $Sx2 - $Sx1;
		$SyTop = $SyBase - $height;

		$this->addSVGcode("<rect x='$Sx1' y='$SyTop' width='$Swidth' height='$height' fill='none' stroke='black' />");	// TO-DO: addSVGcode() should be used everywhere
		//$this->svg .= "<rect x='$x1' y='$yTop' width='$width' height='$height' fill='rgb(180,180,180)' stroke='none' opacity='0.3'/>\n";

	}  // addRectangle()


	function addCircle($Sx, $Sy, $r = 2)
	// Add a circle, with the specified coordinates and radius (optional)
	{
		$this->svg .= "<circle cx='$Sx' cy='$Sy' r='$r' stroke='gray' fill='none' />\n";
	}

	function addHalfCircle($Sx, $Sy, $r = 2)
	// Add a half circle, open to the left, with the specified coordinates and radius (optional)
	{
		$top = $Sy - $r;
		$bottom = $Sy + $r;
		$this->svg .= "<path d='M $Sx,$top A $r,$r 0 0,1 $Sx,$bottom' stroke='gray' fill='none' />\n";
	}


	function addPolygon($pointList)
	// Add a closed, filled polygon formed from an array of points
	{
		$svgPoints = "";

		foreach ($pointList as $pnt)
			$svgPoints .= $pnt->commaSeparatedCoords() . " ";

		$this->addSVGcode("<polygon points='$svgPoints' />");

	}  // function addPolygon()


	function addHorizontalAxis($SxMin, $SxMax, $Y)
	/*	Add a horizontal x-axis line to the plot, at the specified y-coordinate,
	    spanning the indicating range of x-coordinates.
		Precede the SVG tag by a comment pointing out the new graph (TODO: move commenting to a separate method)
	*/
	{
		// Horizontal axis line, preceded by a comment
		$this->svg .= "<!-- NEW GRAPH -->\n<line x1='$SxMin' y1='$Y' x2='$SxMax' y2='$Y' style='stroke:black' />\n";

	}  // addHorizontalAxis()


	function addVerticalAxis($Ymin, $Ymax, $X)
	/*	Add a vertical y-axis line to the plot, at the specified x-coordinate, spanning the indicating range of y-coordinates
	*/
	{
		// Vertical axis line
		$this->svg .= "<line x1='$X' y1='$Ymin' x2='$X' y2='$Ymax' stroke='black' />\n";

	}  // addHorizontalAxis()



	function addVerticalTack($x, $y, $tackExtensionBelow = 4)
	/* 	Create a vertical plot tack mark (i.e. for a horizontal axis) at the point (x,y), and add it to the plot.
		$tackExtensionBelow is the length of the portion shown BELOW the axis (amenable to adjustments for emphasis.)
	 */
	{
		$tackExtensionAbove = 2;				// Portion shown above the horizontal axis (on the main plot itself)

		$tackYmin = $y - $tackExtensionAbove;	// Highest point in the vertical segment forming the tack
		$tackYmax = $y + $tackExtensionBelow;	// Lowest point in the vertical segment forming the tack

		$this->svg .= "<line x1='$x' y1='$tackYmin' x2='$x' y2='$tackYmax' />\n";	// stroke='gray'

	}  // addVerticalTack()


	function addHorizontalTack($x, $y, $color="gray")
	// Create a horizontal plot tack mark (i.e. for a vertical axis) at the point (x,y), and add it to the plot
	{
		$tackExtensionRight = 2;			// Portion shown to the right of the vertical axis (i.e. on the main plot itself)
		$tackExtensionLeft = 4;				// Portion shown to the left of the axis

		$tackSxMin = $x - $tackExtensionLeft;
		$tackSxMax = $x + $tackExtensionRight;

		$this->svg .= "<line x1='$tackSxMin' y1='$y' x2='$tackSxMax' y2='$y' stroke='$color' />\n";	// Note: the horizontal tacks aren't grouped together; so each must specify its color

	}  // addVerticalTack()


	function addVerticalTackLabel($Sx, $Sy, $labelText)
	// Add the specified label below the plot's vertical tack mark at the point (Sx,Sy)
	{
		$labelLength = strlen($labelText);

		// Adjust to the left the x-positioning based on the size of the label; should also be adjusted based on font size
		if ($labelLength == 1)
			$labelX = $Sx - 2;
		elseif ($labelLength == 2)
			$labelX = $Sx - 5;
		elseif ($labelLength == 3)
			$labelX = $Sx - 8;
		else
			$labelX = $Sx - 10;


		$labelY = $Sy + 13;		// Should be adjusted based on font size

		$this->addText($labelText, $labelX, $labelY, "gray");

	}  // addVerticalTackLabel()


	function addHorizontalTackLabel($Sx, $Sy, $labelText)
	// Add the specified label to the left of the plot's horizontal tack mark at the point (Sx,Sy)
	{
		$labelText = trim($labelText);

		$labelLength = strlen($labelText);

		// Adjust the x-positioning based on the size of the label; should also be adjusted based on font size
		if ($labelLength == 1)
			$labelX = $Sx - 15;
		elseif ($labelLength == 2)
			$labelX = $Sx - 15;
		elseif ($labelLength >= 3)
			$labelX = $Sx - 18;


		$labelY = $Sy + 3;		// Should be adjusted based on font size

		$this->addText($labelText, $labelX, $labelY, "gray");

	}  // addHorizontalTackLabel()


	function addPlotLeftCaption($caption, $x, $y)
	/* 	Add the specified caption to the left of the plot, in bold characters.  The leftmost coordinate of the caption is (x,y)
		If the caption is multi-line (specified by the "!" character in the string), the vertical positions are adjusted
	 */
	{
		$captionX = $x;				// Distance from leftmost of screen
		$captionYBottom = $y + 10;	// A little below the y-position of the horizontal axis
		$captionYTop = $y - 40;		// Go higher

		//echo "captionYBottom: $captionYBottom | captionYTop: $captionYTop<br>";

		$captionArray = explode("!", $caption);

		$captionYDelta = round(($captionYBottom - $captionYTop) / (1 + sizeof($captionArray)));

		$captionY = $captionYTop;

		foreach($captionArray as $captionLine)  {
			$captionY += $captionYDelta;		// keep going down for successive caption lines
			//echo "captionY: $captionY<br>";

			$this->addText($captionLine, $captionX, $captionY, "black", "font-size='10' font-weight='bold'");
			//$this->svg .= "<text x='$captionX' y='$captionY' font-size='10' style='fill:black' font-weight='bold'>$captionLine</text>\n";
		}

	}  // addPlotLeftCaption()



	function addVerticalArrow($x, $ybase, $color, $up = true)
	// Add a vertical arrow, pointing either UP (default) or down.  $ybase is the level of the arrow's base
	{
		$xLeft = $x - $this->verticalArrowHalfWidth;
		$xRight = $x + $this->verticalArrowHalfWidth;

		if ($up)
			$arrowYcorner = $ybase - $this->verticalArrowHeight;	// Go up in Screen coordinates
		else
			$arrowYcorner = $ybase + $this->verticalArrowHeight;	// Go down in Screen coordinates

		$this->svg .= "<polyline points='$xLeft, $ybase $x, $arrowYcorner, $xRight, $ybase'  stroke='$color' fill='$color' />\n";
	}

	function addHorizontalArrow($SxBase, $Sy, $color, $right = true)
	// Add a vertical arrow, pointing either UP (default) or down.  $SxBase is the x-coord of the arrow's base
	{
		$SyTop = $Sy - $this->verticalArrowHalfWidth;
		$SyBottom = $Sy + $this->verticalArrowHalfWidth;

		if ($right)
			$arrowXcorner = $SxBase + $this->verticalArrowHeight;	// Go right in Screen coordinates
		else
			$arrowXcorner = $SxBase - $this->verticalArrowHeight;	// Go left in Screen coordinates

		$this->svg .= "<polyline points='$SxBase, $SyTop $arrowXcorner, $Sy $SxBase, $SyBottom'  stroke='$color' fill='$color' />\n";
	}

	function terminatePlot()
	// Close the <SVG> element and return the string with the complete SVG code
	{
		$this->svg .= "</svg>\n";

		return $this->svg;

	}  // terminatePlot()



	/************* The remainder of the functions in this class is rather specialized, and ought to be moved to specific modules ***********/

	function addPulseSignal($x, $y, $height = 45)
	/* 	Add a spike (vertical pulse) signal to the current plot, at the point (x,y).
		The pulse is depicted as a small triangle centered at the the specified x-coordinate.
	 */
	{
		$signalBaseHalfWidth = 3;

		$xLeft = $x - $signalBaseHalfWidth;
		$xRight = $x + $signalBaseHalfWidth;

		$ybase = $y;				// Y-coordinate of the pulse's base
		$yPeak = $y - $height;		// Y-coordinate of the pulse's peak

		$this->svg .= "<polyline points='$xLeft,$ybase $x,$yPeak, $xRight,$ybase' />\n";

	}  // addPulseSignal()


	function addShadedRectangle($x1, $x2, $yBase, $height = 45)
	{
		$width = $x2-$x1;
		$yTop = $yBase - $height;

		$this->addSVGcode("<rect x='$x1' y='$yTop' width='$width' height='$height' fill='rgb(180,180,180)' stroke='none' opacity='0.3'/>");
		//$this->svg .= "<rect x='$x1' y='$yTop' width='$width' height='$height' fill='rgb(180,180,180)' stroke='none' opacity='0.3'/>\n";
		//$this->svg .= "<line x1='$x1' y1='$yTop' x2='$x2' y2='$yBase' opacity='0.3'/>\n";
		//$this->svg .= "<line x1='$x1' y1='$yBase' x2='$x2' y2='$yTop' opacity='0.3'/>\n";

	}  // function addShadedRectangle()


	function addSquareSignal($xLeft, $xRight, $yBase, $ySignal, $label, $color = "purple", $count = 1)
	/* 	Add a square signal to the current plot, marked with the specified label.
		The signal rises from the baseline $yBase to $ySignal at $xLeft, and returns to baseline at $xRight
		Use the specified color
	 */
	{
		$this->svg .= "<polyline points='$xLeft,$yBase $xLeft,$ySignal, $xRight,$ySignal, $xRight,$yBase' stroke='$color' fill='transparent' />\n";

		$xLabel = $xLeft - 4;

		if ($yBase > $ySignal)  {	// A positive signal
			$yLabel = $ySignal - 3;		//		place label above
			$yCount = $yBase - ($yBase - $ySignal) * 0.5;
			$pos = true;
		}
		else  {						// A negative signal
			$yLabel = $ySignal + 9;		// 		place label below
			$yCount = $yBase + ($ySignal - $yBase) * 0.75;
			$pos = false;
		}

		// Mark the signal with a label
		$this->addText($label, $xLabel, $yLabel, $color);

		// In case of completely identical signals, mark them as occurring multiple times
		if ($count > 1)
			$this->addText("x" . $count, $xLabel - 22*$count + 26, $yCount, $color, "font-size='12' font-weight='bold'");
			//$this->addText("x" . $count, $xLabel-(18 * ($count-1)), $yCount, $color, "font-size='12' font-weight='bold'");


		/* Add arrows on the rising and falling edges
		 */

		$midY = round($yBase + $ySignal) / 2;		// Halfway along the vertical extension of the Square pulse

		// Add a little up arrow on the left edge
		$arrowYbase = $midY - 1;	// just above the midpoint
		$this->addVerticalArrow($xLeft, $arrowYbase, $color, $pos);

		// Add a little down arrow on the right edge
		$arrowYbase = $midY + 1;	// just below the midpoint
		$this->addVerticalArrow($xRight, $arrowYbase, $color, ! $pos);

	}  // function addSquareSignal()



}  // class "SVGplot"





/********************************************************************************************************************

	COORDINATE TRANSFORMATIONS

 ********************************************************************************************************************/

class coordsMapping
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

	private $a;	// Scaling factor
	private $b;	// Offset

	function __construct($Tmin, $Tmax, $Zmin, $Zmax)  {
		$this->b = ($Zmax-$Zmin) / ($Tmax-$Tmin);			// *** TO-DO: error situation when denominator is zero
		$this->a = $Zmin - $this->b * $Tmin;

		//echo "Coordinate transformation pars (Z = a + b T) :  a = " . $this->a . " | b = " . $this->b . "<br>";
	}

	function transform($t)
	// Map a value from the old to the new coordinate system.
	{
		return round($this->a  +  $this->b * $t);
	}

}  // class "coordsMapping"




/********************************************************************************************************************

	2-D POINTS

 ********************************************************************************************************************/

class point
{
	public $x;
	public $y;


	function __construct($Px, $Py)
	{
		$this->x = $Px;
		$this->y = $Py;
	}


	public function commaSeparatedCoords()
	// Return the coordinates as a comma-separated string
	{
		return  $this->x . "," . $this->y;
	}

} // class "point"
?>