/****************************************************************************
 * This is a very basic photoshop script I written for own needs.
 * All you need is a folder with icons (or any other images). 
 * You'll get resized images placed in appropriate folders.
 *
 * For processing any arbitary images you can alter fractions ("scale" field 
 * and denominator value) and corresponding folder names. Change the line 49
 * if you are goind to process something different from .png.
 *
 * Hope this will help you avoid reading adobe documentation 
 * and save you a little time!
 *
 * iam@maxmalysh.com
 ***************************************************************************/

/****************************************************************************
 * Some defenitions 
 ***************************************************************************/

// Conversion fractions:
// xxhdpi -> 12/12
// xhdpi  -> 8/12
// hdpi   -> 6/12
// mdpi   -> 4/12
// ldpi   -> 3/12

function Conversion(scale, prefix) {
	this.scale = scale;
	this.prefix = prefix;
}

var coeffs = new Array();
coeffs.push(new Conversion(3,  "ldpi"));
coeffs.push(new Conversion(4,  "mdpi"));
coeffs.push(new Conversion(6,  "hdpi"));
coeffs.push(new Conversion(8,  "xhdpi"));
coeffs.push(new Conversion(12, "xxhdpi"));

var denominator = 12.0
var default_scale = 100;			 		// This value is in percents;

app.preferences.rulerUnits = Units.PERCENT; // You can use Units.PIXELS here as well;	

/****************************************************************************
 * Here the processing begins
 ***************************************************************************/

var inputFolder = Folder.selectDialog("Select a folder to process")
var fileList = inputFolder.getFiles("*.png");  

for (j = 0; j < coeffs.length; j++) {
	// Calculating scale ratio (in percents)
	var cur_scale = default_scale * coeffs[j].scale / denominator;
	
	// Setting up an output folder
	var outputFolder = Folder(
		inputFolder.path + '/' +
		coeffs[j].prefix + '-' +
		inputFolder.name
	)
	
	if (!outputFolder.exists) 
		outputFolder.create()

	for(var i=0; i < fileList.length; i++) {
		if (fileList[i] instanceof File) {
			open(fileList[i])
			var doc = app.activeDocument
			
			doc.resizeImage(cur_scale, null, null, ResampleMethod.BICUBIC); 

			var newName = ''+doc.name+'.png';

			save_options = new PNGSaveOptions()
			save_options.compression = 0
			save_options.interlaced = false
			save_options.typename = "png"

			doc.saveAs(
				File(outputFolder + '/' + newName),	//  filename
				save_options,						//  compression, interlaced, typename
				true,								//  as copy
				Extension.NONE						//  no filename formatting
			);	
			app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);  
		}
	}
}

