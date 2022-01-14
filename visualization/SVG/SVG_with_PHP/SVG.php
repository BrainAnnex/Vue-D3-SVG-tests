<?
/*
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


	function addHorizontalAxisLine($SxMin, $SxMax, $Y)
	/*	Add a horizontal x-axis line to the plot, at the specified y-coordinate,
	    spanning the indicating range of x-coordinates.
		Precede the SVG tag by a comment pointing out the new graph (TODO: move commenting to a separate method)
	*/
	{
		// Horizontal axis line, preceded by a comment
		$this->svg .= "<!-- NEW GRAPH -->\n<line x1='$SxMin' y1='$Y' x2='$SxMax' y2='$Y' style='stroke:black' />\n";

	}  // addHorizontalAxisLine()


	function addVerticalAxisLine($Ymin, $Ymax, $X)
	/*	Add a vertical y-axis line to the plot, at the specified x-coordinate, spanning the indicating range of y-coordinates
	*/
	{
		// Vertical axis line
		$this->svg .= "<line x1='$X' y1='$Ymin' x2='$X' y2='$Ymax' stroke='black' />\n";

	}  // addVerticalAxisLine()



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



	/*************
	        The remainder of the functions in this class is rather specialized,
	        and ought to be moved to specific modules
	 *************/

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




/********************************************************************************************************************

	MID-LEVEL GRAPHICS:  CLASS "plotting"

 ********************************************************************************************************************/

