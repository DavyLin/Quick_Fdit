/* 
	Quick_Fdit, a simple formula editor based on MathQuill, jQuery/jQueryUI, and awesomeFont.
*/
(function(){

var vars={
	qfditui:undefined,
	target:undefined,
	statusbar:undefined
};

var matharr=[ //the button array.
	{x:294,y:6,w:2,h:3,symb:"\\sum^{}_{}", hint:"Use arrow keys to navigate. Not Mouse"},
	{x:407,y:6,w:2,h:3,symb:"\\prod^{}_{}", hint:"Use arrow keys to navigate. Not Mouse"},
	{x:142,y:135,w:2,h:2,symb:"\\lim_{}",hint:"Use arrow keys to navigate. Not Mouse"},
	{x:238,y:135,w:2,h:2,symb:"\\min_{}",hint:"Use arrow keys to navigate. Not Mouse"},
	{x:313,y:137,w:2,h:2,symb:"\\max_{}",hint:"Use arrow keys to navigate. Not Mouse"},
	{x:444,y:274,w:2,h:1,hint:"Generate a vector with less then 10 rows",fun:function(obj){//vector
		var rows=prompt("How many rows?");
		if (isNaN(rows)) return;
		if (rows>10) return;
		obj.mathquill("cmd","(");
		obj.mathquill("cmd","\\vector");
		var e=$.Event("keydown"); e.which=13;
		var i=0;
		while(i<rows){
			obj.mathquill("write","0");
			i+=1;
			if (i==rows) return;
			obj.trigger(e);
		}
	}},
	{x:93,y:29,w:1,h:1,symb:"_",c:1},
	{x:107,y:119,w:2,h:1,hint:"Generate a matrix at most 10x10 size",fun:function(obj){//matrix
		var sz=prompt("Please Define the size by rows and columns, use 'x' to seperate the number. (e.g, 2x3 refers to a matrix having 2 rows and 3 columns)").split("x");
		if (sz.length!=2) return;
		var rows=sz[0], cols=sz[1];
		if (isNaN(rows)) return;
		if (rows>10) return;
		if (cols>10) return;
		var e=$.Event("keydown"); e.which=13,
			e2=$.Event("keydown"); e2.which=27;
		obj.mathquill("cmd","(");
		var j=0;
		while(j<cols){
			obj.mathquill("cmd","\\vector");
			var i=0;
			while(i<rows){
				obj.mathquill("write","0");
				i+=1;
				if (i==rows) break;
				obj.trigger(e);
			}
			obj.trigger(e2);
			j+=1;
			if (j==cols) return;
			obj.mathquill("write","\\quad");
		};
	}},
	{x:125,y:29,w:1,h:1,symb:"_{}^{}"},
	{x:138,y:96,w:2,h:1,symb:"\\lfloor \\rfloor"},
	{x:92,y:65,w:2,h:1,symb:"\\lceil \\rceil"},
	{x:41,y:99,w:2,h:1,symb:"|",c:1},
	{x:395,y:274,w:2,h:1,hint:"Simply a blank space you may need",symb:"\\quad"},
	{x:52,y:31,w:1,h:1,symb:"^",c:1},
	{x:233,y:84,w:2,h:2,symb:"\\binom",c:1},
	{x:12,y:18,w:1,h:2,symb:"\\frac",c:1},
	{x:302,y:82,w:2,h:2,hint:"Combination of { and \\vector",fun:function(obj){// used in function describing a lot.
		var rows=prompt("How many rows?");
		if (isNaN(rows)) return;
		if (rows>10) return;
		obj.mathquill("cmd","\\lbraceonly");
		obj.mathquill("cmd","\\vector");
		var e=$.Event("keydown"); e.which=13;
		obj.mathquill("write","0");
		for (var i=1; i<rows; ++i){
			obj.trigger(e);
			obj.mathquill("write","0");
		}
	}},
	{x:15,y:190,w:2,h:1,symb:"\\sin",c:1},
	{x:82,y:189,w:2,h:1,symb:"\\cos",c:1},
	{x:155,y:188,w:2,h:1,symb:"\\tan",c:1},
	{x:143,y:64,w:1,h:1,symb:"\\bar",c:1},
	{x:174,y:64,w:1,h:1,symb:"\\vec",c:1},
	{x:45,y:146,w:3,h:1,symb:"\\log_{}"},
	{x:392,y:146,w:2,h:1,symb:"\\ln",c:1},
	{x:318,y:250,w:1,h:1,hint:"A single '|'.",symb:"|"},
	{x:193,y:29,w:2,h:1,symb:"\\sqrt[]{}"},
	{x:152,y:29,w:2,h:1,symb:"\\sqrt",c:1},
	{x:228,y:275,w:1,h:1,symb:"\\to"},
	{x:176,y:275,w:1,h:1,symb:"\\Delta"},
	{x:40,y:220,w:1,h:1,symb:"\\pm"},
	{x:62,y:220,w:1,h:1,symb:"\\mp"},
	{x:82,y:220,w:1,h:1,symb:"\\times"},
	{x:100,y:220,w:1,h:1,symb:"\\div"},
	{x:204,y:220,w:1,h:1,symb:"\\inf"},
	{x:227,y:220,w:1,h:1,symb:"\\neq"},
	{x:268,y:220,w:1,h:1,symb:"\\equiv"},
	{x:306,y:220,w:1,h:1,symb:"\\propto"},
	{x:428,y:220,w:1,h:1,symb:"\\exists"},
	{x:406,y:220,w:1,h:1,symb:"\\forall"},
	{x:35,y:276,w:1,h:1,symb:"\\le"},
	{x:64,y:276,w:1,h:1,symb:"\\ge"},
	{x:112,y:276,w:1,h:1,symb:"\\emptyset"},
	{x:278,y:276,w:1,h:1,symb:"\\neg"},
	{x:357,y:275,w:1,h:1,symb:"\\subset"},
	{x:378,y:275,w:1,h:1,symb:"\\superset"},
	{x:86,y:250,w:1,h:1,symb:"\\in"},
	{x:106,y:250,w:1,h:1,symb:"\\notin"},
	{x:59,y:250,w:1,h:1,symb:"\\cap"},
	{x:32,y:250,w:1,h:1,symb:"\\cup"},
	{x:352,y:250,w:1,h:1,symb:"\\parallel"},
	{x:395,y:250,w:1,h:1,symb:"\\perp"},
	{x:468,y:220,w:1,h:1,symb:"\\angle"},
	{x:10,y:305,w:1,h:1,symb:"\\alpha"},
	{x:27,y:305,w:1,h:1,symb:"\\beta"},
	{x:46,y:305,w:1,h:1,symb:"\\gamma"},
	{x:63,y:305,w:1,h:1,symb:"\\delta"},
	{x:80,y:305,w:1,h:1,symb:"\\varepsilon"},
	{x:96,y:305,w:1,h:1,symb:"\\zeta"},
	{x:112,y:305,w:1,h:1,symb:"\\eta"},
	{x:130,y:305,w:1,h:1,symb:"\\theta"},
	{x:148,y:305,w:1,h:1,symb:"\\lambda"},
	{x:166,y:305,w:1,h:1,symb:"\\mu"},
	{x:184,y:305,w:1,h:1,symb:"\\nu"},
	{x:199,y:305,w:1,h:1,symb:"\\xi"},
	{x:216,y:305,w:1,h:1,symb:"\\pi"},
	{x:235,y:305,w:1,h:1,symb:"\\rho"},
	{x:252,y:305,w:1,h:1,symb:"\\sigma"},
	{x:271,y:305,w:1,h:1,symb:"\\varphi"},
	{x:291,y:305,w:1,h:1,symb:"\\phi"},
	{x:312,y:305,w:1,h:1,symb:"\\psi"},
	{x:391,y:305,w:1,h:1,symb:"\\Phi"},
	{x:413,y:305,w:1,h:1,symb:"\\Psi"},
	{x:435,y:305,w:1,h:1,symb:"\\Omega"},
	{x:456,y:305,w:1,h:1,symb:"\\Pi"},
	{x:480,y:305,w:1,h:1,symb:"\\partial"}
];

function generateSelector(obj){
	var content=$("<div>");
	$.each(matharr,function(){
		var symb=this.symb,
			c=this.c,
			fun=this.fun;
		var li=$("<li>")
			.addClass("quickfdit-ui-mathbutton")
			.css('background-position',-this.x + "px " + -this.y + "px")
			.css('width',this.w*25) //total 15w for 300px
			.css('height',this.h*25)
			.css('cursor','pointer')
		if (this.hint)
			statusHelp(li,this.hint);
		else
			statusHelp(li,"LaTeX: "+symb);
		if (fun) {
			li.click(function(){
				fun(obj.target);
				obj.refresh();
			});
		} else
		if (c) 
			li.click(function(){
				obj.target
					.mathquill("cmd", symb)
				obj.refresh();
			})
		else
			li.click(function(){
				obj.target
					.mathquill("write", symb)
				obj.refresh();
			})
		li.appendTo(content);
	});
	content.append(vars.statusbar);
	return content;
}

vars.statusbar=$("<div>").css({"clear":"both"}).addClass("quickfdit-ui-statusbar");
function statusHelp(what,text){
	var ptxt=$("<p>").text(text).hide();
	vars.statusbar.append(ptxt);
	what.mouseenter(function(){ptxt.show();})
	what.mouseleave(function(){ptxt.hide()});
}


function generateToolbar(obj){
	var toolbar=$("<div>")
		.addClass("quickfdit-ui-toolbar");
	var close=$("<div>")
		.addClass("close")
		.append('<i class="fa fa-times" /i>')
		.click(function(){
			obj.qfditui.hide(); 
			obj.target.focus()
			obj.closed=true;
		});
	var buttons=[
		function(){ //help
			return {
				icon:"question",
				hint:"Show help",
				clk:function(){alert('hi')}
			};
		},
		function(){//switch between latex code/visual edit(broken, just show the code...)
			//var dialogdiv=$("<div>").attr("title","LaTeX Code Viewer").append($("<p>").text("Nothing")).dialog({autoOpen:false});
			//$("body").append(dialogdiv);
			return {
				icon:"file-code-o",
				hint:"Show LaTeX Code for the equation.",
				clk:function(){alert('hi')}
			};
		}
	];
	$.each(buttons,function(){
		var tmp=this();
		var btn=$("<div>")
			.append('<i class="fa fa-'+tmp.icon+'" /i>')
			.addClass("button")
			.click(tmp.clk);
		statusHelp(btn,tmp.hint);
		toolbar.append(btn);
	});
	toolbar.append(close);
	return toolbar;
}

$(function(){
	vars.qfditui=$("<div>")
		.addClass("quickfdit-ui")
		.appendTo($("body"))
		.append(generateToolbar(vars))
		.append(generateSelector(vars))
		.hide();
})

$.fn.quickfdit=function(cmd,args){
	switch (cmd){
		default:
			var element=this;
			
			element.mathquill('editable');		
			function refresh(){
				vars.closed=false;
				vars.target=element;
				vars.refresh=refresh;
				vars.qfditui
					.show()
					.position({
						of:element,
						my:"left top+5",
						at:"left bottom",
						collision:"none fit"
					});
				element.focus();
				//console.log("refresh"+element);
			}		
			element.keydown(function(){
				if (!vars.closed) setTimeout(refresh,100);
				//console.log("kd");
			})
			element.click(refresh)		
	}
};

}());