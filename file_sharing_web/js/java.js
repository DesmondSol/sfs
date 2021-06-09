/**
 * @author kevinj045/me
 * This file contains a well java structured javascript, i commented what you need,
 * The codes you need to know
 * comments with "@Replaces:" shows the code in java replaced by javascript
 * comments with "@clear" say "clear this line after you understand it"
 * comments with "@main" say "This must be here, don't clear it"
*/

MM.define('Java',[],function(imp,ins) {
	// To import use imp
	// Navigate through pages using MainActivity.startActivity('activity name');

	function Java(MainActivity,System,routes,info){ // @main
		var DBM = imp('DBM'); // @Replaces: import com.linkhub.DBM in java
		var WebView = imp('WebView'); // @Replaces: import android.webview.WebView in java
		var FileUtils = imp('FileUtils'); // @Replaces: import com.linkhub.FileUtils in java
		var ThemeManager = imp('ThemeManager'); // @Replaces: import com.linkhub.Teme in java
		var log = console.log; // Logging Into The Console

		class Main extends MainActivity{ // This is the main class that will be called 
			constructor(Activity){ // @Replaces: public static void main(String[] args)
				super();
				this.dbm = new DataBaseManager(); // @Replaces: DataBaseManager this.dbm = new DataBaseManager();
				this.FileUtils = new FileUtils();

				this.on('p:c',function(){ // @clear
					//System.out.println('Page Changed');
				});

				/* initiation for ThemeManager */ // @main
				this.ThemeManager = new ThemeManager();
				log(this.ThemeManager);

				// Checking the current activity

				if(this.currentActivity().path == "home"){
					this.prepare(); // @clear
					this.newProperties(); // @clear
				}
			}
			prepare(){ // @Replaces: public void prepare() for instance, @clear
				System.out.println("hello"); // @clear
				System.out.println('Hay','card'); // @clear
				//this.FileUtils.getFile('something'); @clear
				var str = new String("string text"); // @Replaces: String str = "string text";
				var arr = new Array(); // @Replaces: List arr;
				arr.append('Hello'); //  note: there's no property with Array.append i added it, so it may not be available everywhere
				var bool = str.equals("string"); //note: there's no property with String.equals i added it, so it may not be available everywhere
			}
			newProperties(){ // @clear
				// The new properties i added to the System class
				System.newHtmlElement('div') // parameters: element name
				.text('hello')							 // return new jquery element
				.appendTo(System.cntr());

				System.newNodeText('Just a text')  // parameters: text name
																	 	 			 // return new node text
				//var webview = new WebView();  @clear
				//webview.loadUrl('http://somewhere');  @clear
				//webview.toView(); @clear
			}
		}

		class DataBaseManager extends DBM{ // This is another class @Replaces: public class DataBaseManager extends DBM
			constructor(){ // @Replaces: DataBaseManager()
				super();
			}
		}


		// Your code here, tell me if you need any help

		// ...

		return Main; // @main
	}

	// This section is out of java, not recommended to put any code here

	return Java; // @main
});