class plotting
/* Mid-level plotting class.  Plot coordinates are used, until the lower-level plotting object is invoked
 */
{
	// PUBLIC PROPERTIES

	public $svgPlot;			// Low-level SVG graphic object

	public $XcoordTransform;	// Object used for x-coordinate transformations
								//		from plot coordinates to screen coordinate

	public $dTack = 1;			// Spacing between tacks on horizontal axis (in plot coordinates)
	public $labelFrequency = 2;	// Number of tacks in-between consecutive horizontal axis labels

	public $Tmin, $Tmax;		// X-coordinate range in Plot coordinates (shared among all the vertically-aligned plots)
	public $SxMin, $SxMax;		// X-coordinate range in Screen coordinates	(not counting margins at left and right)


	// PRIVATE PROPERTIES

	private $pluginCode = "p";	// Unique code for this plugin



	// TO DO: add a standardized [0-1] plot y-coordinate, with a pre-set YcoordTransform




	/****************************
	     	PUBLIC METHODS
	 ****************************/

	function initializeCanvas($plot_width, $plot_height)
	// Create the opening <SVG> tag
	{
		$this->svgPlot = new SVGplot($plot_width, $plot_height);
	}


	function getSVG()
	// Terminate the plot and return the SVG text
	{
		return  $this->svgPlot->terminatePlot();
	}



	function setCoordinates($Tmin, $Tmax, $SxMin, $SxMax)
	/* Determine and save the parameters of the mapping between Plot coordinates (T's) and Screen coordinates (Sx's);
			only for x-coords.
		Also, save the range of x-coords, both in Plot and Screen coordinates
	 */
	{
		$this->Tmin = $Tmin;
		$this->Tmax = $Tmax;

		$this->XcoordTransform = new coordsMapping($Tmin, $Tmax, $SxMin, $SxMax);

		$this->SxMin = $this->XcoordTransform->transform($Tmin);
		$this->SxMax = $this->XcoordTransform->transform($Tmax);
	}



	function addCaptionAtLeft($caption, $Sy)
	// Add the specified caption (label) to the left of the plot whose horizontal axis is at the given y-coordinate (in Screen coordinates)
	{
		$this->svgPlot->addPlotLeftCaption($caption, 2, $Sy);
	}


	function addHorizontalAxis($SyAxis)
	// Add horizontal axis line to the plot, at the specified y Screen coordinate, plus tacks and tack labels
	{
		// Horizontal axis line
		$this->svgPlot->addHorizontalAxis($this->SxMin, $this->SxMax, $SyAxis);


		// First pass for the tacks (kept together as an SVG group)
		$this->svgPlot->startGroup("stroke='gray'");	// Pass a styling used for all the tacks
		$nTacks = 0;
		for ($tTack = $this->Tmin; $tTack <= $this->Tmax; $tTack += $this->dTack)  {
			//echo "Adding tack line at $tTack<br>";
			$nTacks += 1;

			$SxTack = $this->XcoordTransform->transform($tTack);			// Convert from Plot to Screen coordinates

			if (($nTacks-1) % ($this->labelFrequency) == 0)		// If this tack is to receive a label...
				$this->svgPlot->addVerticalTack($SxTack, $SyAxis, 6);		// ... then make it longer
			else
				$this->svgPlot->addVerticalTack($SxTack, $SyAxis, 2);		// ... otherwise, short


			if ($nTacks > 300)
				break;				// don't go overboard with excessive tacks!
		}
		$this->svgPlot->endGroup();


		// Second pass for the labels
		$nTacks = 0;
		for ($tTack = $this->Tmin; $tTack <= $this->Tmax; $tTack += $this->dTack)  {
			//echo "Adding tack line at $tTack<br>";
			$nTacks += 1;

			$SxTack = $this->XcoordTransform->transform($tTack);			// Convert from Plot to Screen coordinates

			if (($nTacks-1) % ($this->labelFrequency) == 0)		// Starting at the very first one, and then proceeding by multiples
				$this->svgPlot->addVerticalTackLabel($SxTack, $SyAxis, $tTack);	// Use the value $tTack as label


			if ($nTacks > 300)
				break;				// don't go overboard with excessive tack labels!
		}

	}  // function addHorizontalAxis()



	function addVerticalAxisAtOrigin($SyMin, $SyMax)
	// Add horizontal axis line to the plot, plus tacks and tack labels
	{
		$this->svgPlot->addVerticalAxis($SyMin, $SyMax, $this->SxMin);
	}




	public function page_0()
	// To generate the MAIN page of the plotting UI
	{
		$plotChoices = array('pulse', 'square', 'ladder', 'network');


		$cp = new controlPanel(1);		// Create a 1-column Control Panel.  Accept the default for paneTitleStyle


		/* Set some styling parameters for the newly-created Control Panel
		 */

		$cp->tableOptions = "class='plotting'";
		$cp->tdWrapOptions = "valign='top' class='panel'";


		/*
			1st row
		 */


		// This is the only form in actual usage; the rest is just a place-holder for possible future development

		$form = new formBuilder("Vertically-Aligned Plots" , "/pluginPage.php?plugin=p&page=1&ac=" . $this->pluginSupport->siteAccount , "GET");

		$form->hiddenOptions = array("name='group' value='vert'");		// Type of plot grouping ("vertical")
		$form->hiddenOptions[] = "name='plugin' value='p'";
		$form->hiddenOptions[] = "name='page' value='1'";

		$form->addControlText("Tmin", "Tmin", 5);

		$form->addControlText("Tmax", "Tmax", 5);

		$form->addControlText("Tack interval", "dTack", 3);

		//$form->addLabel("Spacing between axis labels (in number of tacks)");
		$form->addControl_PulldownMenu("Spacing between axis labels (in number of tacks)",
										array(1, 2, 3, 4, 5, 6, 7), "labelFreq", "[Choose label frequency]");

		$form->addBlankLine();

		$form->addHeaderLine("LABELS: For multi-line labels, use ! as line break");

		$form->addHeaderLine("SIGNALS:<br>For <b>PULSE</b>, use space- or comma-separated (e.g. <em>5 9 12</em>).<br> &nbsp; Supplemental data can be used to specify shaded refractory intervals (a single integer)");
		$form->addHeaderLine("For <b>SQUARE</b>, use ~ separator (each space-separated Tstart Tend Amp)");
		$form->addHeaderLine("For <b>LADDER</b>, use * separator (each space-separated Time Value). Optional T<em>threshold</em>T prefix (e.g. T8T)");
		$form->addHeaderLine("For <b>NETWORK</b>, use space-separated dendrite numbers (e.g. <em>3 2 5</em>)");


		$form->addBlankLine();
		//$form->addLabel("Choose plot type");
		$form->addControl_PulldownMenu("Choose plot type" , $plotChoices , "t[]" , "[Choose plot type]");
		$form->addControlText("Data 1","d[]", 55);
		$form->addControlText("Label 1", "l[]", 55);
		$form->addControlText("Optional Supplemental Data 1", "s[]", 55);


		$form->addBlankLine();
		//$form->addLabel("Choose plot type");
		$form->addControl_PulldownMenu("Choose plot type" , $plotChoices , "t[]" , "[Choose plot type]");
		$form->addControlText("Data 2","d[]", 55);
		$form->addControlText("Label 2", "l[]", 55);
		$form->addControlText("Optional Supplemental Data 2", "s[]", 55);


		$form->addBlankLine();
		//$form->addLabel("Choose plot type");
		$form->addControl_PulldownMenu("Choose plot type" , $plotChoices , "t[]" , "[Choose plot type]");
		$form->addControlText("Data 3","d[]", 55);
		$form->addControlText("Label 3", "l[]", 55);
		$form->addControlText("Optional Supplemental Data 3", "s[]", 55);


		$form->addBlankLine();
		//$form->addLabel("Choose plot type");
		$form->addControl_PulldownMenu("Choose plot type" , $plotChoices , "t[]" , "[Choose plot type]");
		$form->addControlText("Data 4","d[]", 55);
		$form->addControlText("Label 4", "l[]", 55);
		$form->addControlText("Optional Supplemental Data 4", "s[]", 55);



		$form->submitLabel = "Generate Plot";				// Specify label for submit button


		$cp->addForm($form);


		$html = $cp->generateCP();

		return array("SVG Plotter", $html);

	} // page_0()


	public function page_1()
	// Render the plot specified by the GET parameters below
	{
		$html = "";

		// Extract the fields passed by the invoking form
		$Tmin = $_GET['Tmin'];
		$Tmax = $_GET['Tmax'];
		$dTack = $_GET['dTack'];					// Tack interval
		$labelFrequency = $_GET['labelFreq'];		// Number of tacks between labels

		$labelArray = $_GET['l'];
		$dataArray = $_GET['d'];
		$dataSupplementArray = $_GET['s'];
		$typeArray = $_GET['t'];



		/* Specify the range of screen x-coordinates
		 */
		$SxMin = 60;				// Leave a little "elbow room" on the screen, to the left of the plot (in particular, to fit plot captions)
		$SxMax = 988;				// To fit fully on the standard Brain Annex page
		$canvasWidth = $SxMax + 10;	// Leave a tiny "elbow room" to the right of the plot


		/* Screen coordinates start at 0; specify the vertical spacing between plots
		 */

		$SyBaseline = 0;			// The top of the canvas

		$SyDefaultVerticalAllotment = 80;	// Vertical spacing (canvas allotment) needed by a typical graph small plot, in screen coords
											//		Individual plots may request a multiplicative factor


		$numberOfPlots = sizeof($typeArray);


		/* Provide feedback on the parameters
		*/
		$html .= "<div style='border:1px solid; background-color:white; padding:5px; margin-bottom:20px'>";
		$html .= "<b>PARAMETERS:</b><br><br>";
		$html .= "Tmin: $Tmin<br>";
		$html .= "Tmax: $Tmax<br>";
		$html .= "dTack: $dTack<br>";
		$html .= "labelFrequency (in tacks): $labelFrequency<br>";
		for ($i = 0; $i < $numberOfPlots ; ++$i)  {
			if ($typeArray[$i])  {
				$index = $i + 1;
				$html .= "Plot $index of type <b>&ldquo;" . $typeArray[$i] . "</b>&rdquo; - Label:  <b>" . $labelArray[$i] . "</b> &nbsp; Data: " . $dataArray[$i] . " &nbsp; Supplementary Data: " . $dataSupplementArray[$i] . "<br>";
			}
		}

		$html .= "<hr>";
		$html .= "SxMin: $SxMin<br>";
		$html .= "SxMax: $SxMax";
		$html .= "</div>";


		// Validate parameters


		/* Instantiate a plot object  (TO-DO: aren't we ALREADY inside this class?!?)
		 */
		$myPlot = new plotting();

		/* Establish an overall height for the composite plot (in screen coordinates), and instantiate all individual plots
		 */
		$canvasHeight = $SyBaseline;

		$plotArray = array();

		for ($i = 0; $i < $numberOfPlots ; ++$i)  {		// Note: some of the requested plots (specified by the invoking form) may be missing
			$plotType = $typeArray[$i];

			if ($plotType)  {		// Ignore blanks
				$data = $dataArray[$i];
				$supplementaryData = $dataSupplementArray[$i];

				if (!class_exists($plotType)) {
					echo "<h1>ERROR: No handler class found for Plot Type '$plotType'!  Exiting...</h1>";
					exit;
				}
				/* TO DO: SHOULD ALSO VERIFY THAT THE NEEDED METHOD EXISTS
						if(method_exists($this->as, $method)) ...
				   In the case of SySpacingFactor(), it could be made optional
				  */
				$generalObject = new $plotType($myPlot, $data, $supplementaryData);			// Instantiate each specific plot type
				$canvasHeight += $SyDefaultVerticalAllotment * $generalObject->SySpacingFactor();
				$plotArray[] = $generalObject;
			}
		}

		//print_r($plotArray);

		$canvasHeight += 20; 	// Leave a little space at the bottom for the axis marks of the bottom-most graph


		/* Initialize the plot object
		 */
		$myPlot->initializeCanvas($canvasWidth, $canvasHeight);


		$myPlot->setCoordinates($Tmin, $Tmax, $SxMin, $SxMax);	// Compute & store the x-coord transformation from plot to screen coords

		if ($labelFrequency)
			$myPlot->labelFrequency = $labelFrequency;

		if ($dTack)
			$myPlot->dTack = $dTack;



		/*
			Process each individual plot/caption in turn
		 */


		for ($plotIndex = 0; $plotIndex < sizeof($plotArray); ++$plotIndex)  {
			//echo $typeArray[$plotIndex] . "<br>";
			$plotType = $typeArray[$plotIndex];
			$label = $labelArray[$plotIndex];
			$data = $dataArray[$plotIndex];
			$individualPlot = $plotArray[$plotIndex];	// Object corresponding to each individual plot

			$plotVerticalAllotment = $SyDefaultVerticalAllotment * $individualPlot->SySpacingFactor();
			$SyBaseline += $plotVerticalAllotment;


			$individualPlot->caption = $label;

			$individualPlot->addPlotRow($SyBaseline,
											$SyBaseline - $plotVerticalAllotment + 40
										);

			// The 40 is for some "elbow room" from plot above, i.e. blank space between the top of the plot itself
			//		and the top of its canvas vertical allotment

		}



		/* Terminate the plot and extract the SVG text
		 */

		$svgText = $myPlot->getSVG();


		$html .= "<h1>Plot</h1>";
		$html .= "<div style='border:1px solid; background-color:white; width:$canvasWidth" . "px'>";
		$html .= "$svgText";
		$html .= "</div>";


		$html .= "<h1>SVG Code <a href='https://svg-edit.github.io/svgedit/releases/svg-edit-2.8.1/svg-editor.html' style='margin-left:35px; font-size:10px' target='_blank'>SVG editor</a></h1>";

		$html .= "<div style='border:1px solid; background-color:white'>";
		$html .= "<pre>";
		$html .= str_replace("<", "&lt;", str_replace(">", "&gt;", $svgText));
		$html .= "</pre>";
		$html .= "</div>";

		return array("SVG Plots", $html);

	} // page_1()

} // class "plotting"
?>